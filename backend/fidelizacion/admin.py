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

=============================================================
"""

# ============================================================
#  IMPORTACIONES BASE
# ============================================================
from django.db import transaction, models
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from datetime import date, timedelta
from .models import Promocion 
from .models import Referido


# ============================================================
#  IMPORTACIONES DE MODELOS Y SERIALIZERS
# ============================================================
from django.contrib import admin
from backend.clientes.models import Cliente
from .models import (
    ConceptoPuntos,
    ReglaPuntos,
    ParametrizacionVencimiento,
    BolsaPuntos,
    UsoPuntos,
    UsoPuntosDetalle,
)

# Registro de modelos en el admin de Django
admin.site.register(ConceptoPuntos)
admin.site.register(ReglaPuntos)
admin.site.register(ParametrizacionVencimiento)
admin.site.register(BolsaPuntos)
admin.site.register(UsoPuntos)
admin.site.register(UsoPuntosDetalle)
admin.site.register(Promocion)
admin.site.register(Referido)

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


class BolsaViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de Bolsas de Puntos.
    IMPORTANTE:
    - BolsaPuntos NO tiene campo 'concepto'.
    """
    queryset = BolsaPuntos.objects.select_related("cliente").all().order_by("id")
    serializer_class = BolsaPuntosSerializer


class UsoViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de Usos de Puntos.
    Nota:
    - El uso real debe hacerse mediante el servicio usar_puntos()
    """
    queryset = UsoPuntos.objects.select_related("cliente", "concepto").all().order_by("-fecha")
    serializer_class = UsoPuntosSerializer


# ============================================================
#  FUNCIONES AUXILIARES INTERNAS
# ============================================================

def _regla_para_monto(monto: float):
    """
    Retorna la regla aplicable para un monto determinado.
    Acepta reglas con límite_superior NULL.
    """
    return (
        ReglaPuntos.objects
        .filter(limite_inferior__lte=monto)
        .filter(
            models.Q(limite_superior__gte=monto) |
            models.Q(limite_superior__isnull=True)
        )
        .order_by("-limite_inferior")
        .first()
    )


def _parametro_vigente():
    """
    Retorna la parametrización de vencimiento vigente a la fecha actual.
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

