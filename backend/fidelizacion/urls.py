"""
RUTA: backend/fidelizacion/urls.py
Sistema de Fidelización — Rutas Oficiales
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

# Auth
from .auth_views import LoginView
from rest_framework_simplejwt.views import TokenRefreshView

# Referidos
from .views import referir_cliente


# ============================================================
# CRUDs (ViewSets) — Router
# ============================================================
router = DefaultRouter()
router.register(r'clientes', views.ClienteViewSet)
router.register(r'conceptos', views.ConceptoViewSet)
router.register(r'reglas', views.ReglaViewSet)
router.register(r'vencimientos', views.VencimientoViewSet)
router.register(r'promociones', views.PromocionViewSet)
router.register(r'bolsas', views.BolsaViewSet)
router.register(r'usos', views.UsoViewSet)
router.register(r'insignias', views.InsigniaViewSet)
router.register(r'desafios', views.DesafioViewSet)
router.register(r'insignias_cliente', views.InsigniaClienteViewSet)
router.register(r'desafios_cliente', views.DesafioClienteViewSet)
router.register(r'productos_canje', views.ProductoCanjeViewSet)


# ============================================================
# Servicios
# ============================================================
servicios_patterns = [
    path("cargar_puntos/", views_servicios.cargar_puntos),
    path("usar_puntos/", views_servicios.usar_puntos),
    path("puntos_por_monto/", views_servicios.puntos_por_monto),

    # Historial Canjes
    path("historial_canje_fecha/", views_consultas.historial_canje_por_fecha),
    path("historial_canje_producto/", views_consultas.historial_canje_por_producto),
    path("historial_canje_filtros/", views_consultas.historial_canje_filtros),
]


# ============================================================
# Consultas (NO duplicadas)
# ============================================================
consultas_patterns = [
    path("usos_por_concepto/", views_consultas.usos_por_concepto),
    path("usos_por_fecha/", views_consultas.usos_por_fecha),
    path("usos_por_cliente/", views_consultas.usos_por_cliente),
    path("usos_por_rango_fecha/", views_consultas.usos_por_rango_fecha),

    path("bolsas_por_cliente/", views_consultas.bolsas_por_cliente),
    path("bolsas_por_rango/", views_consultas.bolsas_por_rango),
    path("bolsas_proximo_vencer/", views_consultas.bolsas_proximo_vencer),

    path("puntos_a_vencer/", views_consultas.puntos_a_vencer),
    path("ranking/", views_consultas.ranking),

    path("clientes_cumpleanios/", views_consultas.clientes_cumpleanios),
    path("clientes_por_apellido/", views_consultas.clientes_por_apellido),
    path("clientes_por_nombre/", views_consultas.clientes_por_nombre),
]


# ============================================================
# URLs principales del módulo fidelización
# ============================================================
urlpatterns = [

    # CRUDs
    path("", include(router.urls)),

    # Servicios
    path("servicios/", include(servicios_patterns)),

    # Consultas
    path("consultas/", include(consultas_patterns)),

    # Dashboard
    path("dashboard_metrics/", views_dashboard.dashboard_metrics),
    path("dashboard_analytics/", views_dashboard.dashboard_analytics),

    # Auth
    path("auth/login/", LoginView.as_view()),
    path("auth/refresh/", TokenRefreshView.as_view()),

    # Referidos
    path("referir/", referir_cliente),
]
