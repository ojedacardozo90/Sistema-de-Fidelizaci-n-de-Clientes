"""
RUTA: fidelizacion/views_consultas.py
===========================================================
MÓDULO: Consultas y Reportes del Sistema de Fidelización
===========================================================
Proporciona endpoints GET para generar reportes y consultas
relacionadas con:
 - Clientes con puntos próximos a vencer
 - Ranking de clientes por puntos acumulados
 - Bolsas por cliente
 - Usos por concepto de puntos
===========================================================
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import Sum
from clientes.models import Cliente
from .models import BolsaPuntos, UsoPuntos, ConceptoPuntos
from .serializers import BolsaPuntosSerializer, UsoPuntosSerializer, ClienteSerializer


# ============================================================
#  CLIENTES CON PUNTOS A VENCER
# ============================================================
@api_view(["GET"])
def puntos_a_vencer(request):
    """
    Devuelve lista de clientes con puntos que vencerán en X días.
    Ejemplo:
    GET /api/consultas/puntos_a_vencer/?dias=30
    """
    try:
        dias = int(request.query_params.get("dias", 30))
        fecha_limite = timezone.now() + timezone.timedelta(days=dias)

        bolsas = BolsaPuntos.objects.filter(
            fecha_caducidad__lte=fecha_limite, estado="ACTIVO"
        )

        if not bolsas.exists():
            return Response(
                {"mensaje": f"No hay bolsas con puntos a vencer en {dias} días."},
                status=status.HTTP_200_OK,
            )

        data = BolsaPuntosSerializer(bolsas, many=True).data
        return Response(
            {
                "mensaje": f"Bolsas con puntos a vencer en los próximos {dias} días.",
                "cantidad": len(data),
                "bolsas": data,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================================
#  RANKING DE CLIENTES
# ============================================================
@api_view(["GET"])
def ranking(request):
    """
    Devuelve ranking de clientes según sus puntos acumulados.
    Ejemplo:
    GET /api/consultas/ranking/
    """
    try:
        ranking_data = (
            BolsaPuntos.objects.values("cliente__id", "cliente__nombre", "cliente__apellido")
            .annotate(total_puntos=Sum("puntos_asignados"))
            .order_by("-total_puntos")
        )

        if not ranking_data:
            return Response({"mensaje": "No hay datos de puntos acumulados."}, status=status.HTTP_200_OK)

        return Response(
            {
                "mensaje": "Ranking de clientes por puntos acumulados.",
                "ranking": list(ranking_data),
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================================
#  BOLSAS POR CLIENTE
# ============================================================
@api_view(["GET"])
def bolsas_por_cliente(request):
    """
    Devuelve todas las bolsas activas de un cliente.
    Ejemplo:
    GET /api/consultas/bolsas_por_cliente/?cliente_id=1
    """
    try:
        cliente_id = request.query_params.get("cliente_id")
        if not cliente_id:
            return Response(
                {"error": "Debe proporcionar cliente_id como parámetro."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        bolsas = BolsaPuntos.objects.filter(cliente_id=cliente_id)
        if not bolsas.exists():
            return Response(
                {"mensaje": "El cliente no tiene bolsas registradas."},
                status=status.HTTP_200_OK,
            )

        serializer = BolsaPuntosSerializer(bolsas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================================
#  USOS DE PUNTOS POR CONCEPTO
# ============================================================
@api_view(["GET"])
def usos_por_concepto(request):
    """
    Devuelve los usos de puntos agrupados por concepto.
    Ejemplo:
    GET /api/consultas/usos_por_concepto/?concepto_id=1
    """
    try:
        concepto_id = request.query_params.get("concepto_id")
        if not concepto_id:
            return Response(
                {"error": "Debe proporcionar concepto_id como parámetro."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        usos = UsoPuntos.objects.filter(concepto_id=concepto_id)
        if not usos.exists():
            concepto = ConceptoPuntos.objects.get(id=concepto_id)
            return Response(
                {"mensaje": f"No hay usos registrados para el concepto '{concepto.descripcion}'."},
                status=status.HTTP_200_OK,
            )

        serializer = UsoPuntosSerializer(usos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except ConceptoPuntos.DoesNotExist:
        return Response({"error": "Concepto no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
