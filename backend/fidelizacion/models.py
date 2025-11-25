"""
RUTA: fidelizacion/models.py
====================================================
Modelos principales del Sistema de Fidelización.
Incluye:
 - Conceptos de puntos
 - Reglas de asignación
 - Parametrización de vencimientos
 - Bolsa de puntos
 - Uso de puntos (cabecera y detalle)
Este archivo fue revisado y documentado para:
✔ Cumplir con los requisitos del parcial
✔ Mantener compatibilidad con serializers, views y servicios
✔ Soportar CRUD completo y servicios automáticos de negocio
✔ Claridad total en la presentación del TP final
====================================================
"""

from django.db import models
from django.utils import timezone



# 1) CONCEPTO DE PUNTOS
# ============================================================
class ConceptoPuntos(models.Model):
    """
    Define los diferentes conceptos de uso de puntos.
    Ejemplo:
      - Vale de descuento
      - Premio mensual
      - Bonificación especial
    Cada concepto indica cuántos puntos se requieren para usarlo.
    """

    descripcion = models.CharField(max_length=200)
    puntos_requeridos = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.descripcion} ({self.puntos_requeridos} pts)"

    class Meta:
        verbose_name = "Concepto de Puntos"
        verbose_name_plural = "Conceptos de Puntos"
        ordering = ["id"]




# 2) REGLAS DE PUNTOS
# ============================================================
class ReglaPuntos(models.Model):
    """
    Define las reglas para asignar puntos según el monto de consumo.
    Ejemplo:
      - 0 a 199.999 Gs  → 1 punto cada 50.000
      - 200.000 a 499.999 Gs → 1 punto cada 30.000
      - 500.000 o más → 1 punto cada 20.000

    NOTA IMPORTANTE:
    Si limite_superior es NULL → la regla aplica a montos mayores.
    """

    limite_inferior = models.DecimalField(max_digits=12, decimal_places=2)
    limite_superior = models.DecimalField(
        max_digits=12, decimal_places=2, blank=True, null=True
    )
    monto_por_punto = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        if self.limite_superior:
            return (
                f"{self.limite_inferior} - {self.limite_superior} | "
                f"1 punto cada {self.monto_por_punto} Gs."
            )
        return f"Desde {self.limite_inferior} | 1 punto cada {self.monto_por_punto} Gs."

    class Meta:
        verbose_name = "Regla de Puntos"
        verbose_name_plural = "Reglas de Puntos"
        ordering = ["limite_inferior"]




# 3) PARAMETRIZACIÓN DE VENCIMIENTOS
# ============================================================
class ParametrizacionVencimiento(models.Model):
    """
    Define la validez temporal de los puntos otorgados.

    Ejemplo:
      fecha_inicio = 01/01/2025
      fecha_fin    = 31/12/2025
      dias_duracion = 180

    Esta información permite definir períodos de vigencia de puntos
    y su fecha de caducidad automática.
    """

    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    dias_duracion = models.PositiveIntegerField(default=365)

    def __str__(self):
        return (
            f"Validez: {self.fecha_inicio} a {self.fecha_fin} "
            f"({self.dias_duracion} días)"
        )

    class Meta:
        verbose_name = "Parametrización de Vencimiento"
        verbose_name_plural = "Parametrizaciones de Vencimiento"
        ordering = ["-fecha_inicio"]




# 4) BOLSA DE PUNTOS
# ============================================================
class BolsaPuntos(models.Model):
    """
    Registra los puntos asignados a un cliente por una operación.
    Cada bolsa tiene:
     - Fecha de asignación
     - Fecha de caducidad
     - Puntos asignados
     - Puntos utilizados
     - Estado (ACTIVO, AGOTADO, VENCIDO)

    Importante:
    La bolsa es consumida en un esquema FIFO para canjes.
    """

    cliente = models.ForeignKey(
        'clientes.Cliente',
        on_delete=models.CASCADE,
        related_name='bolsas'
    )

    fecha_asignacion = models.DateTimeField(default=timezone.now)
    fecha_caducidad = models.DateTimeField()

    puntos_asignados = models.PositiveIntegerField(default=0)
    puntos_utilizados = models.PositiveIntegerField(default=0)

    monto_operacion = models.DecimalField(max_digits=12, decimal_places=2)

    estado = models.CharField(
        max_length=20,
        choices=[
            ('ACTIVO', 'Activo'),
            ('AGOTADO', 'Agotado'),
            ('VENCIDO', 'Vencido'),
        ],
        default='ACTIVO'
    )

    def saldo_actual(self):
        """Devuelve el saldo disponible de la bolsa."""
        return max(0, self.puntos_asignados - self.puntos_utilizados)

    def __str__(self):
        return f"Bolsa #{self.id} - Cliente {self.cliente} ({self.estado})"

    class Meta:
        verbose_name = "Bolsa de Puntos"
        verbose_name_plural = "Bolsas de Puntos"
        ordering = ["fecha_caducidad"]




# 5) USO DE PUNTOS (CABECERA)
# ============================================================
class UsoPuntos(models.Model):
    """
    Cabecera del uso de puntos.
    Registra cada canje realizado por el cliente, indicando:
     - Concepto utilizado
     - Cantidad total de puntos descontados
     - Fecha del canje
    """

    cliente = models.ForeignKey(
        'clientes.Cliente',
        on_delete=models.CASCADE,
        related_name='usos'
    )
    concepto = models.ForeignKey(ConceptoPuntos, on_delete=models.CASCADE)
    puntos_utilizados = models.PositiveIntegerField(default=0)
    fecha = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Uso #{self.id} - {self.cliente} - {self.concepto}"

    class Meta:
        verbose_name = "Uso de Puntos"
        verbose_name_plural = "Usos de Puntos"
        ordering = ["-fecha"]



# ============================================================
# 6) USO DE PUNTOS (DETALLE)
# ============================================================
class UsoPuntosDetalle(models.Model):
    """
    Detalle del uso de puntos según esquema FIFO.
    Registra:
     - Bolsa consumida
     - Cantidad consumida de esa bolsa

    Esto permite saber exactamente de dónde salieron los puntos.
    """

    uso = models.ForeignKey(UsoPuntos, on_delete=models.CASCADE)
    bolsa = models.ForeignKey(BolsaPuntos, on_delete=models.CASCADE)
    puntos_utilizados = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Detalle #{self.id} - Uso {self.uso_id} - {self.puntos_utilizados} pts"

    class Meta:
        verbose_name = "Detalle de Uso de Puntos"
        verbose_name_plural = "Detalles de Uso de Puntos"
        ordering = ["uso_id"]
