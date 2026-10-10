# Hubert Apps — página web

Página estática (HTML + CSS + JavaScript, sin instalar nada) para mostrar tus
aplicaciones Android y tu software de escritorio. Funciona abriendo
`index.html` con doble clic y también en GitHub Pages.

## Estructura

```
hubert-web/
├── index.html        → estructura de la página (textos del inicio y contacto)
├── styles.css        → diseño y colores
├── script.js         → lógica (tarjetas, búsqueda, filtros, tema, video)
├── data/apps.js      → ★ EL CATÁLOGO: aquí agregas tus apps y programas
└── assets/
    ├── logo.svg, favicon.svg, hero.svg
    ├── icons/        → iconos de cada app
    ├── screens/      → capturas de pantalla
    └── videos/       → videos .mp4 cortos (opcional)
```

## 1. Cambiar tu nombre, lema y contacto

Abre `index.html` y busca los comentarios `<!-- EDITA AQUÍ -->`:

- **Nombre / marca:** cambia `Hubert Apps` (aparece en la cabecera, el título y el pie).
- **Título y lema** del inicio.
- **Contacto:** reemplaza los `href="#"` por tus enlaces reales, por ejemplo
  `https://github.com/TU_USUARIO` y `mailto:tucorreo@ejemplo.com`, y borra el texto
  `(editar enlace)`.

## 2. Agregar o editar una app

Abre `data/apps.js`. Hay dos listas: `aplicaciones` (Android) y `software`
(Windows/Linux). Cada elemento tiene esta forma:

```js
{
  id: "mi-app",                       // único, sin espacios
  nombre: "Mi App",
  descripcion: "Qué hace, en una o dos líneas.",
  categoria: "Utilidades",            // crea el filtro automáticamente
  version: "1.0.0",
  plataformas: ["Android"],           // o ["Windows", "Linux"]
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

- Las apps publicadas son Mebusco, MineB, PuenteApp Asistencia y Lector Doc. Usa `ejemplo: true` solo para tarjetas de muestra.
- **VirusTotal:** si `virustotal` tiene un enlace (ej. `"https://www.virustotal.com/gui/file/SHA256_DEL_APK"`), aparece
  "Ver análisis en VirusTotal" debajo del botón de descarga. Con `null` no se muestra nada.
- **Permisos:** escribe un texto por permiso explicando para qué se usa. Con `null` o `[]` no se muestra la lista.
- **SHA-256:** en Linux lo obtienes con `sha256sum archivo.apk`.
- Las capturas verticales (de teléfono) se muestran completas, sin recortar.
- Si `descarga` es `"#"`, el botón aparece desactivado.
- Si pones varias capturas, la primera se ve en la tarjeta y todas aparecen en la galería desplegable **"Capturas de pantalla"**. Conviene usar `.webp` de unos 540 px de ancho para que la página cargue rápido.
- **Video mp4 vertical:** añade `poster: "assets/videos/portada.webp"` (imagen que se ve antes de reproducir) y `vertical: true` para que la ventana del video sea alta, como en Lector Doc.
- **Video:** usa `{ tipo: "youtube", valor: "abc123XYZ" }` (el ID es lo que va después de `v=` en el enlace de YouTube; puede ser un video "no listado") o `{ tipo: "mp4", valor: "assets/videos/demo.mp4" }` para un clip corto (ideal menos de 10 MB). `assets/videos/demo-ejemplo.mp4` es solo un video de prueba: bórralo cuando pongas los tuyos.
- Cuida las comas: cada `{ ... }` va separado por una coma.

## 3. Probar en tu PC

Doble clic en `index.html`, o desde la terminal:

```bash
cd hubert-web
python3 -m http.server 8000
# abre http://localhost:8000 en el navegador
```

## 4. Publicar gratis en GitHub Pages

1. Crea una cuenta en <https://github.com>.
2. Crea un repositorio nuevo **público**. Si lo llamas `TU_USUARIO.github.io`, la página quedará en
   `https://TU_USUARIO.github.io`; con otro nombre (ej. `apps`), quedará en
   `https://TU_USUARIO.github.io/apps`.
3. Sube todos los archivos de esta carpeta (botón **Add file → Upload files**, arrastra todo y pulsa **Commit changes**).
   O por terminal:
   ```bash
   git init
   git add .
   git commit -m "Primera versión de la página"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
4. En el repositorio ve a **Settings → Pages**, en *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y pulsa **Save**.
5. Espera 1–2 minutos y abre la dirección que te muestra GitHub.

## 5. Subir los APK (Releases)

GitHub Pages no admite archivos de más de 100 MB y no es buena idea guardar los APK en el repositorio. Mejor:

Los APK actuales están publicados como Releases de este mismo repositorio
(`bigwork-create.github.io`), una por app, con etiquetas `mebusco-v1.0`, `mineb-v1.0`, `puenteapp-v1.0` y `lectordoc-v1.0`.

1. En el repositorio ve a **Releases → Draft a new release**.
2. Pon una etiqueta nueva (ej. `mebusco-v1.1`), arrastra el `.apk` (o el `.zip` del programa de escritorio) y publica.
3. Copia el enlace del archivo y pégalo en el campo `descarga` de `data/apps.js`. Tiene esta forma:
   `https://github.com/bigwork-create/bigwork-create.github.io/releases/download/ETIQUETA/Archivo.apk`
4. Actualiza también `version`, `tamano` y `sha256`.

## Tema claro/oscuro

El botón de sol/luna de la cabecera cambia el tema y lo recuerda en el navegador.
Para cambiar el color de acento edita `--acento` al inicio de `styles.css`.
