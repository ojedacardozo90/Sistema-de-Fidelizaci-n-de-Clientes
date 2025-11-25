"""
RUTA: fidelizacion/tasks.py
===========================================================
MÓDULO: Tareas Programadas del Sistema de Fidelización
===========================================================
Incluye procesos automáticos que deben ejecutarse cada cierto
tiempo, como la expiración de bolsas de puntos.

Este archivo está preparado para usarse con:
 - django-crontab (más simple para el parcial)
 - o Celery Beat (si luego deseas escalar el proyecto)

Para el PARCIAL se recomienda:
   pip install django-crontab

Y en settings.py:
   CRONJOBS = [
       ('0 */6 * * *', 'fidelizacion.tasks.expirar_bolsas'),  # cada 6 horas
   ]

Luego:
   python manage.py crontab add
   python manage.py crontab show
===========================================================
"""

from django.utils import timezone
from .models import BolsaPuntos


def expirar_bolsas():
    """
    Marca como VENCIDAS todas las bolsas cuya fecha de caducidad
    ya pasó y siguen con estado = 'ACTIVO'.

    Este proceso debe ejecutarse automáticamente cada X horas.
    ---------------------------------------------------------
    - No afecta bolsas AGOTADAS (mantienen su historial).
    - No afecta bolsas ya vencidas.
    - Cambia únicamente el campo estado = 'VENCIDO'.
    - Mantiene puntos_utilizados sin modificaciones.
    ---------------------------------------------------------
    Retorna:
        dict con información estadística del proceso.
    """

    ahora = timezone.now()

    # Bolsas activas cuya fecha de caducidad ya pasó
    bolsas_a_vencer = BolsaPuntos.objects.filter(
        estado="ACTIVO",
        fecha_caducidad__lt=ahora,
    )

    cantidad = bolsas_a_vencer.count()

    # Actualizamos solo si existe algo
    if cantidad > 0:
        bolsas_a_vencer.update(estado="VENCIDO")

    # Información útil para logs o auditoría
    return {
        "proceso": "expirar_bolsas",
        "ejecutado_en": str(ahora),
        "bolsas_vencidas": cantidad,
    }
