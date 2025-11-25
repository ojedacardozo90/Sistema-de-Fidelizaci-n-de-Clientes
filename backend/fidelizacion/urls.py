"""
RUTA: fidelizacion/urls.py
===========================================================
Rutas del Sistema de Fidelización
===========================================================
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# CRUD ViewSets
from . import views

# Servicios
from . import views_servicios

# Consultas / Reportes
from . import views_consultas

# Dashboard
from . import views_dashboard

# JWT
from .auth_views import LoginView
from rest_framework_simplejwt.views import TokenRefreshView


# ============================================================
# CRUDs (ViewSets)
# ============================================================
router = DefaultRouter()
router.register(r'clientes', views.ClienteViewSet)
router.register(r'conceptos', views.ConceptoViewSet)
router.register(r'reglas', views.ReglaViewSet)
router.register(r'vencimientos', views.VencimientoViewSet)
router.register(r'bolsas', views.BolsaViewSet)
router.register(r'usos', views.UsoViewSet)


# ============================================================
# Servicios
# ============================================================
servicios_patterns = [
    path("cargar_puntos/", views_servicios.cargar_puntos),
    path("usar_puntos/", views_servicios.usar_puntos),
    path("puntos_por_monto/", views_servicios.puntos_por_monto),
]


# ============================================================
# Consultas
# ============================================================
consultas_patterns = [
    path("puntos_a_vencer/", views_consultas.puntos_a_vencer),
    path("ranking/", views_consultas.ranking),
    path("bolsas_por_cliente/", views_consultas.bolsas_por_cliente),
    path("bolsas_por_rango/", views_consultas.bolsas_por_rango),
    path("usos_por_concepto/", views_consultas.usos_por_concepto),
    path("usos_por_fecha/", views_consultas.usos_por_fecha),
    path("usos_por_cliente/", views_consultas.usos_por_cliente),

    # Consultas faltantes (enunciado oficial)
    path("clientes_cumpleanios/", views_consultas.clientes_cumpleanios),
    path("clientes_por_apellido/", views_consultas.clientes_por_apellido),

    # Parámetro extra: rango de fecha
    path("usos_por_rango_fecha/", views_consultas.usos_por_rango_fecha),
]


# ============================================================
# URLs principales del módulo fidelización
# ============================================================
urlpatterns = [
    # CRUD (router)
    path("", include(router.urls)),

    # Servicios
    path("servicios/", include(servicios_patterns)),

    # Consultas
    path("consultas/", include(consultas_patterns)),

    # Dashboard metrics
    path("dashboard_metrics/", views_dashboard.dashboard_metrics, name="dashboard_metrics"),

    # JWT Auth
    path("auth/login/", LoginView.as_view(), name="token_obtain_pair"),
    path("cargar_puntos/", views_servicios.cargar_puntos),
    path("usar_puntos/", views_servicios.usar_puntos),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
