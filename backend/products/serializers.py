
from rest_framework import serializers


class ProductSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    nombre = serializers.CharField(max_length=255)
    categoria_id = serializers.IntegerField()
    presentacion = serializers.CharField(max_length=255)
    precio = serializers.DecimalField(max_digits=12, decimal_places=2)
    descripcion = serializers.CharField(required=False, allow_blank=True)
    beneficios = serializers.CharField(required=False, allow_blank=True)
    usos = serializers.CharField(required=False, allow_blank=True)
    imagen_url = serializers.URLField(required=False, allow_blank=True)
    ficha_tecnica_url = serializers.URLField(required=False, allow_blank=True)
    aromas = serializers.CharField(required=False, allow_blank=True)
    activo = serializers.BooleanField(default=True)
