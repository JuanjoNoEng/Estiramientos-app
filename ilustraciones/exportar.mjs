// Exporta cada pose a ilustraciones/svg/ej-NNN.svg y genera una hoja de vista previa en PNG.
// Uso: node ilustraciones/exportar.mjs [salida.png] [ids separados por coma]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dibujar } from './figura.mjs';
import { POSES } from './ejercicios.mjs';
import { INFO } from './info.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const SVG_DIR = path.join(aqui, 'svg');
fs.mkdirSync(SVG_DIR, { recursive: true });

const filtro = process.argv[3] ? new Set(process.argv[3].split(',').map(Number)) : null;
const ids = Object.keys(POSES).map(Number).filter(i => !filtro || filtro.has(i)).sort((a, b) => a - b);

const fichas = [];
for (const id of ids) {
  const nombre = `ej-${String(id).padStart(3, '0')}`;
  const svg = dibujar(POSES[id], { id: nombre, titulo: INFO[id]?.nombre ?? POSES[id].nombre });
  fs.writeFileSync(path.join(SVG_DIR, nombre + '.svg'), svg + '\n');
  fichas.push(`<figure><div class="img">${svg}</div><figcaption><b>${id}</b> ${INFO[id]?.nombre ?? POSES[id].nombre ?? ''}</figcaption></figure>`);
}

const salida = process.argv[2];
if (salida) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;padding:24px;background:#fff;font-family:Inter,sans-serif;display:grid;grid-template-columns:repeat(${Math.min(4, ids.length)},320px);gap:18px}
  figure{margin:0}.img{background:#FBF7F1;border-radius:18px;overflow:hidden}.img svg{display:block;width:100%;height:auto}
  figcaption{font-size:13px;color:#0E5A57;margin-top:6px}b{color:#F08A5D;margin-right:4px}
  </style></head><body>${fichas.join('')}</body></html>`;
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 400 }, deviceScaleFactor: Number(process.env.ESCALA || 1) });
  await p.setContent(html);
  await p.screenshot({ path: salida, fullPage: true });
  await b.close();
}
console.log(`${ids.length} ilustraciones exportadas`);
