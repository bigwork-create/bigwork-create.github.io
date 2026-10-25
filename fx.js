/* Fhuture'S — efectos visuales 2026 (fx.js). Vanilla, sin dependencias.
   Calidad adaptable: menos partículas y menor resolución en celulares,
   máx. 30 fps en equipos modestos, se pausa fuera de pantalla o con la pestaña oculta. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finoPuntero = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var movil = window.innerWidth < 760 || (navigator.hardwareConcurrency || 4) <= 4;
  var fpsMax = movil ? 30 : 60;
  root.classList.add('fx-js');

  function listo(fn) { if (doc.readyState !== 'loading') fn(); else doc.addEventListener('DOMContentLoaded', fn); }

  listo(function () {
    /* ---------- Barra de progreso ---------- */
    var barra = doc.createElement('div'); barra.className = 'fx-progreso'; barra.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(barra);
    var cab = doc.querySelector('.cabecera');
    var tick = false;
    function alScroll() {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false;
        var h = root.scrollHeight - innerHeight;
        barra.style.setProperty('--fx-p', h > 0 ? (scrollY / h).toFixed(4) : 0);
        if (cab) cab.classList.toggle('fx-scrolled', scrollY > 10);
      });
    }
    addEventListener('scroll', alScroll, { passive: true }); alScroll();

    /* ---------- Fondo aurora ---------- */
    var fondo = doc.createElement('div'); fondo.className = 'fx-fondo'; fondo.setAttribute('aria-hidden', 'true');
    doc.body.insertBefore(fondo, doc.body.firstChild);
    if (!reducido) aurora(fondo);

    /* ---------- Contadores animados ---------- */
    contadores();

    if (reducido) { revelar(true); return; }

    titulo();
    particulas();
    revelar(false);
    tarjetas();
    botones();
    parallaxHero();
    if (finoPuntero) cursor();
  });

  /* ===== Aurora WebGL (shader de ruido fbm) ===== */
  function aurora(fondo) {
    var c = doc.createElement('canvas'); fondo.appendChild(c);
    var gl = null;
    try { gl = c.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power' }); } catch (e) {}
    if (!gl) return;
    var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs = [
      'precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 ca,cb,cc,bg;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
      'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*1.6;float tt=t*.045;',
      'vec2 q=vec2(fbm(p+tt),fbm(p+vec2(5.2,1.3)-tt));',
      'vec2 w=vec2(fbm(p+3.*q+vec2(1.7,9.2)+tt*1.4),fbm(p+3.*q+vec2(8.3,2.8)-tt));',
      'float f=fbm(p+2.5*w+ (m-.5)*.6);',
      'float band=smoothstep(.25,.95,f)*(.55+.45*sin(uv.x*3.+t*.12));',
      'vec3 col=mix(ca,cb,clamp(q.x*1.3,0.,1.));col=mix(col,cc,clamp(w.y*w.y,0.,1.)*.7);',
      'float glow=pow(band,1.6)*.75*(1.-uv.y*.35);',
      'float d=length(uv-m);glow+=.12*exp(-d*d*9.);',
      'vec3 o=bg+col*glow;o*=1.-.35*length(uv-.5);gl_FragColor=vec4(o,1.);}'
    ].join('');
    function sh(tipo, src) { var s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    var pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uR = gl.getUniformLocation(pr, 'r'), uT = gl.getUniformLocation(pr, 't'), uM = gl.getUniformLocation(pr, 'm');
    function hex(h) { h = h.trim().replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
    function colores() {
      var cs = getComputedStyle(root);
      var claro = root.getAttribute('data-tema') === 'claro';
      gl.uniform3fv(gl.getUniformLocation(pr, 'ca'), hex(cs.getPropertyValue('--acento') || '#22d3a6'));
      gl.uniform3fv(gl.getUniformLocation(pr, 'cb'), hex(cs.getPropertyValue('--acento-2') || '#6c8cff'));
      gl.uniform3fv(gl.getUniformLocation(pr, 'cc'), [0.78, 0.42, 1.0]);
      gl.uniform3fv(gl.getUniformLocation(pr, 'bg'), claro ? [0.96, 0.97, 0.99] : hex(cs.getPropertyValue('--fondo') || '#0f1420'));
    }
    colores();
    new MutationObserver(colores).observe(root, { attributes: true, attributeFilter: ['data-tema'] });
    var escala = movil ? 0.35 : 0.5; // el shader se dibuja a baja resolución y se escala (barato y suave)
    function medir() { c.width = Math.max(2, Math.round(innerWidth * escala)); c.height = Math.max(2, Math.round(innerHeight * escala)); gl.viewport(0, 0, c.width, c.height); gl.uniform2f(uR, c.width, c.height); }
    medir(); addEventListener('resize', medir);
    var mx = .5, my = .5, tx = .5, ty = .5;
    addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth; ty = 1 - e.clientY / innerHeight; }, { passive: true });
    var t0 = performance.now(), ultimo = 0, intervalo = 1000 / Math.min(fpsMax, 30);
    function cuadro(ahora) {
      raf = requestAnimationFrame(cuadro);
      if (ahora - ultimo < intervalo) return; ultimo = ahora;
      mx += (tx - mx) * .05; my += (ty - my) * .05;
      gl.uniform1f(uT, (ahora - t0) / 1000); gl.uniform2f(uM, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    var raf = requestAnimationFrame(cuadro);
    fondo.classList.add('fx-gl');
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(cuadro); });
    c.addEventListener('webglcontextlost', function (e) { e.preventDefault(); cancelAnimationFrame(raf); fondo.classList.remove('fx-gl'); });
  }

  /* ===== Título letra por letra (accesible: el lector lee el texto completo) ===== */
  function titulo() {
    var h = doc.querySelector('.hero__titulo'); if (!h) return;
    h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    var i = 0;
    (function partir(nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (pal) {
            if (!pal) return;
            if (/^\s+$/.test(pal)) { frag.appendChild(doc.createTextNode(' ')); return; }
            var w = doc.createElement('span'); w.className = 'fx-palabra'; w.setAttribute('aria-hidden', 'true');
            Array.from(pal).forEach(function (ch) { var s = doc.createElement('span'); s.className = 'fx-letra'; s.textContent = ch; s.style.setProperty('--i', i++); w.appendChild(s); });
            frag.appendChild(w);
          });
          nodo.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains('acento')) partir(n);
        else if (n.nodeType === 1) { n.setAttribute('aria-hidden', 'true'); n.classList.add('fx-letra'); n.style.setProperty('--i', i); i += 6; }
      });
    })(h);
  }

  /* ===== Constelación de partículas en el hero (reacciona al dedo/ratón) ===== */
  function particulas() {
    var hero = doc.querySelector('.hero'); if (!hero) return;
    var c = doc.createElement('canvas'); c.className = 'fx-particulas'; c.setAttribute('aria-hidden', 'true');
    hero.insertBefore(c, hero.firstChild);
    var x = c.getContext('2d'); if (!x) return;
    var dpr = Math.min(window.devicePixelRatio || 1, movil ? 1 : 1.5);
    var W, H, P = [], N, px = -9999, py = -9999, visible = true, raf;
    function medir() {
      W = hero.clientWidth; H = hero.clientHeight; c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      N = Math.round(Math.min(movil ? 38 : 90, W * H / (movil ? 9000 : 12000)));
      P = []; for (var i = 0; i < N; i++) P.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .6, h: Math.random() });
    }
    medir(); addEventListener('resize', medir);
    hero.addEventListener('pointermove', function (e) { var b = hero.getBoundingClientRect(); px = e.clientX - b.left; py = e.clientY - b.top; }, { passive: true });
    hero.addEventListener('pointerleave', function () { px = py = -9999; });
    var cs = getComputedStyle(doc.documentElement);
    var ultimo = 0, intervalo = 1000 / fpsMax, L = movil ? 90 : 120;
    function cuadro(t) {
      raf = requestAnimationFrame(cuadro);
      if (!visible || doc.hidden || t - ultimo < intervalo) return; ultimo = t;
      x.clearRect(0, 0, W, H);
      var a = cs.getPropertyValue('--acento').trim() || '#22d3a6';
      for (var i = 0; i < N; i++) {
        var p = P[i], dx = p.x - px, dy = p.y - py, d2 = dx * dx + dy * dy;
        if (d2 < 16000) { var f = (16000 - d2) / 16000 * .6; p.vx += dx / Math.sqrt(d2 + 1) * f; p.vy += dy / Math.sqrt(d2 + 1) * f; }
        p.vx *= .96; p.vy *= .96; p.vx += (Math.random() - .5) * .03; p.vy += (Math.random() - .5) * .03;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x += W; if (p.x > W) p.x -= W; if (p.y < 0) p.y += H; if (p.y > H) p.y -= H;
      }
      x.lineWidth = 1;
      for (i = 0; i < N; i++) for (var j = i + 1; j < N; j++) {
        var q = P[i], s = P[j], ex = q.x - s.x, ey = q.y - s.y, dd = ex * ex + ey * ey;
        if (dd < L * L) { x.globalAlpha = (1 - Math.sqrt(dd) / L) * .35; x.strokeStyle = q.h > .5 ? a : '#6c8cff'; x.beginPath(); x.moveTo(q.x, q.y); x.lineTo(s.x, s.y); x.stroke(); }
      }
      for (i = 0; i < N; i++) { var o = P[i]; x.globalAlpha = .9; x.fillStyle = o.h > .5 ? a : '#a9b8ff'; x.beginPath(); x.arc(o.x, o.y, o.r, 0, 6.283); x.fill(); }
      x.globalAlpha = 1;
    }
    raf = requestAnimationFrame(cuadro);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(hero);
  }

  /* ===== Aparición escalonada al hacer scroll ===== */
  function revelar(sinAnim) {
    var sel = '.seccion__cabeza, .aviso-instalar, .filtros, .tarjeta, .tienda-web, .comentario, .contacto > *, .contacto__links li, .legal section, main > .contenedor > section, main > .contenedor > h1, main > .contenedor > h2';
    var io = (!sinAnim && 'IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fx-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 }) : null;
    function marcar(scope) {
      var grupos = new Map();
      scope.querySelectorAll(sel).forEach(function (el) {
        if (el.classList.contains('fx-rev')) return;
        el.classList.add('fx-rev');
        var k = el.parentNode, n = grupos.get(k) || 0; grupos.set(k, n + 1); el.style.setProperty('--d', Math.min(n, 8));
        if (io) io.observe(el); else el.classList.add('fx-in');
      });
    }
    marcar(doc);
    // tarjetas y comentarios se dibujan después (script.js / Firestore): vigilar cambios
    new MutationObserver(function (ms) { ms.forEach(function (m) { if (m.addedNodes.length) marcar(m.target.parentNode || doc); }); })
      .observe(doc.getElementById('contenido') || doc.body, { childList: true, subtree: true });
    // seguridad: si algo quedó oculto (p. ej. al saltar con un ancla), mostrarlo
    setTimeout(function () { doc.querySelectorAll('.fx-rev:not(.fx-in)').forEach(function (el) { var b = el.getBoundingClientRect(); if (b.top < innerHeight && b.bottom > 0) el.classList.add('fx-in'); }); }, 1500);
  }

  /* ===== Contadores ===== */
  function contadores() {
    ['statApps', 'statSoft', 'statCombo'].forEach(function (id) {
      var el = doc.getElementById(id); if (!el) return;
      var fin = parseInt(el.textContent, 10) || 0; if (!fin || reducido) return;
      var t0 = null, dur = 1400;
      el.textContent = '0';
      setTimeout(function () {
        requestAnimationFrame(function paso(t) {
          if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
          el.textContent = Math.round(fin * e); if (k < 1) requestAnimationFrame(paso);
        });
      }, 1000);
    });
  }

  /* ===== Tarjetas 3D v2: ratón + dedo + giroscopio, todo agrupado en un solo rAF ===== */
  function tarjetas() {
    var SEL = '.tarjeta, .tienda-web';
    // mesh gradient detrás de las secciones con tarjetas
    ['aplicaciones', 'software', 'app-programa', 'tienda'].forEach(function (id, k) {
      var s = doc.getElementById(id); if (!s) return;
      var m = doc.createElement('div'); m.className = 'fx-mesh' + (k % 2 ? ' fx-mesh--b' : ''); m.setAttribute('aria-hidden', 'true');
      s.insertBefore(m, s.firstChild);
    });
    // cinta decorativa (nombre + versión) que se revela sobre la captura
    function cintas(scope) {
      scope.querySelectorAll('.tarjeta').forEach(function (t) {
        var cap = t.querySelector('.tarjeta__captura'); if (!cap || cap.querySelector('.fx-cinta')) return;
        var n = t.querySelector('.tarjeta__nombre'), v = t.querySelector('.version');
        var c = doc.createElement('span'); c.className = 'fx-cinta'; c.setAttribute('aria-hidden', 'true');
        var b = doc.createElement('b'); b.textContent = n ? n.textContent : ''; c.appendChild(b);
        var i = doc.createElement('i'); i.textContent = v ? v.textContent : ''; c.appendChild(i);
        cap.appendChild(c);
      });
    }
    cintas(doc);
    var cintaPend = 0;
    new MutationObserver(function (ms) {
      if (cintaPend || !ms.some(function (m) { return Array.prototype.some.call(m.addedNodes, function (n) { return n.nodeType === 1 && !n.classList.contains('fx-cinta') && !n.classList.contains('fx-onda'); }); })) return;
      cintaPend = requestAnimationFrame(function () { cintaPend = 0; cintas(doc); });
    }).observe(doc.getElementById('contenido') || doc.body, { childList: true, subtree: true });

    var estado = new Map(), pend = new Set(), rafId = 0;
    function st(t) { var s = estado.get(t); if (!s) { s = { x: .5, y: .5, on: 0, prox: 0, fuente: '' }; estado.set(t, s); } return s; }
    function pedir(t) { pend.add(t); if (!rafId) rafId = requestAnimationFrame(pintar); }
    function pintar() {
      rafId = 0;
      pend.forEach(function (t) {
        var s = st(t), big = t.classList.contains('tienda-web') ? .45 : 1;
        var px = (s.x - .5) * 2, py = (s.y - .5) * 2, k = s.on;
        var st_ = t.style;
        st_.setProperty('--rx', (-py * 6 * big * k).toFixed(2) + 'deg');
        st_.setProperty('--ry', (px * 8 * big * k).toFixed(2) + 'deg');
        st_.setProperty('--px', (px * k).toFixed(3)); st_.setProperty('--py', (py * k).toFixed(3));
        st_.setProperty('--mx', (s.x * 100).toFixed(1) + '%'); st_.setProperty('--my', (s.y * 100).toFixed(1) + '%');
        st_.setProperty('--ang', (Math.atan2(py, px) * 57.3 + 90).toFixed(1) + 'deg');
        st_.setProperty('--prox', s.prox.toFixed(2)); st_.setProperty('--on', k);
      });
      pend.clear();
    }
    function mover(t, cx, cy, fuente) {
      var b = t.getBoundingClientRect(), s = st(t);
      s.x = Math.min(1, Math.max(0, (cx - b.left) / b.width)); s.y = Math.min(1, Math.max(0, (cy - b.top) / b.height));
      var dx = Math.abs(s.x - .5) * 2, dy = Math.abs(s.y - .5) * 2;
      s.prox = 1 - Math.max(dx, dy) * .55; s.on = 1; s.fuente = fuente;
      t.classList.add('fx-tilt'); pedir(t);
    }
    function soltar(t) { var s = st(t); s.on = 0; s.prox = 0; s.x = s.y = .5; s.fuente = ''; t.classList.remove('fx-tilt', 'fx-activa'); pedir(t); }

    // Ratón
    var actual = null;
    doc.addEventListener('pointermove', function (e) {
      var g = e.target.closest && e.target.closest('.grid');
      if (g && e.pointerType === 'mouse') { var gb = g.getBoundingClientRect(); g.style.setProperty('--gx', (e.clientX - gb.left) + 'px'); g.style.setProperty('--gy', (e.clientY - gb.top) + 'px'); }
      var t = e.target.closest && e.target.closest(SEL);
      if (actual && actual !== t) { soltar(actual); actual = null; }
      if (!t || e.target.closest('.modal')) return;
      if (e.pointerType !== 'mouse' && !dedo) return;
      actual = t; mover(t, e.clientX, e.clientY, e.pointerType);
    }, { passive: true });
    doc.addEventListener('pointerleave', function () { if (actual) { soltar(actual); actual = null; } });

    // Dedo: inclina mientras el dedo está sobre la tarjeta (el scroll sigue funcionando)
    var dedo = false;
    doc.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      var t = e.target.closest && e.target.closest(SEL); if (!t) return;
      dedo = true; actual = t; t.classList.add('fx-activa'); mover(t, e.clientX, e.clientY, 'touch');
    }, { passive: true });
    function finDedo() { if (!dedo) return; dedo = false; var t = actual; actual = null; if (t) setTimeout(function () { soltar(t); }, 450); }
    doc.addEventListener('pointerup', finDedo, { passive: true });
    doc.addEventListener('pointercancel', finDedo, { passive: true });

    // Giroscopio suave en Android (sin pedir permisos: en iOS se omite)
    if (!finoPuntero && 'DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      var visibles = new Set(), base = null, ultimo = 0;
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) visibles.add(e.target); else visibles.delete(e.target); }); }, { threshold: .25 });
      function observar() { doc.querySelectorAll(SEL).forEach(function (t) { if (!t.__fxg) { t.__fxg = 1; io.observe(t); } }); }
      observar(); setTimeout(observar, 2000); setTimeout(observar, 6000);
      addEventListener('deviceorientation', function (e) {
        if (e.beta == null || doc.hidden) return;
        var ahora = performance.now(); if (ahora - ultimo < 50) return; ultimo = ahora; // máx. ~20 por segundo
        if (!base) base = { b: e.beta, g: e.gamma };
        base.b += (e.beta - base.b) * .02; base.g += (e.gamma - base.g) * .02; // se acomoda a cómo sostienes el celular
        var gx = Math.max(-1, Math.min(1, (e.gamma - base.g) / 25)), gy = Math.max(-1, Math.min(1, (e.beta - base.b) / 25));
        visibles.forEach(function (t) {
          var s = st(t); if (s.fuente === 'touch') return;
          s.x = .5 + gx * .5; s.y = .5 + gy * .5; s.on = .55; s.prox = .35 + Math.max(Math.abs(gx), Math.abs(gy)) * .5; s.fuente = 'gyro'; pedir(t);
        });
      }, { passive: true });
    }
  }

  /* ===== Botones magnéticos + onda al tocar ===== */
  function botones() {
    doc.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('.btn, .chip, .contacto__link'); if (!b) return;
      var r = b.getBoundingClientRect(), s = doc.createElement('span'); s.className = 'fx-onda';
      s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px';
      if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
      b.appendChild(s); setTimeout(function () { s.remove(); }, 700);
    });
    if (!finoPuntero) return;
    var actual = null;
    doc.addEventListener('pointermove', function (e) {
      var b = e.target.closest && e.target.closest('.btn');
      if (actual && actual !== b) { actual.style.setProperty('--bx', '0px'); actual.style.setProperty('--by', '0px'); actual = null; }
      if (!b || b.closest('.modal')) return; actual = b;
      var r = b.getBoundingClientRect();
      b.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * .25).toFixed(1) + 'px');
      b.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * .35).toFixed(1) + 'px');
    }, { passive: true });
  }

  /* ===== Parallax de la ilustración del hero ===== */
  function parallaxHero() {
    var arte = doc.querySelector('.hero__arte'); if (!arte) return;
    var img = arte.querySelector('img'); if (!img) return;
    var capa = doc.createElement('div'); capa.className = 'fx-capa'; arte.insertBefore(capa, img); capa.appendChild(img);
    var hero = doc.querySelector('.hero');
    hero.addEventListener('pointermove', function (e) {
      capa.style.setProperty('--px', ((e.clientX / innerWidth - .5) * -30).toFixed(1) + 'px');
      capa.style.setProperty('--py', ((e.clientY / innerHeight - .5) * -24).toFixed(1) + 'px');
    }, { passive: true });
  }

  /* ===== Cursor suave (solo con ratón) ===== */
  function cursor() {
    var a = doc.createElement('div'), p = doc.createElement('div');
    a.className = 'fx-cursor'; p.className = 'fx-cursor-punto'; a.setAttribute('aria-hidden', 'true'); p.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(a); doc.body.appendChild(p);
    var x = 0, y = 0, cx = 0, cy = 0, on = false;
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY; p.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      if (!on) { on = true; root.classList.add('fx-cursor-on'); cx = x; cy = y; }
      a.classList.toggle('fx-sobre', !!(e.target.closest && e.target.closest('a, button, .tarjeta, input, summary, [role="button"]')));
    }, { passive: true });
    doc.addEventListener('pointerleave', function () { on = false; root.classList.remove('fx-cursor-on'); });
    (function loop() { cx += (x - cx) * .18; cy += (y - cy) * .18; a.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)'; requestAnimationFrame(loop); })();
  }
})();
