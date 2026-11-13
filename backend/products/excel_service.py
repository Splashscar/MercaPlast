from pathlib import Path
from openpyxl import load_workbook
from django.conf import settings

EXCEL_PATH = Path(settings.BASE_DIR) / "data" / "MercaPlast.xlsx"


def obtener_hoja(nombre):
    libro = load_workbook(EXCEL_PATH)
    hoja = libro[nombre]
    return libro, hoja


def obtener_registros(nombre):
    libro, hoja = obtener_hoja(nombre)

    encabezados = [
        celda.value for celda in hoja[1]
    ]

    registros = []

    for fila in hoja.iter_rows(min_row=2, values_only=True):
        if all(valor is None for valor in fila):
            continue

        registro = dict(zip(encabezados, fila))
        registros.append(registro)

    libro.close()
    return registros


def obtener_siguiente_id(nombre):
    registros = obtener_registros(nombre)

    ids = [
        registro["id"]
        for registro in registros
        if registro.get("id") is not None
    ]

    return max(ids, default=0) + 1


def crear_registro(nombre, datos):
    libro, hoja = obtener_hoja(nombre)

    encabezados = [
        celda.value for celda in hoja[1]
    ]

    nuevo_id = obtener_siguiente_id(nombre)
    datos["id"] = nuevo_id

    fila = [
        datos.get(encabezado)
        for encabezado in encabezados
    ]

    hoja.append(fila)
    libro.save(EXCEL_PATH)
    libro.close()

    return datos


def actualizar_registro(nombre, registro_id, datos):
    libro, hoja = obtener_hoja(nombre)

    encabezados = [
        celda.value for celda in hoja[1]
    ]

    for fila in range(2, hoja.max_row + 1):
        if hoja.cell(fila, 1).value == registro_id:

            for columna, encabezado in enumerate(encabezados, 1):
                if encabezado in datos:
                    hoja.cell(fila, columna).value = datos[encabezado]

            libro.save(EXCEL_PATH)
            libro.close()

            return True

    libro.close()
    return False


def eliminar_registro(nombre, registro_id):
    libro, hoja = obtener_hoja(nombre)

    for fila in range(2, hoja.max_row + 1):
        if hoja.cell(fila, 1).value == registro_id:
            hoja.delete_rows(fila)
            libro.save(EXCEL_PATH)
            libro.close()
            return True

    libro.close()
    return False