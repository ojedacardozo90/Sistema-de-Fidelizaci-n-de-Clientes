from django.utils import timezone
from .models import BolsaPuntos

def expirar_bolsas():
    """
    Marca como VENCIDO las bolsas cuya fecha_caducidad ya pasó.
    Este job lo podés planificar cada X horas.
    """
    ahora = timezone.now()
    BolsaPuntos.objects.filter(estado="ACTIVO", fecha_caducidad__lt=ahora).update(estado="VENCIDO")
