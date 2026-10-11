/* Hubert Apps — lógica de la página (JavaScript puro, sin librerías) */
(function () {
  'use strict';

  var datos = window.CATALOGO || { aplicaciones: [], software: [] };
  var apps = datos.aplicaciones || [];
  var soft = datos.software || [];

  /* ---------- Utilidades ---------- */
  function el(tag, attrs, hijos) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'texto') n.textContent = attrs[k];
        else if (k === 'clase') n.className = attrs[k];
        else n.setAttribute(k, attrs[k]);
      });
    }
    (hijos || []).forEach(function (h) { if (h) n.appendChild(h); });
    return n;
  }
  function normalizar(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /* ---------- Tema claro / oscuro ---------- */
  var raiz = document.documentElement;
  var btnTema = document.getElementById('temaToggle');
  function actualizarBotonTema() {
    var claro = raiz.getAttribute('data-tema') === 'claro';
    btnTema.setAttribute('aria-label', claro ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', claro ? '#f6f8fc' : '#0f1420');
  }
  btnTema.addEventListener('click', function () {
    var nuevo = raiz.getAttribute('data-tema') === 'claro' ? 'oscuro' : 'claro';
    raiz.setAttribute('data-tema', nuevo);
    try { localStorage.setItem('tema', nuevo); } catch (e) {}
    actualizarBotonTema();
  });
  actualizarBotonTema();

  /* ---------- Menú móvil ---------- */
  var menuBtn = document.getElementById('menuToggle');
  var nav = document.getElementById('navPrincipal');
  function cerrarMenu() {
    nav.classList.remove('abierto');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menú');
  }
  menuBtn.addEventListener('click', function () {
    var abierto = nav.classList.toggle('abierto');
    menuBtn.setAttribute('aria-expanded', String(abierto));
    menuBtn.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') cerrarMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(); });

  /* ---------- Tarjetas ---------- */
  var ICONO_IMG = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

  function insigniaPlataforma(p) {
    return el('span', { clase: 'insignia insignia--' + normalizar(p), texto: p });
  }

  function crearTarjeta(item, tipo) {
    var esApp = tipo === 'app';
    var clases = 'tarjeta';
    if (item.ejemplo) clases += ' tarjeta--ejemplo';
    if (item.proximamente) clases += ' tarjeta--proximamente';
    var art = el('article', { clase: clases, 'aria-labelledby': 't-' + item.id });

    // Etiqueta "Ejemplo" / "Próximamente"
    if (item.ejemplo) art.appendChild(el('span', { clase: 'etiqueta-ejemplo', texto: 'Ejemplo' }));
    if (item.proximamente) art.appendChild(el('span', { clase: 'etiqueta-ejemplo', texto: 'Próximamente' }));

    // Captura de pantalla
    var cap = el('div', { clase: 'tarjeta__captura' });
    if (item.capturas && item.capturas.length) {
      var img = el('img', {
        src: item.capturas[0], alt: 'Captura de pantalla de ' + item.nombre,
        loading: 'lazy', decoding: 'async', width: '640', height: '360'
      });
      // Capturas verticales (de teléfono): se muestran completas, sin recortar
      img.addEventListener('load', function () {
        if (img.naturalHeight > img.naturalWidth) cap.classList.add('tarjeta__captura--vertical');
      });
      cap.appendChild(el('a', {
        clase: 'tarjeta__captura-enlace', href: item.capturas[0], target: '_blank', rel: 'noopener',
        title: 'Ver captura en tamaño completo'
      }, [img]));
    } else {
      var sc = el('div', { clase: 'sin-captura' });
      sc.innerHTML = ICONO_IMG;
      sc.appendChild(el('span', { texto: item.proximamente ? 'En desarrollo' : 'Captura pendiente' }));
      cap.appendChild(sc);
    }
    if (item.video && item.video.valor) {
      var play = el('button', { clase: 'btn-play', type: 'button', 'aria-label': 'Ver demo en video de ' + item.nombre });
      play.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg>';
      play.appendChild(document.createTextNode('Ver demo'));
      play.addEventListener('click', function () { abrirVideo(item); });
      cap.appendChild(play);
    }
    art.appendChild(cap);

    // Cuerpo
    var cuerpo = el('div', { clase: 'tarjeta__cuerpo' });
    var top = el('div', { clase: 'tarjeta__top' }, [
      el('img', { clase: 'tarjeta__icono', src: item.icono || 'assets/icons/generico.svg', alt: '', width: '52', height: '52' }),
      el('div', null, [
        el('h3', { clase: 'tarjeta__nombre', id: 't-' + item.id, texto: item.nombre }),
        el('div', { clase: 'tarjeta__meta' }, [
          el('span', { clase: 'version', texto: item.version && item.version !== '—' ? 'v' + item.version : 'Versión por definir' }),
          item.tamano ? el('span', { clase: 'tarjeta__sep', 'aria-hidden': 'true', texto: '·' }) : null,
          item.tamano ? el('span', { texto: item.tamano }) : null
        ])
      ])
    ]);
    cuerpo.appendChild(top);
    cuerpo.appendChild(el('p', { clase: 'tarjeta__desc', texto: item.descripcion }));

    var ins = el('div', { clase: 'insignias' });
    if (item.categoria) ins.appendChild(el('span', { clase: 'insignia insignia--cat', texto: item.categoria }));
    (item.plataformas || []).forEach(function (p) { ins.appendChild(insigniaPlataforma(p)); });
    (item.tecnologias || []).forEach(function (t) { ins.appendChild(el('span', { clase: 'insignia insignia--tec', texto: t })); });
    cuerpo.appendChild(ins);

    if (item.requisitos) {
      cuerpo.appendChild(el('p', { clase: 'tarjeta__req' }, [
        el('strong', { texto: 'Requiere: ' }), document.createTextNode(item.requisitos)
      ]));
    }
    if (item.permisos && item.permisos.length) {
      var lista = el('ul', { clase: 'detalle__lista' });
      item.permisos.forEach(function (t) { lista.appendChild(el('li', { texto: t })); });
      cuerpo.appendChild(el('details', { clase: 'detalle' }, [
        el('summary', { texto: 'Permisos y para qué se usan' }), lista
      ]));
    }
    // Galería: todas las capturas en miniatura (solo si hay más de una)
    if (item.capturas && item.capturas.length > 1) {
      // Software de escritorio: capturas horizontales (no recortarlas como las de teléfono)
      var galeria = el('div', { clase: esApp ? 'galeria' : 'galeria galeria--horizontal' });
      item.capturas.forEach(function (src, i) {
        galeria.appendChild(el('a', {
          clase: 'galeria__item', href: src, target: '_blank', rel: 'noopener',
          title: 'Ver captura ' + (i + 1) + ' en tamaño completo'
        }, [el('img', {
          src: src, alt: 'Captura ' + (i + 1) + ' de ' + item.nombre,
          loading: 'lazy', decoding: 'async', width: '135', height: '300'
        })]));
      });
      cuerpo.appendChild(el('details', { clase: 'detalle' }, [
        el('summary', { texto: 'Capturas de pantalla (' + item.capturas.length + ')' }), galeria
      ]));
    }
    if (item.sha256) {
      cuerpo.appendChild(el('details', { clase: 'detalle' }, [
        el('summary', { texto: 'Verificar archivo (SHA-256)' }),
        el('code', { clase: 'detalle__hash', texto: item.sha256 })
      ]));
    }

    // Botón de descarga
    if (!item.proximamente) {
      var texto = item.textoBoton || (esApp ? 'Descargar APK' : 'Descargar');
      var sinEnlace = !item.descarga || item.descarga === '#';
      var a = el('a', { clase: 'btn btn--primario btn--bloque', href: item.descarga || '#' });
      a.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      a.appendChild(document.createTextNode(texto));
      if (sinEnlace) {
        a.setAttribute('aria-disabled', 'true');
        a.setAttribute('title', 'Enlace de descarga aún no disponible');
        a.addEventListener('click', function (e) { e.preventDefault(); });
      } else {
        a.setAttribute('rel', 'noopener');
        if (/\.(apk|zip|exe|deb|appimage|msi|tar\.gz)$/i.test(item.descarga)) a.setAttribute('download', '');
      }
      cuerpo.appendChild(a);
      if (item.virustotal) {
        cuerpo.appendChild(el('a', {
          clase: 'enlace-vt', href: item.virustotal, target: '_blank', rel: 'noopener',
          texto: 'Ver análisis en VirusTotal'
        }));
      }
    } else {
      cuerpo.appendChild(el('span', { clase: 'btn btn--secundario btn--bloque', 'aria-disabled': 'true', texto: 'Muy pronto' }));
    }

    art.appendChild(cuerpo);
    return art;
  }

  /* Páginas sin catálogo (por ejemplo privacidad.html): solo tema, menú y año */
  if (!document.getElementById('gridApps')) {
    var anioPie = document.getElementById('anio');
    if (anioPie) anioPie.textContent = new Date().getFullYear();
    return;
  }

  /* ---------- Catálogo de apps: búsqueda + filtros ---------- */
  var gridApps = document.getElementById('gridApps');
  var vacioApps = document.getElementById('vacioApps');
  var chipsApps = document.getElementById('chipsApps');
  var buscar = document.getElementById('buscarApps');
  var categoriaActiva = 'Todas';

  function pintarApps() {
    var q = normalizar(buscar.value.trim());
    gridApps.innerHTML = '';
    var visibles = apps.filter(function (a) {
      var okCat = categoriaActiva === 'Todas' || a.categoria === categoriaActiva;
      var texto = normalizar([a.nombre, a.descripcion, a.categoria].join(' '));
      return okCat && (!q || texto.indexOf(q) !== -1);
    });
    visibles.forEach(function (a) { gridApps.appendChild(crearTarjeta(a, 'app')); });
    vacioApps.hidden = visibles.length > 0;
  }

  function pintarChips() {
    var cats = ['Todas'];
    apps.forEach(function (a) { if (a.categoria && cats.indexOf(a.categoria) === -1) cats.push(a.categoria); });
    cats.forEach(function (c) {
      var b = el('button', { clase: 'chip', type: 'button', 'aria-pressed': String(c === categoriaActiva), texto: c });
      b.addEventListener('click', function () {
        categoriaActiva = c;
        Array.prototype.forEach.call(chipsApps.children, function (x) {
          x.setAttribute('aria-pressed', String(x.textContent === c));
        });
        pintarApps();
      });
      chipsApps.appendChild(b);
    });
  }

  buscar.addEventListener('input', pintarApps);
  pintarChips();
  pintarApps();

  /* ---------- Software ---------- */
  var gridSoft = document.getElementById('gridSoft');
  soft.forEach(function (s) { gridSoft.appendChild(crearTarjeta(s, 'soft')); });

  /* ---------- Estadísticas del hero ---------- */
  document.getElementById('statApps').textContent = apps.length;
  document.getElementById('statSoft').textContent = soft.filter(function (s) { return !s.proximamente; }).length;
  document.getElementById('anio').textContent = new Date().getFullYear();

  /* ---------- Modal de video ---------- */
  var modal = document.getElementById('modalVideo');
  var modalCuerpo = document.getElementById('modalCuerpo');
  var modalTitulo = document.getElementById('modalTitulo');
  var ultimoFoco = null;

  function abrirVideo(item) {
    ultimoFoco = document.activeElement;
    modalTitulo.textContent = 'Demo: ' + item.nombre;
    modalCuerpo.innerHTML = '';
    if (item.video.tipo === 'youtube') {
      modalCuerpo.appendChild(el('iframe', {
        src: 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(item.video.valor) + '?autoplay=1&rel=0',
        title: 'Video de demostración de ' + item.nombre,
        allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
        allowfullscreen: ''
      }));
    } else {
      var attrs = { src: item.video.valor, controls: '', autoplay: '', playsinline: '', muted: '', preload: 'metadata' };
      if (item.video.poster) attrs.poster = item.video.poster;
      var v = el('video', attrs);
      v.muted = true;
      modalCuerpo.appendChild(v);
    }
    // Videos verticales (de teléfono): ventana angosta y alta
    modal.classList.toggle('modal--vertical', !!item.video.vertical);
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    document.getElementById('modalCerrar').focus();
  }
  function cerrarVideo() {
    modalCuerpo.innerHTML = ''; // detiene el video
    if (modal.open && typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
    if (ultimoFoco) ultimoFoco.focus();
  }
  document.getElementById('modalCerrar').addEventListener('click', cerrarVideo);
  modal.addEventListener('click', function (e) { if (e.target === modal) cerrarVideo(); });
  modal.addEventListener('cancel', function (e) { e.preventDefault(); cerrarVideo(); });

  /* ---------- Resaltar sección activa en el menú ---------- */
  if ('IntersectionObserver' in window) {
    var enlaces = nav.querySelectorAll('a');
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          enlaces.forEach(function (a) {
            var activo = a.getAttribute('href') === '#' + en.target.id;
            a.classList.toggle('activo', activo);
            if (activo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'aplicaciones', 'software', 'contacto'].forEach(function (id) {
      var s = document.getElementById(id); if (s) obs.observe(s);
    });
  }
})();
