"""
RUTA: clientes/models.py
====================================================
Modelo principal del Cliente del Sistema de Fidelización.
====================================================
"""

from django.db import models


# ============================================================
# 1cLIENTE
# ============================================================
class Cliente(models.Model):
    """
    Define los datos básicos del cliente y su nivel de fidelización.
    Este modelo es la base de relación para las demás entidades del sistema:
    BolsaPuntos, UsoPuntos,
    """

    # ------------------------
    # Datos personales
    # ------------------------
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    numero_documento = models.CharField(max_length=20, unique=True)
    tipo_documento = models.CharField(max_length=30, default="CI")
    nacionalidad = models.CharField(max_length=50, default="Paraguaya")
    email = models.EmailField(max_length=120, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)

    # ------------------------
    # Fidelización
    # ------------------------
    nivel_fidelizacion = models.CharField(
        max_length=20,
        choices=[
            ("BRONCE", "Bronce"),
            ("PLATA", "Plata"),
            ("ORO", "Oro"),
            ("DIAMANTE", "Diamante"),
        ],
        default="BRONCE",
    )

    # ------------------------
    # Gestión y control
    # ------------------------
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        ordering = ["apellido", "nombre"]

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.numero_documento})"

    # ============================================================
    # MÉTODO: actualizar_nivel
    # ============================================================
    def actualizar_nivel(self):
        """
        Calcula el total de puntos activos (solo bolsas en estado ACTIVO)
        y actualiza el nivel de fidelización del cliente.
        """
        total_puntos = 0
        if hasattr(self, "bolsas"):
            total_puntos = sum(b.saldo_actual() for b in self.bolsas.filter(estado="ACTIVO"))

        if total_puntos < 1000:
            nuevo = "BRONCE"
        elif total_puntos < 3000:
            nuevo = "PLATA"
        elif total_puntos < 6000:
            nuevo = "ORO"
        else:
            nuevo = "DIAMANTE"

        if nuevo != self.nivel_fidelizacion:
            self.nivel_fidelizacion = nuevo
            self.save(update_fields=["nivel_fidelizacion"])

        return nuevo
