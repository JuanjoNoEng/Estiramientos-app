// Vista previa de animaciones: una fila por ejercicio con 5 fotogramas (inicio → final).
// Uso: node ilustraciones/animar.mjs salida.png 4,48,61
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { animacion } from './figura.mjs';
import { POSES } from './ejercicios.mjs';
import { INICIOS } from './inicios.mjs';

const require = createRequire(import.meta.url);
const salida = process.argv[2];
const ids = (process.argv[3] ?? Object.keys(INICIOS).join(',')).split(',').map(Number).filter(i => POSES[i]);
const T = [0, 0.25, 0.5, 0.75, 1];
const filas = ids.map(id => {
  if (!INICIOS[id]) return `<div class="fila"><b>${id}</b><span>sin postura inicial</span></div>`;
  const a = animacion(INICIOS[id], POSES[id], { id: 'a' + id, zoomMax: 1.5 });
  return `<div class="fila"><b>${id} ${POSES[id].nombre ?? ''}</b>${T.map(t => `<div class="c">${a.cuadro(t)}</div>`).join('')}</div>`;
}).join('');
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:16px;font:13px Inter,sans-serif;background:#fff}
.fila{display:grid;grid-template-columns:110px repeat(5,220px);gap:8px;align-items:center;margin-bottom:10px}
.c{background:#FBF7F1;border-radius:10px;overflow:hidden}.c svg{display:block;width:100%;height:auto}b{color:#0E5A57}</style>${filas}`;
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 400 }, deviceScaleFactor: Number(process.env.ESCALA || 1) });
await p.setContent(html);
await p.screenshot({ path: salida, fullPage: true });
await b.close();
console.log(`${ids.length} animaciones`);
