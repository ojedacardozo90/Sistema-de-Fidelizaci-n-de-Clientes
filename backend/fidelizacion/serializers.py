"""
RUTA: fidelizacion/serializers.py
===========================================================
Serializadores del Sistema de Fidelización
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
    Insignia,
    InsigniaCliente,
    Desafio,
    DesafioCliente,
    Promocion,
    ProductoCanje,
    Canje,   # ← ESTE ES EL NOMBRE CORRECTO DEL MODELO
)

# ============================================================
# CLIENTE
# ============================================================
class ClienteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cliente
        fields = [
            "id", "nombre", "apellido", "numero_documento",
            "tipo_documento", "nacionalidad", "email",
            "telefono", "fecha_nacimiento", "nivel_fidelizacion"
        ]
        extra_kwargs = {
            "nivel_fidelizacion": {"read_only": True},
        }

# ============================================================
# CONCEPTO DE PUNTOS
# ============================================================
class ConceptoPuntosSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConceptoPuntos
        fields = "__all__"

# ============================================================
# REGLA DE PUNTOS
# ============================================================
class ReglaPuntosSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReglaPuntos
        fields = "__all__"

# ============================================================
# VENCIMIENTOS
# ============================================================
class ParametrizacionVencimientoSerializer(serializers.ModelSerializer):

    class Meta:
        model = ParametrizacionVencimiento
        fields = "__all__"

# ============================================================
# PROMOCIONES
# ============================================================
class PromocionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promocion
        fields = "__all__"

# ============================================================
# BOLSA DE PUNTOS
# ============================================================
class BolsaPuntosSerializer(serializers.ModelSerializer):

    cliente = ClienteSerializer(read_only=True)

    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(),
        source="cliente",
        write_only=True
    )

    saldo = serializers.SerializerMethodField()

    def get_saldo(self, obj):
        return max(0, obj.puntos_asignados - obj.puntos_utilizados)

    class Meta:
        model = BolsaPuntos
        fields = [
            "id", "cliente", "cliente_id",
            "fecha_asignacion", "fecha_caducidad",
            "puntos_asignados", "puntos_utilizados",
            "monto_operacion", "estado", "saldo",
        ]

# ============================================================
# DETALLE DE USO DE PUNTOS (FIFO)
# ============================================================
class UsoPuntosDetalleSerializer(serializers.ModelSerializer):

    bolsa_id = serializers.IntegerField(source="bolsa.id", read_only=True)
    bolsa_fecha_asignacion = serializers.DateTimeField(source="bolsa.fecha_asignacion", read_only=True)
    bolsa_puntos_asignados = serializers.IntegerField(source="bolsa.puntos_asignados", read_only=True)
    fecha_caducidad = serializers.DateTimeField(source="bolsa.fecha_caducidad", read_only=True)

    class Meta:
        model = UsoPuntosDetalle
        fields = [
            "id",
            "uso",
            "bolsa_id",
            "puntos_utilizados",
            "bolsa_fecha_asignacion",
            "bolsa_puntos_asignados",
            "fecha_caducidad",
        ]
        read_only_fields = fields

# ============================================================
# USO DE PUNTOS (CABECERA)
# ============================================================
class UsoPuntosSerializer(serializers.ModelSerializer):

    cliente = ClienteSerializer(read_only=True)
    cliente_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(),
        source="cliente",
        write_only=True
    )

    concepto = ConceptoPuntosSerializer(read_only=True)
    concepto_id = serializers.PrimaryKeyRelatedField(
        queryset=ConceptoPuntos.objects.all(),
        source="concepto",
        write_only=True
    )

    detalles = serializers.SerializerMethodField()

    def get_detalles(self, obj):
        det = UsoPuntosDetalle.objects.filter(uso=obj)
        return UsoPuntosDetalleSerializer(det, many=True).data

    class Meta:
        model = UsoPuntos
        fields = [
            "id", "cliente", "cliente_id",
            "concepto", "concepto_id",
            "puntos_utilizados", "fecha",
            "detalles",
        ]

# ============================================================
# INSIGNIAS
# ============================================================
class InsigniaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insignia
        fields = "__all__"

class InsigniaClienteSerializer(serializers.ModelSerializer):
    insignia = InsigniaSerializer(read_only=True)

    class Meta:
        model = InsigniaCliente
        fields = ["id", "insignia", "fecha_otorgada"]

# ============================================================
# DESAFÍOS
# ============================================================
class DesafioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desafio
        fields = "__all__"

class DesafioClienteSerializer(serializers.ModelSerializer):
    desafio = DesafioSerializer(read_only=True)

    class Meta:
        model = DesafioCliente
        fields = ["id", "desafio", "progreso", "completado"]

# ============================================================
# PRODUCTOS DE CANJE
# ============================================================
class ProductoCanjeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoCanje
        fields = "__all__"

# ============================================================
# REGISTRO DE CANJES
# ============================================================
class CanjeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Canje
        fields = "__all__"
