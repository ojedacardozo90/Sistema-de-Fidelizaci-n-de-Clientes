"""
RUTA: fidelizacion/views_consultas.py
===========================================================
MÓDULO: Consultas y Reportes del Sistema de Fidelización
===========================================================
Incluye exclusivamente los endpoints GET requeridos para:

 1) Clientes con puntos a vencer
 2) Ranking de clientes
 3) Bolsas por cliente
 4) Bolsas por rango de puntos
 5) Usos por concepto
 6) Usos por fecha exacta
 7) Usos por cliente
 8) Clientes con cumpleaños (faltante)
 9) Clientes por apellido (aproximación) (faltante)
10) Usos por rango de fechas (faltante)

===========================================================
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import Sum
from datetime import datetime

from backend.clientes.models import Cliente
from .models import BolsaPuntos, UsoPuntos, ConceptoPuntos
from .serializers import (
    BolsaPuntosSerializer,
    UsoPuntosSerializer,
    ClienteSerializer
)


# 1) CLIENTES CON PUNTOS A VENCER EN X DÍAS
# ============================================================
@api_view(["GET"])
def puntos_a_vencer(request):
    dias = int(request.GET.get("dias", 30))
    fecha_limite = timezone.now() + timezone.timedelta(days=dias)

    bolsas = BolsaPuntos.objects.filter(
        estado="ACTIVO",
        fecha_caducidad__lte=fecha_limite
    )

    data = BolsaPuntosSerializer(bolsas, many=True).data

    return Response({
        "mensaje": f"Puntos a vencer en {dias} días",
        "cantidad": len(data),
        "bolsas": data
    })

@api_view(["GET"])
def bolsas_proximo_vencer(request):
    """
    Devuelve bolsas cuya fecha de caducidad está dentro de 30 días.
    """
    limite = timezone.now() + timezone.timedelta(days=30)

    bolsas = BolsaPuntos.objects.filter(
        estado="ACTIVO",
        fecha_caducidad__lte=limite
    )

    return Response(BolsaPuntosSerializer(bolsas, many=True).data)


# 2) RANKING DE CLIENTES
# ============================================================
@api_view(["GET"])
def ranking(request):
    ranking_data = []

    for cliente in Cliente.objects.all():
        total_usado = UsoPuntos.objects.filter(
            cliente=cliente
        ).aggregate(total=Sum("puntos_utilizados"))["total"] or 0

        ranking_data.append({
            "cliente": f"{cliente.nombre} {cliente.apellido}",
            "puntos_utilizados": total_usado
        })

    ranking_data = sorted(ranking_data, key=lambda x: x["puntos_utilizados"], reverse=True)

    return Response({
        "mensaje": "Ranking top 5",
        "top": ranking_data[:5]
    })


# 3) BOLSAS POR CLIENTE
# ============================================================
@api_view(["GET"])
def bolsas_por_cliente(request):
    cliente_id = request.GET.get("cliente_id")
    if not cliente_id:
        return Response({"error": "Debe enviar cliente_id"}, status=400)

    bolsas = BolsaPuntos.objects.filter(cliente_id=cliente_id)
    return Response(BolsaPuntosSerializer(bolsas, many=True).data)


# 4) BOLSAS POR RANGO
# ============================================================
@api_view(["GET"])
def bolsas_por_rango(request):
    try:
        min_p = int(request.GET.get("min", 0))
        max_p = int(request.GET.get("max", 99999999))

        bolsas = BolsaPuntos.objects.filter(
            puntos_asignados__gte=min_p,
            puntos_asignados__lte=max_p
        )

        return Response(BolsaPuntosSerializer(bolsas, many=True).data)
    except:
        return Response({"error": "Parámetros inválidos"}, status=400)

# 5) USOS POR CONCEPTO
# ============================================================
@api_view(["GET"])
def usos_por_concepto(request):
    concepto_id = request.GET.get("concepto_id")
    if not concepto_id:
        return Response({"error": "Debe enviar concepto_id"}, status=400)

    usos = UsoPuntos.objects.filter(concepto_id=concepto_id)
    return Response(UsoPuntosSerializer(usos, many=True).data)


# 6) USOS POR FECHA EXACTA
# ============================================================
@api_view(["GET"])
def usos_por_fecha(request):
    fecha = request.GET.get("fecha")
    if not fecha:
        return Response({"error": "Debe enviar fecha=YYYY-MM-DD"}, status=400)

    usos = UsoPuntos.objects.filter(fecha__date=fecha)
    return Response(UsoPuntosSerializer(usos, many=True).data)

# 7) USOS POR CLIENTE
# ============================================================
@api_view(["GET"])
def usos_por_cliente(request):
    cliente_id = request.GET.get("cliente_id")
    if not cliente_id:
        return Response({"error": "Debe enviar cliente_id"}, status=400)

    usos = UsoPuntos.objects.filter(cliente_id=cliente_id)
    return Response(UsoPuntosSerializer(usos, many=True).data)


# 8) CLIENTES CON CUMPLEAÑOS (FALTABA)
# ============================================================
@api_view(["GET"])
def clientes_cumpleanios(request):
    """
    GET /api/consultas/clientes_cumpleanios/?mes=3&dia=15
    """
    mes = request.GET.get("mes")
    dia = request.GET.get("dia")

    if not mes:
        return Response({"error": "Debe enviar mes"}, status=400)

    qs = Cliente.objects.filter(fecha_nacimiento__month=mes)

    if dia:
        qs = qs.filter(fecha_nacimiento__day=dia)

    return Response(ClienteSerializer(qs, many=True).data)



# 9) CLIENTES POR APELLIDO (APROX)
# ============================================================
@api_view(["GET"])
def clientes_por_apellido(request):
    """
    GET /api/consultas/clientes_por_apellido/?apellido=Go
    """
    apellido = request.GET.get("apellido")
    if not apellido:
        return Response({"error": "Debe enviar apellido"}, status=400)

    clientes = Cliente.objects.filter(apellido__icontains=apellido)
    return Response(ClienteSerializer(clientes, many=True).data)

# 9.1) CLIENTES POR NOMBRE (APROX)
# ============================================================
@api_view(["GET"])
def clientes_por_nombre(request):
    """
    GET /api/consultas/clientes_por_nombre/?nombre=Ra
    Busca coincidencias aproximadas en el nombre del cliente.
    """
    nombre = request.GET.get("nombre")
    if not nombre:
        return Response({"error": "Debe enviar nombre"}, status=400)

    clientes = Cliente.objects.filter(nombre__icontains=nombre)
    return Response(ClienteSerializer(clientes, many=True).data)


# 10) USOS POR RANGO DE FECHAS (FALTANTE)
# ============================================================
@api_view(["GET"])
def usos_por_rango_fecha(request):
    """
    GET /api/consultas/usos_por_rango_fecha/?desde=2025-01-10&hasta=2025-02-01
    """
    desde = request.GET.get("desde")
    hasta = request.GET.get("hasta")

    if not (desde and hasta):
        return Response(
            {"error": "Debe enviar desde=YYYY-MM-DD y hasta=YYYY-MM-DD"},
            status=400
        )

    usos = UsoPuntos.objects.filter(
        fecha__date__gte=desde,
        fecha__date__lte=hasta
    )

    return Response(UsoPuntosSerializer(usos, many=True).data)

# 8) CONSULTA: MÉTRICAS DEL DASHBOARD
# ============================================================
@api_view(["GET"])
def dashboard_metrics(request):
    """
    Devuelve todas las métricas necesarias para el Dashboard:
    - Total de clientes
    - Total puntos asignados
    - Total puntos utilizados
    - Total puntos vencidos
    - Puntos próximos a vencer (30 días)
    - Ranking Top 5
    """

    # --- Total de clientes ---
    total_clientes = Cliente.objects.count()

    # --- Total puntos asignados ---
    puntos_asignados = BolsaPuntos.objects.aggregate(
        total=Sum("puntos_asignados")
    )["total"] or 0

    # --- Total puntos utilizados ---
    puntos_utilizados = BolsaPuntos.objects.aggregate(
        total=Sum("puntos_utilizados")
    )["total"] or 0

    # --- Total puntos vencidos ---
    puntos_vencidos = BolsaPuntos.objects.filter(
        estado="VENCIDO"
    ).aggregate(
        total=Sum("puntos_asignados") 
    )["total"] or 0

    # --- Puntos próximos a vencer ---
    fecha_limite = timezone.now() + timezone.timedelta(days=30)
    puntos_por_vencer = BolsaPuntos.objects.filter(
        estado="ACTIVO",
        fecha_caducidad__lte=fecha_limite
    ).aggregate(
        total=Sum("puntos_asignados") 
    )["total"] or 0

    # --- Ranking top 5 ---
    ranking_data = []
    for cliente in Cliente.objects.all():
        total_usado = UsoPuntos.objects.filter(
            cliente=cliente
        ).aggregate(total=Sum("puntos_utilizados"))["total"] or 0

        ranking_data.append({
            "cliente": f"{cliente.nombre} {cliente.apellido}",
            "puntos_utilizados": total_usado,
        })

    ranking_data = sorted(
        ranking_data,
        key=lambda x: x["puntos_utilizados"],
        reverse=True
    )[:5]

    return Response(
        {
            "total_clientes": total_clientes,
            "puntos_asignados": puntos_asignados,
            "puntos_utilizados": puntos_utilizados,
            "puntos_vencidos": puntos_vencidos,
            "puntos_por_vencer": puntos_por_vencer,
            "top_5": ranking_data,
        },
        status=200
    )
# 11) CLIENTES POR NOMBRE (APROX)
# ============================================================
@api_view(["GET"])
def clientes_por_nombre(request):
    """
    GET /api/consultas/clientes_por_nombre/?nombre=Ju
    """
    nombre = request.GET.get("nombre")
    if not nombre:
        return Response({"error": "Debe enviar nombre"}, status=400)

    clientes = Cliente.objects.filter(nombre__icontains=nombre)
    return Response(ClienteSerializer(clientes, many=True).data)
# ============================================================
# HISTORIAL DE CANJES POR FECHA
# ============================================================

@api_view(["GET"])
def historial_canje_por_fecha(request):
    fecha = request.query_params.get("fecha")
    fecha_inicio = request.query_params.get("fecha_inicio")
    fecha_fin = request.query_params.get("fecha_fin")

    if not fecha and not (fecha_inicio and fecha_fin):
        return Response({"error": "Enviar fecha=YYYY-MM-DD o fecha_inicio & fecha_fin"}, status=400)

    usos = UsoPuntos.objects.all()

    if fecha:
        usos = usos.filter(fecha__date=fecha)

    if fecha_inicio and fecha_fin:
        usos = usos.filter(fecha__date__range=[fecha_inicio, fecha_fin])

    usos = usos.order_by("-fecha")

    data = []
    for uso in usos:
        detalles = UsoPuntosDetalle.objects.filter(uso=uso)
        data.append({
            "cliente": f"{uso.cliente.nombre} {uso.cliente.apellido}",
            "fecha": uso.fecha,
            "concepto": uso.concepto.descripcion,
            "puntos_utilizados": uso.puntos_utilizados,
            "detalles": [
                {
                    "bolsa_id": d.bolsa.id,
                    "puntos": d.puntos_utilizados
                }
                for d in detalles
            ]
        })

    return Response(data)
@api_view(["GET"])
def historial_canje_por_producto(request):
    concepto_id = request.query_params.get("concepto_id")

    if not concepto_id:
        return Response({"error": "Enviar concepto_id"}, status=400)

    usos = UsoPuntos.objects.filter(concepto_id=concepto_id).order_by("-fecha")

    data = []
    for uso in usos:
        detalles = UsoPuntosDetalle.objects.filter(uso=uso)
        data.append({
            "cliente": f"{uso.cliente.nombre} {uso.cliente.apellido}",
            "fecha": uso.fecha,
            "puntos_utilizados": uso.puntos_utilizados,
            "detalles": [
                {
                    "bolsa_id": d.bolsa.id,
                    "puntos": d.puntos_utilizados
                }
                for d in detalles
            ]
        })

    return Response(data)
# ============================================================
# HISTORIAL AVANZADO DE CANJES (filtros múltiples)
# ============================================================

@api_view(["GET"])
def historial_canje_filtros(request):
    fecha = request.GET.get("fecha")
    desde = request.GET.get("desde")
    hasta = request.GET.get("hasta")
    concepto_id = request.GET.get("concepto_id")
    cliente_id = request.GET.get("cliente_id")

    usos = UsoPuntos.objects.all().order_by("-fecha")

    if fecha:
        usos = usos.filter(fecha__date=fecha)

    if desde and hasta:
        usos = usos.filter(fecha__date__range=[desde, hasta])

    if concepto_id:
        usos = usos.filter(concepto_id=concepto_id)

    if cliente_id:
        usos = usos.filter(cliente_id=cliente_id)

    data = []
    for uso in usos:
        detalles = UsoPuntosDetalle.objects.filter(uso=uso)

        data.append({
            "fecha": uso.fecha,
            "cliente": f"{uso.cliente.nombre} {uso.cliente.apellido}",
            "concepto": uso.concepto.descripcion if uso.concepto else "-",
            "puntos_utilizados": uso.puntos_utilizados,
            "detalles": [
                {
                    "bolsa_id": d.bolsa.id,
                    "puntos": d.puntos_utilizados
                }
                for d in detalles
            ],
        })

    return Response(data)
