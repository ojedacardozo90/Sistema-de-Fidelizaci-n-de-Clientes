"""
RUTA: fidelizacion/views.py
==============================================================
 MÓDULO: Vistas del Sistema de Fidelización
==============================================================
Contiene:
 - CRUDs automáticos para las entidades base.
 - Servicios de asignación, uso y consulta de puntos.
 - Reportes y segmentación de clientes.
 - Envío de comprobantes por correo electrónico.
 - Lógica de negocio bajo transacciones atómicas.

Autor: Raúl Catalino Irala Benítez
Materia: Ingeniería de Software II - Backend TP Final
Institución: Facultad Politécnica - UNA
==============================================================
"""

# ============================================================
#  IMPORTACIONES BASE
# ============================================================
from django.db import transaction, models
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from datetime import date, timedelta

# ============================================================
#  IMPORTACIONES DE MODELOS Y SERIALIZERS
# ============================================================
from clientes.models import Cliente
from .models import (
    ConceptoPuntos,
    ReglaPuntos,
    ParametrizacionVencimiento,
    BolsaPuntos,
    UsoPuntos,
    UsoPuntosDetalle,
)
from .serializers import (
    ClienteSerializer,
    ConceptoPuntosSerializer,
    ReglaPuntosSerializer,
    ParametrizacionVencimientoSerializer,
    BolsaPuntosSerializer,
    UsoPuntosSerializer,
)

# ============================================================
#  CRUDs BÁSICOS (ADMINISTRACIÓN DE DATOS)
# ============================================================

class ClienteViewSet(viewsets.ModelViewSet):
    """Gestión de clientes registrados en el sistema."""
    queryset = Cliente.objects.all().order_by("id")
    serializer_class = ClienteSerializer


class ConceptoViewSet(viewsets.ModelViewSet):
    """Gestión de conceptos de uso de puntos (vales, premios, etc.)."""
    queryset = ConceptoPuntos.objects.all().order_by("id")
    serializer_class = ConceptoPuntosSerializer


class ReglaViewSet(viewsets.ModelViewSet):
    """Gestión de reglas de asignación de puntos según monto."""
    queryset = ReglaPuntos.objects.all().order_by("limite_inferior")
    serializer_class = ReglaPuntosSerializer


class VencimientoViewSet(viewsets.ModelViewSet):
    """Gestión de parametrizaciones de vencimiento de puntos."""
    queryset = ParametrizacionVencimiento.objects.all().order_by("-id")
    serializer_class = ParametrizacionVencimientoSerializer


class BolsaViewSet(viewsets.ReadOnlyModelViewSet):
    """Consulta de bolsas de puntos generadas por cliente."""
    queryset = BolsaPuntos.objects.select_related("cliente").all().order_by("fecha_caducidad")
    serializer_class = BolsaPuntosSerializer


class UsoViewSet(viewsets.ReadOnlyModelViewSet):
    """Consulta de usos de puntos (historial de canjes)."""
    queryset = UsoPuntos.objects.select_related("cliente", "concepto").all().order_by("-fecha")
    serializer_class = UsoPuntosSerializer


# ============================================================
#  FUNCIONES AUXILIARES INTERNAS
# ============================================================

def _regla_para_monto(monto: float):
    """
    Retorna la regla que aplica a un monto determinado.
    Selecciona aquella cuyo rango contiene al monto.
    """
    return (
        ReglaPuntos.objects
        .filter(limite_inferior__lte=monto)
        .filter(models.Q(limite_superior__isnull=True) | models.Q(limite_superior__gte=monto))
        .order_by("-limite_inferior")
        .first()
    )


def _parametro_vigente():
    """
    Devuelve la parametrización de vencimiento vigente a la fecha actual.
    """
    hoy = timezone.now().date()
    return (
        ParametrizacionVencimiento.objects
        .filter(fecha_inicio__lte=hoy, fecha_fin__gte=hoy)
        .order_by("-id")
        .first()
    )


# ============================================================
#  SERVICIO: CARGA (ASIGNACIÓN) DE PUNTOS
# ============================================================

