# Hubert Apps — página web

Página estática (HTML + CSS + JavaScript, sin librerías ni servicios externos) con el catálogo
de apps Android y software para Windows de Hubert Apps.

- **Sitio oficial:** <https://hubert-app-001.web.app> (Firebase Hosting).
- `https://bigwork-create.github.io` (GitHub Pages) solo **redirige** al sitio oficial.
  Este repositorio guarda el código completo de la web y las Releases con los APK.

## Estructura

```
├── index.html        → página principal (inicio, apps, software, contacto)
├── privacidad.html   → política de privacidad
├── terminos.html     → términos de uso
├── licencias.html    → licencias de terceros y cómo verificar descargas
├── 404.html          → página "no encontrada" (usa rutas absolutas /…)
├── styles.css        → diseño y colores
├── tema.js           → aplica el tema claro/oscuro guardado (se carga en <head>)
├── script.js         → lógica (tarjetas, búsqueda, filtros, tema, menú, video)
├── data/apps.js      → ★ EL CATÁLOGO: aquí agregas tus apps y programas
├── robots.txt, sitemap.xml
├── firebase.json     → configuración de Firebase Hosting (cabeceras de seguridad y caché)
├── herramientas/redirecciones.py → genera las páginas de redirección para GitHub Pages
├── .github/workflows/pages.yml   → publica esas redirecciones en GitHub Pages
├── LICENSE           → licencia MIT del código de la web
└── assets/           → logo, favicon, hero, og-image.png, icons/, screens/, videos/
```

## 1. Textos y contacto

Abre `index.html` y busca los comentarios `<!-- EDITA AQUÍ -->`. El correo de contacto
(`bigwork4002@gmail.com`) aparece en la sección Contacto, en el pie de cada página y en las
páginas legales. El botón de GitHub está oculto (atributo `hidden`).

## 2. Agregar o editar una app

Abre `data/apps.js`. Hay dos listas: `aplicaciones` (Android) y `software`
(Windows). Cada elemento tiene esta forma:

```js
{
  id: "mi-app",                       // único, sin espacios
  nombre: "Mi App",
  descripcion: "Qué hace, en una o dos líneas.",
  categoria: "Utilidades",            // crea el filtro automáticamente
  version: "1.0.0",
  plataformas: ["Android"],           // o ["Windows"]
  icono: "assets/icons/mi-app.png",
  capturas: ["assets/screens/mi-app-1.png"],   // o [] si aún no tienes
  video: { tipo: "youtube", valor: "ID_DEL_VIDEO" },  // o null
  descarga: "https://github.com/TU_USUARIO/mi-app/releases/download/v1.0.0/mi-app.apk",
  textoBoton: "Descargar APK",        // opcional
  tecnologias: ["Kotlin", "Room"],    // opcional
  requisitos: "Android 8.0 o superior", // opcional, se muestra como "Requiere: …"
  tamano: "10.6 MB",                  // opcional, aparece junto a la versión
  sha256: "6bc707…",                  // opcional, huella del archivo (desplegable)
  virustotal: null,                   // opcional: enlace al análisis en VirusTotal
  permisos: [                         // opcional: lista desplegable de permisos, o null
    "Cámara: para escanear códigos QR."
  ],
  ejemplo: false,                     // true = se marca como "Ejemplo"
  proximamente: false                 // true = tarjeta "Próximamente"
}
```

- Las apps publicadas son Mebusco, Modo Noche (antes MineB), Asiste QR (antes PuenteApp Asistencia), Lector Doc y Linterna. Usa `ejemplo: true` solo para tarjetas de muestra.
- **VirusTotal:** si `virustotal` tiene un enlace (ej. `"https://www.virustotal.com/gui/file/SHA256_DEL_APK"`), aparece
  "Ver análisis en VirusTotal" debajo del botón de descarga. Con `null` no se muestra nada. Pon el enlace solo
  después de subir el archivo a VirusTotal y comprobar que el análisis existe.
