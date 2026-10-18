/* =====================================================================
   CATÁLOGO DE FHUTURE'S
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas editar para agregar, quitar o
   cambiar apps y programas. La página lo lee automáticamente.

   Campos de cada elemento:
     id            Texto único, sin espacios (ej. "mi-app")
     nombre        Nombre visible
     descripcion   Descripción corta (1–2 líneas)
     categoria     Categoría para los filtros (ej. "Utilidades")
     version       Versión (ej. "1.0.0")
     plataformas   Lista: ["Android"] o ["Windows"]
     icono         Ruta a la imagen del icono (SVG o PNG)
     capturas      Lista de rutas a capturas de pantalla (puede ir vacía [])
                   La primera va en la tarjeta; si hay más de una aparece
                   la galería desplegable "Capturas de pantalla"
     video         null, o { tipo: "youtube", valor: "ID_DEL_VIDEO" }
                   o { tipo: "mp4", valor: "assets/videos/archivo.mp4" }
                   En mp4 puedes añadir (opcional) poster: "imagen.webp"
                   (portada antes de reproducir) y vertical: true
                   (video grabado en vertical, de teléfono)
     descarga      Enlace de descarga (APK, .exe, .zip…). "#" = sin enlace aún
     textoBoton    (opcional) Texto del botón. Por defecto "Descargar APK"
                   en apps y "Descargar" en software
     tecnologias   (opcional) Lista de etiquetas, ej. ["Python", "SQLite"]
     requisitos    (opcional) Se muestra en el bloque visible "Requisitos".
                   Texto (solo el sistema), ej. "Android 8.0 o superior", u
                   objeto { sistema, equipo, permisos, espacio }, ej.
                   { sistema: "Android 8.0 o superior", permisos: "Ninguno" (solo si de verdad no accede a nada),
                     espacio: "unos 15 MB libres" }. "Descarga" sale de tamano;
                   si falta permisos se deduce de la lista permisos.
     tamano        (opcional) Tamaño del archivo, ej. "10.6 MB"
     sha256        (opcional) Huella SHA-256 del archivo, para verificarlo
     virustotal    (opcional) Enlace al análisis en VirusTotal, o null.
                   Si tiene enlace aparece "Ver análisis en VirusTotal"
     permisos      (opcional) Lista de textos explicando cada permiso, o null.
                   Se muestra como una lista desplegable "Permisos"
     releaseRepo   (opcional) Repositorio de GitHub donde están sus descargas,
                   ej. "bigwork-create/registro-asistencia-desktop".
                   Por defecto "bigwork-create/bigwork-create.github.io"
     releasePrefijos (opcional) Lista de inicios de etiqueta (tag) de sus
                   versiones en GitHub, ej. ["mebusco-"]. Se suman las
                   descargas de TODAS las versiones cuya etiqueta empiece así
                   y se muestra "↓ 123 descargas" en la tarjeta.
                   [""] = todas las versiones del repositorio.
                   Si falta, la tarjeta no muestra contador
     idsAnteriores (opcional) Lista de ids viejos que siguen funcionando como
                   enlace directo …/#id (llevan a la tarjeta con el id nuevo)
     ejemplo       true = elemento de muestra (se marca como "Ejemplo")

   Lista appPrograma (sección y categoría "App + Programa"): productos que
   necesitan la app Android Y el programa de Windows. Usan los mismos campos
   y además:
     aviso         Texto del aviso "Necesitas las dos partes"
     pasos         Lista de pasos de "Cómo conectar"
     partes        Lista de descargas, una por parte:
                   { nombre, version, archivo, tamano, descarga, textoBoton, sha256 }
     requisitos    Igual que arriba, con un campo extra "red" (ej. misma wifi)
     releaseFuentes Lista { repo, prefijos } para sumar las descargas de
                   varios repositorios de GitHub en un solo contador
     proximamente  true = tarjeta "Próximamente" (sin botón de descarga)

   El ID de YouTube es lo que va después de "v=" en el enlace:
   https://www.youtube.com/watch?v=ESTE_ES_EL_ID
   ===================================================================== */

