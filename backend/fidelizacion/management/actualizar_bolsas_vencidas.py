from django.utils import timezone
from fidelizacion.models import BolsaPuntos

def handle(*args, **options):
    ahora = timezone.now()
    vencidas = BolsaPuntos.objects.filter(estado="ACTIVO", fecha_caducidad__lt=ahora)
    vencidas.update(estado="VENCIDO")
