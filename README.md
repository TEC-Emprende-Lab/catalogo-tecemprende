# Catálogo de servicios · TEC Emprende Lab

Página informativa, de solo lectura, para mostrar en ferias y para incrustar en Google Sites.
HTML, CSS y JavaScript puros: no necesita instalación ni paso de compilación.

## Estructura

```
index.html            Contenido y estructura de la página
css/
  fonts.css           Fuente Poppins (alojada aquí, sin depender de Google Fonts)
  base.css            Colores, tipografía, reinicio y botones
  header-hero.css     Encabezado, portada y barra de búsqueda/filtros
  catalog.css         Tarjetas de servicios y ventana de detalle
  sections.css        Galería, contacto y pie
  responsive.css      Ajustes para celular
  accessible.css      Texto grande, contraste alto, cuadrícula simple
  band.css            Franjas con foto a la izquierda y texto a la derecha
  spacing.css         Espaciado y reducción de movimiento
js/main.js            Búsqueda, filtros, ventana de detalle y contacto rápido
assets/img/           Fotografías (JPG optimizadas)
assets/fonts/         Poppins en WOFF2
assets/favicon.svg    Ícono de la pestaña
assets/logo-tec-emprende-lab.svg  Logo del encabezado
tools/build-single.py Genera una versión en un solo archivo (opcional)
vercel.json           Cabeceras y caché para Vercel
```

> Los archivos CSS se cargan en el orden en que aparecen en `index.html`; ese orden importa, porque los últimos ajustan a los primeros.

## Cómo editar

- **Textos, precios, botones:** en `index.html`. Cada servicio es un bloque `<article class="card" id="...">`. Busca el nombre del servicio con Ctrl+F.
- **Agregar un servicio:** copia una tarjeta completa dentro de su sección (`<section class="svc">`) y cambia `id`, `data-subject`, el texto y los enlaces. Si usa una foto nueva, ponla en `assets/img/` y agrega su regla `[data-img="nombre"]` en `css/catalog.css`.
- **Colores y tipografía:** variables al inicio de `css/base.css`.
- **Datos de contacto:** WhatsApp, correo y teléfono se repiten en las tarjetas (`mailto:`), en la ventana de contacto rápido y en la sección Contacto; busca el número o el correo para cambiarlos en todos los sitios.
- **Con JavaScript desactivado** la página se ve completa; solo dejan de funcionar la búsqueda, los filtros y las ventanas.

## Probar en tu computadora

Abre `index.html` con doble clic. También funciona con un servidor local: `python3 -m http.server` y entra a `http://localhost:8000`.

## Publicar en Vercel (vía GitHub)

1. Sube esta carpeta a un repositorio de GitHub.
2. En vercel.com/new elige **Import Git Repository**.
3. Framework Preset: **Other**. Build Command y Output Directory: vacíos.
4. Cada cambio que subas a GitHub se publica solo en uno o dos minutos.

## Incrustar en Google Sites

Insertar > **Insertar enlace** (o Incorporar > pestaña URL) y pega la dirección de Vercel. Los enlaces de correo y teléfono ya salen del marco (`target="_top"`).

## Versión de un solo archivo

`python3 tools/build-single.py` crea `dist/catalogo-single.html` con todo incrustado, para llevarla en una USB o abrirla sin internet.

## Pendientes por confirmar

- Correo oficial: los documentos usan `tecemprendelab@itcr.ac.cr` y el brief de diseño `@tec.ac.cr`.
- Tarifas y condiciones del alquiler de espacio, y fechas y precio del Técnico (hoy "por anunciarse").
- Autorización de uso de imagen de las personas que aparecen en las fotos.
