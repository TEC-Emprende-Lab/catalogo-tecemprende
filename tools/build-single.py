"""Genera dist/catalogo-single.html: la misma página en UN solo archivo
(CSS, JS, fuente e imágenes incrustados). Útil para llevarla en una USB,
enviarla por correo o abrirla sin internet en una feria.

Uso (desde la raíz del proyecto):  python3 tools/build-single.py
"""
import base64, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "index.html").read_text(encoding="utf-8")

def b64(path, mime):
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()

def inline_css(name):
    css = (root / "css" / name).read_text(encoding="utf-8")
    css = re.sub(r'url\("\.\./assets/fonts/([^"]+)"\)',
                 lambda m: f'url("{b64(root/"assets"/"fonts"/m.group(1), "font/woff2")}")', css)
    css = re.sub(r'url\("\.\./assets/img/([^"]+)"\)',
                 lambda m: f'url("{b64(root/"assets"/"img"/m.group(1), "image/jpeg")}")', css)
    return css

# CSS: cada <link rel="stylesheet" href="css/x.css"> pasa a ser un <style>
html = re.sub(r'  <link rel="stylesheet" href="css/([^"]+)">\n?',
              lambda m: "  <style>\n" + inline_css(m.group(1)) + "\n  </style>\n", html)
# Se quitan precargas (ya no hay archivos aparte) y el favicon pasa a datos
html = re.sub(r'  <link rel="preload"[^>]*>\n', "", html)
html = html.replace('href="assets/favicon.svg"',
                    f'href="{b64(root/"assets"/"favicon.svg", "image/svg+xml")}"')
html = html.replace('  <meta property="og:image" content="assets/img/hero.jpg">\n', "")
# JS
js = (root / "js" / "main.js").read_text(encoding="utf-8")
html = html.replace('<script src="js/main.js" defer></script>', "<script>\n" + js + "\n</script>")

out = root / "dist"; out.mkdir(exist_ok=True)
(out / "catalogo-single.html").write_text(html, encoding="utf-8")
print("Listo:", out / "catalogo-single.html", f"({(out/'catalogo-single.html').stat().st_size/1024:.0f} KB)")
