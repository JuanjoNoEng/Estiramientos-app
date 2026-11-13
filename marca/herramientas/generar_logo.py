"""Genera el logo final de Andrey Hernández, Quiropráctico (monograma A·H) en todas sus variantes.

Uso:  python3 marca/herramientas/generar_logo.py
Requiere: pip install fonttools
Las fuentes (Fraunces y Outfit, licencia SIL OFL) están en marca/herramientas/fuentes/.
Todo el texto se convierte a trazos, así que los SVG no dependen de fuentes instaladas.
"""
import math
import os

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

AQUI = os.path.dirname(os.path.abspath(__file__))
FUENTES = os.path.join(AQUI, "fuentes")
SALIDA = os.path.join(AQUI, "..", "logo")

# ---------- Paleta ----------
VERDE = "#0E5A57"      # principal (verde petróleo)
VERDE_OSC = "#0A3F3D"  # fondos oscuros
CORAL = "#F08A5D"      # acento (columna)
MENTA = "#7CC6A6"      # secundario
CREMA = "#FBF7F1"      # fondo claro
BLANCO = "#FFFFFF"


def n(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


# ---------- Texto a trazos ----------
_fuentes = {}


def fuente(nombre):
    if nombre not in _fuentes:
        _fuentes[nombre] = TTFont(os.path.join(FUENTES, f"{nombre}-normal.woff"))
    return _fuentes[nombre]


def ancho(texto, nombre, tam, tracking=0.0):
    f = fuente(nombre)
    upm = f["head"].unitsPerEm
    cmap, hmtx = f.getBestCmap(), f["hmtx"]
    w = sum(hmtx[cmap[ord(c)]][0] for c in texto) * tam / upm
    return w + tracking * tam * (len(texto) - 1)


def altura_mayus(nombre, tam):
    f = fuente(nombre)
    return f["OS/2"].sCapHeight * tam / f["head"].unitsPerEm


def texto(txt, nombre, tam, x, y, tracking=0.0, anclaje="start"):
    """Devuelve (d, bbox) del texto con línea base en y."""
    f = fuente(nombre)
    upm = f["head"].unitsPerEm
    gs, cmap, hmtx = f.getGlyphSet(), f.getBestCmap(), f["hmtx"]
    s = tam / upm
    if anclaje == "middle":
        x -= ancho(txt, nombre, tam, tracking) / 2
    pen = SVGPathPen(gs, ntos=n)
    bpen = BoundsPen(gs)
    cx = x
    for c in txt:
        g = cmap[ord(c)]
        t = (s, 0, 0, -s, cx, y)
        gs[g].draw(TransformPen(pen, t))
        gs[g].draw(TransformPen(bpen, t))
        cx += hmtx[g][0] * s + tracking * tam
    return pen.getCommands(), bpen.bounds


# ---------- Columna (vértebras sobre una curva) ----------
def qbez(p0, p1, p2, t):
    x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0]
    y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]
    dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0])
    dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])
    return x, y, math.degrees(math.atan2(dy, dx))


def columna(p0, p1, p2, cantidad, w0, w1, h0, h1, color, radio):
    pasos = 2000
    pts = [qbez(p0, p1, p2, i / pasos) for i in range(pasos + 1)]
    L = [0.0]
    for a, b in zip(pts, pts[1:]):
        L.append(L[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    piezas, j = [], 0
    for k in range(cantidad):
        objetivo = L[-1] * k / (cantidad - 1)
        while j < pasos and L[j] < objetivo:
            j += 1
        x, y, ang = pts[j]
        u = k / (cantidad - 1)
        w, h = w0 + (w1 - w0) * u, h0 + (h1 - h0) * u
        piezas.append(
            f'<rect x="{n(-w/2)}" y="{n(-h/2)}" width="{n(w)}" height="{n(h)}" rx="{n(radio)}" '
            f'transform="translate({n(x)} {n(y)}) rotate({n(ang + 90)})" fill="{color}"/>'
        )
    return "".join(piezas)


# ---------- Símbolo A·H ----------
TAM_LETRA = 200
BASE = 200  # línea base de las letras en el sistema del símbolo
SEP = 54    # espacio entre A y H donde va la columna


def simbolo(letras=VERDE, acento=CORAL, x=0.0, y=0.0, esc=1.0, vertebras=6):
    """Devuelve (svg, ancho, alto) del monograma, con origen arriba a la izquierda."""
    fa = "fraunces-latin-600"
    wa = ancho("A", fa, TAM_LETRA)
    cap = altura_mayus(fa, TAM_LETRA)
    da, ba = texto("A", fa, TAM_LETRA, 0, BASE)
    dh, bh = texto("H", fa, TAM_LETRA, wa + SEP, BASE)
    izq, der = ba[0], bh[2]
    # La columna sobresale por arriba y por abajo de las letras
    cx = wa + SEP / 2
    arriba, abajo = BASE - cap - 30, BASE + 26
    col = columna(
        (cx, abajo), (cx - 13, (arriba + abajo) / 2), (cx, arriba),
        vertebras, 27, 16, 21, 14, acento, 5,
    ) if vertebras == 6 else columna(
        (cx, abajo - 6), (cx - 10, (arriba + abajo) / 2), (cx, arriba + 10),
        vertebras, 30, 22, 26, 20, acento, 6,
    )
    alto_total = (abajo + 14) - (arriba - 10)
    dx, dy = -izq, -(arriba - 10)
    svg = (
        f'<g transform="translate({n(x)} {n(y)}) scale({n(esc)}) translate({n(dx)} {n(dy)})">'
        f'<path d="{da}" fill="{letras}"/><path d="{dh}" fill="{letras}"/>{col}</g>'
    )
    return svg, (der - izq) * esc, alto_total * esc, cap * esc, (BASE + dy) * esc


def documento(contenido, w, h, fondo=None, radio=0):
    bg = f'<rect width="{n(w)}" height="{n(h)}" rx="{n(radio)}" fill="{fondo}"/>' if fondo else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n(w)} {n(h)}" width="{n(w)}" height="{n(h)}">'
        f'<title>Andrey Hernández · Quiropráctico</title>{bg}{contenido}</svg>\n'
    )


