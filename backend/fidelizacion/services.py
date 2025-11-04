# fidelizacion/services.py
# ============================================================
# Servicios de negocio para el Sistema de Fidelización
# ============================================================
from django.utils import timezone
from datetime import timedelta
from .models import BolsaPuntos, ReglaPuntos, ParametrizacionVencimiento

def calcular_puntos_por_monto(monto):
    """
    Determina cuántos puntos corresponden según las reglas definidas.
    - Busca la regla donde el monto encaje entre límite_inferior y límite_superior.
    - Si no hay límite_superior (None), aplica a montos mayores.
    """
    regla = (
        ReglaPuntos.objects
        .filter(limite_inferior__lte=monto)
        .filter(models.Q(limite_superior__gte=monto) | models.Q(limite_superior__isnull=True))
        .order_by('limite_inferior')
        .first()
    )
    if not regla:
        return 0, None  # No hay regla aplicable

    puntos = int(monto // float(regla.monto_por_punto))
    return puntos, regla


def obtener_fecha_caducidad():
    """
    Usa la parametrización de vencimiento activa (fecha actual entre inicio y fin)
    para calcular la fecha de caducidad.
    """
    hoy = timezone.now().date()
    param = (
        ParametrizacionVencimiento.objects
        .filter(fecha_inicio__lte=hoy, fecha_fin__gte=hoy)
        .order_by('-fecha_inicio')
        .first()
    )
    if not param:
        return hoy + timedelta(days=365)
    return hoy + timedelta(days=param.dias_duracion)


def asignar_puntos_cliente(cliente, monto_operacion):
    """
    Crea una bolsa de puntos automáticamente según las reglas.
    """
    puntos, regla = calcular_puntos_por_monto(monto_operacion)
    if puntos == 0:
        return None  # No hay puntos por esa operación

    fecha_caducidad = obtener_fecha_caducidad()

    bolsa = BolsaPuntos.objects.create(
        cliente=cliente,
        puntos_asignados=puntos,
        puntos_utilizados=0,
        monto_operacion=monto_operacion,
        fecha_asignacion=timezone.now(),
        fecha_caducidad=fecha_caducidad,
        estado='ACTIVO',
    )

    return {
        "cliente_id": cliente.id,
        "puntos_asignados": puntos,
        "fecha_caducidad": fecha_caducidad,
        "regla_aplicada": str(regla) if regla else None
    }
