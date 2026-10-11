/* =====================================================================
   COMENTARIOS DE HUBERT APPS
   ---------------------------------------------------------------------
   Comentarios que agregas tú a mano (por ejemplo, opiniones que te enviaron
   y que la persona aceptó publicar). Se muestran en la sección "Comentarios"
   junto con los que la gente publica desde la web (esos se guardan en
   Firestore y se borran con el programa "Moderar comentarios"). Si Firestore no
   responde, la página muestra al menos estos. Si no hay ninguno, aparece
   "Aún no hay comentarios."

   Campos de cada comentario:
     nombre   Nombre o apodo que eligió la persona, o "Anónimo"
     texto    El comentario
     fecha    Fecha en formato "AAAA-MM-DD" (se muestra como "11 de octubre de 2026")

   Se muestran del más reciente al más antiguo. Ejemplo:

   window.COMENTARIOS = [
     { nombre: "Anónimo", texto: "Mebusco me ahorra mucho tiempo en el colegio.", fecha: "2026-10-11" },
     { nombre: "Profe Rosa", texto: "Lector Doc abre todo sin internet, muy útil.", fecha: "2026-10-12" }
   ];

   No pongas nombres reales, correos ni teléfonos sin permiso de la persona.
   ===================================================================== */

window.COMENTARIOS = [];
