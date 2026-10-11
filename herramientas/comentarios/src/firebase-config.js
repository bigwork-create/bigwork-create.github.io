/* Configuración pública del proyecto de Firebase "hubert-app-001".
   Estas claves NO son secretas: identifican el proyecto. La seguridad la dan las reglas de
   Firestore (firestore.rules en la raíz de la web). */
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore/lite';

export const configFirebase = {
  apiKey: 'AIzaSyCUEKEimBQRCznM8Vgw8jeGgkgZdhcaFB0',
  authDomain: 'hubert-app-001.firebaseapp.com',
  projectId: 'hubert-app-001',
  appId: '1:645938730565:web:c77e9afd5029738a52f52c'
};

/* Al abrir la web desde tu propia PC (localhost / 127.0.0.1) se usan los emuladores de Firebase,
   así las pruebas nunca tocan los comentarios reales. */
export const usarEmulador = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

export const app = initializeApp(usarEmulador ? Object.assign({}, configFirebase, { projectId: 'demo-hubert' }) : configFirebase);
export const db = getFirestore(app);
if (usarEmulador) connectFirestoreEmulator(db, '127.0.0.1', 8080);
