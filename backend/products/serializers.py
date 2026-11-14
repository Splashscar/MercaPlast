from datetime import datetime
from decimal import Decimal

from rest_framework import serializers

from .excel_service import obtener_registros


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


class CategorySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    nombre = serializers.CharField(max_length=255)
    descripcion = serializers.CharField(required=False, allow_blank=True)
    activa = serializers.BooleanField(default=True)


class PromotionSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    producto_id = serializers.IntegerField(required=False, allow_null=True)
    nombre = serializers.CharField(max_length=255)
    descripcion = serializers.CharField(required=False, allow_blank=True)
    imagen_url = serializers.URLField(required=False, allow_blank=True)
    precio_promocional = serializers.DecimalField(
        max_digits=12, decimal_places=2, min_value=Decimal("0.01")
    )
    cantidad_minima = serializers.IntegerField(min_value=1)
    fecha_inicio = serializers.DateField()
    fecha_fin = serializers.DateField()
    activa = serializers.BooleanField(default=True)

    def validate_producto_id(self, value):
        if value is None:
            return None

        productos = obtener_registros("Productos")
        if not any(p.get("id") == value for p in productos):
            raise serializers.ValidationError(
                "El producto indicado no existe."
            )
        return value

    def validate(self, datos):
        if datos["fecha_fin"] < datos["fecha_inicio"]:
            raise serializers.ValidationError(
                {"fecha_fin": "La fecha fin no puede ser anterior a la fecha inicio."}
            )

        producto_id = datos.get("producto_id")
        if producto_id is not None:
            productos = obtener_registros("Productos")
            producto = next(
                (p for p in productos if p.get("id") == producto_id),
                None,
            )
            if producto and producto.get("precio") is not None:
                precio_normal = Decimal(str(producto["precio"]))
                if datos["precio_promocional"] >= precio_normal:
                    raise serializers.ValidationError(
                        {"precio_promocional": "Debe ser menor al precio normal del producto."}
                    )
        return datos

    def to_representation(self, instance):
        instance = dict(instance)
        for campo in ("fecha_inicio", "fecha_fin"):
            if isinstance(instance.get(campo), datetime):
                instance[campo] = instance[campo].date()
        return super().to_representation(instance)
