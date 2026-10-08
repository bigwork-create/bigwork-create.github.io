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
     video         null, o { tipo: "youtube", valor: "ID_DEL_VIDEO" }
                   o { tipo: "mp4", valor: "assets/videos/archivo.mp4" }
     descarga      Enlace de descarga (APK, .exe, .zip…). "#" = sin enlace aún
     textoBoton    (opcional) Texto del botón. Por defecto "Descargar APK"
                   en apps y "Descargar" en software
     tecnologias   (opcional) Lista de etiquetas, ej. ["Python", "SQLite"]
     ejemplo       true = elemento de muestra (se marca como "Ejemplo")
     proximamente  true = tarjeta "Próximamente" (sin botón de descarga)

   El ID de YouTube es lo que va después de "v=" en el enlace:
   https://www.youtube.com/watch?v=ESTE_ES_EL_ID
   ===================================================================== */

window.CATALOGO = {
  aplicaciones: [
    {
      id: "calculadora-ejemplo",
      nombre: "Calculadora Simple",
      descripcion: "Calculadora con operaciones básicas, historial y modo oscuro.",
      categoria: "Utilidades",
      version: "1.0.0",
      plataformas: ["Android"],
      icono: "assets/icons/calculadora.svg",
      capturas: ["assets/screens/captura-calculadora.svg"],
      video: { tipo: "mp4", valor: "assets/videos/demo-ejemplo.mp4" },
      descarga: "#",
      ejemplo: true
    },
    {
      id: "tareas-ejemplo",
      nombre: "Mis Tareas",
      descripcion: "Lista de pendientes con recordatorios y guardado local en el teléfono.",
      categoria: "Productividad",
      version: "0.3.1",
      plataformas: ["Android"],
      icono: "assets/icons/tareas.svg",
      capturas: ["assets/screens/captura-tareas.svg"],
      video: null, /* ej.: { tipo: "youtube", valor: "ID_DEL_VIDEO" } */
      descarga: "#",
      ejemplo: true
    },
    {
      id: "quiz-ejemplo",
      nombre: "Quiz Perú",
      descripcion: "Preguntas de cultura general sobre el Perú para aprender jugando.",
      categoria: "Educación",
      version: "0.1.0",
      plataformas: ["Android"],
      icono: "assets/icons/quiz.svg",
      capturas: [],
      video: null,
      descarga: "#",
      ejemplo: true
    }
  ],

  software: [
    {
      id: "registro-asistencia",
      nombre: "Registro de Asistencia Empresarial",
      descripcion: "Marca la asistencia del personal por DNI. Funciona sin internet y guarda todo en una base de datos local.",
      categoria: "Gestión",
      version: "1.0.0", /* EDITA: versión real */
      plataformas: ["Windows", "Linux"],
      icono: "assets/icons/asistencia.svg",
      capturas: ["assets/screens/captura-asistencia.svg"],
      video: null,
      descarga: "#", /* EDITA: enlace al .zip en GitHub Releases */
      tecnologias: ["Python", "PyQt6", "SQLite", "Sin conexión"]
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
