
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.table import Table, TableStyleInfo
from pathlib import Path

ruta = Path(__file__).parent / "data" / "MercaPlast.xlsx"

libro = Workbook()

productos = libro.active
productos.title = "Productos"

promociones = libro.create_sheet("Promociones")
categorias = libro.create_sheet("Categorias")

encabezados = {
    "Productos": [
        "id", "nombre", "categoria_id", "presentacion",
        "precio", "descripcion", "beneficios", "usos",
        "imagen_url", "ficha_tecnica_url", "aromas", "activo"
    ],
    "Promociones": [
        "id", "producto_id", "nombre", "descripcion",
        "precio_promocional", "cantidad_minima",
        "fecha_inicio", "fecha_fin", "activa"
    ],
    "Categorias": [
        "id", "nombre", "descripcion", "activa"
    ]
}

for hoja in libro.worksheets:
    columnas = encabezados[hoja.title]
    hoja.append(columnas)
    hoja.freeze_panes = "A2"
    hoja.sheet_view.showGridLines = False

    for celda in hoja[1]:
        celda.font = Font(bold=True, color="FFFFFF")
        celda.fill = PatternFill(
            fill_type="solid",
            fgColor="1F4E78"
        )
        celda.alignment = Alignment(horizontal="center")

    for columna in hoja.columns:
        letra = columna[0].column_letter
        hoja.column_dimensions[letra].width = 22

    hoja.auto_filter.ref = hoja.dimensions

libro.save(ruta)

print(f"Excel creado correctamente: {ruta}")
