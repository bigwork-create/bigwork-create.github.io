/* Administración de comentarios (solo Hubert).
   Entra con la cuenta de Google bigwork4002@gmail.com; las reglas de Firestore solo dejan
   borrar a esa cuenta, así que esta página no le sirve a nadie más. */
import { collection, doc, query, orderBy, limit, startAfter, getDocs, deleteDoc } from 'firebase/firestore/lite';
import {
  initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserPopupRedirectResolver,
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, connectAuthEmulator
} from 'firebase/auth';
import { app, db, usarEmulador, EMULADOR_AUTH, CORREO_ADMIN } from './firebase-config.js';
import { el, fechaDe, fechaCompleta } from './comun.js';

const POR_PAGINA = 25;
const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});
if (usarEmulador) connectAuthEmulator(auth, EMULADOR_AUTH, { disableWarnings: true });

const $ = function (id) { return document.getElementById(id); };
const entrar = $('adminEntrar');
const salir = $('adminSalir');
const sesion = $('adminSesion');
const estado = $('adminEstado');
const panel = $('adminPanel');
const lista = $('adminLista');
const mas = $('adminMas');
const vacio = $('adminVacio');

function avisar(msg, tipo) {
  estado.textContent = msg;
  estado.className = 'admin__estado' + (tipo ? ' admin__estado--' + tipo : '');
}

let ultimo = null;
let cargando = false;

function fila(d) {
  const c = d.data();
  const f = fechaDe(c.creado);
  const borrar = el('button', { type: 'button', clase: 'btn btn--secundario admin__borrar', texto: 'Borrar' });
  const li = el('li', { clase: 'admin__item' }, [
    el('div', { clase: 'admin__meta' }, [
      el('strong', { texto: c.nombre || 'Anónimo' }),
      el('span', { texto: ' · ' }),
      el('time', { datetime: f ? f.toISOString() : null, texto: fechaCompleta(f) })
    ]),
    el('p', { clase: 'admin__texto', texto: c.texto }),
    el('div', { clase: 'admin__pie' }, [borrar])
  ]);
  borrar.addEventListener('click', async function () {
    const resumen = (c.texto || '').slice(0, 80);
    if (!window.confirm('¿Borrar este comentario de ' + (c.nombre || 'Anónimo') + '?\n\n"' + resumen + '"\n\nNo se puede deshacer.')) return;
    borrar.disabled = true;
    try {
      await deleteDoc(doc(db, 'comentarios', d.id));
      li.remove();
      vacio.hidden = lista.children.length > 0;
      avisar('Comentario borrado.', 'ok');
    } catch (err) {
      borrar.disabled = false;
      avisar(err && String(err.code).indexOf('permission-denied') !== -1
        ? 'No tienes permiso para borrar. Entra con ' + CORREO_ADMIN + '.'
        : 'No se pudo borrar. Revisa tu conexión.', 'error');
    }
  });
  return li;
}

async function cargar(reiniciar) {
  if (cargando) return;
  cargando = true;
  mas.disabled = true;
  if (reiniciar) { lista.textContent = ''; ultimo = null; }
  try {
    const partes = [collection(db, 'comentarios'), orderBy('creado', 'desc')];
    if (ultimo) partes.push(startAfter(ultimo));
    partes.push(limit(POR_PAGINA));
    const snap = await getDocs(query.apply(null, partes));
    snap.docs.forEach(function (d) { lista.appendChild(fila(d)); });
    if (snap.docs.length) ultimo = snap.docs[snap.docs.length - 1];
    mas.hidden = snap.docs.length < POR_PAGINA;
    vacio.hidden = lista.children.length > 0;
  } catch (err) {
    avisar('No se pudieron cargar los comentarios. Revisa tu conexión.', 'error');
    if (window.console) console.warn(err);
  } finally {
    cargando = false;
    mas.disabled = false;
  }
}

entrar.addEventListener('click', async function () {
  avisar('');
  try {
    const proveedor = new GoogleAuthProvider();
    proveedor.setCustomParameters({ prompt: 'select_account', login_hint: CORREO_ADMIN });
    await signInWithPopup(auth, proveedor);
  } catch (err) {
    const c = err && err.code ? String(err.code) : '';
    if (c.indexOf('popup-closed') !== -1 || c.indexOf('cancelled-popup') !== -1) return;
    if (c.indexOf('popup-blocked') !== -1) return avisar('El navegador bloqueó la ventana de Google. Permite las ventanas emergentes para esta página.', 'error');
    if (c.indexOf('unauthorized-domain') !== -1) return avisar('Este dominio no está autorizado en Firebase Authentication.', 'error');
    if (c.indexOf('operation-not-allowed') !== -1 || c.indexOf('configuration-not-found') !== -1) return avisar('El acceso con Google no está activado en Firebase Authentication.', 'error');
    avisar('No se pudo entrar con Google (' + (c || 'error') + ').', 'error');
  }
});
salir.addEventListener('click', function () { signOut(auth); });
mas.addEventListener('click', function () { cargar(false); });

onAuthStateChanged(auth, function (u) {
  const esAdmin = !!(u && !u.isAnonymous && u.email === CORREO_ADMIN && u.emailVerified);
  entrar.hidden = !!u;
  salir.hidden = !u;
  sesion.textContent = u ? 'Sesión: ' + (u.email || 'anónima') : '';
  panel.hidden = !esAdmin;
  if (u && !esAdmin) avisar('Esta cuenta no tiene permiso para administrar comentarios. Entra con ' + CORREO_ADMIN + '.', 'error');
  else if (!u) avisar('');
  if (esAdmin) { avisar(''); cargar(true); }
});
