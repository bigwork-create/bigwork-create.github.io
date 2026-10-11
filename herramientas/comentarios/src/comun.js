/* Utilidades compartidas por la página pública y la de administración. */
export function el(tag, attrs, hijos) {
  const n = document.createElement(tag);
  if (attrs) {
    for (const k of Object.keys(attrs)) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === 'texto') n.textContent = v;
      else if (k === 'clase') n.className = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const h of hijos || []) {
    if (h === null || h === undefined || h === false) continue;
    n.appendChild(typeof h === 'string' ? document.createTextNode(h) : h);
  }
  return n;
}

const fmtDia = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' });
const fmtCompleta = new Intl.DateTimeFormat('es-PE', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Lima' });

export function fechaDe(valor) {
  if (!valor) return null;
  if (valor instanceof Date) return valor;
  if (typeof valor.toDate === 'function') return valor.toDate();
  return null;
}
export function fechaDia(d) { return d ? fmtDia.format(d) : ''; }
export function fechaCompleta(d) { return d ? fmtCompleta.format(d) + ' (hora de Lima)' : ''; }
