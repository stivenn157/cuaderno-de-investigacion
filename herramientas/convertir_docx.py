"""
Extrae el texto de los documentos .docx de /documentos para escribir los resúmenes.

Uso (desde la carpeta Pagina):
    python herramientas/convertir_docx.py

Por cada documento genera js/contenido/<materia>/<id>.js con su texto completo en HTML.
Esa carpeta es solo de consulta local: no se publica (está en .gitignore), porque la
página muestra resúmenes y ofrece el documento original para descargar.
"""
import html
import json
import re
from pathlib import Path

import docx
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.table import Table
from docx.text.paragraph import Paragraph

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "documentos"
DESTINO = RAIZ / "js" / "contenido"

# Nombre de archivo .docx -> id usado en la página (ver js/datos.js)
IDS = {
    "Analisis de caso": "analisis-de-caso",
    "parcial practico linea de enfasis": "parcial-practico",
    "Taller 1": "taller-1",
    "Taller practico": "taller-practico",
    "ACTIVIDAD 1": "actividad-1",
    "actividad practica": "actividad-practica",
    "Parcial 1": "parcial-1",
    "Taller Teorico": "taller-teorico",
    "Taller practico 4": "taller-practico-4",
    "Taller teorico 4": "taller-teorico-4",
}

TITULOS_SECCION = ("referencias", "introducción", "introduccion", "conclusiones", "conclusión")
CAJA = re.compile(r"[│┌┐└┘├┤┬┴┼─▼▲►◄]")


def bloques(documento):
    for hijo in documento.element.body.iterchildren():
        etiqueta = hijo.tag.split("}")[-1]
        if etiqueta == "p":
            yield Paragraph(hijo, documento)
        elif etiqueta == "tbl":
            yield Table(hijo, documento)


def es_negrita(p: Paragraph) -> bool:
    runs = [r for r in p.runs if r.text.strip()]
    estilo_negrita = bool(p.style is not None and p.style.font.bold)

    def run_negrita(r) -> bool:
        if r.bold is not None:
            return r.bold
        if r.style is not None and r.style.font.bold is not None:
            return r.style.font.bold
        return estilo_negrita

    return bool(runs) and all(run_negrita(r) for r in runs)


def es_portada(p: Paragraph) -> bool:
    return p.alignment == WD_ALIGN_PARAGRAPH.CENTER


def html_en_linea(p: Paragraph) -> str:
    partes = []
    for r in p.runs:
        texto = html.escape(r.text).replace("\n", "<br>")
        if not texto:
            continue
        if r.italic:
            texto = f"<em>{texto}</em>"
        partes.append(texto)
    return "".join(partes).strip()


def tabla_html(tabla: Table) -> str:
    filas = []
    for i, fila in enumerate(tabla.rows):
        celda = "th" if i == 0 else "td"
        contenido = "".join(
            f"<{celda}>{html.escape(c.text.strip()).replace(chr(10), '<br>')}</{celda}>" for c in fila.cells
        )
        filas.append(f"<tr>{contenido}</tr>")
    cabecera, cuerpo = filas[0], filas[1:]
    return (
        '<div class="tabla"><table><thead>' + cabecera + "</thead><tbody>"
        + "".join(cuerpo) + "</tbody></table></div>"
    )


def slug(texto: str) -> str:
    base = re.sub(r"[^a-z0-9áéíóúñ]+", "-", texto.lower()).strip("-")
    return base[:60]


def convertir(ruta: Path) -> str:
    documento = docx.Document(str(ruta))
    salida, diagrama, en_referencias, en_portada = [], [], False, True

    def cerrar_diagrama():
        if diagrama:
            salida.append('<pre class="diagrama">' + html.escape("\n".join(diagrama)) + "</pre>")
            diagrama.clear()

    for bloque in bloques(documento):
        if isinstance(bloque, Table):
            en_portada = False
            cerrar_diagrama()
            salida.append(tabla_html(bloque))
            continue

        texto = bloque.text.strip()
        if not texto:
            continue
        if en_portada and es_portada(bloque):
            continue
        en_portada = False

        if CAJA.search(texto):
            diagrama.append(bloque.text.rstrip())
            continue
        cerrar_diagrama()

        if es_negrita(bloque):
            minus = texto.lower()
            if minus.startswith("parte") or minus.startswith(TITULOS_SECCION):
                en_referencias = minus.startswith("referencias")
                salida.append(f'<h2 id="{slug(texto)}">{html.escape(texto)}</h2>')
            else:
                salida.append(f'<h3 id="{slug(texto)}">{html.escape(texto)}</h3>')
            continue

        clase = ' class="referencia"' if en_referencias else ""
        salida.append(f"<p{clase}>{html_en_linea(bloque)}</p>")

    cerrar_diagrama()
    return "\n".join(salida)


def main() -> None:
    for ruta in sorted(ORIGEN.rglob("*.docx")):
        materia = ruta.parent.name
        doc_id = IDS.get(ruta.stem)
        if doc_id is None:
            print(f"Sin id, se omite: {ruta.name}")
            continue
        cuerpo = convertir(ruta)
        destino = DESTINO / materia / f"{doc_id}.js"
        destino.parent.mkdir(parents=True, exist_ok=True)
        clave = f"{materia}/{doc_id}"
        destino.write_text(
            "/* Archivo generado por herramientas/convertir_docx.py. No editar a mano. */\n"
            f"window.Contenido = window.Contenido || {{}};\n"
            f"window.Contenido[{json.dumps(clave)}] = {json.dumps(cuerpo, ensure_ascii=False)};\n",
            encoding="utf-8",
        )
        print(f"{clave}: {len(cuerpo):,} caracteres")


if __name__ == "__main__":
    main()
