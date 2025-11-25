from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from django.db import models, transaction
from backend.clientes.models import Cliente
from .models import (
    ReglaPuntos,
    BolsaPuntos,
    UsoPuntos,
    UsoPuntosDetalle,
    ConceptoPuntos,
)

# ============================================================
#  SERVICIO: CARGAR PUNTOS
# ============================================================

@api_view(["POST"])
def cargar_puntos(request):
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

        BolsaPuntos.objects.create(
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
            "puntos_asignados": puntos_asignados
        }, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# ============================================================
#  SERVICIO: USAR PUNTOS
# ============================================================

@api_view(["POST"])
@transaction.atomic
def usar_puntos(request):

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

    uso.save(update_fields=["puntos_utilizados"])

    if restante > 0:
        raise transaction.TransactionManagementError("Saldo insuficiente de puntos.")

    return Response({"mensaje": "Puntos usados correctamente."}, status=201)
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

        regla = (
            ReglaPuntos.objects
            .filter(limite_inferior__lte=monto)
            .filter(
                models.Q(limite_superior__gte=monto) |
                models.Q(limite_superior__isnull=True)
            )
            .order_by("-limite_inferior")
            .first()
        )

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
