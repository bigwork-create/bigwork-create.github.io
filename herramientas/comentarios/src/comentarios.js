/* Comentarios de Hubert Apps (sección "Comentarios" de la página principal).
   - Muestra los comentarios publicados en Firestore (los más recientes primero, de 20 en 20)
     junto con los que Hubert agrega a mano en data/comentarios.js.
   - Si Firestore no responde, se quedan los de data/comentarios.js (los pinta script.js).
   - El botón "Comentar" abre una ventana para escribir; se publica al instante (sin cuenta ni
     sesión) y Hubert borra los malos con su programa de escritorio
     "Moderar comentarios" (fuera de esta web).
   - Mientras la página siga abierta se recuerda la elección (Anónimo o apodo), el apodo y "Acepto
     las reglas", solo en una variable en memoria: al recargar la página se pregunta de nuevo.
   - Si la persona marca "No volver a preguntar" y publica, esa elección y la aceptación de las reglas
     se guardan en localStorage (solo en su navegador, nunca se envían). En las siguientes visitas la
     ventana muestra "Comentas como X · Cambiar"; "Cambiar" borra lo guardado.
   - El texto del comentario se borra al publicar.
   Se compila con esbuild (ver herramientas/comentarios/README.md); no editar assets/js a mano. */
import { collection, query, orderBy, limit, startAfter, getDocs, addDoc, serverTimestamp } from 'firebase/firestore/lite';
import { db } from './firebase-config.js';
import { el, fechaDe, fechaDia, fechaCompleta } from './comun.js';

const POR_PAGINA = 20;
const TIEMPO_MINIMO_MS = 3000;    // antispam: nadie escribe un comentario en menos de 3 s
const MAX_APODO = 30;
const MIN_TEXTO = 3;
const MAX_TEXTO = 500;

const lista = document.getElementById('listaComentarios');
const vacio = document.getElementById('vacioComentarios');
const botonComentar = document.getElementById('btnComentar');
const botonMas = document.getElementById('masComentarios');
const estado = document.getElementById('estadoComentarios');

/* ---------- Filtros antispam (las reglas de Firestore repiten lo esencial) ---------- */
const RE_ENLACE = /(https?:|:\/\/|www\s*\.|\b[a-z0-9-]{2,}\s*(\.|\[\.\]|\(punto\))\s*(com|net|org|pe|io|app|xyz|info|ly|me|co|gl|link|site|online|store|shop|ru|cn|tk|top|biz|es|mx|ar|cl|gg|tv|to)\b)/i;
const RE_CORREO = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
const RE_CELULAR = /(^|\D)9\d{2}[\s.-]?\d{3}[\s.-]?\d{3}(\D|$)/;
const GROSERIAS = [
  'conchatumadre', 'conchadetumadre', 'concha de tu madre', 'conchasumadre', 'ctm', 'csm', 'ptm', 'ptmr', 'hdp', 'hijo de puta', 'hijodeputa',
  'mierda', 'mrd', 'puta', 'puto', 'putas', 'putos', 'cojudo', 'cojuda', 'cojudos', 'idiota', 'idiotas', 'imbecil', 'imbeciles',
  'estupido', 'estupida', 'maricon', 'maricones', 'pendejo', 'pendeja', 'carajo', 'verga', 'pinga', 'chucha', 'malparido',
  'gonorrea', 'perra', 'culero', 'mongol', 'retrasado', 'subnormal', 'tarado', 'basura humana'
];
function normalizar(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[@4]/g, 'a').replace(/3/g, 'e').replace(/[1!]/g, 'i').replace(/0/g, 'o').replace(/\$/g, 's')
    .replace(/(.)\1{2,}/g, '$1$1');
}
const RE_GROSERIAS = new RegExp('(^|[^a-z])(' + GROSERIAS.map(function (g) { return g.replace(/ /g, '\\s+'); }).join('|') + ')(?=$|[^a-z])');
function problemaDeContenido(t) {
  if (RE_ENLACE.test(t)) return 'No se permiten enlaces ni direcciones web.';
  if (RE_CORREO.test(t)) return 'No pongas correos electrónicos: los comentarios son públicos.';
  if (RE_CELULAR.test(t)) return 'No pongas números de celular: los comentarios son públicos.';
  if (RE_GROSERIAS.test(normalizar(t))) return 'Tu texto tiene palabras no permitidas. Por favor, escríbelo de otra forma.';
  return '';
}

