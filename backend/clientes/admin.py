"""
RUTA: clientes/admin.py

MÓDULO: Administración de Clientes
===========================================================
Permite gestionar desde el panel de Django Admin los datos
de los clientes que participan en el sistema de fidelización.

Incluye:
 - Visualización de información básica de los clientes
 - Cálculo automático de puntos disponibles (bolsas activas)
 - Filtros por nacionalidad, tipo de documento y rango de puntos
 - Búsqueda por nombre, apellido o número de documento
 - Orden lógico por apellido
===========================================================
"""

from django.contrib import admin
from .models import Cliente
from backend.fidelizacion.models import BolsaPuntos




# FILTRO PERSONALIZADO: Rango de puntos disponibles
# ============================================================
class PuntosRangoFilter(admin.SimpleListFilter):
    title = "Rango de puntos disponibles"
    parameter_name = "puntos_rango"

    def lookups(self, request, model_admin):
        """Define las opciones del filtro."""
        return [
            ("0-499", "0 – 499 pts"),
            ("500-999", "500 – 999 pts"),
            ("1000+", "1000 pts o más"),
        ]

    def queryset(self, request, queryset):
        """Filtra los clientes según el rango elegido."""
        clientes_ids = []
        for cliente in queryset:
            total = sum(
                b.puntos_asignados - b.puntos_utilizados
                for b in BolsaPuntos.objects.filter(cliente=cliente, estado="ACTIVO")
            )
            if self.value() == "0-499" and total < 500:
                clientes_ids.append(cliente.id)
            elif self.value() == "500-999" and 500 <= total < 1000:
                clientes_ids.append(cliente.id)
            elif self.value() == "1000+" and total >= 1000:
                clientes_ids.append(cliente.id)
        return queryset.filter(id__in=clientes_ids)



# ADMIN: Clientes
# ============================================================
@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    """Gestión de clientes registrados en el sistema."""

    list_display = (
        "id",
        "nombre",
        "apellido",
        "numero_documento",
        "tipo_documento",
        "nacionalidad",
        "email",
        "telefono",
        "puntos_disponibles",  # Nueva columna dinámica
    )
    list_filter = ("nacionalidad", "tipo_documento", PuntosRangoFilter)
    search_fields = ("nombre", "apellido", "numero_documento", "email")
    ordering = ("apellido", "nombre")

    
    # Cálculo dinámico de puntos disponibles
    # ------------------------------------------------------------
    def puntos_disponibles(self, obj):
        """
        Calcula los puntos disponibles del cliente sumando todas
        las bolsas activas (puntos_asignados - puntos_utilizados).
        """
        bolsas = BolsaPuntos.objects.filter(cliente=obj, estado="ACTIVO")
        total_puntos = sum(b.puntos_asignados - b.puntos_utilizados for b in bolsas)
        return f"{total_puntos:,} pts"

    puntos_disponibles.short_description = "Puntos disponibles"
    puntos_disponibles.admin_order_field = "id"