@api_view(['POST'])
def cargar_puntos(request):
    """
    Servicio principal para cargar puntos.
    Selecciona automáticamente la regla aplicable
    y crea una BolsaPuntos válida durante 365 días.
    """
    try:
        cliente_id = request.data.get("cliente_id")
        monto_operacion = float(request.data.get("monto_operacion", 0))

        if not cliente_id or monto_operacion <= 0:
            return Response({"error": "Debe enviar cliente_id y monto_operacion válidos."}, status=400)

        cliente = Cliente.objects.get(id=cliente_id)

        regla = (
            ReglaPuntos.objects
            .filter(limite_inferior__lte=monto_operacion)
            .filter(
                models.Q(limite_superior__gte=monto_operacion) |
                models.Q(limite_superior__isnull=True)
            )
            .order_by("-limite_inferior")
            .first()
        )

        if not regla:
            return Response({"error": f"No hay una regla definida para el monto {monto_operacion}."}, status=400)

        puntos_asignados = int(monto_operacion / regla.monto_por_punto)

        bolsa = BolsaPuntos.objects.create(
            cliente=cliente,
            fecha_asignacion=timezone.now(),
            fecha_caducidad=timezone.now() + timezone.timedelta(days=365),
            puntos_asignados=puntos_asignados,
            puntos_utilizados=0,
            monto_operacion=monto_operacion,
            estado="ACTIVO"
        )

        return Response({
            "mensaje": "Puntos cargados exitosamente.",
            "cliente": f"{cliente.nombre} {cliente.apellido}",
            "monto_operacion": monto_operacion,
            "puntos_asignados": puntos_asignados,
            "regla_aplicada": {
                "id": regla.id,
                "limite_inferior": regla.limite_inferior,
                "limite_superior": regla.limite_superior,
                "monto_por_punto": regla.monto_por_punto
            },
            "bolsa_id": bolsa.id
        }, status=201)

    except Cliente.DoesNotExist:
        return Response({"error": "Cliente no encontrado."}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# ============================================================
#  SERVICIO: USO (CANJE) DE PUNTOS
# ============================================================

@api_view(["POST"])
@transaction.atomic
def usar_puntos(request):
    """
    Servicio para canjear puntos.
    Aplica política FIFO sobre las bolsas ACTIVAS.
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
    uso = UsoPuntos.objects.create(
        cliente=cliente,
        concepto=concepto,
        puntos_utilizados=0
    )

    for b in bolsas:
        if restante <= 0:
            break

        disponible = b.puntos_asignados - b.puntos_utilizados
        if disponible <= 0:
            continue

        usar = min(disponible, restante)
        b.puntos_utilizados += usar

        if b.puntos_asignados == b.puntos_utilizados:
            b.estado = "AGOTADO"

        b.save(update_fields=["puntos_utilizados", "estado"])

        UsoPuntosDetalle.objects.create(
            uso=uso,
            bolsa=b,
            puntos_utilizados=usar
        )

        uso.puntos_utilizados += usar
        restante -= usar

    if restante > 0:
        raise transaction.TransactionManagementError("Saldo insuficiente de puntos.")

    uso.save(update_fields=["puntos_utilizados"])

    # Envío de correo opcional
    if getattr(settings, "EMAIL_BACKEND", None) and cliente.email:
        try:
            send_mail(
                subject="Comprobante de uso de puntos",
                message=(
                    f"Cliente: {cliente.nombre} {cliente.apellido}\n"
                    f"Total utilizado: {uso.puntos_utilizados} pts\n"
                    f"Concepto: {concepto.descripcion}"
                ),
                from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
                recipient_list=[cliente.email],
                fail_silently=True,
            )
        except Exception:
            pass

    cliente.actualizar_nivel()
    return Response(UsoPuntosSerializer(uso).data, status=201)


# ============================================================
#  CONSULTA: PUNTOS ESTIMADOS POR MONTO
# ============================================================

@api_view(['GET'])
def puntos_por_monto(request):
    """
    Devuelve cuántos puntos obtendría un cliente por un monto.
    No afecta la base de datos.
    """
    try:
        monto = float(request.query_params.get("monto", 0))

        if monto <= 0:
            return Response({"error": "Debe enviar un monto válido."}, status=400)

        regla = _regla_para_monto(monto)

        if not regla:
            return Response({"error": "No existe regla aplicable."}, status=400)

        puntos = int(monto / regla.monto_por_punto)

        return Response({
            "mensaje": "Cálculo estimado correcto.",
            "monto": monto,
            "puntos_estimados": puntos,
            "regla_aplicada": {
                "id": regla.id,
                "limite_inferior": regla.limite_inferior,
                "limite_superior": regla.limite_superior,
                "monto_por_punto": regla.monto_por_punto
            }
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# ============================================================
#  CONSULTAS DE CLIENTES
# ============================================================

@api_view(["GET"])
def consulta_clientes_segmentacion(request):
    """
    Segmentación dinámica por:
      - nombre (icontains),
      - nacionalidad,
      - rango de edad.
    """
    clientes = Cliente.objects.all()

    if nombre := request.GET.get("nombre"):
        clientes = clientes.filter(nombre__icontains=nombre)

    if nac := request.GET.get("nacionalidad"):
        clientes = clientes.filter(nacionalidad__icontains=nac)

    edad_min = request.GET.get("edad_min")
    edad_max = request.GET.get("edad_max")

    if edad_min and edad_max:
        edad_min = int(edad_min)
        edad_max = int(edad_max)
        hoy = date.today()

        clientes = [
            c for c in clientes
            if c.fecha_nacimiento and edad_min <= (hoy.year - c.fecha_nacimiento.year) <= edad_max
        ]

    return Response(ClienteSerializer(clientes, many=True).data)


@api_view(["GET"])
def ranking_clientes(request):
    """
    Devuelve el TOP 5 de clientes con más puntos utilizados.
    """
    ranking = []

    for cliente in Cliente.objects.all():
        total_usado = sum(
            uso.puntos_utilizados for uso in cliente.usopuntos_set.all()
        )
        ranking.append({
            "cliente": f"{cliente.nombre} {cliente.apellido}",
            "puntos_utilizados": total_usado
        })

    ranking = sorted(ranking, key=lambda x: x["puntos_utilizados"], reverse=True)

    return Response(ranking[:5])
