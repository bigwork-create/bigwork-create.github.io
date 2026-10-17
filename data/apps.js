/* =====================================================================
   CATÁLOGO DE HUBERT APPS
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
     requisitos    (opcional) Texto, ej. "Android 8.0 o superior"
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
     proximamente  true = tarjeta "Próximamente" (sin botón de descarga)

   El ID de YouTube es lo que va después de "v=" en el enlace:
   https://www.youtube.com/watch?v=ESTE_ES_EL_ID
   ===================================================================== */

window.CATALOGO = {
  aplicaciones: [
    {
      id: "mebusco",
      nombre: "Mebusco",
      descripcion: "Consulta un padrón sin internet: importa un CSV y busca por DNI, apellido o nombre, aun con palabras incompletas. Reemplaza o agrega personas, y la ficha muestra también las columnas extra. Los datos se quedan en tu teléfono.",
      categoria: "Utilidades",
      version: "2.0.1",
      plataformas: ["Android"],
      requisitos: "Android 8.0 o superior",
      tamano: "6.6 MB",
      icono: "assets/icons/mebusco.png",
      capturas: [
        "assets/screens/mebusco-inicio.webp",
        "assets/screens/mebusco-busqueda.webp"
      ],
      video: null,
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/mebusco-v2.0.1/Mebusco-2.0.1.apk",
      sha256: "88b267c2dc665388bd421a6d6233d786bdf787b6d2d186e70af4103a4ba7e4c7",
      releasePrefijos: ["mebusco-"],
      virustotal: null,
      permisos: ["No pide permisos especiales."],
      tecnologias: ["Sin conexión"]
    },
    {
      id: "modonoche",
      nombre: "Modo Noche",
      descripcion: "Oscurece la pantalla por debajo del brillo mínimo y aplica un filtro cálido para descansar la vista de noche. Se activa con horario, desde los ajustes rápidos o con sus widgets.",
      categoria: "Utilidades",
      version: "1.1.1",
      plataformas: ["Android"],
      requisitos: "Android 8.0 o superior",
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
      version: "1.1.0",
      plataformas: ["Android"],
      requisitos: "Android 7.0 o superior (cámara recomendada; sin cámara se registra por DNI)",
      tamano: "17.3 MB",
      icono: "assets/icons/asisteqr.png",
      capturas: ["assets/screens/asisteqr-inicio.webp", "assets/screens/asisteqr-lista.webp"],
      video: null,
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/asisteqr-v1.1.0/AsisteQR-1.1.0.apk",
      sha256: "c1d412ae000a96be927330dc9db5f39fd00462423703d1c22ae97d363de2103c",
      releasePrefijos: ["asisteqr-", "puenteapp-"], // incluye la versión antigua PuenteApp Asistencia
      virustotal: null,
      permisos: [
        "Cámara: para escanear los códigos QR.",
        "Vibración: para avisarte cuando registra una lectura."
      ],
      tecnologias: ["Escáner QR", "CSV"]
    },
    {
      id: "lectordoc",
      nombre: "Lector Doc",
      descripcion: "Lee PDF, TXT, CSV e imágenes sin internet, y convierte imágenes a PDF, TXT a PDF y PDF a PNG. Tus archivos se quedan en tu teléfono.",
      categoria: "Utilidades",
      version: "1.0.1",
      plataformas: ["Android"],
      requisitos: "Android 8.0 o superior",
      tamano: "19.8 MB",
      icono: "assets/icons/lectordoc.png",
      capturas: [
        "assets/screens/lectordoc-inicio.webp",
        "assets/screens/lectordoc-pdf.webp",
        "assets/screens/lectordoc-csv.webp",
        "assets/screens/lectordoc-busqueda.webp"
      ],
      video: { tipo: "mp4", valor: "assets/videos/lectordoc-demo.mp4", poster: "assets/videos/lectordoc-demo-poster.webp", vertical: true },
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/lectordoc-v1.0.1/LectorDoc-1.0.1.apk",
      sha256: "a1035c57612a4a19c206e066418edaa6761e89894e5c5739775cff77e6f9cb2f",
      releasePrefijos: ["lectordoc-"],
      virustotal: null,
      permisos: ["No pide permisos especiales."],
      tecnologias: ["Sin conexión", "PDF"]
    },
    {
      id: "linterna",
      nombre: "Linterna",
      descripcion: "Enciende la linterna con un toque, desde los ajustes rápidos, con su widget o con los botones de volumen aunque la app esté cerrada. Se apaga sola después del tiempo que elijas o al agitar el teléfono.",
      categoria: "Utilidades",
      version: "1.0.1",
      plataformas: ["Android"],
      requisitos: "Android 8.0 o superior, con flash",
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
      requisitos: "Windows 10 o superior (64 bits)",
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
  ]
};
