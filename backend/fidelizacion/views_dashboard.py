# RUTA: fidelizacion/views_dashboard.py

# MÉTRICAS DEL DASHBOARD PRINCIPAL
# =============================================

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from django.utils import timezone

from backend.clientes.models import Cliente

from .models import BolsaPuntos, UsoPuntos


@api_view(["GET"])
def dashboard_metrics(request):
    """
    Endpoint principal del Dashboard.
    Devuelve estadísticas del sistema:
      - total clientes
      - total bolsas activas
      - puntos asignados, usados y disponibles
      - ranking top 5
      - puntos a vencer próximos 30 días
    """

    total_clientes = Cliente.objects.count()

    bolsas_activas = BolsaPuntos.objects.filter(estado="ACTIVO")
    
    puntos_asignados = bolsas_activas.aggregate(total=Sum("puntos_asignados"))["total"] or 0
    puntos_usados = bolsas_activas.aggregate(total=Sum("puntos_utilizados"))["total"] or 0
    puntos_disponibles = puntos_asignados - puntos_usados

    # Ranking TOP 5 por puntos usados
    ranking_data = []
    for cliente in Cliente.objects.all():
        total_usado = UsoPuntos.objects.filter(cliente=cliente).aggregate(total=Sum("puntos_utilizados"))["total"] or 0
        ranking_data.append({
            "cliente": f"{cliente.nombre} {cliente.apellido}",
            "puntos_utilizados": total_usado
        })
    ranking_data = sorted(ranking_data, key=lambda x: x["puntos_utilizados"], reverse=True)[:5]

    # Puntos próximos a vencer (30 días)
    fecha_limite = timezone.now() + timezone.timedelta(days=30)
    bolsas_a_vencer = BolsaPuntos.objects.filter(
        estado="ACTIVO",
        fecha_caducidad__lte=fecha_limite
    ).count()

    return Response({
        "total_clientes": total_clientes,
        "bolsas_activas": bolsas_activas.count(),
        "puntos_asignados": puntos_asignados,
        "puntos_usados": puntos_usados,
        "puntos_disponibles": puntos_disponibles,
        "ranking": ranking_data,
        "bolsas_por_vencer": bolsas_a_vencer,
    })