/* ---------- Datos: Firestore + data/comentarios.js ---------- */
function fechaEstatica(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 17)); // mediodía en Lima
  return isNaN(d.getTime()) ? null : d;
}
const estaticos = (Array.isArray(window.COMENTARIOS) ? window.COMENTARIOS : [])
  .filter(function (c) { return c && String(c.texto || '').trim(); })
  .map(function (c) { return { nombre: c.nombre, texto: c.texto, fecha: fechaEstatica(c.fecha), soloDia: true }; });

let remotos = [];     // comentarios leídos de Firestore
let propios = [];     // publicados desde este navegador en esta visita
let ultimoDoc = null; // para "Ver más"
let agotado = false;  // ya no hay más en Firestore
let fallo = false;    // Firestore no respondió

function tarjeta(c) {
  const d = c.fecha;
  const nombre = String(c.nombre || '').trim() || 'Anónimo';
  return el('article', { clase: 'comentario' }, [
    el('div', { clase: 'comentario__cabeza' }, [
      el('strong', { clase: 'comentario__nombre' + (nombre === 'Anónimo' ? ' comentario__nombre--anonimo' : ''), texto: nombre }),
      d ? el('time', { clase: 'comentario__fecha', datetime: d.toISOString(), title: c.soloDia ? null : fechaCompleta(d), texto: fechaDia(d) }) : null
    ]),
    el('p', { clase: 'comentario__texto', texto: String(c.texto).trim() })
  ]);
}

function pintar() {
  // Los de data/comentarios.js se intercalan por fecha; mientras queden páginas en Firestore,
  // solo se muestran los que son más nuevos que el último comentario cargado.
  let corte = null;
  if (!agotado && !fallo && remotos.length) corte = remotos[remotos.length - 1].fecha;
  const fijos = estaticos.filter(function (e) {
    if (fallo || agotado) return true;
    return corte && e.fecha && e.fecha >= corte;
  });
  const idsPropios = new Set(propios.map(function (p) { return p.id; }));
  const todos = propios.concat(remotos.filter(function (r) { return !idsPropios.has(r.id); }), fijos);
  todos.sort(function (a, b) { return (b.fecha ? b.fecha.getTime() : 0) - (a.fecha ? a.fecha.getTime() : 0); });
  lista.textContent = '';
  todos.forEach(function (c) { lista.appendChild(tarjeta(c)); });
  lista.hidden = todos.length === 0;
  vacio.hidden = todos.length > 0;
  botonMas.hidden = agotado || fallo;
}

async function cargarPagina() {
  botonMas.disabled = true;
  try {
    const partes = [collection(db, 'comentarios'), orderBy('creado', 'desc')];
    if (ultimoDoc) partes.push(startAfter(ultimoDoc));
    partes.push(limit(POR_PAGINA));
    const snap = await getDocs(query.apply(null, partes));
    snap.docs.forEach(function (d) {
      const x = d.data();
      remotos.push({ id: d.id, nombre: x.nombre, texto: x.texto, fecha: fechaDe(x.creado) });
    });
    if (snap.docs.length) ultimoDoc = snap.docs[snap.docs.length - 1];
    agotado = snap.docs.length < POR_PAGINA;
    fallo = false;
    estado.textContent = '';
  } catch (err) {
    if (!remotos.length) {
      fallo = true;
      botonComentar.hidden = true;
      estado.textContent = 'No se pudieron cargar los comentarios más recientes. Revisa tu conexión.';
    } else {
      estado.textContent = 'No se pudieron cargar más comentarios. Inténtalo de nuevo.';
    }
    if (window.console) console.warn('Comentarios:', err);
  } finally {
    botonMas.disabled = false;
    pintar();
  }
}

