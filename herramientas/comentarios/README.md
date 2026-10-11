# Comentarios de Hubert Apps

Código fuente de los scripts de la sección "Comentarios". La web (CSP `script-src 'self'`) no
carga nada desde CDN: el Firebase JS SDK se empaqueta con esbuild en archivos locales de `assets/js/`.

- `src/comentarios.js`: lista (Firestore + `data/comentarios.js`), "Ver más" y la ventana "Comentar".
- `src/admin-comentarios.js`: página privada `admin-comentarios.html` (entrar con Google y borrar).
- `src/firebase-config.js`: configuración pública del proyecto; en `localhost` usa los emuladores.
- Reglas: `firestore.rules`; índices: `firestore.indexes.json` (en la raíz de la web).

## Compilar (después de cambiar algo en `src/`)

```bash
cd herramientas/comentarios
npm install
npm run build      # borra y regenera ../../assets/js
```

## Probar en tu PC sin tocar los comentarios reales

```bash
# en la raíz de la web (requiere Java 21)
firebase emulators:start --only firestore,auth --project demo-hubert
```

Abre la web desde `http://127.0.0.1:...` con un servidor local: los scripts se conectan solos a los
emuladores. La CSP de `firebase.json` no incluye los puertos del emulador, así que con el emulador
de hosting hay que agregarlos temporalmente a `connect-src`.

## Publicar

```bash
firebase deploy --only firestore:rules,firestore:indexes,hosting
```
