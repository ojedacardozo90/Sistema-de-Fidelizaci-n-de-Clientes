"""
RUTA: fidelizacion/services.py
===========================================================
MÓDULO: Servicios de Negocio del Sistema de Fidelización
===========================================================
Aquí se centraliza la lógica de negocio que NO depende
directamente de peticiones HTTP ni del framework REST.

Incluye:
 - Cálculo automático de puntos según reglas vigentes.
 - Determinación de fecha de caducidad.
 - Creación completa de bolsa de puntos.
 - Servicios reutilizables desde views, señales o admin.

Este módulo existe para:
 - Mantener el código limpio.
 - Cumplir la arquitectura en capas solicitada en IS2.
 - Permitir test unitarios más simples.

===========================================================
"""

from datetime import timedelta
from django.utils import timezone
from django.db import models

from .models import (
    BolsaPuntos,
    ReglaPuntos,
    ParametrizacionVencimiento,
)


# ============================================================
#  SERVICIO 1: Calcular puntos según reglas
# ============================================================
def calcular_puntos_por_monto(monto):
    """
    Dado un monto, determina cuántos puntos corresponden usando
    las reglas de fidelización.

    Lógica:
    - Busca la regla cuyo rango contenga el monto.
    - Si límite_superior es NULL, significa "sin límite superior".
    - Aplica: puntos = monto / monto_por_punto
    - Devuelve (puntos, regla)

    Retorna:
        - puntos: int
        - regla: instancia de ReglaPuntos o None
    """
    regla = (
        ReglaPuntos.objects
        .filter(limite_inferior__lte=monto)
        .filter(
            models.Q(limite_superior__gte=monto)
            | models.Q(limite_superior__isnull=True)
        )
        .order_by("limite_inferior")
        .first()
    )

    if not regla:
        return 0, None

    puntos = int(monto // float(regla.monto_por_punto))
    return puntos, regla


# ============================================================
#  SERVICIO 2: Obtener la fecha de caducidad
# ============================================================
def obtener_fecha_caducidad():
    """
    Devuelve la fecha de caducidad correspondiente según la
    parametrización vigente.

    - Busca la parametrización activa según la fecha actual.
    - Si no hay ninguna, por defecto 365 días.
    """
    hoy = timezone.now().date()

    param = (
        ParametrizacionVencimiento.objects
        .filter(fecha_inicio__lte=hoy, fecha_fin__gte=hoy)
        .order_by("-fecha_inicio")
        .first()
    )

    if not param:
        return hoy + timedelta(days=365)

    return hoy + timedelta(days=param.dias_duracion)


# ============================================================
#  SERVICIO 3: Asignar puntos a un cliente
# ============================================================
def asignar_puntos_cliente(cliente, monto_operacion):
    """
    Crea una bolsa de puntos asociada al cliente.

    Lógica:
    - Calcula automáticamente los puntos según reglas.
    - Obtiene la fecha de caducidad según parametrización.
    - Crea la bolsa en estado ACTIVO.

    Devuelve:
        dict con datos creados o None si no aplica regla.
    """

    puntos, regla = calcular_puntos_por_monto(monto_operacion)

    # Si no hay regla, no se generan puntos
    if puntos == 0:
        return None

    fecha_caducidad = obtener_fecha_caducidad()

    bolsa = BolsaPuntos.objects.create(
        cliente=cliente,
        puntos_asignados=puntos,
        puntos_utilizados=0,
        monto_operacion=monto_operacion,
        fecha_asignacion=timezone.now(),
        fecha_caducidad=fecha_caducidad,
        estado="ACTIVO",
    )

    return {
        "cliente_id": cliente.id,
        "puntos_asignados": puntos,
        "fecha_caducidad": fecha_caducidad,
        "regla_aplicada": str(regla) if regla else None,
        "bolsa_id": bolsa.id,
    }
