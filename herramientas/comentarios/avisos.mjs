// Junta los avisos legales que extrae esbuild en un solo archivo con nombre fijo.
import { readdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
const salida = '../../assets/js';
const version = JSON.parse(readFileSync('node_modules/firebase/package.json', 'utf8')).version;
let texto = 'Avisos de terceros incluidos en los scripts de comentarios de Fhuture'S (assets/js)\n' +
  '==========================================================================\n\n' +
  'Firebase JavaScript SDK ' + version + ' (firebase/app y firebase/firestore)\n' +
  'Copyright Google LLC. Licencia: Apache License 2.0 — https://www.apache.org/licenses/LICENSE-2.0\n' +
  'Código fuente: https://github.com/firebase/firebase-js-sdk\n\n' +
  'Avisos originales extraídos del código:\n\n';
const vistos = new Set();
function recorrer(dir) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) recorrer(p);
    else if (f.name.endsWith('.LEGAL.txt')) {
      const b = readFileSync(p, 'utf8').trim();
      if (b && !vistos.has(b)) { vistos.add(b); texto += b + '\n\n'; }
      unlinkSync(p);
    }
  }
}
recorrer(salida);
writeFileSync(join(salida, 'AVISOS-TERCEROS.txt'), texto);
console.log('AVISOS-TERCEROS.txt:', vistos.size, 'bloques');