/* ---------- Ventana "Escribir un comentario" ---------- */
const dialogo = el('dialog', { clase: 'modal modal--comentar', id: 'modalComentar', 'aria-labelledby': 'tituloComentar' });
const modoAnon = el('input', { type: 'radio', name: 'modoComentario', value: 'anonimo', id: 'modoAnon' });
const modoApodo = el('input', { type: 'radio', name: 'modoComentario', value: 'apodo', id: 'modoApodo' });
const apodo = el('input', { type: 'text', id: 'apodoComentario', maxlength: String(MAX_APODO), autocomplete: 'off', spellcheck: 'false', placeholder: 'Tu apodo', 'aria-describedby': 'avisoApodo' });
const apodoCaja = el('div', { clase: 'form-comentar__apodo', hidden: true }, [
  el('label', { for: 'apodoComentario', texto: 'Apodo (máximo ' + MAX_APODO + ' caracteres)' }),
  apodo,
  el('p', { clase: 'form-comentar__aviso', id: 'avisoApodo', texto: 'Si quieres seguir siendo anónimo, no pongas tu nombre real. Tu apodo será público.' })
]);
const texto = el('textarea', { id: 'textoComentario', rows: '5', maxlength: String(MAX_TEXTO), 'aria-describedby': 'cuentaComentario' });
const cuenta = el('span', { clase: 'form-comentar__cuenta', id: 'cuentaComentario', texto: '0 / ' + MAX_TEXTO });
const trampa = el('input', { type: 'text', name: 'sitio_web', id: 'sitioWeb', tabindex: '-1', autocomplete: 'off' });
const acepto = el('input', { type: 'checkbox', id: 'aceptoReglas' });
const noPreguntar = el('input', { type: 'checkbox', id: 'noPreguntar', 'aria-describedby': 'notaNoPreguntar' });
const nombreResumen = el('strong', { clase: 'form-comentar__quien' });
const cambiar = el('button', { type: 'button', clase: 'form-comentar__cambiar', texto: 'Cambiar' });
const resumen = el('p', { clase: 'form-comentar__resumen', hidden: true }, ['Comentas como ', nombreResumen, ' · ', cambiar]);
const estadoForm = el('p', { clase: 'form-comentar__estado', role: 'alert', 'aria-live': 'assertive' });
const enviar = el('button', { type: 'submit', clase: 'btn btn--primario', texto: 'Publicar comentario' });
const cancelar = el('button', { type: 'button', clase: 'btn btn--secundario', value: 'cancelar', texto: 'Cancelar' });
const cerrarX = el('button', { type: 'button', clase: 'btn-icono', 'aria-label': 'Cerrar' });
cerrarX.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

const form = el('form', { clase: 'form-comentar', novalidate: true }, [
  resumen,
  el('fieldset', { clase: 'form-comentar__modo', id: 'bloqueModo' }, [
    el('legend', { texto: '¿Cómo quieres aparecer?' }),
    el('label', { clase: 'form-comentar__opcion', for: 'modoAnon' }, [modoAnon, ' Comentar como Anónimo']),
    el('label', { clase: 'form-comentar__opcion', for: 'modoApodo' }, [modoApodo, ' Usar un apodo']),
    apodoCaja
  ]),
  el('div', { clase: 'form-comentar__campo' }, [el('label', { for: 'textoComentario', texto: 'Tu comentario' }), texto, cuenta]),
  el('div', { clase: 'form-comentar__trampa', 'aria-hidden': 'true' }, [el('label', { for: 'sitioWeb', texto: 'Deja este campo vacío' }), trampa]),
  el('div', { clase: 'form-comentar__reglas', id: 'bloqueReglas' }, [
    acepto,
    el('label', { for: 'aceptoReglas' }, ['Acepto las ', el('a', { href: 'terminos.html#comentarios', target: '_blank', rel: 'noopener', texto: 'reglas de comentarios' })])
  ]),
  el('div', { clase: 'form-comentar__reglas form-comentar__nopreguntar', id: 'bloqueNoPreguntar' }, [
    noPreguntar,
    el('label', { for: 'noPreguntar' }, ['No volver a preguntar ', el('small', { id: 'notaNoPreguntar', texto: '(se guarda solo en este navegador)' })])
  ]),
  el('p', { clase: 'form-comentar__nota', texto: 'Tu comentario se publica al instante y lo puede leer cualquiera. No incluyas datos personales tuyos ni de otras personas.' }),
  estadoForm,
  el('div', { clase: 'form-comentar__acciones' }, [enviar, cancelar])
]);
dialogo.appendChild(el('div', { clase: 'modal__caja' }, [
  el('div', { clase: 'modal__cabeza' }, [el('h3', { id: 'tituloComentar', texto: 'Escribir un comentario' }), cerrarX]),
  form
]));
document.body.appendChild(dialogo);
const bloqueModo = form.querySelector('#bloqueModo');
const bloqueReglas = form.querySelector('#bloqueReglas');
const bloqueNoPreguntar = form.querySelector('#bloqueNoPreguntar');

