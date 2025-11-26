from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.db.models import Sum, Count, F
from django.utils import timezone
from django.utils.timezone import now
from datetime import timedelta


# IMPORTS CORRECTOS
from backend.clientes.models import Cliente
from backend.fidelizacion.models import BolsaPuntos, UsoPuntos


# ============================================================
#  MÉTRICAS PRINCIPALES DEL DASHBOARD  (PROTEGIDO JWT)
# ============================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_metrics(request):
    hoy = timezone.now().date()

    # Total clientes
    total_clientes = Cliente.objects.count()

    # Puntos asignados
    total_puntos_cargados = BolsaPuntos.objects.aggregate(
        total=Sum("puntos_asignados")
    )["total"] or 0

    # Puntos utilizados
    total_puntos_usados = UsoPuntos.objects.aggregate(
        total=Sum("puntos_utilizados")
    )["total"] or 0

    # Puntos activos (solo bolsas activas)
    puntos_activos = sum(
        b.puntos_asignados - b.puntos_utilizados
        for b in BolsaPuntos.objects.filter(estado="ACTIVO")
    )

    # Para la tarjeta “Puntos Vencidos”
    puntos_vencidos = sum(
        b.puntos_asignados - b.puntos_utilizados
        for b in BolsaPuntos.objects.filter(estado="VENCIDO")
    )

    # Próximos a vencer en 7 días
    proximos_vencer = BolsaPuntos.objects.filter(
        fecha_caducidad__lte=hoy + timedelta(days=7),
        estado="ACTIVO"
    ).count()

    # Ranking - Top 5 clientes que más usan puntos
    ranking = (
        UsoPuntos.objects
        .values(cliente=F("cliente__nombre"))
        .annotate(puntos_utilizados=Sum("puntos_utilizados"))
        .order_by("-puntos_utilizados")[:5]
    )

    return Response({
        "total_clientes": total_clientes,
        "puntos_asignados": total_puntos_cargados,
        "puntos_utilizados": total_puntos_usados,
        "puntos_activos": puntos_activos,
        "puntos_vencidos": puntos_vencidos,
        "puntos_por_vencer": proximos_vencer,
        "top_5": list(ranking)
    })


# ============================================================
#  ANALÍTICAS AVANZADAS  (PROTEGIDO JWT)
# ============================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_analytics(request):

    # 1) Clientes activos vs inactivos (últimos 90 días)
    hoy = now().date()
    hace_90_dias = hoy - timedelta(days=90)

    clientes_activos = (
        UsoPuntos.objects
        .filter(fecha__gte=hace_90_dias)
        .values("cliente")
        .distinct()
        .count()
    )

    clientes_totales = Cliente.objects.count()
    clientes_inactivos = clientes_totales - clientes_activos

    # 2) ROI = puntos usados / puntos asignados
    total_asignados = BolsaPuntos.objects.aggregate(
        total=Sum("puntos_asignados")
    )["total"] or 0

    total_usados = BolsaPuntos.objects.aggregate(
        total=Sum("puntos_utilizados")
    )["total"] or 0

    roi = round((total_usados / total_asignados) * 100, 2) if total_asignados else 0

    # 3) Canjes últimos 6 meses
    meses = []
    cantidades = []

    for i in range(6):
        mes = hoy - timedelta(days=30 * i)
        mes_inicio = mes.replace(day=1)
        mes_fin = (mes_inicio + timedelta(days=32)).replace(day=1)

        count = UsoPuntos.objects.filter(
            fecha__gte=mes_inicio,
            fecha__lt=mes_fin
        ).count()

        meses.insert(0, mes_inicio.strftime("%b %Y"))
        cantidades.insert(0, count)

    # 4) Conceptos más usados
    top_conceptos = (
        UsoPuntos.objects
        .values(nombre=F("concepto__descripcion"))
        .annotate(cantidad=Count("id"))
        .order_by("-cantidad")[:5]
    )

    # 5) Mejores acumuladores
    mejores_acumuladores = (
        BolsaPuntos.objects
        .values(nombre=F("cliente__nombre"), apellido=F("cliente__apellido"))
        .annotate(total=Sum("puntos_asignados"))
        .order_by("-total")[:5]
    )

    return Response({
        "clientes_activos": clientes_activos,
        "clientes_inactivos": clientes_inactivos,
        "roi": roi,
        "meses": meses,
        "canjes_6_meses": cantidades,
        "top_conceptos": list(top_conceptos),
        "mejores_acumuladores": list(mejores_acumuladores)
    })
