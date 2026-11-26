# Catálogo de servicios · TEC Emprende Lab

Página estática (HTML, CSS y JS puros) que presenta los servicios del Lab. Se muestra en ferias y se incrusta en Google Sites. Se publica en Vercel desde este repositorio (`TEC-Emprende-Lab/catalogo-tecemprende`, rama `main`).

## Reglas del proyecto
- Idioma: español de Costa Rica, tono formal pero cercano. Sin emojis.
- Solo servicios reales; no inventar precios, fechas ni condiciones. Si falta un dato, decir "por anunciarse" o "por consulta".
- Sin año de creación, sin "áreas de trabajo", sin conteo de servicios, sin estados con fecha (ediciones, "próximamente").
- El énfasis en ciencia y tecnología aplica solo a la incubación con Catalitec; el resto es abierto al público.
- Accesible (WCAG AA), fácil para personas mayores y menores de edad, buen uso en celular. Sin JavaScript la página debe verse completa.
- Marca: Poppins, crema #FAF5EC, texto #1A1612, naranja #E8521A (variables en `css/base.css`).
- Los CSS se cargan en el orden de `src/plantilla.html`; ese orden importa.
- El contenido vive en `content/` (JSON) y se edita desde `/admin` (Decap CMS, flujo editorial: borrador → revisión → publicar). No escribir contenido directo en la plantilla; si se agrega un campo, actualizar `tools/render.mjs` y `admin/config.yml` juntos.
- Vercel arma la página con `node tools/build.mjs` (sin dependencias). `tools/render.mjs` valida los datos y detiene la publicación si algo falta.
- Cada cambio de contenido: probar búsqueda (sin tildes), filtros, ventana de detalle y ventana de contacto rápido.

## Flujo de trabajo
- `main` es producción: cada push se publica en https://catalogo-tecemprende.vercel.app. Trabajar en una rama, revisar la vista previa de Vercel y unir a `main` con un Pull Request.
- Un cambio por commit, mensaje en español e imperativo ("Actualizar tarifa del alquiler").
- Correo, WhatsApp y teléfono se cambian una sola vez en `content/sitio.json` (o en /admin → Textos del sitio → Contacto).
- Nunca subir tokens ni contraseñas (el secreto OAuth del administrador va solo en las variables de Vercel). No usar `X-Frame-Options: DENY` ni `frame-ancestors 'none'`: rompería la inserción en Google Sites.
- `og:image`, `og:url` y `canonical` usan la URL completa del sitio; si cambia el dominio, actualizarlas.
- Al cambiar cualquier CSS o `js/main.js`, subir el número `?v=` de todos los enlaces en `src/plantilla.html` (y en `404.html` si cambian `fonts.css` o `base.css`); la caché de Vercel dura 1 hora.

## Estructura
Ver README.md. Cada servicio es un archivo `content/servicios/<id>.json` (el nombre es el ancla `#id`); `tools/render.mjs` lo convierte en `<article class="card">` dentro de su `<section class="svc">`. La foto va en el campo `imagen` (ruta absoluta `/assets/img/...`) y se aplica en línea con `--img`.

## Servicios actuales (secciones)
Técnico (destacado, precio por anunciarse) · Cursos (Costos, Diseño Exprés, Marketing Digital) · Incubación (Catalitec, Pre-incubación) · Asesorías (reunión de 30 min por Calendly; asesoría personalizada con costo según necesidades) · Charlas y Talleres (Catalíticos) · Alquiler de espacio (tarifa por consulta).

## Contacto oficial usado en la página
WhatsApp 8748-6464 · teléfono 2550-9270 · correo tecemprendelab@itcr.ac.cr (por confirmar contra @tec.ac.cr) · Calendly https://calendly.com/incubaciontec-r8c/30min

## Pendientes
- Confirmar correo oficial.
- Tarifa y condiciones del alquiler de espacio; fecha y precio del Técnico.
- Confirmar que la reunión de 30 minutos no tiene costo.
- Autorización de imagen de las personas en las fotos.
- Datos de las asesorías personalizadas (alcance y rango de costos).