/* ---------- Preferencia guardada ("No volver a preguntar"): solo en este navegador ---------- */
const CLAVE_PREF = 'comentarios:preferencia';
function leerPreferencia() {
  try {
    const p = JSON.parse(window.localStorage.getItem(CLAVE_PREF) || 'null');
    if (!p || p.acepto !== true) return null;
    if (p.modo === 'anonimo') return { modo: 'anonimo', apodo: '' };
    if (p.modo === 'apodo' && typeof p.apodo === 'string') {
      const a = p.apodo.trim().replace(/\s+/g, ' ');
      if (a && a.length <= MAX_APODO && !problemaDeContenido(a)) return { modo: 'apodo', apodo: a };
    }
  } catch (err) { /* sin acceso a localStorage o dato dañado */ }
  return null;
}
function guardarPreferencia(modo, valorApodo) {
  try {
    window.localStorage.setItem(CLAVE_PREF, JSON.stringify({ modo: modo, apodo: modo === 'apodo' ? valorApodo : '', acepto: true }));
    return true;
  } catch (err) { return false; }
}
function borrarPreferencia() {
  try { window.localStorage.removeItem(CLAVE_PREF); } catch (err) { /* nada */ }
}
let hayAlmacen = false;
try { const k = CLAVE_PREF + ':prueba'; window.localStorage.setItem(k, '1'); window.localStorage.removeItem(k); hayAlmacen = true; } catch (err) { hayAlmacen = false; }
if (!hayAlmacen) bloqueNoPreguntar.hidden = true;
let preferencia = leerPreferencia();

let abiertoEn = 0;
/* Elección recordada solo en memoria (se pierde al recargar o cerrar la página). */
const recordado = { modo: '', apodo: '', acepto: false, noPreguntar: false };
function recordar() {
  if (preferencia) return; // con preferencia guardada, la memoria no cambia
  recordado.modo = modoApodo.checked ? 'apodo' : (modoAnon.checked ? 'anonimo' : '');
  recordado.apodo = apodo.value;
  recordado.acepto = acepto.checked;
  recordado.noPreguntar = noPreguntar.checked;
}
function mostrarCampos(si) {
  bloqueModo.hidden = !si;
  bloqueReglas.hidden = !si;
  bloqueNoPreguntar.hidden = !si || !hayAlmacen;
  resumen.hidden = si;
}
function restaurar() {
  const r = preferencia ? { modo: preferencia.modo, apodo: preferencia.apodo, acepto: true, noPreguntar: true } : recordado;
  modoAnon.checked = r.modo === 'anonimo';
  modoApodo.checked = r.modo === 'apodo';
  apodo.value = r.apodo;
  acepto.checked = r.acepto;
  noPreguntar.checked = r.noPreguntar && hayAlmacen;
  apodoCaja.hidden = !modoApodo.checked;
  nombreResumen.textContent = preferencia ? (preferencia.modo === 'apodo' ? preferencia.apodo : 'Anónimo') : '';
  mostrarCampos(!preferencia);
}
cambiar.addEventListener('click', function () {
  // Borra lo guardado y vuelve a mostrar los campos con los valores actuales para poder cambiarlos.
  borrarPreferencia();
  recordado.modo = modoApodo.checked ? 'apodo' : 'anonimo';
  recordado.apodo = apodo.value;
  recordado.acepto = acepto.checked;
  recordado.noPreguntar = false;
  preferencia = null;
  noPreguntar.checked = false;
  mostrarCampos(true);
  (modoApodo.checked ? apodo : modoAnon).focus();
});
/* Deja la ventana como nueva (sin elección, apodo ni texto); luego abrir() repone la elección recordada. */
function limpiar() {
  form.reset();
  modoAnon.checked = false;
  modoApodo.checked = false;
  apodo.value = '';
  texto.value = '';
  trampa.value = '';
  acepto.checked = false;
  apodoCaja.hidden = true;
  cuenta.textContent = '0 / ' + MAX_TEXTO;
  estadoForm.textContent = '';
}
function actualizarModo() {
  apodoCaja.hidden = !modoApodo.checked;
  if (modoApodo.checked) apodo.focus();
}
modoAnon.addEventListener('change', function () { actualizarModo(); recordar(); });
modoApodo.addEventListener('change', function () { actualizarModo(); recordar(); });
apodo.addEventListener('input', recordar);
acepto.addEventListener('change', recordar);
noPreguntar.addEventListener('change', recordar);
texto.addEventListener('input', function () { cuenta.textContent = texto.value.length + ' / ' + MAX_TEXTO; });