def guardar(nombre, contenido):
    os.makedirs(SALIDA, exist_ok=True)
    with open(os.path.join(SALIDA, nombre), "w") as fh:
        fh.write(contenido)


# ---------- Variantes ----------
def variante_simbolo(nombre, letras, acento, fondo=None):
    pad = 24
    s, w, h, *_ = simbolo(letras, acento, pad, pad)
    guardar(nombre, documento(s, w + 2 * pad, h + 2 * pad, fondo))


def variante_horizontal(nombre, letras, acento, texto_c, sub_c, fondo=None):
    pad = 32
    s, w, h, cap, base = simbolo(letras, acento, pad, pad)
    fo = "outfit-latin-600"
    fs = "outfit-latin-500"
    # El nombre arranca a la altura de las mayúsculas del monograma y el subtítulo cae en su línea base
    r1 = altura_mayus(fo, 1)
    t1 = cap * 0.50 / r1
    t2 = t1 * 0.36
    x = pad + w + cap * 0.42
    y_base = pad + base
    y_tope = y_base - cap
    d1, b1 = texto("Andrey Hernández", fo, t1, x, y_tope + r1 * t1)
    d2, b2 = texto("QUIROPRÁCTICO", fs, t2, x + t1 * 0.04, y_base, tracking=0.34)
    ancho_total = max(b1[2], b2[2]) + pad
    cont = s + f'<path d="{d1}" fill="{texto_c}"/><path d="{d2}" fill="{sub_c}"/>'
    guardar(nombre, documento(cont, ancho_total, h + 2 * pad, fondo))


def variante_vertical(nombre, letras, acento, texto_c, sub_c, fondo=None):
    pad = 40
    fo = "outfit-latin-600"
    fs = "outfit-latin-500"
    t1 = 64
    t2 = t1 * 0.36
    w_nombre = ancho("Andrey Hernández", fo, t1)
    s0, w0, h0, cap0, _ = simbolo()
    esc = (w_nombre * 0.62) / w0
    W = w_nombre + 2 * pad
    s, w, h, *_ = simbolo(letras, acento, (W - w0 * esc) / 2, pad, esc)
    y1 = pad + h + 30 + altura_mayus(fo, t1)
    d1, _ = texto("Andrey Hernández", fo, t1, W / 2, y1, anclaje="middle")
    y2 = y1 + 24 + altura_mayus(fs, t2)
    d2, _ = texto("QUIROPRÁCTICO", fs, t2, W / 2, y2, tracking=0.34, anclaje="middle")
    cont = s + f'<path d="{d1}" fill="{texto_c}"/><path d="{d2}" fill="{sub_c}"/>'
    guardar(nombre, documento(cont, W, y2 + pad, fondo))


def variante_icono(nombre, lado=1024, radio=0.22, zona=0.66, vertebras=6, fondo=VERDE, letras=CREMA):
    """Ícono cuadrado: monograma claro sobre verde. radio=0 → versión 'maskable' a sangre."""
    _, w0, h0, *_ = simbolo(vertebras=vertebras)
    esc = lado * zona / max(w0, h0)
    s, w, h, *_ = simbolo(letras, CORAL, (lado - w0 * esc) / 2, (lado - h0 * esc) / 2, esc, vertebras)
    guardar(nombre, documento(s, lado, lado, fondo, lado * radio))


if __name__ == "__main__":
    variante_simbolo("simbolo-color.svg", VERDE, CORAL)
    variante_simbolo("simbolo-negativo.svg", CREMA, CORAL)
    variante_simbolo("simbolo-una-tinta-verde.svg", VERDE, VERDE)
    variante_simbolo("simbolo-una-tinta-blanco.svg", BLANCO, BLANCO)
    variante_horizontal("logo-horizontal-color.svg", VERDE, CORAL, VERDE, CORAL)
    variante_horizontal("logo-horizontal-negativo.svg", CREMA, CORAL, CREMA, MENTA)
    variante_horizontal("logo-horizontal-una-tinta.svg", VERDE, VERDE, VERDE, VERDE)
    variante_vertical("logo-vertical-color.svg", VERDE, CORAL, VERDE, CORAL)
    variante_vertical("logo-vertical-negativo.svg", CREMA, CORAL, CREMA, MENTA)
    variante_icono("icono-app.svg")
    variante_icono("icono-app-maskable.svg", radio=0, zona=0.56)
    variante_icono("favicon.svg", lado=64, radio=0.22, zona=0.80, vertebras=4)
    print("Logo generado en", os.path.normpath(SALIDA))
