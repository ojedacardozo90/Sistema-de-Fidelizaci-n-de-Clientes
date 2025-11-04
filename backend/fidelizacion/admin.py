"""
RUTA: fidelizacion/admin.py
===========================================================
MÓDULO: Administración del Sistema de Fidelización
===========================================================
Permite gestionar desde el panel de Django Admin todos los
modelos de fidelización: conceptos, reglas, parametrización,
bolsas, usos y detalles.

Incluye:
 - Visualización de campos clave
 - Filtros por estado, fecha, cliente
 - Búsquedas textuales
 - Orden lógico y coherente
 - Cálculo automático de puntos según reglas activas
===========================================================
"""

from django.contrib import admin, messages
from django.utils import timezone
from .models import (
    ConceptoPuntos,
    ReglaPuntos,
    ParametrizacionVencimiento,
    BolsaPuntos,
    UsoPuntos,
    UsoPuntosDetalle
)


# ============================================================
# ADMIN: Conceptos de Puntos
# ============================================================
@admin.register(ConceptoPuntos)
class ConceptoPuntosAdmin(admin.ModelAdmin):
    """Gestión de conceptos de puntos."""
    list_display = ("id", "descripcion", "puntos_requeridos")
    search_fields = ("descripcion",)
    ordering = ("id",)


# ============================================================
# ADMIN: Reglas de Asignación de Puntos
# ============================================================
@admin.register(ReglaPuntos)
class ReglaPuntosAdmin(admin.ModelAdmin):
    """Gestión de reglas de asignación de puntos."""
    list_display = ("id", "limite_inferior", "limite_superior", "monto_por_punto")
    list_filter = ("limite_inferior",)
    ordering = ("limite_inferior",)
    search_fields = ("limite_inferior", "limite_superior")


# ============================================================
# ADMIN: Parametrización de Vencimiento
# ============================================================
@admin.register(ParametrizacionVencimiento)
class ParametrizacionVencimientoAdmin(admin.ModelAdmin):
    """Gestión de parametrización de vencimiento de puntos."""
    list_display = ("id", "dias_duracion", "fecha_inicio", "fecha_fin")
    list_filter = ("fecha_inicio", "fecha_fin")
    ordering = ("-id",)


# ============================================================
# ADMIN: Bolsa de Puntos
# ============================================================
@admin.register(BolsaPuntos)
class BolsaPuntosAdmin(admin.ModelAdmin):
    """Gestión de las bolsas de puntos asignadas a clientes."""
    list_display = (
        "id",
        "cliente",
        "monto_operacion",
        "puntos_asignados",
        "regla_aplicada",
        "estado",
        "fecha_asignacion",
        "fecha_caducidad",
    )
    list_filter = ("estado", "fecha_caducidad")
    search_fields = ("cliente__nombre", "cliente__apellido")
    ordering = ("-fecha_asignacion",)
    readonly_fields = ("puntos_asignados", "puntos_utilizados", "fecha_asignacion")

    def regla_aplicada(self, obj):
        """Muestra en el listado del admin qué regla se aplicó al calcular los puntos."""
        try:
            regla = (
                ReglaPuntos.objects
                .filter(limite_inferior__lte=obj.monto_operacion, limite_superior__gte=obj.monto_operacion)
                .first()
            )
            if regla:
                return (
                    f"{int(regla.limite_inferior):,} – {int(regla.limite_superior):,} Gs "
                    f"→ 1 pt / {int(regla.monto_por_punto):,} Gs"
                )
            return "Sin regla aplicada"
        except Exception:
            return "—"

    regla_aplicada.short_description = "Regla aplicada"

    # ------------------------------------------------------------
    # Guardado automático con cálculo exacto según ReglaPuntos
    # ------------------------------------------------------------
    def save_model(self, request, obj, form, change):
        """
        Calcula automáticamente los puntos asignados según la
        regla que corresponde al monto de operación. Muestra un
        mensaje visual informativo al guardar.
        """
        try:
            if not obj.monto_operacion or obj.monto_operacion <= 0:
                self.message_user(
                    request,
                    " Debe indicar un monto válido para calcular los puntos.",
                    level=messages.ERROR,
                )
                return

            regla = (
                ReglaPuntos.objects
                .filter(limite_inferior__lte=obj.monto_operacion, limite_superior__gte=obj.monto_operacion)
                .first()
            )

            if not regla:
                self.message_user(
                    request,
                    f" No se encontró una regla de puntos para el monto {obj.monto_operacion:,.0f} Gs.",
                    level=messages.ERROR,
                )
                return

            puntos_calculados = int(obj.monto_operacion / regla.monto_por_punto)
            obj.puntos_asignados = puntos_calculados
            obj.puntos_utilizados = 0
            obj.fecha_asignacion = timezone.now()
            obj.fecha_caducidad = timezone.now() + timezone.timedelta(days=365)

            super().save_model(request, obj, form, change)

            self.message_user(
                request,
                f" Bolsa creada automáticamente: {puntos_calculados} pts asignados "
                f"según regla #{regla.id} "
                f"({int(regla.limite_inferior):,} – {int(regla.limite_superior):,} Gs → "
                f"1 pt / {int(regla.monto_por_punto):,} Gs).",
                level=messages.SUCCESS,
            )

        except Exception as e:
            self.message_user(
                request,
                f" Error al crear la bolsa: {str(e)}",
                level=messages.ERROR,
            )


# ============================================================
#  ADMIN: Uso de Puntos (Cabecera)
# ============================================================
@admin.register(UsoPuntos)
class UsoPuntosAdmin(admin.ModelAdmin):
    """Gestión de usos de puntos realizados por los clientes."""
    list_display = ("id", "cliente", "concepto", "puntos_utilizados", "fecha")
    list_filter = ("concepto", "fecha")
    search_fields = ("cliente__nombre", "cliente__apellido")
    ordering = ("-fecha",)


# ============================================================
#  ADMIN: Detalle de Uso de Puntos
# ============================================================
@admin.register(UsoPuntosDetalle)
class UsoPuntosDetalleAdmin(admin.ModelAdmin):
    """Gestión del detalle de usos de puntos (por bolsa)."""
    list_display = ("id", "uso", "bolsa", "puntos_utilizados")
    list_filter = ("bolsa__estado",)
    search_fields = ("uso__cliente__nombre", "bolsa__cliente__apellido")
    ordering = ("id",)
