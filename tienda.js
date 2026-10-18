/* ==========================================================================
   Tienda (bodega) — sección "Tienda" de la página principal.
   Lee en vivo (solo lectura) las categorías y productos de la tienda en
   Firestore (proyecto tiendas-001) con la API REST: no carga ningún SDK.
   Los productos se cargan y editan desde la app Tiendas Admin.
   Son productos físicos: cada tarjeta lleva un botón para comunicarse por
   WhatsApp y adquirir el producto (no hay descargas).
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- EDITA AQUÍ ---------- */
  // Documento de la tienda en Firestore: tiendas/{TIENDA_ID} ("Hubert", enlace /hubert).
  var TIENDA_ID = 'JXRp9brwmmZL9UJ62cgV';
  // Clave web pública de Firebase (app web "Tienda Web" de tiendas-001). No es secreta:
  // la seguridad la dan las reglas de Firestore (lectura pública, escritura solo del dueño).
  var API_KEY = 'AIzaSyDd7DwbJtv5jmkr4u8C3qyVd7Tt2wJunAs';
  var PROYECTO = 'tiendas-001';
  // WhatsApp para pedidos (51 + 9 dígitos).
  var WHATSAPP = '51907523553';
  /* --------------------------------- */

  var seccion = document.getElementById('tienda');
  if (!seccion) return;
  var grid = document.getElementById('gridTienda');
  var chips = document.getElementById('chipsTienda');
  var estado = document.getElementById('estadoTienda');

  var BASE = 'https://firestore.googleapis.com/v1/projects/' + PROYECTO +
    '/databases/(default)/documents/tiendas/' + TIENDA_ID + '/';

  var categorias = [];
  var productos = [];
  var categoriaActiva = 'todos';
  var cargando = false;

  function el(tag, attrs, hijos) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'clase') n.className = v;
      else if (k === 'texto') n.textContent = v;
      else n.setAttribute(k, v);
    });
    (hijos || []).forEach(function (h) { if (h) n.appendChild(h); });
    return n;
  }

  // Convierte un valor de la API REST de Firestore a JavaScript.
  function valor(v) {
    if (!v) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return Number(v.doubleValue);
    if ('booleanValue' in v) return v.booleanValue;
    if ('nullValue' in v) return null;
    if ('timestampValue' in v) return v.timestampValue;
    return null;
  }
  function documento(d) {
    var o = { id: d.name.split('/').pop() };
    var f = d.fields || {};
    Object.keys(f).forEach(function (k) { o[k] = valor(f[k]); });
    return o;
  }

  function listar(coleccion) {
    var todos = [];
    function pagina(token) {
      var url = BASE + coleccion + '?pageSize=300&key=' + API_KEY + (token ? '&pageToken=' + encodeURIComponent(token) : '');
      return fetch(url, { credentials: 'omit' }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).then(function (j) {
        (j.documents || []).forEach(function (d) { todos.push(documento(d)); });
        return j.nextPageToken ? pagina(j.nextPageToken) : todos;
      });
    }
    return pagina(null);
  }

  function numero(n) { return typeof n === 'number' && isFinite(n) ? n : null; }
  function soles(n) { return 'S/ ' + n.toFixed(2); }
  function tienePrecio(p) { var n = numero(p.precio); return n !== null && n > 0; }

  function estadoDe(p) {
    var stock = numero(p.stock);
    if (p.estado === 'agotado' || (stock !== null && stock <= 0 && p.estado !== 'proximamente')) return 'agotado';
    if (p.estado === 'proximamente') return 'proximamente';
    var min = numero(p.stockMinimo);
    if (stock !== null && min !== null && stock <= min) return 'pocos';
    return 'disponible';
  }
  var TEXTO_ESTADO = { disponible: 'Disponible', pocos: '¡Quedan pocos!', agotado: 'Agotado', proximamente: 'Próximamente' };

  // Fotos de Cloudinary: pedimos una versión liviana.
  function urlFoto(url) {
    if (typeof url !== 'string' || url.indexOf('https://') !== 0) return null;
    var pre = 'https://res.cloudinary.com/umd0dffn/image/upload/';
    if (url.indexOf(pre) === 0) return pre + 'f_auto,q_auto,w_480,c_limit/' + url.slice(pre.length);
    return url;
  }

  function enlaceWhatsApp(p) {
    var detalle = tienePrecio(p) ? soles(p.precio) : 'consultar precio';
    var msg = 'Hola, quiero adquirir: ' + (p.nombre || 'producto') + ' (' + detalle + ')';
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
  }

  var ICONO_WA = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"/></svg>';
  var ICONO_BOLSA = '<svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true"><path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';

  function tarjeta(p) {
    var est = estadoDe(p);
    var art = el('article', { clase: 'producto producto--' + est });

    var foto = el('div', { clase: 'producto__foto' });
    var src = urlFoto(p.foto);
    if (src) {
      var img = el('img', { src: src, alt: p.nombre || '', loading: 'lazy', decoding: 'async', width: '240', height: '240' });
      img.addEventListener('error', function () { foto.innerHTML = ICONO_BOLSA; foto.classList.add('producto__foto--vacia'); });
      foto.appendChild(img);
    } else {
      foto.innerHTML = ICONO_BOLSA;
      foto.classList.add('producto__foto--vacia');
    }
    foto.appendChild(el('span', { clase: 'producto__estado producto__estado--' + est, texto: TEXTO_ESTADO[est] }));
    art.appendChild(foto);

    var cuerpo = el('div', { clase: 'producto__cuerpo' });
    cuerpo.appendChild(el('h3', { clase: 'producto__nombre', texto: p.nombre || 'Producto' }));
    cuerpo.appendChild(el('p', { clase: 'producto__precio', texto: tienePrecio(p) ? soles(p.precio) : 'Consultar precio' }));
    var pm = numero(p.precioMayor), cm = numero(p.cantidadMayor);
    if (pm !== null && pm > 0) {
      cuerpo.appendChild(el('p', { clase: 'producto__mayor', texto: 'Por mayor: ' + soles(pm) + (cm ? ' desde ' + cm + ' u.' : '') }));
    }

    if (est === 'agotado') {
      cuerpo.appendChild(el('span', { clase: 'btn btn--secundario btn--bloque producto__accion', 'aria-disabled': 'true', texto: 'Agotado' }));
    } else {
      var a = el('a', {
        clase: 'btn btn--primario btn--bloque producto__accion', href: enlaceWhatsApp(p),
        target: '_blank', rel: 'noopener', 'aria-label': 'Comunicarse por WhatsApp para adquirir ' + (p.nombre || 'el producto')
      });
      a.innerHTML = ICONO_WA;
      a.appendChild(el('span', { texto: 'Comunicarse para adquirir' }));
      cuerpo.appendChild(a);
    }
    art.appendChild(cuerpo);
    return art;
  }

  function mostrarEstado(texto, conReintento) {
    estado.textContent = texto;
    estado.hidden = !texto;
    if (conReintento) {
      var b = el('button', { clase: 'btn btn--secundario', type: 'button', texto: 'Reintentar' });
      b.addEventListener('click', cargar);
      estado.appendChild(document.createTextNode(' '));
      estado.appendChild(b);
    }
  }

  function pintarChips() {
    chips.innerHTML = '';
    var usadas = {};
    productos.forEach(function (p) { usadas[p.categoriaId] = true; });
    var lista = categorias.filter(function (c) { return usadas[c.id]; });
    if (lista.length < 2) { chips.hidden = true; return; }
    chips.hidden = false;
    [{ id: 'todos', nombre: 'Todos' }].concat(lista).forEach(function (c) {
      var b = el('button', { clase: 'chip', type: 'button', 'aria-pressed': String(c.id === categoriaActiva), texto: c.nombre || 'Otros' });
      b.addEventListener('click', function () {
        categoriaActiva = c.id;
        Array.prototype.forEach.call(chips.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        pintarProductos();
      });
      chips.appendChild(b);
    });
  }

  function pintarProductos() {
    grid.innerHTML = '';
    var lista = productos.filter(function (p) { return categoriaActiva === 'todos' || p.categoriaId === categoriaActiva; });
    lista.forEach(function (p) { grid.appendChild(tarjeta(p)); });
    if (!productos.length) mostrarEstado('Pronto agregaremos productos.');
    else mostrarEstado('');
  }

  function cargar() {
    if (cargando) return;
    cargando = true;
    grid.innerHTML = '';
    mostrarEstado('Cargando productos…');
    Promise.all([listar('categorias'), listar('productos')]).then(function (r) {
      var ordenCat = {};
      categorias = r[0].slice().sort(function (a, b) {
        return (numero(a.orden) || 0) - (numero(b.orden) || 0) || String(a.nombre).localeCompare(String(b.nombre), 'es');
      });
      categorias.forEach(function (c, i) { ordenCat[c.id] = i; });
      productos = r[1].filter(function (p) { return p.nombre; }).sort(function (a, b) {
        var ca = ordenCat[a.categoriaId] !== undefined ? ordenCat[a.categoriaId] : 999;
        var cb = ordenCat[b.categoriaId] !== undefined ? ordenCat[b.categoriaId] : 999;
        return ca - cb || (numero(a.orden) || 0) - (numero(b.orden) || 0) || String(a.nombre).localeCompare(String(b.nombre), 'es');
      });
      pintarChips();
      pintarProductos();
    }).catch(function () {
      mostrarEstado('No se pudieron cargar los productos. Revisa tu conexión e inténtalo de nuevo.', true);
    }).then(function () { cargando = false; });
  }

  // Carga cuando la sección está por verse (ahorra lecturas si nadie baja hasta aquí).
  if ('IntersectionObserver' in window && location.hash !== '#tienda') {
    var obs = new IntersectionObserver(function (entradas) {
      if (entradas.some(function (e) { return e.isIntersecting; })) { obs.disconnect(); cargar(); }
    }, { rootMargin: '600px 0px' });
    obs.observe(seccion);
  } else {
    cargar();
  }
})();
