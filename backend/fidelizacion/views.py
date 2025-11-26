"""
RUTA: fidelizacion/views.py
==============================================================
 MÓDULO: Vistas CRUD del Sistema de Fidelización
==============================================================
Incluye únicamente:
 CRUD de todas las entidades
 Segmentación de clientes
 Ranking de clientes
 Paginación profesional (DRF)
==============================================================
"""

# ============================================================
#  IMPORTACIONES BASE
# ============================================================
from datetime import date
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination



# ============================================================
#  MODELOS Y SERIALIZERS
# ============================================================
from backend.clientes.models import Cliente
from .models import (
    
    ConceptoPuntos,
    ReglaPuntos,
    ParametrizacionVencimiento,
    BolsaPuntos,
    UsoPuntos,
    Insignia,
    InsigniaCliente,
    Desafio,
    DesafioCliente,
    ProductoCanje,
    Canje,
    Promocion,   # ← IMPORTADO CORRECTO
)
from .serializers import (
    ClienteSerializer,
    ConceptoPuntosSerializer,
    ReglaPuntosSerializer,
    ParametrizacionVencimientoSerializer,
    BolsaPuntosSerializer,
    UsoPuntosSerializer,
    InsigniaSerializer,
    InsigniaClienteSerializer,
    DesafioSerializer,
    DesafioClienteSerializer,
    ProductoCanjeSerializer,
    CanjeSerializer,
    PromocionSerializer,    # ← EL QUE FALTABA
)


# ============================================================
#  PAGINACIÓN GLOBAL PARA CRUD
# ============================================================
class StandardPagination(PageNumberPagination):
    page_size = 10
    page_query_param = "pagina"
    page_size_query_param = "limite"
    max_page_size = 200


# ============================================================
#  CRUDs PRINCIPALES
# ============================================================
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all().order_by("id")
    serializer_class = ClienteSerializer
    pagination_class = StandardPagination


class ConceptoViewSet(viewsets.ModelViewSet):
    queryset = ConceptoPuntos.objects.all().order_by("id")
    serializer_class = ConceptoPuntosSerializer
    pagination_class = StandardPagination


class ReglaViewSet(viewsets.ModelViewSet):
    queryset = ReglaPuntos.objects.all().order_by("limite_inferior")
    serializer_class = ReglaPuntosSerializer
    pagination_class = StandardPagination


class VencimientoViewSet(viewsets.ModelViewSet):
    queryset = ParametrizacionVencimiento.objects.all().order_by("-id")
    serializer_class = ParametrizacionVencimientoSerializer
    pagination_class = StandardPagination

class PromocionViewSet(viewsets.ModelViewSet):
    queryset = Promocion.objects.all().order_by("-fecha_inicio")
    serializer_class = PromocionSerializer
    pagination_class = StandardPagination


class BolsaViewSet(viewsets.ModelViewSet):
    queryset = BolsaPuntos.objects.select_related("cliente").all().order_by("id")
    serializer_class = BolsaPuntosSerializer
    pagination_class = StandardPagination


class UsoViewSet(viewsets.ModelViewSet):
    queryset = UsoPuntos.objects.select_related("cliente", "concepto").all().order_by("-fecha")
    serializer_class = UsoPuntosSerializer
    pagination_class = StandardPagination

class InsigniaViewSet(viewsets.ModelViewSet):
    queryset = Insignia.objects.all()
    serializer_class = InsigniaSerializer

class DesafioViewSet(viewsets.ModelViewSet):
    queryset = Desafio.objects.all()
    serializer_class = DesafioSerializer

class InsigniaClienteViewSet(viewsets.ModelViewSet):
    queryset = InsigniaCliente.objects.all()
    serializer_class = InsigniaClienteSerializer

class DesafioClienteViewSet(viewsets.ModelViewSet):
    queryset = DesafioCliente.objects.all()
    serializer_class = DesafioClienteSerializer
    
class ProductoCanjeViewSet(viewsets.ModelViewSet):
    queryset = ProductoCanje.objects.all()
    serializer_class = ProductoCanjeSerializer


# ============================================================
#  CONSULTA: SEGMENTACIÓN DE CLIENTES
# ============================================================
@api_view(["GET"])
def consulta_clientes_segmentacion(request):
    """
    Segmentación de clientes por:
     - nombre
     - nacionalidad
     - rango de edad
     Con respuesta extendida y paginada.
    """

    clientes = Cliente.objects.all()

    if nombre := request.GET.get("nombre"):
        clientes = clientes.filter(nombre__icontains=nombre)

    if nacionalidad := request.GET.get("nacionalidad"):
        clientes = clientes.filter(nacionalidad__icontains=nacionalidad)

    edad_min = request.GET.get("edad_min")
    edad_max = request.GET.get("edad_max")

    if edad_min and edad_max:
        hoy = date.today()
        edad_min = int(edad_min)
        edad_max = int(edad_max)
        clientes = [
            c for c in clientes
            if c.fecha_nacimiento and edad_min <= (hoy.year - c.fecha_nacimiento.year) <= edad_max
        ]

    # PAGINACIÓN
    paginator = StandardPagination()
    page = paginator.paginate_queryset(clientes, request)
    serializer = ClienteSerializer(page, many=True)

    return paginator.get_paginated_response({
        "filtros": request.GET,
        "cantidad": len(serializer.data),
        "clientes": serializer.data
    })


# ============================================================
#  CONSULTA: RANKING DE CLIENTES
# ============================================================
@api_view(["GET"])
def ranking_clientes(request):
    """
    Ranking Top 5 de clientes por puntos utilizados.
    Respuesta extendida.
    """
    resultado = []

    for cliente in Cliente.objects.all():
        total = sum(u.puntos_utilizados for u in cliente.usos.all())
        resultado.append({
            "cliente": f"{cliente.nombre} {cliente.apellido}",
            "puntos_utilizados": total,
            "nivel_fidelizacion": cliente.nivel_fidelizacion,
            "id": cliente.id,
        })

    ranking = sorted(resultado, key=lambda x: x["puntos_utilizados"], reverse=True)

    return Response({
        "mensaje": "Top 5 clientes con más puntos utilizados.",
        "total_en_sistema": len(resultado),
        "ranking": ranking[:5]
    })

@api_view(["POST"])
def referir_cliente(request):
    try:
        cliente_id = request.data.get("cliente_id")
        email_referido = request.data.get("email")

        if not cliente_id or not email_referido:
            return Response({"error": "Enviar cliente_id y email del referido."}, status=400)

        cliente = Cliente.objects.get(pk=cliente_id)

        # Bonus fijo por referir
        BONUS = 100

        # Registrar referido
        ref = Referido.objects.create(
            cliente=cliente,
            referido_email=email_referido,
            bonus_otorgado=BONUS
        )

        # Dar puntos de regalo
        BolsaPuntos.objects.create(
            cliente=cliente,
            fecha_asignacion=timezone.now(),
            fecha_caducidad=timezone.now() + timezone.timedelta(days=365),
            puntos_asignados=BONUS,
            puntos_utilizados=0,
            monto_operacion=0,
            estado="ACTIVO"
        )

        return Response({
            "mensaje": "Referido registrado",
            "bonus_otorgado": BONUS,
            "referido": email_referido
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)
