/* Aplica el tema guardado (claro u oscuro) antes de pintar la página, para evitar parpadeo.
   Se carga en <head> como archivo aparte porque la política de seguridad (CSP) no permite scripts en línea. */
(function () {
  try {
    var t = localStorage.getItem('tema');
    if (t === 'claro' || t === 'oscuro') document.documentElement.setAttribute('data-tema', t);
  } catch (e) {}
})();
