/* Hubert Apps — aviso de cookies y consentimiento para Google Analytics
   - La elección se guarda en localStorage, clave "consentimiento_analitica":
     "aceptado" o "rechazado". Sin elección, se muestra el aviso.
   - Analytics (analitica.js) solo se carga después de "Aceptar".
   - Cualquier botón con el atributo data-configurar-cookies borra la elección
     y vuelve a mostrar el aviso. */
(function () {
  'use strict';

  var CLAVE = 'consentimiento_analitica';
  var GA_ID = 'G-YQT7FG748M';
  var aviso = null;
  var cargada = false;

  function leer() {
    try { return localStorage.getItem(CLAVE); } catch (e) { return null; }
  }
  function guardar(valor) {
    try {
      if (valor) localStorage.setItem(CLAVE, valor);
      else localStorage.removeItem(CLAVE);
    } catch (e) {}
  }

  function cargarAnalitica() {
    window['ga-disable-' + GA_ID] = false;
    if (cargada) return;
    cargada = true;
    var s = document.createElement('script');
    s.type = 'module';
    s.src = 'analitica.js';
    document.head.appendChild(s);
  }

  /* Detiene Analytics y borra sus cookies (_ga, _ga_XXXX) */
  function detenerAnalitica() {
    window['ga-disable-' + GA_ID] = true;
    var partes = location.hostname.split('.');
    var dominios = [''];
    for (var i = 0; i < partes.length - 1; i++) {
      var d = partes.slice(i).join('.');
      dominios.push('; domain=' + d, '; domain=.' + d);
    }
    document.cookie.split(';').forEach(function (c) {
      var nombre = c.split('=')[0].trim();
      if (!/^_ga/.test(nombre)) return;
      dominios.forEach(function (dom) {
        document.cookie = nombre + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + dom;
      });
    });
  }

  function ajustarEspacio() {
    // Deja espacio al final de la página para que el aviso no tape el contenido
    document.body.style.paddingBottom = (aviso && !aviso.hidden) ? (aviso.offsetHeight + 24) + 'px' : '';
  }

  function crearAviso() {
    aviso = document.createElement('div');
    aviso.className = 'cookies';
    aviso.id = 'avisoCookies';
    aviso.setAttribute('role', 'dialog');
    aviso.setAttribute('aria-modal', 'false');
    aviso.setAttribute('aria-labelledby', 'cookiesTitulo');
    aviso.setAttribute('aria-describedby', 'cookiesTexto');
    aviso.hidden = true;
    aviso.innerHTML =
      '<div>' +
        '<h2 class="cookies__titulo" id="cookiesTitulo">Tu privacidad</h2>' +
        '<p class="cookies__texto" id="cookiesTexto">Me gustaría usar cookies de Google Analytics para saber cuántas personas visitan la web y qué apps se descargan. ' +
        'Solo se activan si aceptas, y puedes cambiar tu elección cuando quieras. ' +
        '<a href="privacidad.html">Más información en la política de privacidad</a>.</p>' +
      '</div>' +
      '<div class="cookies__acciones">' +
        '<button type="button" class="btn btn--secundario" data-cookies="rechazar">Rechazar</button>' +
        '<button type="button" class="btn btn--primario" data-cookies="aceptar">Aceptar</button>' +
      '</div>';

    aviso.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-cookies]');
      if (!b) return;
      if (b.getAttribute('data-cookies') === 'aceptar') {
        guardar('aceptado');
        cargarAnalitica();
      } else {
        guardar('rechazado');
        detenerAnalitica();
      }
      ocultarAviso(true);
      actualizarEstado();
    });

    // Justo después del enlace "Saltar al contenido", para llegar rápido con el teclado
    var saltar = document.querySelector('.saltar');
    if (saltar && saltar.parentNode === document.body) saltar.insertAdjacentElement('afterend', aviso);
    else document.body.insertBefore(aviso, document.body.firstChild);

    window.addEventListener('resize', ajustarEspacio);
  }

  var focoPrevio = null;
  function mostrarAviso(enfocar) {
    if (!aviso) crearAviso();
    focoPrevio = enfocar ? document.activeElement : null;
    aviso.hidden = false;
    ajustarEspacio();
    if (enfocar) aviso.querySelector('[data-cookies="rechazar"]').focus();
  }
  function ocultarAviso(devolverFoco) {
    if (!aviso) return;
    aviso.hidden = true;
    ajustarEspacio();
    if (devolverFoco && focoPrevio && document.contains(focoPrevio)) focoPrevio.focus();
    focoPrevio = null;
  }

  /* Texto de estado en la página de privacidad (si existe) */
  function actualizarEstado() {
    var est = document.getElementById('estadoCookies');
    if (!est) return;
    var v = leer();
    est.textContent = v === 'aceptado'
      ? 'Ahora mismo: aceptaste Google Analytics.'
      : v === 'rechazado'
        ? 'Ahora mismo: rechazaste Google Analytics. No se carga.'
        : 'Ahora mismo: todavía no elegiste. Google Analytics no se carga hasta que aceptes.';
  }

  /* Botones "Configurar cookies" */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-configurar-cookies]');
    if (!b) return;
    e.preventDefault();
    if (leer() === 'aceptado') detenerAnalitica(); // queda en pausa hasta que vuelva a aceptar
    guardar(null);
    actualizarEstado();
    mostrarAviso(true);
  });

  function iniciar() {
    var v = leer();
    if (v === 'aceptado') cargarAnalitica();
    else if (v !== 'rechazado') mostrarAviso(false);
    actualizarEstado();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
