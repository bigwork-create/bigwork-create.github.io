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
     plataformas   Lista: ["Android"] o ["Windows", "Linux"]
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
      descripcion: "Consulta un padrón sin internet: importa tu lista desde un archivo CSV y busca a cualquier persona por DNI o por nombre. Los datos se quedan en tu teléfono.",
      categoria: "Utilidades",
      version: "1.0",
      plataformas: ["Android"],
      requisitos: "Android 8.0 o superior",
      tamano: "10.6 MB",
      icono: "assets/icons/mebusco.png",
      capturas: [],
      video: null,
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/mebusco-v1.0/Mebusco-1.0.apk",
      sha256: "6bc70728d2ad3a9bfeba7c9ebd0fc91b68186ca6efd18d6f13f0873375ff38a0",
      virustotal: null,
      permisos: ["No pide permisos especiales."],
      tecnologias: ["Sin conexión"]
    },
    {
      id: "mineb",
      nombre: "MineB",
      descripcion: "Oscurece la pantalla por debajo del brillo mínimo y aplica un filtro cálido para descansar la vista de noche. Se activa con horario, desde los ajustes rápidos o con sus widgets.",
      categoria: "Utilidades",
      version: "1.0",
      plataformas: ["Android"],
      requisitos: "Android 8.0 o superior",
      tamano: "6.2 MB",
      icono: "assets/icons/mineb.png",
      capturas: [],
      video: null,
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/mineb-v1.0/MineB-1.0.apk",
      sha256: "1a9e05895b507588fec490b99943ea5f4a7038d893d390ad7e3efed7d9434cd6",
      virustotal: null,
      permisos: [
        "Mostrar sobre otras apps: para dibujar el filtro oscuro encima de la pantalla.",
        "Servicio en primer plano y notificaciones: para mantener el filtro activo y avisarte de que está encendido.",
        "Iniciar al encender el teléfono: para que el horario programado siga funcionando tras reiniciar.",
        "Ignorar la optimización de batería y mantener activo (wake lock): para que el sistema no apague el filtro ni el horario."
      ]
    },
    {
      id: "puenteapp-asistencia",
      nombre: "PuenteApp Asistencia",
      descripcion: "Toma asistencia escaneando el código QR con el DNI de cada persona. Importa el padrón desde CSV, mira quién asistió y quién falta, y exporta el resultado a CSV.",
      categoria: "Gestión",
      version: "1.0",
      plataformas: ["Android"],
      requisitos: "Android 7.0 o superior, con cámara",
      tamano: "29.3 MB",
      icono: "assets/icons/puenteapp.png",
      capturas: ["assets/screens/puenteapp-inicio.png"],
      video: null,
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/puenteapp-v1.0/PuenteApp-1.0.apk",
      sha256: "5a2a622a93abe67f388455937189a73d38276382e743cae0fa400a764e286bf8",
      virustotal: null,
      permisos: [
        "Cámara: para escanear los códigos QR.",
        "Vibración: para avisarte cuando registra una lectura.",
        "Internet y estado de la red: los agrega automáticamente la librería de escaneo ML Kit de Google; el código de la app no usa internet."
      ],
      tecnologias: ["Escáner QR", "CSV"]
    },
    {
      id: "lectordoc",
      nombre: "Lector Doc",
      descripcion: "Lee PDF, TXT, CSV e imágenes sin internet, y convierte imágenes a PDF, TXT a PDF y PDF a PNG. Tus archivos se quedan en tu teléfono.",
      categoria: "Utilidades",
      version: "1.0",
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
      descarga: "https://github.com/bigwork-create/bigwork-create.github.io/releases/download/lectordoc-v1.0/LectorDoc-1.0.apk",
      sha256: "d137ca44f47d036dea155a1ec80d17fa20b53b231e997268f498ee0f569c7d12",
      virustotal: null,
      permisos: ["No pide permisos especiales."],
      tecnologias: ["Sin conexión", "PDF"]
    }
  ],

  software: [
    {
      id: "registro-asistencia",
      nombre: "Registro de Asistencia Empresarial",
      descripcion: "Carga tu padrón desde CSV, Excel o Word, abre reuniones y marca la asistencia buscando por nombre o DNI. Calcula el quórum y genera el acta en PDF, Excel o CSV. Funciona sin internet y los datos se quedan en tu computadora.",
      categoria: "Gestión",
      version: "2.0.0",
      plataformas: ["Windows"],
      requisitos: "Windows 10 o superior (64 bits)",
      tamano: "46.4 MB",
      icono: "assets/icons/asistencia.svg",
      capturas: [
        "assets/screens/registro-asistencia-inicio.webp",
        "assets/screens/registro-asistencia-tomar.webp"
      ],
      video: null,
      descarga: "https://github.com/bigwork-create/registro-asistencia-desktop/releases/download/v2.0.0/RegistroAsistencia.exe",
      textoBoton: "Descargar para Windows (.exe)",
      sha256: "7d1d2abd6f4d5d19a9a1d4043f079dd3a66e56acad6408d958637aad844a4a80",
      virustotal: null,
      permisos: [
        "No necesita instalarse ni pide permisos de administrador: se abre con doble clic.",
        "Guarda la base de datos solo en tu computadora, en la carpeta %APPDATA%\\RegistroAsistencia.",
        "Windows SmartScreen puede mostrar un aviso porque el programa no está firmado: elige «Más información» y luego «Ejecutar de todas formas»."
      ],
      tecnologias: ["Python", "PySide6 (Qt)", "SQLite", "Sin conexión"]
    },
    {
      id: "proximamente-1",
      nombre: "Próximamente",
      descripcion: "Nuevo programa de escritorio en desarrollo. ¡Muy pronto aquí!",
      categoria: "En desarrollo",
      version: "—",
      plataformas: ["Windows", "Linux"],
      icono: "assets/icons/proximamente.svg",
      capturas: [],
      video: null,
      descarga: "#",
      proximamente: true
    }
  ]
};
