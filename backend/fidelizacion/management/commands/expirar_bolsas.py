"""
Comando: vencer_bolsas
====================================================
Actualiza el estado de las bolsas de puntos vencidas.
Puede ejecutarse manualmente o programarse con cron.
====================================================
Uso:
  python manage.py vencer_bolsas
====================================================
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from fidelizacion.models import BolsaPuntos

class Command(BaseCommand):
    help = "Actualiza las bolsas de puntos vencidas (estado = VENCIDO)."

    def handle(self, *args, **options):
        hoy = timezone.now()
        vencidas = BolsaPuntos.objects.filter(
            estado="ACTIVO", fecha_caducidad__lt=hoy
        )
        total = vencidas.count()
        for b in vencidas:
            b.estado = "VENCIDO"
            b.save(update_fields=["estado"])
        self.stdout.write(
            self.style.SUCCESS(f"Se actualizaron {total} bolsas vencidas.")
        )
