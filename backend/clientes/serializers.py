from rest_framework import serializers
from .models import Cliente


class ClienteSerializer(serializers.ModelSerializer):
    referido_por_codigo = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Cliente
        fields = [
            "id", "nombre", "apellido", "tipo_documento",
            "numero_documento", "email", "telefono",
            "nacionalidad", "fecha_nacimiento",
            "codigo_referido", "referido_por", "referido_por_codigo"
        ]
        read_only_fields = ["codigo_referido", "referido_por"]

    def create(self, validated_data):

        referido_codigo = validated_data.pop("referido_por_codigo", None)

        cliente = Cliente.objects.create(**validated_data)

        # Si viene un código de referencia, buscar al que refiere
        if referido_codigo:
            try:
                ref = Cliente.objects.get(codigo_referido=referido_codigo)
                cliente.referido_por = ref
                cliente.save()
            except Cliente.DoesNotExist:
                pass

        return cliente
