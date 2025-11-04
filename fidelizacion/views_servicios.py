"""
RUTA: fidelizacion/views_servicios.py
===========================================================
 MÓDULO: Servicios del Sistema de Fidelización
===========================================================
Incluye las operaciones especiales del sistema que no son
CRUD directos, sino procesos automáticos:

 - cargar_puntos: asigna puntos a un cliente por operación
 - usar_puntos: descuenta puntos según concepto de uso
 - puntos_por_monto: consulta informativa (GET)
===========================================================
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db import transaction
from clientes.models import Cliente
from .models import (
    BolsaPuntos,
    ReglaPuntos,
    ConceptoPuntos,
    UsoPuntos,
    UsoPuntosDetalle,
)
from .serializers import BolsaPuntosSerializer, UsoPuntosSerializer


# ============================================================
# CARGAR PUNTOS
# ============================================================
@api_view(['POST'])
def cargar_puntos(request):
    """
    Asigna puntos a un cliente en función del monto de la operación.
    Reglas:
      - Calcula puntos según tabla de ReglaPuntos activa.
      - Crea una BolsaPuntos con fecha de caducidad.
    """
    try:
        cliente_id = request.data.get("cliente_id")
        monto_operacion = float(request.data.get("monto_operacion", 0))

        if not cliente_id or monto_operacion <= 0:
            return Response(
                {"error": "Debe enviar cliente_id y monto_operacion válidos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cliente = Cliente.objects.get(id=cliente_id)

        # Buscar regla activa
        regla = ReglaPuntos.objects.order_by('-id').first()
        if not regla:
            return Response(
                {"error": "No hay reglas de puntos definidas."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calcular puntos según la regla
        puntos_asignados = int(monto_operacion / regla.monto_equivalencia)

        # Crear bolsa
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
                "puntos_asignados": puntos_asignados,
                "monto_operacion": monto_operacion,
                "bolsa_id": bolsa.id,
            },
            status=status.HTTP_201_CREATED,
        )

    except Cliente.DoesNotExist:
        return Response(
            {"error": "Cliente no encontrado."},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================================
#  USAR PUNTOS
# ============================================================
@api_view(['POST'])
@transaction.atomic
def usar_puntos(request):
    """
    Descuenta puntos de las bolsas del cliente (FIFO).
    Crea UsoPuntos (cabecera) y UsoPuntosDetalle (detalle).
    """
    try:
        cliente_id = request.data.get("cliente_id")
        concepto_id = request.data.get("concepto_id")
        puntos_a_usar = int(request.data.get("puntos_utilizados", 0))

        if not all([cliente_id, concepto_id, puntos_a_usar > 0]):
            return Response(
                {"error": "Debe enviar cliente_id, concepto_id y puntos_utilizados válidos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cliente = Cliente.objects.get(id=cliente_id)
        concepto = ConceptoPuntos.objects.get(id=concepto_id)

        # Crear cabecera
        uso = UsoPuntos.objects.create(
            cliente=cliente,
            concepto=concepto,
            puntos_utilizados=puntos_a_usar,
            fecha=timezone.now()
        )

        # Descontar puntos FIFO
        puntos_restantes = puntos_a_usar
        bolsas = BolsaPuntos.objects.filter(
            cliente=cliente, estado="ACTIVO"
        ).order_by("fecha_asignacion")

        for bolsa in bolsas:
            saldo = bolsa.puntos_asignados - bolsa.puntos_utilizados
            if saldo <= 0:
                continue

            if puntos_restantes <= saldo:
                bolsa.puntos_utilizados += puntos_restantes
                bolsa.save()
                UsoPuntosDetalle.objects.create(
                    uso=uso, bolsa=bolsa, puntos_utilizados=puntos_restantes
                )
                puntos_restantes = 0
                break
            else:
                bolsa.puntos_utilizados += saldo
                bolsa.save()
                UsoPuntosDetalle.objects.create(
                    uso=uso, bolsa=bolsa, puntos_utilizados=saldo
                )
                puntos_restantes -= saldo

        if puntos_restantes > 0:
            return Response(
                {"error": "El cliente no posee puntos suficientes."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "mensaje": "Uso de puntos registrado correctamente.",
                "cliente": f"{cliente.nombre} {cliente.apellido}",
                "concepto": concepto.descripcion,
                "puntos_usados": puntos_a_usar,
            },
            status=status.HTTP_201_CREATED,
        )

    except Cliente.DoesNotExist:
        return Response({"error": "Cliente no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except ConceptoPuntos.DoesNotExist:
        return Response({"error": "Concepto no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================================
# CONSULTAR PUNTOS POR MONTO
# ============================================================
@api_view(['GET'])
def puntos_por_monto(request):
    """
    Devuelve la cantidad estimada de puntos que un cliente
    obtendría por un monto determinado.
    """
    try:
        monto = float(request.query_params.get("monto", 0))
        if monto <= 0:
            return Response({"error": "Debe enviar un monto válido."}, status=status.HTTP_400_BAD_REQUEST)

        regla = ReglaPuntos.objects.order_by('-id').first()
        if not regla:
            return Response({"error": "No hay reglas de puntos definidas."}, status=status.HTTP_400_BAD_REQUEST)

        puntos = int(monto / regla.monto_equivalencia)

        return Response(
            {
                "monto": monto,
                "equivalencia_actual": regla.monto_equivalencia,
                "puntos_estimados": puntos,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
