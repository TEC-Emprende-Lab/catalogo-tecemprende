# Catálogo de servicios · TEC Emprende Lab

Página informativa, de solo lectura, para mostrar en ferias y para incrustar en Google Sites.
HTML, CSS y JavaScript puros. El contenido vive en archivos de datos (`content/`) que se editan desde el
administrador en `/admin`; al publicar, Vercel arma la página completa (también se ve sin JavaScript).

## Editar el contenido (administrador)

1. Entre a **https://catalogo-tecemprende.vercel.app/admin** e inicie sesión con su cuenta de GitHub
   (debe tener permiso de escritura en `TEC-Emprende-Lab/catalogo-tecemprende`).
2. **Servicios**: una ficha por tarjeta del catálogo. **Textos del sitio**: portada, galería, contacto, pie y secciones.
3. Al pulsar **Guardar**, el cambio queda como **borrador**: no se publica. Cada borrador es una rama con su
   Pull Request en GitHub y una vista previa de Vercel (el enlace aparece en el Pull Request).
4. En **Flujo editorial**, mueva el borrador a **En revisión** y luego a **Listo**. Quien revisa abre la vista previa
   y, si todo está bien, pulsa **Publicar**. En uno o dos minutos el cambio está en el sitio.

Si un dato obligatorio falta o es inválido (por ejemplo, un correo mal escrito), la vista previa falla con un
mensaje que dice qué corregir, y el sitio publicado no se toca.

Recomendaciones: fotos JPG de menos de 150 KB y unos 1600 px de ancho, solo con autorización de imagen de las
personas que aparecen; si un dato no está confirmado, escriba «por anunciarse» o «por consulta».

## Estructura

```
content/
  servicios/*.json    Un archivo por servicio (el nombre del archivo es su identificador: #tecnico, #costos…)
  secciones.json      Secciones del catálogo y sus filtros, en orden
  sitio.json          Portada, encabezado del catálogo, galería, contacto y pie
src/plantilla.html    Estructura de la página, con marcas {{ dato }} que se llenan al publicar
tools/
  render.mjs          Llena la plantilla con los datos y valida (sin dependencias)
  build.mjs           Arma el sitio en dist/ (lo ejecuta Vercel)
  build-single.py     Versión en un solo archivo (opcional; requiere ejecutar antes build.mjs)
admin/                Administrador (Decap CMS): index.html y config.yml con los formularios
api/                  Inicio de sesión con GitHub para el administrador (funciones de Vercel)
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
assets/img/           Fotografías (JPG optimizadas); assets/img/subidas/ guarda las que se suben desde /admin
assets/fonts/         Poppins en WOFF2
assets/favicon.svg    Ícono de la pestaña
assets/logo-tec-emprende-lab.svg  Logo del encabezado
assets/apple-touch-icon.png  Ícono al guardar la página en la pantalla de inicio (iPhone)
404.html              Página de "no encontrada" que Vercel muestra en direcciones inexistentes
vercel.json           Armado, cabeceras y caché para Vercel
```

> Los archivos CSS se cargan en el orden en que aparecen en `src/plantilla.html`; ese orden importa, porque los últimos ajustan a los primeros.

## Cambios de diseño (código)

- **Estructura y textos fijos** (botones, etiquetas de formularios): `src/plantilla.html`.
- **Cómo se arma cada tarjeta:** `tools/render.mjs`. Si agrega un campo nuevo, agréguelo también en `admin/config.yml`.
- **Colores y tipografía:** variables al inicio de `css/base.css`.
- **Fotos:** cada tarjeta y foto de galería recibe su imagen en línea (`--img`), desde los datos.
- **Con JavaScript desactivado** la página se ve completa; solo dejan de funcionar la búsqueda, los filtros y las ventanas.

## Probar en tu computadora

Requiere Node 18 o superior: `node tools/build.mjs` y sirva la carpeta `dist/` con cualquier servidor local
(por ejemplo `npx serve dist`). El administrador solo inicia sesión en el dominio publicado.

## Publicar en Vercel

Vercel ejecuta `node tools/build.mjs` y publica `dist/` (configurado en `vercel.json`). Cada cambio en `main`
se publica solo; cada rama o Pull Request tiene su vista previa.

### Configuración del inicio de sesión del administrador (una sola vez)

1. En GitHub: **Settings de la organización TEC-Emprende-Lab → Developer settings → OAuth Apps → New OAuth App**.
   - Homepage URL: `https://catalogo-tecemprende.vercel.app`
   - Authorization callback URL: `https://catalogo-tecemprende.vercel.app/api/callback`
2. Copie el **Client ID** y genere un **Client secret**.
3. En Vercel: **Project → Settings → Environment Variables**, agregue `OAUTH_CLIENT_ID` y `OAUTH_CLIENT_SECRET`
   (entorno Production) y vuelva a publicar.

El secreto nunca va en el repositorio.

## Incrustar en Google Sites

Insertar > **Insertar enlace** (o Incorporar > pestaña URL) y pega la dirección de Vercel. Los enlaces de correo y teléfono ya salen del marco (`target="_top"`).

## Versión de un solo archivo

`node tools/build.mjs` y luego `python3 tools/build-single.py` crean `dist/catalogo-single.html` con todo incrustado, para llevarla en una USB o abrirla sin internet.

## Pendientes por confirmar

- Correo oficial: los documentos usan `tecemprendelab@itcr.ac.cr` y el brief de diseño `@tec.ac.cr`.
- Tarifas y condiciones del alquiler de espacio, y fechas y precio del Técnico (hoy "por anunciarse").
- Autorización de uso de imagen de las personas que aparecen en las fotos.
