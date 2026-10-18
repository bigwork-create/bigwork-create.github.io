/* Botones "Compartir" de Fhuture'S.
   - Botón general (cabecera del inicio y pie de página): comparte la página principal.
   - Botón de cada tarjeta: comparte el enlace directo a esa app (…/#id); lo crea script.js
     con los atributos data-url, data-titulo y data-texto.
   En el celular abre el menú de compartir del propio sistema. Si no está disponible, muestra un
   pequeño menú con "Copiar enlace", WhatsApp y Facebook (enlaces simples, sin SDK ni cookies).
   Archivo aparte porque la política de seguridad (CSP) no permite scripts en línea. */
(function () {
  'use strict';

  var URL_WEB = 'https://fhutures.web.app/';
  var TITULO = "Fhuture'S";
  var TEXTO = 'Herramientas simples para trabajo real: apps Android y software para Windows que funcionan sin conexión.';

  var ICO_COPIAR = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  var ICO_WA = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 20l1.2-3.6A8 8 0 1 1 8 19z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9.2 8.6c.3 2.6 2.3 4.9 5 5.6l1-1.2-1.8-.9-.7.7c-.9-.5-1.7-1.3-2.1-2.2l.7-.7-.8-1.8z" fill="currentColor"/></svg>';
  var ICO_FB = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M14 8h3V4.5h-3a4 4 0 0 0-4 4V11H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3V8.8c0-.5.3-.8.5-.8z" fill="currentColor"/></svg>';

  /* ---------- Aviso breve (toast) accesible ---------- */
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.setAttribute('aria-atomic', 'true');
  document.body.appendChild(toast);
  var toastTimer;
  function avisar(msg) {
    toast.textContent = msg;
    toast.classList.add('toast--visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('toast--visible'); }, 2600);
  }

  /* ---------- Copiar enlace ---------- */
  function copiarAntiguo(url) {
    var ta = document.createElement('textarea');
    ta.value = url;
    ta.setAttribute('readonly', '');
    ta.className = 'sr-only';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  function copiar(url) {
    function fallo() {
      if (copiarAntiguo(url)) { avisar('Enlace copiado'); return; }
      // Último recurso: mostrar el enlace para copiarlo a mano.
      window.prompt('Copia este enlace:', url);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(function () { avisar('Enlace copiado'); }, fallo);
    } else {
      fallo();
    }
  }

  /* ---------- Datos que comparte cada botón ---------- */
  function datosDe(boton) {
    return {
      title: boton.getAttribute('data-titulo') || TITULO,
      text: boton.getAttribute('data-texto') || TEXTO,
      url: boton.getAttribute('data-url') || URL_WEB
    };
  }

  /* ---------- Menú (popover) cuando no hay menú del sistema ---------- */
  var abierto = null; // { boton, menu }
  var contador = 0;

  function crearMenu(boton) {
    var d = datosDe(boton);
    var menu = document.createElement('div');
    menu.className = 'compartir__menu';
    menu.id = 'menuCompartir' + (++contador);
    menu.setAttribute('role', 'group');
    menu.setAttribute('aria-label', boton.getAttribute('aria-label') || 'Compartir esta página');
    menu.hidden = true;

    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'compartir__opcion';
    b.innerHTML = ICO_COPIAR + '<span>Copiar enlace</span>';
    b.addEventListener('click', function () { copiar(d.url); cerrar(true); });

    function enlace(href, ico, txt) {
      var a = document.createElement('a');
      a.className = 'compartir__opcion';
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = ico + '<span>' + txt + '</span><span class="sr-only"> (se abre en otra pestaña)</span>';
      a.addEventListener('click', function () { cerrar(false); });
      return a;
    }

    menu.appendChild(b);
    menu.appendChild(enlace('https://wa.me/?text=' + encodeURIComponent(d.text + ' ' + d.url), ICO_WA, 'WhatsApp'));
    menu.appendChild(enlace('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(d.url), ICO_FB, 'Facebook'));
    boton.parentNode.appendChild(menu);
    boton.setAttribute('aria-controls', menu.id);
    return menu;
  }

  function menuDe(boton) {
    var id = boton.getAttribute('aria-controls');
    var m = id && document.getElementById(id);
    return m || crearMenu(boton);
  }

  function abrir(boton) {
    var menu = menuDe(boton);
    if (abierto) cerrar(false);
    menu.hidden = false;
    boton.setAttribute('aria-expanded', 'true');
    abierto = { boton: boton, menu: menu };
    var primero = menu.querySelector('.compartir__opcion');
    if (primero) primero.focus();
  }

  function cerrar(devolverFoco) {
    if (!abierto) return;
    var a = abierto;
    abierto = null;
    a.menu.hidden = true;
    a.boton.setAttribute('aria-expanded', 'false');
    if (devolverFoco && document.contains(a.boton)) a.boton.focus();
  }

  // Un solo escuchador para todos los botones, incluidos los de tarjetas que se vuelven a dibujar al filtrar.
  document.addEventListener('click', function (e) {
    var boton = e.target.closest ? e.target.closest('[data-compartir]') : null;
    if (boton) {
      if (abierto && abierto.boton === boton) { cerrar(true); return; }
      if (navigator.share) {
        navigator.share(datosDe(boton)).catch(function (err) {
          // Si la persona cancela no hacemos nada; si el sistema falla, mostramos el menú.
          if (!err || err.name !== 'AbortError') abrir(boton);
        });
      } else {
        abrir(boton);
      }
      return;
    }
    if (abierto && !abierto.menu.contains(e.target)) cerrar(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && abierto) { e.preventDefault(); cerrar(true); }
  });
  document.addEventListener('focusin', function (e) {
    if (abierto && !abierto.menu.contains(e.target) && !abierto.boton.contains(e.target)) cerrar(false);
  });
})();
