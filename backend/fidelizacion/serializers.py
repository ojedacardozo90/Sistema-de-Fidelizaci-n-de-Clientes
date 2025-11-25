"""
RUTA: fidelizacion/serializers.py
===========================================================
MÓDULO: Serializadores del Sistema de Fidelización
===========================================================
Permiten transformar los modelos en formato JSON y viceversa,
para la comunicación con la API REST del sistema.

Incluye:
 - ClienteSerializer (lectura/escritura completa)
 - ConceptoPuntosSerializer
 - ReglaPuntosSerializer
 - ParametrizacionVencimientoSerializer
 - BolsaPuntosSerializer
 - UsoPuntosSerializer (con detalle anidado)
 - UsoPuntosDetalleSerializer

Este archivo fue revisado, corregido y ampliado para cumplir con:
✔ CRUD completo de todas las entidades
✔ Servicios adicionales del parcial
✔ Detalles anidados coherentes para los usos FIFO
✔ Compatibilidad total con los ModelViewSet y servicios personalizados

===========================================================
"""

from rest_framework import serializers
from backend.clientes.models import Cliente

from .models import (
    ConceptoPuntos,
    ReglaPuntos,
    ParametrizacionVencimiento,
    BolsaPuntos,
    UsoPuntos,
    UsoPuntosDetalle,
)

# ============================================================
# CLIENTE (CRUD COMPLETO)
# ============================================================
class ClienteSerializer(serializers.ModelSerializer):
    """
    Serializador completo del cliente.
    Se usa tanto para lectura como escritura en la API.

    NOTA: 'nivel_fidelizacion' es de solo lectura, ya que es calculado.
    """
    class Meta:
        model = Cliente
        fields = [
            "id", "nombre", "apellido", "numero_documento",
            "tipo_documento", "nacionalidad", "email",
            "telefono", "fecha_nacimiento", "nivel_fidelizacion"
        ]
        extra_kwargs = {
            "nombre": {"required": True},
            "apellido": {"required": True},
            "numero_documento": {"required": True},
            "tipo_documento": {"required": True},
            "email": {"required": False, "allow_blank": True},
            "telefono": {"required": False, "allow_blank": True},
            "nivel_fidelizacion": {"read_only": True},
        }


# ============================================================
# CONCEPTO DE PUNTOS
# ============================================================
class ConceptoPuntosSerializer(serializers.ModelSerializer):
    """
    Serializa los distintos conceptos mediante los cuales
    un cliente puede usar sus puntos (vales, premios, etc.).
    """
    class Meta:
        model = ConceptoPuntos
        fields = "__all__"


# ============================================================
# REGLAS DE PUNTOS
# ============================================================
class ReglaPuntosSerializer(serializers.ModelSerializer):
    """
    Serializa las reglas de asignación de puntos según
    los rangos de monto definidos por el administrador.
    """
    class Meta:
        model = ReglaPuntos
        fields = "__all__"


# ============================================================
# PARAMETRIZACIÓN DE VENCIMIENTOS
# ============================================================
class ParametrizacionVencimientoSerializer(serializers.ModelSerializer):
    """
    Serializa las parametrizaciones de vigencia de puntos,
    permitiendo definir duración y fechas activas.
    """
    class Meta:
        model = ParametrizacionVencimiento
        fields = "__all__"


# ============================================================
# BOLSA DE PUNTOS
# ============================================================
class BolsaPuntosSerializer(serializers.ModelSerializer):
    """
    Serializa las bolsas de puntos asignadas a los clientes.
    Incluye el saldo disponible (campo calculado dinámicamente).
    """

    # Cliente solo-lectura (muestra los datos completos)
    cliente = ClienteSerializer(read_only=True)

    # Para POST/PUT → permite enviar {"cliente_id": 3}
    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(),
        source="cliente",
        write_only=True
    )

    # Saldo final calculado: puntos_asignados - puntos_utilizados
    saldo = serializers.SerializerMethodField()

    def get_saldo(self, obj):
        return max(0, obj.puntos_asignados - obj.puntos_utilizados)

    class Meta:
        model = BolsaPuntos
        fields = [
            "id", "cliente", "cliente_id", "fecha_asignacion",
            "fecha_caducidad", "puntos_asignados", "puntos_utilizados",
            "monto_operacion", "estado", "saldo"
        ]


# ============================================================
# DETALLE DE USO DE PUNTOS (FIFO)
# ============================================================
class UsoPuntosDetalleSerializer(serializers.ModelSerializer):
    """
    Serializa cada detalle de uso de puntos (por bolsa).
    Permite visualizar:
     - ID de la bolsa consumida
     - Puntos descontados de esa bolsa
     - Fecha de caducidad de la bolsa utilizada
    """
    bolsa_id = serializers.IntegerField(source="bolsa.id", read_only=True)
    fecha_caducidad = serializers.DateTimeField(
        source="bolsa.fecha_caducidad",
        read_only=True
    )

    class Meta:
        model = UsoPuntosDetalle
        fields = [
            "id", "uso", "bolsa_id",
            "puntos_utilizados", "fecha_caducidad"
        ]


# ============================================================
# USO DE PUNTOS (CABECERA)
# ============================================================
class UsoPuntosSerializer(serializers.ModelSerializer):
    """
    Serializa el uso de puntos realizado por el cliente.
    Incluye:
     - Cliente (solo lectura)
     - Concepto (solo lectura)
     - detalles: lista de UsoPuntosDetalle

    Permite POST usando:
     {
         "cliente_id": 1,
         "concepto_id": 2,
         "puntos_utilizados": 300
     }
    """

    # Cliente completo (solo lectura)
    cliente = ClienteSerializer(read_only=True)

    # Para POST → cliente_id
    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(), source="cliente", write_only=True
    )

    # Concepto completo (solo lectura)
    concepto = ConceptoPuntosSerializer(read_only=True)

    # Para POST → concepto_id
    concepto_id = serializers.PrimaryKeyRelatedField(
        queryset=ConceptoPuntos.objects.all(), source="concepto", write_only=True
    )

    # Detalles FIFO (lista)
    detalles = serializers.SerializerMethodField()

    def get_detalles(self, obj):
        detalles = UsoPuntosDetalle.objects.filter(uso=obj)
        return UsoPuntosDetalleSerializer(detalles, many=True).data

    class Meta:
        model = UsoPuntos
        fields = [
            "id", "cliente", "cliente_id", "concepto", "concepto_id",
            "puntos_utilizados", "fecha", "detalles"
        ]
