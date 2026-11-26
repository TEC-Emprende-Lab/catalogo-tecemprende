/* Catálogo de servicios · TEC Emprende Lab
   Búsqueda, filtros, ventana de detalle y contacto rápido.
   Sin dependencias. Con JavaScript desactivado la página se ve completa. */

'use strict';

(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var input = document.getElementById('buscador');
  var counter = document.getElementById('contador');
  var emptyBox = document.getElementById('sin-resultados');
  var pills = Array.prototype.slice.call(document.querySelectorAll('.pill'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  var groupEls = Array.prototype.slice.call(document.querySelectorAll('.svc'));
  var dlg = document.getElementById('detalle');
  var toast = document.getElementById('toast');
  var state = { area: 'todos', q: '', touched: false };
  var current = null;

  function norm(t) { return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }

  var index = cards.map(function (c) {
    return norm([
      c.querySelector('h3').textContent,
      c.querySelector('.sub').textContent,
      c.querySelector('.desc').textContent,
      c.querySelector('.incluye').textContent,
      c.querySelector('.facts').textContent,
      c.querySelector('.detail').textContent,
      c.getAttribute('data-area-label')
    ].join(' '));
  });

  function visibleCards() { return cards.filter(function (c) { return !c.hidden; }); }

  function applyFilters() {
    var terms = state.q ? state.q.split(/\s+/) : [];
    var shown = 0;
    var wasHidden = cards.map(function (c) { return c.hidden; });
    cards.forEach(function (c, i) {
      var okArea = state.area === 'todos' || c.getAttribute('data-area') === state.area;
      var okText = terms.every(function (t) { return index[i].indexOf(t) !== -1; });
      c.hidden = !(okArea && okText);
      if (!c.hidden) shown++;
    });
    groupEls.forEach(function (g) { g.hidden = !g.querySelector('.card:not([hidden])'); });
    pills.forEach(function (p) {
      p.setAttribute('aria-pressed', String(p.getAttribute('data-filter') === state.area));
    });
    counter.textContent = shown === 0 ? 'No hay servicios con esa búsqueda.' : 'La lista de servicios se actualizó.';
    emptyBox.classList.toggle('show', shown === 0);
    if (ready && !reduce) {
      var n = 0;
      cards.forEach(function (c, i) {
        if (c.hidden || c.classList.contains('reveal')) return;
        if (wasHidden[i] || state.touched) { c.style.setProperty('--pd', (n * 25) + 'ms'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); n++; }
      });
    }
  }
  var ready = false;

  input.addEventListener('input', function () { state.q = norm(input.value.trim()); state.touched = true; applyFilters(); });
  pills.forEach(function (p) {
    p.addEventListener('click', function () { state.area = p.getAttribute('data-filter'); state.touched = true; applyFilters(); });
  });
  document.getElementById('limpiar').addEventListener('click', function () {
    state.area = 'todos'; state.q = ''; input.value = ''; applyFilters(); input.focus();
  });

  /* Aparición suave al desplazarse */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gitems = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  var revealEls = cards.concat(gitems);
  cards.forEach(function (c, i) { c.style.setProperty('--d', '0ms'); });
  gitems.forEach(function (g, i) { g.classList.add('reveal'); g.style.setProperty('--d', ((i % 3) * 40) + 'ms'); });
  revealEls.forEach(function (el) {
    el.addEventListener('animationend', function (e) {
      if (e.target === el && el.classList.contains('reveal')) { el.classList.remove('reveal', 'in'); }
      else if (e.target === el && el.classList.contains('pop')) { el.classList.remove('pop'); }
    });
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -20px 0px' });
    revealEls.forEach(function (c) { io.observe(c); });
  } else {
    revealEls.forEach(function (c) { c.classList.add('in'); });
  }

  /* Encabezado con sombra al desplazarse */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', (window.pageYOffset || root.scrollTop) > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Aviso breve */
  var toastTimer;
  function say(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  function copyText(text, msg) {
    function done() { say(msg); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (err) { say('No se pudo copiar'); }
      document.body.removeChild(ta);
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll('.copy'), function (b) {
    b.addEventListener('click', function () {
      copyText(b.getAttribute('data-copy'), b.getAttribute('data-label'));
      var tn = b.lastChild, orig = tn.textContent;
      b.classList.add('done'); tn.textContent = '¡Listo!';
      setTimeout(function () { b.classList.remove('done'); tn.textContent = orig; }, 1400);
    });
  });

  /* Ventana de detalle */
  function fill(card) {
    current = card;
    dlg.setAttribute('data-img', card.getAttribute('data-img'));
    document.getElementById('dlg-badges').innerHTML = card.querySelector('.badges').innerHTML;
    document.getElementById('dlg-titulo').textContent = card.querySelector('h3').textContent;
    document.getElementById('dlg-sub').textContent = card.querySelector('.sub').textContent;
    document.getElementById('dlg-desc').textContent = card.querySelector('.desc').textContent;
    document.getElementById('dlg-incluye').innerHTML = card.querySelector('.incluye').innerHTML;
    document.getElementById('dlg-facts').innerHTML = card.querySelector('.facts').outerHTML;
    document.getElementById('dlg-detail').innerHTML = card.querySelector('.detail').outerHTML;
    var cta = card.querySelector('.cta'), dcta = document.getElementById('dlg-cta'), dcal = document.getElementById('dlg-cal');
    dcta.setAttribute('href', cta.getAttribute('href'));
    var hasCal = !!card.querySelector('.cal');
    dcal.hidden = !hasCal;
    dcta.classList.toggle('btn-primary', !hasCal);
    var vis = visibleCards(), i = vis.indexOf(card);
    document.getElementById('dlg-prev').disabled = i <= 0;
    document.getElementById('dlg-next').disabled = i === -1 || i >= vis.length - 1;
    dlg.scrollTop = 0;
    if (!reduce) {
      ['dlg-body'].forEach(function (cls) {
        var el = dlg.querySelector('.' + cls); el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap');
      });
    }
  }
  function unlock() {
    root.classList.remove('lock');
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  function closeDlg() {
    if (!dlg.open) return;
    if (reduce) { dlg.close(); unlock(); return; }
    dlg.classList.add('closing');
    var done = false;
    function fin() { if (done) return; done = true; dlg.classList.remove('closing'); dlg.close(); unlock(); }
    dlg.addEventListener('animationend', function h(e) { if (e.target === dlg) { dlg.removeEventListener('animationend', h); fin(); } });
    setTimeout(fin, 350);
  }
  function openCard(card) {
    if (card.hidden) { state.area = 'todos'; state.q = ''; input.value = ''; applyFilters(); }
    fill(card);
    if (!dlg.open) { dlg.showModal(); root.classList.add('lock'); }
    try { history.replaceState(null, '', '#' + card.id); } catch (e) {}
  }
  function step(dir) {
    var vis = visibleCards(), i = vis.indexOf(current) + dir;
    if (i >= 0 && i < vis.length) openCard(vis[i]);
  }
  cards.forEach(function (c) {
    c.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      openCard(c);
    });
  });
  document.getElementById('dlg-cerrar').addEventListener('click', closeDlg);
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); closeDlg(); });
  document.getElementById('dlg-prev').addEventListener('click', function () { step(-1); });
  document.getElementById('dlg-next').addEventListener('click', function () { step(1); });
  document.getElementById('dlg-link').addEventListener('click', function () {
    copyText(location.href.split('#')[0] + '#' + current.id, 'Enlace copiado');
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDlg(); });
  dlg.addEventListener('close', function () {
    root.classList.remove('lock');
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  });

  /* Contacto rápido */
  var qc = document.getElementById('contacto-rapido');
  function openQuick(subject, mailHref) {
    var msg = 'Hola, quisiera información sobre: ' + subject;
    document.getElementById('qc-sub').textContent = 'Consulta sobre: ' + subject;
    document.getElementById('qc-wa').setAttribute('href', 'https://wa.me/50687486464?text=' + encodeURIComponent(msg));
    document.getElementById('qc-mail').setAttribute('href', mailHref);
    if (!qc.open) qc.showModal();
  }
  document.getElementById('qc-cerrar').addEventListener('click', function () { qc.close(); });
  qc.addEventListener('click', function (e) { if (e.target === qc) qc.close(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.cta, #dlg-cta');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('mailto:') !== 0) return;
    e.preventDefault(); e.stopPropagation();
    var card = a.id === 'dlg-cta' ? current : a.closest('.card');
    openQuick(card ? card.getAttribute('data-subject') : 'TEC Emprende Lab', href);
  }, true);

  var sx = 0, sy = 0;
  dlg.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  dlg.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 40) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  function fromHash() {
    var id = location.hash.slice(1);
    var card = id && document.getElementById(id);
    if (card && card.classList.contains('card')) openCard(card);
  }
  window.addEventListener('hashchange', fromHash);

  applyFilters();
  ready = true;
  fromHash();
})();
