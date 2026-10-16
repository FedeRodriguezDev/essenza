/* =========================================================
   ESSENZA — interacciones del sitio. Sin dependencias.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     PRECIOS: cambiá este valor para todo el sitio.
     'completos' → muestra todas las tarifas
     'desde'     → muestra solo el precio más bajo de cada plan
     'ocultos'   → reemplaza los montos por "Consultá"
     null        → respeta el data-precios escrito en cada página
     --------------------------------------------------------- */
  var PRECIOS = null;

  var site = document.querySelector('.site');
  if (!site) return;
  if (PRECIOS) site.setAttribute('data-precios', PRECIOS);

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cabecera compacta + parallax ---------- */
  var header = document.querySelector('.header');
  var pxEls = Array.prototype.slice.call(document.querySelectorAll('[data-px]'));
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset || 0;
      if (header) header.classList.toggle('is-scrolled', y > 40);
      if (!reduce) {
        pxEls.forEach(function (el) {
          el.style.transform = 'translate3d(0,' + (y * parseFloat(el.getAttribute('data-px'))).toFixed(1) + 'px,0)';
        });
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú en celular ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');
  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    menu.classList.remove('is-open');
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
      menu.classList.toggle('is-open', !open);
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Aparecer al hacer scroll ----------
     Lo que ya está en pantalla al cargar nunca se oculta;
     solo se anima lo que entra después. */
  var io = null;
  if (!reduce && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    var vh = window.innerHeight || 800;
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (el.getBoundingClientRect().top < vh) el.classList.add('is-in');
      else io.observe(el);
    });
    site.classList.add('is-anim');
  }
  function showInside(root) {
    root.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Video de fondo ----------
     Solo se reproduce en pantallas anchas, sin "reducir movimiento" y sin ahorro de datos.
     En el resto de los casos queda la imagen fija (poster). */
  var saveData = navigator.connection && navigator.connection.saveData;
  var wide = window.matchMedia && window.matchMedia('(min-width: 861px)').matches;
  document.querySelectorAll('video[data-autoplay]').forEach(function (v) {
    if (reduce || saveData || !wide) return;
    v.preload = 'auto';
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  });

  /* ---------- Filtro "¿Para quién buscás?" ---------- */
  var chips = document.querySelectorAll('[data-filter]');
  if (chips.length) {
    var cards = document.querySelectorAll('[data-aud]');
    var count = document.getElementById('filtro-resultado');
    var empty = document.getElementById('filtro-vacio');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        var n = 0;
        cards.forEach(function (card) {
          var ok = f === 'todos' || card.getAttribute('data-aud').split(' ').indexOf(f) >= 0;
          card.hidden = !ok;
          if (ok) { n++; card.classList.add('is-in'); }
        });
        if (count) {
          count.textContent = f === 'todos'
            ? count.getAttribute('data-todos')
            : n + (n === 1 ? ' actividad' : ' actividades') + ' para ' + chip.textContent.trim().toLowerCase() + '.';
        }
        if (empty) empty.hidden = n !== 0;
      });
    });
  }

  /* ---------- Pestañas (accesibles con teclado) ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) { panel.hidden = !on; if (on) showInside(panel); }
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
  });
})();
