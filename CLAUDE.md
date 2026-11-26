# Catálogo de servicios · TEC Emprende Lab

Página estática (HTML, CSS y JS puros, sin build) que presenta los servicios del Lab. Se muestra en ferias y se incrusta en Google Sites. Se publica en Vercel desde este repositorio (`TEC-Emprende-Lab/catalogo-tecemprende`, rama `main`).

## Reglas del proyecto
- Idioma: español de Costa Rica, tono formal pero cercano. Sin emojis.
- Solo servicios reales; no inventar precios, fechas ni condiciones. Si falta un dato, decir "por anunciarse" o "por consulta".
- Sin año de creación, sin "áreas de trabajo", sin conteo de servicios, sin estados con fecha (ediciones, "próximamente").
- El énfasis en ciencia y tecnología aplica solo a la incubación con Catalitec; el resto es abierto al público.
- Accesible (WCAG AA), fácil para personas mayores y menores de edad, buen uso en celular. Sin JavaScript la página debe verse completa.
- Marca: Poppins, crema #FAF5EC, texto #1A1612, naranja #E8521A (variables en `css/base.css`).
- Los CSS se cargan en el orden de `index.html`; ese orden importa.
- Cada cambio de contenido: probar búsqueda (sin tildes), filtros, ventana de detalle y ventana de contacto rápido.

## Flujo de trabajo
- `main` es producción: cada push se publica en https://catalogo-tecemprende.vercel.app. Trabajar en una rama, revisar la vista previa de Vercel y unir a `main` con un Pull Request.
- Un cambio por commit, mensaje en español e imperativo ("Actualizar tarifa del alquiler").
- Un dato que se repite (correo, WhatsApp, teléfono) se busca en todo el proyecto, incluido `js/main.js`.
- Nunca subir tokens ni contraseñas. No usar `X-Frame-Options: DENY` ni `frame-ancestors 'none'`: rompería la inserción en Google Sites.
- `og:image`, `og:url` y `canonical` usan la URL completa del sitio; si cambia el dominio, actualizarlas.
- Al cambiar cualquier CSS o `js/main.js`, subir el número `?v=` de todos los enlaces en `index.html` (y en `404.html` si cambian `fonts.css` o `base.css`); la caché de Vercel dura 1 hora.

## Estructura
Ver README.md. Cada servicio es un `<article class="card" id="...">` en `index.html`, dentro de su `<section class="svc">`. Fotos en `assets/img/`; la regla de foto por servicio está en `css/catalog.css` (`[data-img="..."]`).

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
