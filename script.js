/* Fhuture'S — lógica de la página (JavaScript puro, sin librerías) */
(function () {
  'use strict';

  var datos = window.CATALOGO || { aplicaciones: [], software: [] };
  var apps = datos.aplicaciones || [];
  var soft = datos.software || [];
  var combos = datos.appPrograma || []; // App + Programa: app Android que necesita un programa de Windows

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

  /* Botón "Compartir" de cada tarjeta: comparte el enlace directo …/#id (la lógica está en compartir.js) */
  var ICONO_COMPARTIR = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="18" cy="5" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="19" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" stroke="currentColor" stroke-width="2"/></svg>';
  function textoCorto(t) {
    var m = String(t || '').match(/^.*?[.!?](\s|$)/);
    return (m ? m[0] : String(t || '')).trim();
  }
  function botonCompartir(item) {
    var b = el('button', {
      clase: 'btn-icono tarjeta__compartir', type: 'button', 'data-compartir': '',
      'aria-label': 'Compartir ' + item.nombre, title: 'Compartir',
      'data-url': 'https://fhutures.web.app/#' + item.id,
      'data-titulo': item.nombre + ' · Fhuture\'S',
      'data-texto': textoCorto(item.descripcion)
    });
    b.innerHTML = ICONO_COMPARTIR;
    return el('span', { clase: 'compartir compartir--derecha' }, [b]);
  }

  function crearTarjeta(item, tipo) {
    var esApp = tipo === 'app';
    var esCombo = tipo === 'combo';
    var clases = 'tarjeta';
    if (esCombo) clases += ' tarjeta--combo';
    if (item.ejemplo) clases += ' tarjeta--ejemplo';
    if (item.proximamente) clases += ' tarjeta--proximamente';
    var art = el('article', { clase: clases, id: item.id, 'aria-labelledby': 't-' + item.id });

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
          item.tamano ? el('span', { texto: item.tamano }) : null,
          // Contador de descargas: oculto hasta que lleguen los datos de GitHub (ver "Contador de descargas")
          (item.releasePrefijos || item.releaseFuentes) ? el('span', { clase: 'tarjeta__sep tarjeta__descargas-sep', 'aria-hidden': 'true', texto: '·', hidden: '' }) : null,
          (item.releasePrefijos || item.releaseFuentes) ? el('span', { clase: 'tarjeta__descargas', 'data-descargas': item.id, hidden: '' }) : null
        ])
      ])
    ]);
    if (!item.proximamente) top.appendChild(botonCompartir(item));
    cuerpo.appendChild(top);
    cuerpo.appendChild(el('p', { clase: 'tarjeta__desc', texto: item.descripcion }));

    // App + Programa: aviso visible de que se necesitan las dos partes
    if (item.aviso) {
      var aviso = el('p', { clase: 'aviso-combo', role: 'note' });
      aviso.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="2.5" y="5" width="11" height="8" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5.5 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="16" y="4" width="5.5" height="11" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M13.5 9h2.5" stroke="currentColor" stroke-width="1.8" stroke-dasharray="1.5 1.5"/></svg>';
      aviso.appendChild(el('span', null, [el('strong', { texto: 'Necesitas las dos partes. ' }), document.createTextNode(item.aviso)]));
      cuerpo.appendChild(aviso);
    }

    var ins = el('div', { clase: 'insignias' });
    if (esCombo) ins.appendChild(el('span', { clase: 'insignia insignia--combo', texto: 'App + Programa' }));
    if (item.categoria) ins.appendChild(el('span', { clase: 'insignia insignia--cat', texto: item.categoria }));
    (item.plataformas || []).forEach(function (p) { ins.appendChild(insigniaPlataforma(p)); });
    (item.tecnologias || []).forEach(function (t) { ins.appendChild(el('span', { clase: 'insignia insignia--tec', texto: t })); });
    cuerpo.appendChild(ins);

    // Requisitos (siempre visible): sistema, permisos, tamaño de descarga y espacio.
    // item.requisitos puede ser un texto (solo el sistema) o un objeto:
    // { sistema, equipo, permisos, espacio }. Si falta "permisos" se deduce de
    // item.permisos; el tamaño de descarga sale de item.tamano.
    var rq = item.requisitos;
    if (rq && !item.proximamente) {
      if (typeof rq === 'string') rq = { sistema: rq };
      var permisosRq = rq.permisos;
      if (!permisosRq && item.permisos && item.permisos.length) {
        permisosRq = /^no (pide|necesita)/i.test(item.permisos[0]) ? 'Ninguno' : item.permisos.length + ' (ver la lista abajo)';
      }
      var filas = [
        ['Sistema', rq.sistema],
        ['Equipo', rq.equipo],
        ['Red', rq.red],
        ['Permisos', permisosRq],
        ['Descarga', item.tamano],
        ['Espacio', rq.espacio]
      ];
      var dl = el('dl', { clase: 'requisitos__lista' });
      filas.forEach(function (f) {
        if (!f[1]) return;
        dl.appendChild(el('dt', { texto: f[0] }));
        dl.appendChild(el('dd', { texto: f[1] }));
      });
      cuerpo.appendChild(el('section', { clase: 'requisitos', 'aria-label': 'Requisitos de ' + item.nombre }, [
        el('h4', { clase: 'requisitos__titulo', texto: 'Requisitos' }), dl
      ]));
    }
    // App + Programa: pasos para conectar la app con el programa
    if (item.pasos && item.pasos.length) {
      var ol = el('ol', { clase: 'detalle__lista' });
      item.pasos.forEach(function (t) { ol.appendChild(el('li', { texto: t })); });
      cuerpo.appendChild(el('details', { clase: 'detalle detalle--pasos', open: '' }, [
        el('summary', { texto: 'Cómo conectar' }), ol
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
      var galeria = el('div', { clase: esApp ? 'galeria' : (esCombo ? 'galeria galeria--mixta' : 'galeria galeria--horizontal') });
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
    // Varios archivos (App + Programa): una huella por cada parte
    if (item.partes && item.partes.some(function (pt) { return pt.sha256; })) {
      var hashes = el('div', { clase: 'detalle__hashes' });
      item.partes.forEach(function (pt) {
        if (!pt.sha256) return;
        hashes.appendChild(el('p', { clase: 'detalle__hash-titulo', texto: pt.nombre + (pt.archivo ? ' (' + pt.archivo + ')' : '') }));
        hashes.appendChild(el('code', { clase: 'detalle__hash', texto: pt.sha256 }));
      });
      cuerpo.appendChild(el('details', { clase: 'detalle' }, [
        el('summary', { texto: 'Verificar archivos (SHA-256)' }), hashes
      ]));
    }

    // App + Programa: un botón por cada parte (app y programa)
    if (item.partes && item.partes.length && !item.proximamente) {
      var bloque = el('div', { clase: 'descargas-combo' });
      item.partes.forEach(function (pt) {
        var d = el('a', { clase: 'btn btn--primario btn--bloque', href: pt.descarga || '#', rel: 'noopener' });
        d.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        d.appendChild(document.createTextNode(pt.textoBoton || ('Descargar ' + pt.nombre)));
        if (/\.(apk|zip|exe|msi)$/i.test(pt.descarga || '')) d.setAttribute('download', '');
        bloque.appendChild(el('div', { clase: 'descargas-combo__parte' }, [
          d, el('small', { clase: 'descargas-combo__nota', texto: [pt.nombre, pt.version ? 'v' + pt.version : '', pt.tamano].filter(Boolean).join(' · ') })
        ]));
      });
      cuerpo.appendChild(bloque);
      art.appendChild(cuerpo);
      return art;
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

  /* ---------- Contador de descargas (GitHub Releases) ----------
     Suma las descargas de TODAS las versiones de cada app, leyendo la API pública
     de GitHub (sin cuenta ni clave). Son 2 consultas por visita como máximo, y el
     resultado se guarda 1 hora en el navegador. Si GitHub no responde, el contador
     simplemente no aparece. */
  var REPO_POR_DEFECTO = 'bigwork-create/bigwork-create.github.io';
  var CACHE_MS = 60 * 60 * 1000;
  var totalesDescargas = {}; // id de la app -> número de descargas
  var formatoNumero = (function () {
    try { var f = new Intl.NumberFormat('es-PE'); return function (n) { return f.format(n); }; }
    catch (e) { return function (n) { return String(n); }; }
  })();

  function mostrarDescargas() {
    var nodos = document.querySelectorAll('[data-descargas]');
    Array.prototype.forEach.call(nodos, function (n) {
      var total = totalesDescargas[n.getAttribute('data-descargas')];
      var sep = n.previousElementSibling;
      if (typeof total !== 'number' || total < 1) return;
      n.textContent = '↓ ' + formatoNumero(total) + (total === 1 ? ' descarga' : ' descargas');
      n.title = 'Descargas desde GitHub, sumando todas las versiones';
      n.hidden = false;
      if (sep && sep.classList.contains('tarjeta__descargas-sep')) sep.hidden = false;
    });
  }

  function leerReleases(repo) {
    var clave = 'descargas:' + repo;
    try {
      var c = JSON.parse(localStorage.getItem(clave) || 'null');
      if (c && Date.now() - c.t < CACHE_MS && Array.isArray(c.r)) return Promise.resolve(c.r);
    } catch (e) {}
    return fetch('https://api.github.com/repos/' + repo + '/releases?per_page=100', {
      headers: { Accept: 'application/vnd.github+json' },
      credentials: 'omit', referrerPolicy: 'no-referrer'
    }).then(function (res) {
      if (!res.ok) throw new Error('GitHub ' + res.status);
      return res.json();
    }).then(function (lista) {
      if (!Array.isArray(lista)) throw new Error('Respuesta inesperada');
      // Solo guardamos lo necesario: etiqueta y descargas de cada versión
      var r = lista.filter(function (x) { return x && !x.draft; }).map(function (x) {
        var n = 0;
        (x.assets || []).forEach(function (a) { n += Number(a.download_count) || 0; });
        return { tag: String(x.tag_name || ''), n: n };
      });
      try { localStorage.setItem(clave, JSON.stringify({ t: Date.now(), r: r })); } catch (e) {}
      return r;
    });
  }

  function cargarDescargas() {
    if (typeof fetch !== 'function' || typeof Promise === 'undefined') return;
    var porRepo = {};
    apps.concat(soft, combos).forEach(function (it) {
      if (it.proximamente) return;
      // releaseFuentes: [{ repo, prefijos }] para sumar descargas de varios repositorios (App + Programa)
      var fuentes = it.releaseFuentes || (it.releasePrefijos ? [{ repo: it.releaseRepo, prefijos: it.releasePrefijos }] : []);
      fuentes.forEach(function (f) {
        var repo = f.repo || REPO_POR_DEFECTO;
        (porRepo[repo] = porRepo[repo] || []).push({ it: it, prefijos: f.prefijos || [''] });
      });
    });
    Object.keys(porRepo).forEach(function (repo) {
      leerReleases(repo).then(function (releases) {
        porRepo[repo].forEach(function (x) {
          var total = 0;
          releases.forEach(function (r) {
            var coincide = x.prefijos.some(function (p) { return r.tag.indexOf(p) === 0; });
            if (coincide) total += r.n;
          });
          totalesDescargas[x.it.id] = (totalesDescargas[x.it.id] || 0) + total;
        });
        mostrarDescargas();
      })['catch'](function () { /* sin conexión o límite de GitHub: no se muestra el contador */ });
    });
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
    mostrarDescargas();
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

  /* ---------- App + Programa ---------- */
  var gridCombo = document.getElementById('gridCombo');
  if (gridCombo) combos.forEach(function (c) { gridCombo.appendChild(crearTarjeta(c, 'combo')); });
  cargarDescargas();

  /* ---------- Comentarios (data/comentarios.js) ---------- */
  (function () {
    var lista = document.getElementById('listaComentarios');
    var vacio = document.getElementById('vacioComentarios');
    if (!lista) return;
    var formato;
    try { var f = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); formato = function (d) { return f.format(d); }; }
    catch (e) { formato = function (d) { return d.toISOString().slice(0, 10); }; }
    function fecha(s) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
      if (!m) return null;
      var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
      return isNaN(d.getTime()) ? null : d;
    }
    var coms = (Array.isArray(window.COMENTARIOS) ? window.COMENTARIOS : []).filter(function (c) {
      return c && String(c.texto || '').trim();
    }).sort(function (a, b) { return String(b.fecha || '').localeCompare(String(a.fecha || '')); });
    coms.forEach(function (c) {
      var d = fecha(c.fecha);
      lista.appendChild(el('article', { clase: 'comentario' }, [
        el('div', { clase: 'comentario__cabeza' }, [
          el('strong', { clase: 'comentario__nombre', texto: String(c.nombre || '').trim() || 'Anónimo' }),
          d ? el('time', { clase: 'comentario__fecha', datetime: c.fecha, texto: formato(d) }) : null
        ]),
        el('p', { clase: 'comentario__texto', texto: String(c.texto).trim() })
      ]));
    });
    lista.hidden = coms.length === 0;
    vacio.hidden = coms.length > 0;
  })();

  /* ---------- Estadísticas del hero ---------- */
  document.getElementById('statApps').textContent = apps.length;
  document.getElementById('statSoft').textContent = soft.filter(function (s) { return !s.proximamente; }).length;
  var statCombo = document.getElementById('statCombo');
  if (statCombo) statCombo.textContent = combos.filter(function (c) { return !c.proximamente; }).length;
  document.getElementById('anio').textContent = new Date().getFullYear();

  /* ---------- Enlace directo a una tarjeta (…/#mebusco) ---------- */
  // Las tarjetas se crean con JavaScript, así que el salto automático del navegador ocurre antes de que existan:
  // por eso buscamos la tarjeta después de dibujar el catálogo (el margen de la cabecera fija lo da scroll-padding-top).
  function irATarjeta() {
    var id = decodeURIComponent((location.hash || '').slice(1));
    if (!id) return;
    var esApp = apps.some(function (a) { return a.id === id; });
    var esSoft = soft.some(function (s) { return s.id === id; }) || combos.some(function (c) { return c.id === id; });
    if (!esApp && !esSoft) {
      // ¿Es un id viejo? (idsAnteriores, ej. #puenteapp → #asiste-qr)
      var nuevo = apps.concat(soft, combos).filter(function (x) {
        return Array.isArray(x.idsAnteriores) && x.idsAnteriores.indexOf(id) !== -1;
      })[0];
      if (!nuevo) return;
      id = nuevo.id;
      history.replaceState(null, '', '#' + encodeURIComponent(id));
      esApp = apps.indexOf(nuevo) !== -1;
      esSoft = !esApp;
    }
    if (esApp && !document.getElementById(id)) {
      // Estaba oculta por la búsqueda o el filtro: los quitamos para mostrarla.
      buscar.value = '';
      categoriaActiva = 'Todas';
      Array.prototype.forEach.call(chipsApps.children, function (x) {
        x.setAttribute('aria-pressed', String(x.textContent === 'Todas'));
      });
      pintarApps();
    }
    var t = document.getElementById(id);
    if (!t) return;
    t.scrollIntoView({ block: 'start' });
    t.classList.remove('tarjeta--destacada');
    void t.offsetWidth; // reinicia la animación
    t.classList.add('tarjeta--destacada');
    setTimeout(function () { t.classList.remove('tarjeta--destacada'); }, 2400);
  }
  window.addEventListener('hashchange', irATarjeta);
  if (location.hash) requestAnimationFrame(irATarjeta);

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
    ['inicio', 'aplicaciones', 'software', 'app-programa', 'tienda', 'comentarios', 'contacto'].forEach(function (id) {
      var s = document.getElementById(id); if (s) obs.observe(s);
    });
  }
})();
