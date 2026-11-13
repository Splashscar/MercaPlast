
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from .excel_service import (
    obtener_registros,
    crear_registro,
    actualizar_registro,
    eliminar_registro
)

from .serializers import ProductSerializer, CategorySerializer, PromotionSerializer

class SoloAdminEscribe:
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]
class ProductListCreateView(SoloAdminEscribe, APIView):

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


class ProductDetailView(SoloAdminEscribe, APIView):

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

class CategoryListCreateView(SoloAdminEscribe, APIView):

    def get(self, request):
        categorias = obtener_registros("Categorias")
        serializer = CategorySerializer(categorias, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            categoria = crear_registro(
                "Categorias",
                serializer.validated_data
            )
            return Response(categoria, status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class CategoryDetailView(SoloAdminEscribe, APIView):

    def put(self, request, categoria_id):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            actualizado = actualizar_registro(
                "Categorias",
                categoria_id,
                serializer.validated_data
            )

            if actualizado:
                return Response({"mensaje": "Categoría actualizada"})

            return Response(
                {"error": "Categoría no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, categoria_id):
        eliminado = eliminar_registro("Categorias", categoria_id)

        if eliminado:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            {"error": "Categoría no encontrada"},
            status=status.HTTP_404_NOT_FOUND
        )
class PromotionListCreateView(SoloAdminEscribe,APIView):

    def get(self, request):
        promociones = obtener_registros("Promociones")
        serializer = PromotionSerializer(promociones, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PromotionSerializer(data=request.data)

        if serializer.is_valid():
            promocion = crear_registro(
                "Promociones",
                serializer.validated_data
            )
            return Response(promocion, status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class PromotionDetailView(SoloAdminEscribe, APIView):

    def put(self, request, promocion_id):
        serializer = PromotionSerializer(data=request.data)

        if serializer.is_valid():
            actualizado = actualizar_registro(
                "Promociones",
                promocion_id,
                serializer.validated_data
            )

            if actualizado:
                return Response({"mensaje": "Promoción actualizada"})

            return Response(
                {"error": "Promoción no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, promocion_id):
        eliminado = eliminar_registro("Promociones", promocion_id)

        if eliminado:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            {"error": "Promoción no encontrada"},
            status=status.HTTP_404_NOT_FOUND
        )