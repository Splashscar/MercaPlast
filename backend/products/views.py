
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .excel_service import (
    obtener_registros,
    crear_registro,
    actualizar_registro,
    eliminar_registro
)

from .serializers import ProductSerializer


class ProductListCreateView(APIView):

    def get(self, request):
        productos = obtener_registros("Productos")
        serializer = ProductSerializer(productos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            producto = crear_registro(
                "Productos",
                serializer.validated_data
            )
            return Response(producto, status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ProductDetailView(APIView):

    def put(self, request, producto_id):
        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            actualizado = actualizar_registro(
                "Productos",
                producto_id,
                serializer.validated_data
            )

            if actualizado:
                return Response({"mensaje": "Producto actualizado"})

            return Response(
                {"error": "Producto no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, producto_id):
        eliminado = eliminar_registro("Productos", producto_id)

        if eliminado:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            {"error": "Producto no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )
