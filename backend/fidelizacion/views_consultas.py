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
    GET /api/consultas/clientes_cumpleanios/?mes=1&dia=15
    """
    mes = request.GET.get("mes")
    dia = request.GET.get("dia")

    if not mes:
        return Response({"error": "Debe enviar mes"}, status=400)

    clientes = Cliente.objects.filter(fecha_nacimiento__month=mes)

    if dia:
        clientes = clientes.filter(fecha_nacimiento__day=dia)

    return Response(ClienteSerializer(clientes, many=True).data)


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
