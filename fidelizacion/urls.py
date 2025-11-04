"""
RUTA: fidelizacion/urls.py
===========================================================
MÓDULO DE RUTAS - Sistema de Fidelización de Clientes
===========================================================
Define los endpoints REST del sistema, integrando:
 - CRUDs (ModelViewSets)
 - Servicios especiales (POST / GET)
 - Consultas y reportes
===========================================================
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import views_servicios, views_consultas

# ============================================================
# RUTAS CRUD AUTOMÁTICAS (ModelViewSets)
# ============================================================
router = DefaultRouter()
router.register(r'clientes', views.ClienteViewSet, basename='clientes')
router.register(r'conceptos', views.ConceptoViewSet, basename='conceptos')
router.register(r'reglas', views.ReglaViewSet, basename='reglas')
router.register(r'vencimientos', views.VencimientoViewSet, basename='vencimientos')
router.register(r'bolsas', views.BolsaViewSet, basename='bolsas')
router.register(r'usos', views.UsoViewSet, basename='usos')


# ============================================================
# RUTAS DE SERVICIOS (LÓGICA DE NEGOCIO)
# ============================================================
servicios_patterns = [
    path('cargar_puntos/', views_servicios.cargar_puntos, name='cargar_puntos'),
    path('usar_puntos/', views_servicios.usar_puntos, name='usar_puntos'),
    path('puntos_por_monto/', views_servicios.puntos_por_monto, name='puntos_por_monto'),
]


# ============================================================
#  RUTAS DE CONSULTAS Y REPORTES
# ============================================================
consultas_patterns = [
    path('puntos_a_vencer/', views_consultas.puntos_a_vencer, name='puntos_a_vencer'),
    path('ranking/', views_consultas.ranking, name='ranking'),
    path('bolsas_por_cliente/', views_consultas.bolsas_por_cliente, name='bolsas_por_cliente'),
    path('usos_por_concepto/', views_consultas.usos_por_concepto, name='usos_por_concepto'),
]


# ============================================================
#  RUTAS PRINCIPALES DE LA APLICACIÓN
# ============================================================
urlpatterns = [
    # CRUDs automáticos
    path('', include(router.urls)),

    # Servicios
    path('servicios/', include((servicios_patterns, 'servicios'))),

    # Consultas
    path('consultas/', include((consultas_patterns, 'consultas'))),
]
