from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    ProductListCreateView,
    ProductDetailView,
    CategoryListCreateView,
    CategoryDetailView,
    PromotionListCreateView,
    PromotionDetailView,
)
from .upload_views import ImageUploadView

urlpatterns = [
    path("auth/login/", obtain_auth_token, name="login"),
    path("upload-image/", ImageUploadView.as_view(), name="upload-image"),
    path("products/", ProductListCreateView.as_view(), name="products"),
    path("products/<int:producto_id>/", ProductDetailView.as_view(), name="product-detail"),
    path("categories/", CategoryListCreateView.as_view(), name="categories"),
    path("categories/<int:categoria_id>/", CategoryDetailView.as_view(), name="category-detail"),
    path("promotions/", PromotionListCreateView.as_view(), name="promotions"),
    path("promotions/<int:promocion_id>/", PromotionDetailView.as_view(), name="promotion-detail"),
]
