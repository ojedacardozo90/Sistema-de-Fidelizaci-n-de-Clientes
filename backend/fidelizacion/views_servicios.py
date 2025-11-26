from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from django.db import models, transaction
from datetime import date

from backend.clientes.models import Cliente
from .models import (
    ReglaPuntos,
    BolsaPuntos,
    UsoPuntos,
    UsoPuntosDetalle,
    ConceptoPuntos,
    Insignia,
    InsigniaCliente,
    DesafioCliente,
    Promocion,
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

        # Obtener regla aplicable
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
            return Response({"error": f"No hay regla definida para el monto {monto_operacion}."}, status=400)

        puntos_asignados = int(monto_operacion / regla.monto_por_punto)

        # ============================================================
        # DESAFÍOS TIPO PUNTOS
        # ============================================================
        desafios = DesafioCliente.objects.filter(cliente=cliente, desafio__tipo="PUNTOS")
        for dc in desafios:
            dc.progreso += puntos_asignados
            if dc.progreso >= dc.desafio.meta:
                dc.completado = True
            dc.save()

        # ============================================================
        # PROMOCIONES ACTIVAS
        # ============================================================
        hoy = date.today()
        promos = Promocion.objects.filter(
            activo=True,
            fecha_inicio__lte=hoy,
            fecha_fin__gte=hoy
        )

        for promo in promos:
            if promo.tipo == "MULTIPLICADOR":
                puntos_asignados *= promo.valor
            elif promo.tipo == "BONUS":
                puntos_asignados += promo.valor

        # Crear bolsa
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

    try:
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

        # ============================================================
        # DESAFÍOS TIPO CANJES
        # ============================================================
        desafios = DesafioCliente.objects.filter(cliente=cliente, desafio__tipo="CANJES")
        for dc in desafios:
            dc.progreso += 1
            if dc.progreso >= dc.desafio.meta:
                dc.completado = True
            dc.save()

        # ============================================================
        # INSIGNIA — PRIMER CANJE
        # ============================================================
        if not UsoPuntos.objects.filter(cliente=cliente).exclude(id=uso.id).exists():
            try:
                badge = Insignia.objects.get(nombre="Primer Canje")
                InsigniaCliente.objects.get_or_create(cliente=cliente, insignia=badge)
            except:
                pass

        return Response({"mensaje": "Puntos usados correctamente."}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
# ============================================================
@api_view(["POST"])
@transaction.atomic
def canjear_producto(request):
    """
    Servicio oficial de canje de puntos por productos/servicios.
    FIFO real, igual que usar_puntos.
    """
    try:
        cliente_id = request.data.get("cliente_id")
        producto_id = request.data.get("producto_id")

        if not cliente_id or not producto_id:
            return Response({"error": "cliente_id y producto_id son obligatorios."}, status=400)

        cliente = Cliente.objects.get(id=cliente_id)
        producto = ProductoCanje.objects.get(id=producto_id)

        puntos_requeridos = producto.puntos_requeridos

        # Bolsas FIFO
        bolsas = (
            BolsaPuntos.objects
            .select_for_update()
            .filter(cliente=cliente, estado="ACTIVO")
            .order_by("fecha_caducidad", "id")
        )

        restante = puntos_requeridos

        canje = Canje.objects.create(
            cliente=cliente,
            producto=producto,
            puntos_utilizados=0,
        )

        for b in bolsas:
            if restante <= 0:
                break

            disponible = b.puntos_asignados - b.puntos_utilizados
            if disponible <= 0:
                continue

            usar = min(disponible, restante)

            b.puntos_utilizados += usar
            if b.puntos_utilizados == b.puntos_asignados:
                b.estado = "AGOTADO"

            b.save(update_fields=["puntos_utilizados", "estado"])

            CanjeDetalle.objects.create(
                canje=canje,
                bolsa=b,
                puntos_utilizados=usar,
            )

            canje.puntos_utilizados += usar
            restante -= usar

        canje.save()

        if restante > 0:
            raise transaction.TransactionManagementError(
                "Puntos insuficientes para realizar el canje."
            )

        return Response({
            "mensaje": "Canje realizado correctamente.",
            "producto": producto.nombre,
            "puntos_utilizados": canje.puntos_utilizados
        }, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=500)




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

        # Obtener regla aplicable
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

        # Cálculo base
        puntos = int(monto / regla.monto_por_punto)

        # Aplicar promociones activas (sin afectar la BD)
        hoy = date.today()
        promos = Promocion.objects.filter(
            activo=True,
            fecha_inicio__lte=hoy,
            fecha_fin__gte=hoy
        )

        puntos_finales = puntos

        for promo in promos:
            if promo.tipo == "MULTIPLICADOR":
                puntos_finales *= promo.valor
            elif promo.tipo == "BONUS":
                puntos_finales += promo.valor

        return Response({
            "mensaje": "Cálculo estimado correcto.",
            "monto": monto,
            "puntos_estimados": puntos_finales,
            "regla_aplicada": {
                "id": regla.id,
                "limite_inferior": regla.limite_inferior,
                "limite_superior": regla.limite_superior,
                "monto_por_punto": regla.monto_por_punto
            },
            "promociones_aplicadas": [
                {
                    "nombre": p.nombre,
                    "tipo": p.tipo,
                    "valor": p.valor
                }
                for p in promos
            ]
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)

