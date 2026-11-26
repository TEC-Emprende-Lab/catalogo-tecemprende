/* Arma index.html a partir de src/plantilla.html y los datos de content/.
   Módulo puro (sin Node ni navegador): lo usa tools/build.mjs en Vercel
   y se puede probar en el navegador. No agrega dependencias.

   Marcas de la plantilla:
     {{ ruta.al.dato }}   texto escapado
     {{{ bloque }}}       HTML ya armado (solo bloques que genera este módulo) */

const AREAS_CLASE = {
  tecnico: 'svc-tec', cursos: 'svc-cursos', incubacion: 'svc-inc',
  asesorias: 'svc-ase', charlas: 'svc-cha', alquiler: 'svc-alq'
};
const TAMANOS = ['normal', 'wide', 'tall', 'full'];

export function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* url() para estilos en línea: solo rutas del sitio o https, sin comillas ni paréntesis */
function cssUrl(ruta) {
  const r = String(ruta || '').trim();
  if (!/^(\/|https:\/\/)[^"'()\s\\<>]+$/.test(r)) return '';
  return `url("${r}")`;
}
function cssPos(pos) {
  const p = String(pos || '').trim();
  return /^[a-z0-9 .%-]{1,40}$/i.test(p) ? p : 'center 50%';
}
const soloDigitos = s => String(s || '').replace(/\D/g, '');

/* ---------- Validación: los errores detienen la publicación ---------- */
export function validar({ sitio, secciones, servicios }) {
  const errores = [];
  const falta = (cond, msg) => { if (!cond) errores.push(msg); };
  const areas = new Set((secciones?.secciones || []).map(s => s.id));
  falta(areas.size > 0, 'content/secciones.json: no hay secciones.');
  for (const s of secciones?.secciones || []) {
    falta(/^[a-z0-9-]+$/.test(s.id || ''), `Sección "${s.titulo}": el identificador solo puede tener minúsculas, números y guiones.`);
    for (const k of ['titulo', 'filtro', 'etiqueta']) falta(s[k], `Sección "${s.id}": falta "${k}".`);
  }
  const c = sitio?.contacto || {};
  falta(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.correo || ''), 'Contacto: el correo no es válido.');
  falta(soloDigitos(c.telefono).length === 8, 'Contacto: el teléfono debe tener 8 dígitos.');
  falta(soloDigitos(c.whatsapp).length === 8, 'Contacto: el WhatsApp debe tener 8 dígitos.');
  const ids = new Set();
  for (const s of servicios) {
    const n = `Servicio "${s.titulo || s.id}"`;
    falta(/^[a-z0-9-]+$/.test(s.id), `${n}: el nombre del archivo solo puede tener minúsculas, números y guiones.`);
    falta(!ids.has(s.id), `${n}: identificador repetido.`); ids.add(s.id);
    for (const k of ['titulo', 'nombre_completo', 'subtitulo', 'descripcion', 'incluye', 'etiqueta']) falta(s[k], `${n}: falta "${k}".`);
    falta(areas.has(s.area), `${n}: la sección "${s.area}" no existe.`);
    falta(cssUrl(s.imagen), `${n}: falta la foto o la ruta no es válida.`);
    if (s.calendly) falta(/^https:\/\//.test(s.calendly), `${n}: el enlace de agenda debe empezar con https://.`);
  }
  return errores;
}

/* ---------- Bloques ---------- */
function detalleHtml(bloques = []) {
  const out = [];
  let ultimoTitulo = null;
  for (const b of bloques) {
    if (b.titulo && b.titulo !== ultimoTitulo) out.push(`                <h4>${esc(b.titulo)}</h4>`);
    ultimoTitulo = b.titulo;
    if (b.type === 'parrafo') out.push(`                <p>${esc(b.texto)}</p>`);
    else if (b.type === 'lista') {
      out.push('                <ul>');
      for (const p of b.puntos || []) out.push(`                  <li>${esc(p)}</li>`);
      out.push('                </ul>');
    } else if (b.type === 'modulos') {
      out.push('                ' + (b.modulos || []).map(m =>
        `<details><summary>${esc(m.numero)} <span>${esc(m.nombre)}</span></summary>` +
        `<p class="mmeta">${esc(m.meta)}</p><p class="mgoal">${esc(m.objetivo)}</p>` +
        (m.cursos || []).map(c =>
          `<div class="cblock"><p class="course"><strong>${esc(c.nombre)}</strong></p>` +
          `<p class="cmeta">${esc(c.meta)}</p><p class="cdesc">${esc(c.descripcion)}</p>` +
          `<ul>${(c.temas || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('') +
        (m.resultado ? `<p class="mout"><strong>Al terminar el módulo:</strong> ${esc(m.resultado)}</p>` : '') +
        '</details>').join(''));
    }
  }
  return out.join('\n');
}

function tarjetaHtml(s, seccion, correo) {
  const datos = s.datos || [];
  const conPrecio = datos.some(d => d.precio);
  const asunto = encodeURIComponent('Consulta sobre: ' + s.nombre_completo);
  const estilo = `--pos: ${cssPos(s.posicion_imagen)}; --img: ${cssUrl(s.imagen)}`;
  const accion = s.calendly
    ? `<a target="_blank" rel="noopener" class="btn more cal" href="${esc(s.calendly)}">Agendar reunión</a>`
    : '<button type="button" class="btn more" aria-haspopup="dialog">Ver detalles</button>';
  return `          <article class="card reveal" id="${esc(s.id)}" data-img="${esc(s.id)}" data-area="${esc(s.area)}" data-area-label="${esc(seccion.etiqueta)}" data-subject="${esc(s.nombre_completo)}" style="${esc(estilo)}">
            <figure class="card-media"><div class="thumb" aria-hidden="true"></div><figcaption>${esc(s.pie_foto)}</figcaption></figure>
            <div class="card-body${conPrecio ? ' has-price' : ''}">
              <div class="badges"><span class="badge badge-type">${esc(s.etiqueta)}</span></div>
${s.cinta ? `              <p class="ribbon">${esc(s.cinta)}</p>\n` : ''}              <h3>${esc(s.titulo)}</h3>
              <p class="sub">${esc(s.subtitulo)}</p>
              <p class="desc">${esc(s.descripcion)}</p>
              <ul class="facts">${datos.map(d => `<li${d.precio ? ' class="price"' : ''}>${esc(d.texto)}</li>`).join('')}</ul>
              <p class="incluye"><strong>Incluye:</strong> ${esc(s.incluye)}</p>
${s.beca_titulo || s.beca_texto ? `              <p class="beca"><strong>${esc(s.beca_titulo)}</strong> ${esc(s.beca_texto)}</p>\n` : ''}              <div class="detail">
${detalleHtml(s.detalle)}
              </div>
              <div class="card-actions">
                ${accion}
                <a target="_top" class="btn cta" href="mailto:${esc(correo)}?subject=${asunto}">Consultar</a>
              </div>
            </div>
          </article>`;
}

/* ---------- Página completa ---------- */
export function renderizar({ plantilla, sitio, secciones, servicios }) {
  const visibles = servicios.filter(s => s.visible !== false)
    .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999) || a.id.localeCompare(b.id));
  const correo = sitio.contacto.correo;
  const usadas = (secciones.secciones || []).filter(sec => visibles.some(s => s.area === sec.id));

  const bloques = {
    filtros: usadas.map(sec =>
      `        <button type="button" class="pill" data-filter="${esc(sec.id)}" aria-pressed="false">${esc(sec.filtro)}</button>`).join('\n'),
    secciones: usadas.map(sec => `        <section class="svc ${AREAS_CLASE[sec.id] || 'svc-' + esc(sec.id)}" id="g-${esc(sec.id)}" aria-labelledby="t-g-${esc(sec.id)}">
          <div class="svc-head">
            <h2 id="t-g-${esc(sec.id)}">${esc(sec.titulo)}</h2>
            <p>${esc(sec.texto)}</p>
          </div>
          <div class="grid">

${visibles.filter(s => s.area === sec.id).map(s => tarjetaHtml(s, sec, correo)).join('\n\n')}

          </div>
        </section>`).join('\n\n'),
    fotos: (sitio.galeria.fotos || []).map(f => {
      const t = TAMANOS.includes(f.tamano) ? f.tamano : 'normal';
      return `          <div class="g-item${t === 'normal' ? '' : ' ' + t}" role="img" aria-label="${esc(f.descripcion)}" style="${esc('--img: ' + cssUrl(f.imagen))}"></div>`;
    }).join('\n'),
    indice: visibles.map(s => `            <li><a href="#${esc(s.id)}">${esc(s.nombre_completo)}</a></li>`).join('\n'),
    portada_estilo: esc(sitio.portada.imagen ? '--img-hero: ' + cssUrl(sitio.portada.imagen) : ''),
    contacto_estilo: esc(sitio.contacto.imagen ? '--img-contacto: ' + cssUrl(sitio.contacto.imagen) : '')
  };
  const datos = {
    ...sitio,
    tel_enlace: '+506' + soloDigitos(sitio.contacto.telefono),
    wa_enlace: 'https://wa.me/506' + soloDigitos(sitio.contacto.whatsapp)
  };

  return plantilla
    .replace(/\{\{\{\s*([\w]+)\s*\}\}\}/g, (_, k) => {
      if (!(k in bloques)) throw new Error(`Bloque desconocido en la plantilla: ${k}`);
      return bloques[k];
    })
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, ruta) => {
      const v = ruta.split('.').reduce((o, k) => (o == null ? o : o[k]), datos);
      if (v == null) throw new Error(`Dato faltante en la plantilla: ${ruta}`);
      return esc(v);
    });
}