window.CATALOGO = {
  aplicaciones: [
    {
      id: "mebusco",
      nombre: "Mebusco",
      descripcion: "Consulta un padrón sin internet: carga un CSV y busca por DNI (aunque falten los ceros iniciales), apellido o nombre, aun con palabras incompletas. Nuevo diseño con modo oscuro, abre el CSV desde otras apps, acepta la columna “Apellidos y nombres”, comparte o copia la ficha y exporta el padrón a CSV. Los datos se quedan en tu teléfono.",
      categoria: "Utilidades",
      version: "2.1.1",
      plataformas: ["Android"],
      requisitos: { sistema: "Android 8.0 o superior", permisos: "Acceso a archivos: solo el CSV que elijas o abras con la app y el que exportes", espacio: "Unos 10 MB libres, más el padrón que cargues" },
      tamano: "1.5 MB",
      icono: "assets/icons/mebusco.png",
      capturas: [
        "assets/screens/mebusco-inicio.webp",
        "assets/screens/mebusco-busqueda.webp",
        "assets/screens/mebusco-ficha.webp",
        "assets/screens/mebusco-oscuro.webp"
      ],
      video: null,
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/mebusco-v2.1.1/Mebusco-2.1.1.apk",
      sha256: "34ec110f45844621cc655d3e29b162539d9e5277f16c224f942bcf2afe745c97",
      releasePrefijos: ["mebusco-"],
      virustotal: null,
      permisos: [
        "Acceso a archivos, solo con tu autorización: el CSV que elijas o abras desde otra app, y el archivo donde decidas exportar el padrón.",
        "No ve el resto del teléfono ni usa internet."
      ],
      tecnologias: ["Sin conexión", "CSV", "Modo oscuro"]
    },
    {
      id: "modonoche",
      nombre: "Modo Noche",
      descripcion: "Oscurece la pantalla por debajo del brillo mínimo y aplica un filtro cálido para descansar la vista de noche. Se activa con horario, desde los ajustes rápidos o con sus widgets.",
      categoria: "Utilidades",
      version: "1.1.1",
      plataformas: ["Android"],
      requisitos: { sistema: "Android 8.0 o superior", permisos: "Mostrar sobre otras apps, notificaciones, inicio al encender y batería (detalle abajo)", espacio: "Unos 20 MB libres" },
      tamano: "6.2 MB",
      icono: "assets/icons/modonoche.png",
      capturas: [
        "assets/screens/modonoche-inicio.webp",
        "assets/screens/modonoche-activo.webp"
      ],
      video: null,
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/modonoche-v1.1.1/ModoNoche-1.1.1.apk",
      sha256: "024a5960972ff68c3d1834302b75f71d72c8267b560eb5ebe8c328731a807f62",
      releasePrefijos: ["modonoche-", "mineb-"], // incluye la versión antigua MineB
      virustotal: null,
      permisos: [
        "Mostrar sobre otras apps: para dibujar el filtro oscuro encima de la pantalla.",
        "Servicio en primer plano y notificaciones: para mantener el filtro activo y avisarte de que está encendido.",
        "Iniciar al encender el teléfono: para que el horario programado siga funcionando tras reiniciar.",
        "Ignorar la optimización de batería y mantener activo (wake lock): para que el sistema no apague el filtro ni el horario."
      ]
    },
    {
      id: "asiste-qr",
      idsAnteriores: ["puenteapp-asistencia", "puenteapp"], // enlaces viejos …/#puenteapp-asistencia y …/#puenteapp
      nombre: "Asiste QR",
      descripcion: "Antes PuenteApp Asistencia. Toma asistencia escaneando el código QR con el DNI de cada persona: deshaz un registro, cierra eventos y guarda su historial, y exporta a CSV con todas las columnas del padrón. Funciona sin internet.",
      categoria: "Gestión",
      version: "1.1.1",
      plataformas: ["Android"],
      requisitos: { sistema: "Android 7.0 o superior", equipo: "Cámara recomendada (sin cámara se registra por DNI)", permisos: "Cámara y vibración; acceso a archivos: solo el padrón que elijas y lo que exportes", espacio: "Unos 50 MB libres, más tus eventos" },
      tamano: "17.3 MB",
      icono: "assets/icons/asisteqr.png",
      capturas: ["assets/screens/asisteqr-inicio.webp", "assets/screens/asisteqr-lista.webp"],
      video: null,
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/asisteqr-v1.1.1/AsisteQR-1.1.1.apk",
      sha256: "02439163d16587dbe6002392742da365f3a76f7c2d8216881a6e425fb3bb8d32",
      releasePrefijos: ["asisteqr-", "puenteapp-"], // incluye la versión antigua PuenteApp Asistencia
      virustotal: null,
      permisos: [
        "Cámara: para escanear los códigos QR.",
        "Vibración: para avisarte cuando registra una lectura.",
        "Acceso a archivos, solo con tu autorización: el padrón CSV que elijas o abras desde otra app, y el archivo donde decidas guardar lo que exportes. No ve el resto del teléfono."
      ],
      tecnologias: ["Escáner QR", "CSV"]
    },
    {
      id: "lectordoc",
      nombre: "Lector Doc",
      descripcion: "Lee PDF, Word (.docx), TXT, CSV e imágenes sin internet. Convierte imágenes a PDF, texto a PDF, CSV a PDF, PDF a PNG y PDF a texto. Filtra tus documentos por tipo y busca los de una carpeta que elijas. Solo accede a los archivos que abras y a esa carpeta, y todo se queda en tu teléfono.",
      categoria: "Utilidades",
      version: "2.0.0",
      plataformas: ["Android"],
      requisitos: { sistema: "Android 8.0 o superior", permisos: "Acceso a archivos: solo los que abras y la carpeta que elijas. Sin internet", espacio: "Unos 15 MB libres, más los archivos que conviertas" },
      tamano: "3.9 MB",
      icono: "assets/icons/lectordoc.png",
      capturas: [
        "assets/screens/lectordoc-inicio.webp",
        "assets/screens/lectordoc-word.webp",
        "assets/screens/lectordoc-transformar.webp",
        "assets/screens/lectordoc-ajustes.webp",
        "assets/screens/lectordoc-pdf.webp",
        "assets/screens/lectordoc-csv.webp",
        "assets/screens/lectordoc-busqueda.webp"
      ],
      video: { tipo: "mp4", valor: "assets/videos/lectordoc-demo.mp4", poster: "assets/videos/lectordoc-demo-poster.webp", vertical: true },
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/lectordoc-v2.0.0/LectorDoc-2.0.0.apk",
      sha256: "49073d8a33f44d6ece23d44f91e885f2a37d53bbc45d9888b23d837b6d3d0b1a",
      releasePrefijos: ["lectordoc-"],
      virustotal: null,
      permisos: [
        "Acceso a archivos, solo con tu autorización: los documentos que abras o compartas con Lector Doc, y la carpeta que elijas con el selector de Android para buscar documentos.",
        "El acceso a esa carpeta se mantiene para volver a buscar; se quita al borrar los datos de la app o al desinstalarla.",
        "No ve el resto del teléfono ni usa internet."
      ],
      tecnologias: ["Sin conexión", "PDF", "Word", "Conversiones"]
    },
    {
      id: "linterna",
      nombre: "Linterna",
      descripcion: "Enciende la linterna con un toque, desde los ajustes rápidos, con su widget o con los botones de volumen aunque la app esté cerrada. Se apaga sola después del tiempo que elijas o al agitar el teléfono.",
      categoria: "Utilidades",
      version: "1.0.1",
      plataformas: ["Android"],
      requisitos: { sistema: "Android 8.0 o superior", equipo: "Teléfono de 64 bits (ARM64) con flash", permisos: "Vibración; accesibilidad opcional (detalle abajo)", espacio: "Unos 5 MB libres" },
      tamano: "969 KB",
      icono: "assets/icons/linterna.png",
      capturas: [
        "assets/screens/linterna-encendida.webp",
        "assets/screens/linterna-temporizador.webp"
      ],
      video: null,
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/linterna-v1.0.1/Linterna-1.0.1.apk",
      sha256: "d29fe56680e9463f6241abeda738d50c3360e252f4a5e4f4b8180fee0f160ccc",
      releasePrefijos: ["linterna-"],
      virustotal: null,
      permisos: [
        "Flash: usa el flash de la cámara solo como luz. No pide permiso de cámara, no toma fotos ni graba.",
        "Vibración: una vibración corta te confirma si la linterna se encendió o se apagó con los botones de volumen.",
        "Accesibilidad (opcional, la activas tú): permite usar los botones de volumen con la app cerrada. No lee el texto ni el contenido de la pantalla."
      ],
      tecnologias: ["Botones de volumen", "Widget", "Ajustes rápidos", "Apagado automático"]
    }
  ],

  software: [
    {
      id: "registro-asistencia",
      nombre: "Registro de Asistencia Empresarial",
      descripcion: "Carga tu padrón desde CSV, Excel o Word, abre reuniones y marca la asistencia buscando por nombre o DNI. Calcula el quórum y genera el acta en PDF, Excel o CSV. Funciona sin internet y los datos se quedan en tu computadora.",
      categoria: "Gestión",
      version: "2.0.2",
      plataformas: ["Windows"],
      requisitos: { sistema: "Windows 10 (versión 1809 o posterior) u 11, de 64 bits", permisos: "Usa los archivos que elijas (padrón y actas); no pide permisos de administrador", espacio: "Unos 170 MB libres: 46 MB del .zip y 116 MB al descomprimirlo" },
      tamano: "46.3 MB",
      icono: "assets/icons/asistencia.svg",
      capturas: [
        "assets/screens/registro-asistencia-inicio.webp",
        "assets/screens/registro-asistencia-tomar.webp"
      ],
      video: null,
      descarga: "https://github.com/bigwork-create/registro-asistencia-desktop/releases/download/v2.0.2/RegistroAsistencia-2.0.2-windows.zip",
      textoBoton: "Descargar para Windows (.zip)",
      sha256: "31fd497d6384be30e1d5301f40a550207277bf13d7ee6a6c8f9f542ad7a65708",
      releaseRepo: "bigwork-create/registro-asistencia-desktop",
      releasePrefijos: [""], // todas las versiones del repositorio
      virustotal: null,
      permisos: [
        "Cómo abrirlo: descomprime el .zip (clic derecho > Extraer todo), abre la carpeta RegistroAsistencia y haz doble clic en RegistroAsistencia.exe. No saques el .exe de su carpeta.",
        "No necesita instalarse ni pide permisos de administrador.",
        "Guarda la base de datos solo en tu computadora, en la carpeta %APPDATA%\\RegistroAsistencia.",
        "Windows SmartScreen puede mostrar un aviso porque el programa no está firmado: elige «Más información» y luego «Ejecutar de todas formas».",
        "Código abierto con licencia MIT. Incluye Qt for Python (PySide6) bajo LGPL-3.0; los avisos están en la carpeta LICENSES del zip."
      ],
      tecnologias: ["Python", "PySide6 (Qt)", "SQLite", "Sin conexión"]
    },
    {
      id: "proximamente-1",
      nombre: "Próximamente",
      descripcion: "Nuevo programa de escritorio en desarrollo. ¡Muy pronto aquí!",
      categoria: "En desarrollo",
      version: "—",
      plataformas: ["Windows"],
      icono: "assets/icons/proximamente.svg",
      capturas: [],
      video: null,
      descarga: "#",
      proximamente: true
    }
  ],
  /* App + Programa: la app Android y el programa de Windows se necesitan juntos */
  appPrograma: [
    {
      id: "asistencia-x-qr",
      idsAnteriores: ["punto-asistencia"], // enlace viejo …/#punto-asistencia
      nombre: "Asistencia x QR",
      descripcion: "Antes Punto Asistencia. Toma asistencia con el teléfono y regístrala en tu computadora. La app Asistencia x QR escanea el QR del DNI y lo envía por tu wifi al programa de Windows, que marca a la persona en el padrón al instante y guarda el historial por fecha. Hasta 2 teléfonos por PC, sin internet.",
      categoria: "Gestión",
      version: "1.0.1",
      plataformas: ["Android", "Windows"],
      aviso: "La app Asistencia x QR va en el teléfono y el programa Asistencia x QR (PC) en la computadora, conectados a la misma red wifi. Solo con una de las dos no funciona.",
      pasos: [
        "En la PC: descomprime el .zip, abre la carpeta AsistenciaXQR y haz doble clic en AsistenciaXQR.exe. Carga tu padrón (CSV o Excel) en la pestaña Padrón.",
        "La primera vez, cuando el Firewall de Windows pregunte, permite el acceso solo en «Redes privadas». Si el teléfono no encuentra la PC, ejecuta permitir_firewall_windows.bat como administrador.",
        "En el teléfono: instala la app Asistencia x QR y conéctalo a la misma wifi que la PC (no necesita internet).",
        "En el programa pulsa «Enlazar teléfono». En la app toca «Enlazar con la PC» y escanea el QR que aparece (vence a los 5 minutos). Puedes enlazar hasta 2 teléfonos.",
        "Listo: escanea el QR del DNI de cada persona con la app y la PC la marca como presente."
      ],
      requisitos: {
        sistema: "App: Android 7.0 o superior · Programa: Windows 10 (versión 1809 o posterior) u 11, de 64 bits",
        equipo: "Teléfono con cámara",
        red: "Teléfono y PC en la misma red wifi o LAN (sin internet). Usa los puertos 8080 y 8081 solo en redes privadas",
        permisos: "App: cámara, red local y vibración · Programa: red local y los archivos que elijas, solo con tu autorización",
        espacio: "Teléfono: unos 60 MB libres · PC: unos 170 MB libres (48 MB del .zip y 119 MB al descomprimirlo)"
      },
      tamano: "17.0 MB (app) + 47.6 MB (programa)",
      icono: "assets/icons/punto-asistencia.png",
      capturas: [
        "assets/screens/punto-asistencia-pc.webp",
        "assets/screens/punto-asistencia-enlace.webp"
      ],
      video: null,
      partes: [
        {
          nombre: "App Asistencia x QR (Android)",
          version: "1.0.1",
          archivo: "AsistenciaXQR-1.0.1.apk",
          tamano: "17.0 MB",
          descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/asistenciaxqr-app-v1.0.1/AsistenciaXQR-1.0.1.apk",
          textoBoton: "Descargar app Asistencia x QR (APK)",
          sha256: "6a530e7567edfe1e271ff19440d7fe90a84bb27ec92dba72f93583ab2ea5de70"
        },
        {
          nombre: "Programa Asistencia x QR (Windows)",
          version: "1.0.1",
          archivo: "AsistenciaXQR-1.0.1-windows.zip",
          tamano: "47.6 MB",
          descarga: "https://github.com/bigwork-create/punto-asistencia-pc/releases/download/v1.0.1/AsistenciaXQR-1.0.1-windows.zip",
          textoBoton: "Descargar programa para Windows (.zip)",
          sha256: "6ed6846e2a5b2b7189ef9d93b0a3609cc120bc216931334f840bf20fda952bfc"
        }
      ],
      releaseFuentes: [
        { repo: "bigwork-create/bigwork-create.github.io", prefijos: ["asistenciaxqr-", "punto-"] }, // incluye la versión antigua (app Punto)
        { repo: "bigwork-create/punto-asistencia-pc", prefijos: [""] }
      ],
      virustotal: null,
      permisos: [
        "App · Cámara: para escanear el QR del DNI y el QR de enlace de la PC.",
        "App · Red (wifi local): solo para hablar con el programa de tu PC en la misma red. No usa internet y tiene desactivado el envío de métricas de ML Kit a Google.",
        "App · Vibración: para avisarte de cada registro.",
        "Programa · Red local: recibe los registros en el puerto TCP 8080 y responde a la app en el puerto UDP 8081. Permítelo solo en redes privadas; solo acepta teléfonos que enlazaste con su QR, y cada registro va firmado.",
        "Programa · Archivos, solo con tu autorización: el padrón que elijas y el archivo donde decidas exportar. Sus datos se guardan solo en tu PC, en %APPDATA%\\PuntoAsistencia.",
        "Windows SmartScreen puede mostrar un aviso porque el programa no está firmado: elige «Más información» y luego «Ejecutar de todas formas». No necesita instalarse ni pide permisos de administrador (solo el .bat opcional del Firewall).",
        "El programa es de código abierto (licencia MIT) e incluye Qt for Python (PySide6) bajo LGPL-3.0; los avisos están en la carpeta LICENSES del zip."
      ],
      tecnologias: ["Escáner QR", "Wifi local", "Python", "PySide6 (Qt)", "SQLite"]
    }
  ]
};
