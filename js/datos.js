/* =========================================================
   ESSENZA — datos desde Google Sheets
   La web ya trae todos los datos escritos en el HTML (respaldo).
   Si la planilla responde, este archivo los reemplaza por los de la planilla.
   Si la planilla no responde o un valor está vacío/mal, queda lo del HTML.
   ========================================================= */

/* 1 · PEGÁ ACÁ LOS ENLACES CSV DE CADA PESTAÑA
   En la planilla: Archivo › Compartir › Publicar en la Web ›
   elegí la pestaña › formato "Valores separados por comas (.csv)" › Publicar.
   Dejá un enlace vacío ('') para no usar esa pestaña. */
var ESSENZA_HOJAS = {
  precios:  '',
  horarios: '',
  datos:    ''
};

(function () {
  'use strict';

  var CACHE_MIN = 10;            // minutos que el navegador guarda la planilla
  var site = document.querySelector('.site');

  /* ---------- utilidades ---------- */
  function parseCSV(text) {
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (c !== '\r') cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }
  function toObjects(rows) {
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1).filter(function (r) { return r.join('').trim() !== ''; }).map(function (r) {
      var o = {};
      head.forEach(function (h, i) { o[h] = (r[i] || '').trim(); });
      return o;
    });
  }
  function num(v) {
    var d = String(v || '').replace(/[^\d]/g, '');
    return d ? parseInt(d, 10) : null;
  }
  function money(n) { return '$' + n.toLocaleString('es-UY'); }

  function cacheGet(k) {
    try {
      var raw = sessionStorage.getItem('essenza:' + k);
      if (!raw) return null;
      var o = JSON.parse(raw);
      return (Date.now() - o.t) < CACHE_MIN * 60000 ? o.v : null;
    } catch (e) { return null; }
  }
  function cacheSet(k, v) {
    try { sessionStorage.setItem('essenza:' + k, JSON.stringify({ t: Date.now(), v: v })); } catch (e) {}
  }
  function load(name) {
    var url = ESSENZA_HOJAS[name];
    if (!url) return Promise.resolve(null);
    var c = cacheGet(name);
    if (c) return Promise.resolve(c);
    return fetch(url, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (t) { var o = toObjects(parseCSV(t)); cacheSet(name, o); return o; })
      .catch(function (e) { console.warn('[Essenza] No se pudo leer la pestaña "' + name + '". Se usan los datos del HTML.', e); return null; });
  }

  /* ---------- precios ---------- */
  function applyPrecios(list) {
    if (!list) return;
    var map = {};
    list.forEach(function (r) { var n = num(r.precio); if (r.id && n) map[r.id] = n; });

    document.querySelectorAll('[data-precio]').forEach(function (el) {
      var n = map[el.getAttribute('data-precio')];
      if (n) el.textContent = money(n);
    });
    // "desde": el menor precio de uno o varios planes (data-desde="clave1,clave2")
    document.querySelectorAll('[data-desde]').forEach(function (el) {
      var keys = el.getAttribute('data-desde').split(',');
      var min = null;
      Object.keys(map).forEach(function (id) {
        keys.forEach(function (k) {
          if (id.indexOf(k + '.') === 0 && (min === null || map[id] < min)) min = map[id];
        });
      });
      if (min) el.textContent = money(min);
    });
  }

  /* ---------- horarios ---------- */
  var DIAS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
  function applyHorarios(list) {
    if (!list) return;
    document.querySelectorAll('table[data-horarios]').forEach(function (table) {
      var act = table.getAttribute('data-horarios');
      var rows = list.filter(function (r) { return r.actividad === act; });
      if (!rows.length) return;
      var tbody = table.querySelector('tbody');
      tbody.textContent = '';
      rows.forEach(function (r) {
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        th.scope = 'row'; th.textContent = r.hora || '';
        tr.appendChild(th);
        DIAS.forEach(function (d) {
          var td = document.createElement('td');
          var v = r[d] || '—';
          td.textContent = v;
          if (/gratis/i.test(v)) td.className = 'gift';
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    });
  }

  /* ---------- datos generales ---------- */
  function applyDatos(list) {
    if (!list) return;
    var d = {};
    list.forEach(function (r) { if (r.clave) d[r.clave] = r.valor; });

    // textos sueltos: <span data-dato="direccion">
    document.querySelectorAll('[data-dato]').forEach(function (el) {
      var v = d[el.getAttribute('data-dato')];
      if (v) el.textContent = v;
    });

    // WhatsApp: <a data-wa="general|natacion|colonia">
    document.querySelectorAll('[data-wa]').forEach(function (a) {
      var tel = String(d['whatsapp_' + a.getAttribute('data-wa')] || '').replace(/[^\d]/g, '');
      if (tel.length >= 11) a.href = 'https://wa.me/' + tel;
    });

    // modo de precios
    var modo = (d.modo_precios || '').toLowerCase();
    if (['completos', 'desde', 'ocultos'].indexOf(modo) >= 0) site.setAttribute('data-precios', modo);

    // temporada de la colonia: verano | invierno | ninguna
    var t = (d.colonia_temporada || '').toLowerCase();
    if (['verano', 'invierno', 'ninguna'].indexOf(t) >= 0) {
      var band = document.querySelector('[data-season]');
      var ribbon = document.querySelector('[data-ribbon]');
      var card = document.querySelector('[data-colonia-card]');
      if (t === 'ninguna') {
        if (band) band.hidden = true;
        if (ribbon) ribbon.hidden = true;
        if (card) card.style.order = '99';
      } else {
        if (band) {
          band.hidden = false;
          var tag = band.querySelector('[data-season-tag]'), txt = band.querySelector('[data-season-text]');
          if (tag && d['banda_' + t + '_etiqueta']) tag.textContent = d['banda_' + t + '_etiqueta'];
          if (txt && d['banda_' + t + '_texto']) txt.textContent = d['banda_' + t + '_texto'];
        }
        if (ribbon) { ribbon.hidden = false; ribbon.textContent = 'Inscripciones abiertas · ' + t; }
        if (card) card.style.order = '';
      }
    }
  }

  // expuesto para revisar.html
  window.EssenzaDatos = { parseCSV: parseCSV, toObjects: toObjects, num: num, money: money };
  if (!site) return;

  /* ---------- arranque ---------- */
  Promise.all([load('precios'), load('horarios'), load('datos')]).then(function (res) {
    applyPrecios(res[0]);
    applyHorarios(res[1]);
    applyDatos(res[2]);
  });

})();
