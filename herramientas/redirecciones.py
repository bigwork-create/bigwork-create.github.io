"""Genera el sitio mínimo que GitHub Pages publica: solo redirecciones al sitio oficial.

El sitio oficial es https://fhutures.web.app (Firebase Hosting). Este repositorio
guarda el código completo, pero bigwork-create.github.io solo debe llevar al sitio oficial,
conservando la ruta, los parámetros y el ancla (#...).

Uso: python3 herramientas/redirecciones.py CARPETA_DE_SALIDA
"""

import html
import sys
from pathlib import Path

OFICIAL = "https://fhutures.web.app"
PAGINAS = ["index.html", "privacidad.html", "terminos.html", "licencias.html"]

PLANTILLA = """<!DOCTYPE html>
<html lang="es-PE">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fhuture'S se mudó a fhutures.web.app</title>
  <link rel="canonical" href="{destino}">
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0; url={destino}">
  <script>location.replace("{oficial}" + location.pathname + location.search + location.hash);</script>
</head>
<body>
  <p>Fhuture'S ahora está en <a href="{destino}">{destino_txt}</a>.</p>
</body>
</html>
"""


def pagina(ruta: str) -> str:
    destino = f"{OFICIAL}/{'' if ruta == 'index.html' else ruta}"
    return PLANTILLA.format(oficial=OFICIAL, destino=html.escape(destino), destino_txt=html.escape(destino.replace("https://", "")))


def main() -> int:
    salida = Path(sys.argv[1] if len(sys.argv) > 1 else "_redireccion")
    salida.mkdir(parents=True, exist_ok=True)
    for ruta in PAGINAS:
        (salida / ruta).write_text(pagina(ruta), encoding="utf-8")
    # Cualquier otra dirección (p. ej. /assets/...) cae en 404.html y también redirige.
    (salida / "404.html").write_text(pagina("index.html"), encoding="utf-8")
    (salida / ".nojekyll").write_text("", encoding="utf-8")
    (salida / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {OFICIAL}/sitemap.xml\n", encoding="utf-8")
    print(f"Redirecciones generadas en {salida}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
