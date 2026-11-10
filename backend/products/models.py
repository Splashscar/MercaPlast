from django.db import models


class Product(models.Model):
    name = models.CharField('Nombre', max_length=100)
    slug = models.SlugField(unique=True)
    short_description = models.CharField('Descripción corta', max_length=150)
    image = models.ImageField('Imagen', upload_to='products/')
    is_active = models.BooleanField('Activo', default=True)
    order = models.PositiveIntegerField('Orden', default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def __str__(self):
        return self.name