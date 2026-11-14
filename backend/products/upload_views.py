import cloudinary.uploader
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .views import SoloAdminEscribe

TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"]
TAMANO_MAXIMO = 5 * 1024 * 1024  # 5 MB


class ImageUploadView(SoloAdminEscribe, APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        archivo = request.FILES.get("imagen")

        if archivo is None:
            return Response(
                {"error": "Falta el archivo en el campo 'imagen'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if archivo.content_type not in TIPOS_PERMITIDOS:
            return Response(
                {"error": "Solo se permiten imágenes JPG, PNG o WEBP."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if archivo.size > TAMANO_MAXIMO:
            return Response(
                {"error": "La imagen no puede superar los 5 MB."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            resultado = cloudinary.uploader.upload(archivo, folder="mercaplast")
        except Exception:
            return Response(
                {"error": "No se pudo subir la imagen a Cloudinary."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({"url": resultado["secure_url"]}, status=status.HTTP_201_CREATED)