- **Permisos:** escribe un texto por permiso explicando para qué se usa. Con `null` o `[]` no se muestra la lista.
- **SHA-256:** en Linux lo obtienes con `sha256sum archivo.apk`.
- Las capturas verticales (de teléfono) se muestran completas, sin recortar.
- Si `descarga` es `"#"`, el botón aparece desactivado.
- Si pones varias capturas, la primera se ve en la tarjeta y todas aparecen en la galería desplegable **"Capturas de pantalla"**. Conviene usar `.webp` de unos 540 px de ancho para que la página cargue rápido.
- **Video mp4 vertical:** añade `poster: "assets/videos/portada.webp"` (imagen que se ve antes de reproducir) y `vertical: true` para que la ventana del video sea alta, como en Lector Doc.
- **Video:** usa `{ tipo: "youtube", valor: "abc123XYZ" }` (el ID es lo que va después de `v=` en el enlace de YouTube; puede ser un video "no listado") o `{ tipo: "mp4", valor: "assets/videos/demo.mp4" }` para un clip corto (ideal menos de 10 MB). Si usas YouTube, agrega `https://www.youtube-nocookie.com` a `frame-src` en la política de seguridad de `firebase.json` y menciónalo en `privacidad.html`.
- Cuida las comas: cada `{ ... }` va separado por una coma.

## 3. Probar en tu PC

```bash
cd hubert-web
python3 -m http.server 8000
# abre http://localhost:8000 en el navegador
```

## 4. Publicar

**Sitio oficial (Firebase Hosting):** desde la carpeta `hubert-web` en Zorin:

```bash
firebase deploy --only hosting
```

**GitHub Pages:** al hacer `git push` a `main`, el flujo `.github/workflows/pages.yml` genera con
`herramientas/redirecciones.py` páginas mínimas que redirigen cada dirección de
`bigwork-create.github.io` a la misma ruta en `hubert-app-001.web.app`. No hace falta tocar nada más.
(En *Settings → Pages* la fuente es **GitHub Actions**.)

## 5. Subir los APK (Releases)

Los APK están publicados como Releases de este mismo repositorio, una por versión:
`mebusco-v2.0.1`, `modonoche-v1.1.1`, `asisteqr-v1.1.0` (antes `puenteapp-v1.0.1`), `lectordoc-v1.0.1` y `linterna-v1.0.1`
(las anteriores siguen disponibles y dicen que fueron reemplazadas). El programa de Windows se publica en
[registro-asistencia-desktop](https://github.com/bigwork-create/registro-asistencia-desktop/releases)
como `RegistroAsistencia-<versión>-windows.zip`.

1. En el repositorio ve a **Releases → Draft a new release**.
2. Pon una etiqueta nueva (ej. `mebusco-v2.0.2`), arrastra el `.apk` y publica.
3. Copia el enlace del archivo y pégalo en el campo `descarga` de `data/apps.js`:
   `https://github.com/bigwork-create/bigwork-create.github.io/releases/download/ETIQUETA/Archivo.apk`
4. Actualiza también `version`, `tamano` y `sha256`.

Todas las apps se firman con la misma clave. Huella SHA-256 del certificado (también en `licencias.html`):
`9C:E4:B5:17:69:60:AA:F2:85:97:D7:11:15:53:AC:2D:DE:62:94:65:C5:05:A7:40:35:DF:AB:F2:92:D9:EB:49`

## Privacidad y seguridad

La web **no usa cookies ni estadísticas** (Google Analytics se quitó). Solo guarda la preferencia
de tema (`tema`) en el navegador. `firebase.json` envía cabeceras de seguridad, entre ellas una
política de contenido (CSP) que solo permite archivos de este mismo sitio: no uses scripts ni
estilos en línea (`<script>…</script>`, `style="…"`). Si agregas un servicio externo (YouTube,
formularios, estadísticas), actualiza la CSP de `firebase.json` y `privacidad.html` con su fecha.

## Tema claro/oscuro

El botón de sol/luna de la cabecera cambia el tema y lo recuerda en el navegador.
Para cambiar el color de acento edita `--acento` al inicio de `styles.css`.

## Licencia

El código de esta web usa la licencia MIT (archivo `LICENSE`). Los iconos, las capturas y el
nombre "Hubert Apps" no se incluyen en esa licencia.