function abrir() {
  limpiar();
  restaurar();
  abiertoEn = Date.now();
  if (typeof dialogo.showModal === 'function') dialogo.showModal(); else dialogo.setAttribute('open', '');
  if (preferencia || modoAnon.checked) texto.focus();
  else if (modoApodo.checked) apodo.focus();
  else modoAnon.focus();
}
function cerrar() {
  recordar();
  if (dialogo.open && typeof dialogo.close === 'function') dialogo.close(); else dialogo.removeAttribute('open');
  limpiar();
  botonComentar.focus();
}
botonComentar.addEventListener('click', abrir);
cancelar.addEventListener('click', cerrar);
cerrarX.addEventListener('click', cerrar);
dialogo.addEventListener('click', function (e) { if (e.target === dialogo) cerrar(); });
dialogo.addEventListener('cancel', function (e) { e.preventDefault(); cerrar(); });

function error(msg, foco) {
  estadoForm.textContent = msg;
  if (foco) foco.focus();
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  estadoForm.textContent = '';
  if (!modoAnon.checked && !modoApodo.checked) return error('Elige cómo quieres aparecer: "Comentar como Anónimo" o "Usar un apodo".', modoAnon);
  const usaApodo = modoApodo.checked;
  const nombre = usaApodo ? apodo.value.trim().replace(/\s+/g, ' ') : 'Anónimo';
  const t = texto.value.trim();

  if (usaApodo && !nombre) return error('Escribe tu apodo o elige "Comentar como Anónimo".', apodo);
  if (usaApodo && nombre.length > MAX_APODO) return error('El apodo puede tener hasta ' + MAX_APODO + ' caracteres.', apodo);
  if (usaApodo) { const p = problemaDeContenido(nombre); if (p) return error('Apodo no válido. ' + p, apodo); }
  if (t.length < MIN_TEXTO) return error('Escribe un comentario de al menos ' + MIN_TEXTO + ' caracteres.', texto);
  if (t.length > MAX_TEXTO) return error('El comentario puede tener hasta ' + MAX_TEXTO + ' caracteres.', texto);
  const p = problemaDeContenido(t);
  if (p) return error(p, texto);
  if (!acepto.checked) return error('Para publicar, marca "Acepto las reglas de comentarios".', acepto);
  if (Date.now() - abiertoEn < TIEMPO_MINIMO_MS) return error('Espera unos segundos y vuelve a intentarlo.');

  if (trampa.value) { // robot: fingimos que salió bien y no guardamos nada
    cerrar();
    estado.textContent = '¡Gracias! Tu comentario fue publicado.';
    return;
  }

  enviar.disabled = true;
  enviar.textContent = 'Publicando…';
  try {
    const nuevo = await addDoc(collection(db, 'comentarios'), { nombre: nombre, texto: t, creado: serverTimestamp() });
    propios.unshift({ id: nuevo.id, nombre: nombre, texto: t, fecha: new Date() });
    if (!preferencia && noPreguntar.checked && hayAlmacen) {
      recordar();
      if (guardarPreferencia(usaApodo ? 'apodo' : 'anonimo', nombre)) preferencia = leerPreferencia();
    }
    pintar();
    cerrar();
    estado.textContent = '¡Gracias! Tu comentario ya está publicado.';
  } catch (err) {
    const codigo = err && err.code ? String(err.code) : '';
    if (codigo.indexOf('permission-denied') !== -1) {
      error('No se pudo publicar. Revisa que el texto no tenga enlaces y tenga entre ' + MIN_TEXTO + ' y ' + MAX_TEXTO + ' caracteres.');
    } else {
      error('No se pudo publicar. Revisa tu conexión e inténtalo de nuevo.');
    }
    if (window.console) console.warn('Comentarios:', err);
  } finally {
    enviar.disabled = false;
    enviar.textContent = 'Publicar comentario';
  }
});

botonMas.addEventListener('click', cargarPagina);
botonComentar.hidden = false;
cargarPagina();
