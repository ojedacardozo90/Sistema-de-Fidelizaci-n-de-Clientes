"""
core/urls.py
==========================================
Rutas principales del proyecto Django.
Conecta la API del sistema de fidelización
bajo el prefijo /api/.
==========================================
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# -------------------------------------------------
# Vista base de prueba (opcional)
# -------------------------------------------------
def home(request):
    """
    Endpoint raíz del sistema.
    Devuelve un mensaje simple para verificar que el servidor esté en línea.
    """
    return JsonResponse({
        "mensaje": "Sistema de Fidelización de Clientes - API Activa",
        "endpoints": {
            "base_api": "/api/",
            "documentacion": "Utilice /api/ para acceder a los servicios y CRUDs."
        }
    })

# -------------------------------------------------
# URL Patterns principales
# -------------------------------------------------
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),                # Página raíz simple
    path('api/', include('fidelizacion.urls')), # Incluye todas las rutas de fidelización
    path("api/fidelizacion/", include("fidelizacion.urls")),

]
