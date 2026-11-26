/* Arma el sitio en dist/ para publicarlo. Lo ejecuta Vercel en cada publicación
   (ver vercel.json). Uso local: node tools/build.mjs
   Sin dependencias: solo Node 18 o superior. */
import { readFileSync, readdirSync, writeFileSync, rmSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderizar, validar } from './render.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const leerJson = ruta => {
  try { return JSON.parse(readFileSync(join(raiz, ruta), 'utf8')); }
  catch (e) { throw new Error(`No se pudo leer ${ruta}: ${e.message}`); }
};

const sitio = leerJson('content/sitio.json');
const secciones = leerJson('content/secciones.json');
const servicios = readdirSync(join(raiz, 'content/servicios'))
  .filter(f => f.endsWith('.json'))
  .map(f => ({ id: f.replace(/\.json$/, ''), ...leerJson(join('content/servicios', f)) }));

const errores = validar({ sitio, secciones, servicios });
for (const s of servicios) {
  if (s.imagen && s.imagen.startsWith('/') && !existsSync(join(raiz, s.imagen))) {
    errores.push(`Servicio "${s.titulo || s.id}": no existe la foto ${s.imagen}.`);
  }
}
if (errores.length) {
  console.error('\nNo se publicó: hay que corregir estos datos en el administrador:\n');
  for (const e of errores) console.error('  - ' + e);
  console.error('');
  process.exit(1);
}

const plantilla = readFileSync(join(raiz, 'src/plantilla.html'), 'utf8');
const html = renderizar({ plantilla, sitio, secciones, servicios });

const dist = join(raiz, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);
for (const p of ['css', 'js', 'assets', 'admin', '404.html']) cpSync(join(raiz, p), join(dist, p), { recursive: true });
writeFileSync(join(dist, 'index.html'), html);
console.log(`Listo: dist/index.html con ${servicios.filter(s => s.visible !== false).length} servicios visibles.`);