# ============================================================
#  CARGAR PUNTOS (Versión con selección automática de regla)
# ============================================================
@api_view(['POST'])
def cargar_puntos(request):
    """
    Asigna puntos a un cliente según el monto de la operación,
    aplicando automáticamente la regla de puntos correspondiente
    según su rango (límite inferior y superior).
    """
    try:
        cliente_id = request.data.get("cliente_id")
        monto_operacion = float(request.data.get("monto_operacion", 0))

        # --- Validación inicial ---
        if not cliente_id or monto_operacion <= 0:
            return Response(
                {"error": "Debe enviar cliente_id y monto_operacion válidos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cliente = Cliente.objects.get(id=cliente_id)

        # --- Buscar regla correspondiente según el rango del monto ---
        regla = (
            ReglaPuntos.objects
            .filter(limite_inferior__lte=monto_operacion, limite_superior__gte=monto_operacion)
            .first()
        )

        if not regla:
            return Response(
                {"error": f"No se encontró una regla de puntos para el monto {monto_operacion}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # --- Calcular puntos según la regla ---
        # Ejemplo: si monto_por_punto = 50000, 1 punto por cada 50.000 Gs
        if regla.monto_por_punto <= 0:
            return Response(
                {"error": "La regla tiene un monto_por_punto no válido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        puntos_asignados = int(monto_operacion / regla.monto_por_punto)

        # --- Crear la bolsa de puntos ---
        bolsa = BolsaPuntos.objects.create(
            cliente=cliente,
            fecha_asignacion=timezone.now(),
            fecha_caducidad=timezone.now() + timezone.timedelta(days=365),
            puntos_asignados=puntos_asignados,
            puntos_utilizados=0,
            monto_operacion=monto_operacion,
            estado="ACTIVO"
        )

        return Response(
            {
                "mensaje": "Puntos cargados exitosamente.",
                "cliente": f"{cliente.nombre} {cliente.apellido}",
                "monto_operacion": monto_operacion,
                "puntos_asignados": puntos_asignados,
                "regla_aplicada": {
                    "id": regla.id,
                    "limite_inferior": regla.limite_inferior,
                    "limite_superior": regla.limite_superior,
                    "monto_por_punto": regla.monto_por_punto,
                },
                "bolsa_id": bolsa.id,
            },
            status=status.HTTP_201_CREATED,
        )

    except Cliente.DoesNotExist:
        return Response({"error": "Cliente no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ============================================================
#  SERVICIO: USO (CANJE) DE PUNTOS
# ============================================================

@api_view(["POST"])
@transaction.atomic
def usar_puntos(request):
    """
    Permite al cliente usar puntos según un concepto definido.
    Entradas (JSON):
        {
            "cliente_id": 1,
            "concepto_id": 2,
            "puntos_requeridos": 500
        }
    Lógica:
      - Esquema FIFO: consume bolsas más antiguas primero.
      - Genera UsoPuntos + UsoPuntosDetalle.
      - Actualiza el estado de las bolsas.
      - Envía comprobante por correo (si hay backend configurado).
    """
    cliente_id = request.data.get("cliente_id")
    concepto_id = request.data.get("concepto_id")
    puntos_requeridos = int(request.data.get("puntos_requeridos", 0))

    if not (cliente_id and concepto_id and puntos_requeridos > 0):
        return Response({"detail": "cliente_id, concepto_id y puntos_requeridos>0 son obligatorios."}, status=400)

    cliente = Cliente.objects.get(pk=cliente_id)
    concepto = ConceptoPuntos.objects.get(pk=concepto_id)

    bolsas = (
        BolsaPuntos.objects
        .select_for_update()
        .filter(cliente=cliente, estado="ACTIVO")
        .order_by("fecha_caducidad", "id")
    )

    restante = puntos_requeridos
    uso = UsoPuntos.objects.create(cliente=cliente, concepto=concepto, puntos_utilizados=0)

    for b in bolsas:
        if restante <= 0:
            break
        disponible = b.puntos_asignados - b.puntos_utilizados
        if disponible <= 0:
            continue
        usar = min(disponible, restante)
        b.puntos_utilizados += usar
        if (b.puntos_asignados - b.puntos_utilizados) == 0:
            b.estado = "AGOTADO"
        b.save(update_fields=["puntos_utilizados", "estado"])
        UsoPuntosDetalle.objects.create(uso=uso, puntos_utilizados=usar, bolsa=b)
        uso.puntos_utilizados += usar
        restante -= usar

    if restante > 0:
        raise transaction.TransactionManagementError("Saldo insuficiente de puntos.")

    uso.save(update_fields=["puntos_utilizados"])

    #  Envío opcional de comprobante por correo
    if getattr(settings, "EMAIL_BACKEND", None) and cliente.email:
        try:
            send_mail(
                subject="Comprobante de uso de puntos",
                message=f"Cliente: {cliente.nombre} {cliente.apellido}\n"
                        f"Total utilizado: {uso.puntos_utilizados} pts\n"
                        f"Concepto: {concepto.descripcion}",
                from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
                recipient_list=[cliente.email],
                fail_silently=True,
            )
        except Exception:
            pass

    cliente.actualizar_nivel()
    return Response(UsoPuntosSerializer(uso).data, status=201)


# ============================================================
#  SERVICIOS DE CONSULTA Y REPORTES
# ============================================================
# ============================================================
#  CONSULTAR PUNTOS POR MONTO (con selección automática de regla)
# ============================================================
@api_view(['GET'])
def puntos_por_monto(request):
    """
    Devuelve la cantidad estimada de puntos que un cliente obtendría
    por un monto determinado, aplicando la regla de puntos correspondiente
    según su rango (límite inferior y superior).
    No modifica la base de datos.
    """
    try:
        monto = float(request.query_params.get("monto", 0))

        # --- Validación ---
        if monto <= 0:
            return Response(
                {"error": "Debe enviar un monto válido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Buscar regla correspondiente según el rango ---
        regla = (
            ReglaPuntos.objects
            .filter(limite_inferior__lte=monto, limite_superior__gte=monto)
            .first()
        )

        if not regla:
            return Response(
                {"error": f"No se encontró una regla de puntos para el monto {monto}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Calcular puntos según la regla ---
        if regla.monto_por_punto <= 0:
            return Response(
                {"error": "La regla tiene un monto_por_punto no válido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        puntos_estimados = int(monto / regla.monto_por_punto)

        # --- Respuesta detallada ---
        return Response(
            {
                "mensaje": "Cálculo estimado realizado correctamente.",
                "monto_consultado": monto,
                "puntos_estimados": puntos_estimados,
                "regla_aplicada": {
                    "id": regla.id,
                    "limite_inferior": regla.limite_inferior,
                    "limite_superior": regla.limite_superior,
                    "monto_por_punto": regla.monto_por_punto,
                }
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ============================================================
#  SEGMENTACIÓN Y RANKING DE CLIENTES
# ============================================================

@api_view(["GET"])
def consulta_clientes_segmentacion(request):
    """
    Permite segmentar clientes por:
     - Nombre (búsqueda parcial)
     - Nacionalidad
     - Rango de edad (edad_min, edad_max)
    """
    clientes = Cliente.objects.all()

    if nombre := request.GET.get("nombre"):
        clientes = clientes.filter(nombre__icontains=nombre)
    if nac := request.GET.get("nacionalidad"):
        clientes = clientes.filter(nacionalidad__icontains=nac)

    edad_min = request.GET.get("edad_min")
    edad_max = request.GET.get("edad_max")
    if edad_min and edad_max:
        edad_min, edad_max = int(edad_min), int(edad_max)
        hoy = date.today()
        clientes = [c for c in clientes if c.fecha_nacimiento and edad_min <= (hoy.year - c.fecha_nacimiento.year) <= edad_max]

    return Response(ClienteSerializer(clientes, many=True).data)


@api_view(["GET"])
def ranking_clientes(request):
    """Retorna el Top 5 de clientes con más puntos utilizados."""
    ranking = []
    for cliente in Cliente.objects.all():
        total_usado = sum(u.puntos_utilizados for u in cliente.usopuntos_set.all())
        ranking.append({
            "cliente": f"{cliente.nombre} {cliente.apellido}",
            "puntos_utilizados": total_usado
        })
    ranking = sorted(ranking, key=lambda x: x["puntos_utilizados"], reverse=True)[:5]
    return Response(ranking)
