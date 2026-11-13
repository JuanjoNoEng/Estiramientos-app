// Exporta los SVG de marca/logo a PNG y genera la guía visual marca/guia-de-marca.png
// Uso: node marca/herramientas/exportar.js   (requiere Playwright con Chromium)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LOGO = path.join(__dirname, '..', 'logo');
const PNG = path.join(LOGO, 'png');
fs.mkdirSync(PNG, { recursive: true });

const leer = f => fs.readFileSync(path.join(LOGO, f), 'utf8');
const tam = svg => svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);

const exportaciones = [
  ['icono-app.svg', [1024, 512, 192, 180]],
  ['icono-app-maskable.svg', [512, 192]],
  ['favicon.svg', [48, 32, 16]],
  ['simbolo-color.svg', [1000]],
  ['simbolo-negativo.svg', [1000]],
  ['logo-horizontal-color.svg', [2000]],
  ['logo-horizontal-negativo.svg', [2000]],
  ['logo-vertical-color.svg', [1200]],
  ['logo-vertical-negativo.svg', [1200]],
];

const ficha = (archivo, fondo, etiqueta, clase = '') =>
  `<figure class="${clase}"><div class="box" style="background:${fondo}">${leer(archivo)}</div><figcaption>${etiqueta}</figcaption></figure>`;

const colores = [
  ['Verde petróleo', '#0E5A57', 'Principal'],
  ['Coral', '#F08A5D', 'Acento · columna'],
  ['Menta', '#7CC6A6', 'Secundario'],
  ['Verde profundo', '#0A3F3D', 'Fondos oscuros'],
  ['Crema', '#FBF7F1', 'Fondo claro'],
];

const guia = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Outfit;src:url(file://${__dirname}/fuentes/outfit-latin-600-normal.woff);font-weight:600}
@font-face{font-family:Outfit;src:url(file://${__dirname}/fuentes/outfit-latin-500-normal.woff);font-weight:500}
body{margin:0;padding:56px;width:1288px;background:#fff;font-family:Outfit,Inter,sans-serif;color:#0E5A57}
h1{font-weight:600;font-size:40px;margin:0 0 4px}h2{font-weight:500;font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:#F08A5D;margin:44px 0 16px}
p.lead{font-family:Inter,sans-serif;color:#4a6664;margin:0;font-size:16px}
.fila{display:flex;gap:20px;align-items:stretch;flex-wrap:wrap}
figure{margin:0;flex:1}figure.s{flex:0 0 220px}
.box{border-radius:16px;padding:28px;display:flex;align-items:center;justify-content:center;height:100%;box-sizing:border-box;border:1px solid #eee}
.box svg{max-width:100%;height:auto;max-height:260px}
figcaption{font-family:Inter,sans-serif;font-size:12px;color:#777;margin-top:8px}
.color{flex:1;border-radius:16px;overflow:hidden;border:1px solid #eee;font-family:Inter,sans-serif}
.color div:first-child{height:110px}.color div:last-child{padding:12px 14px;font-size:13px;color:#333}
.color b{display:block;font-size:14px;color:#0E5A57}
.tam{display:flex;gap:28px;align-items:flex-end}
.tam svg{width:100%;height:auto;display:block}
.tam div{text-align:center;font-family:Inter,sans-serif;font-size:12px;color:#777}
</style></head><body>
<h1>Andrey Hernández · Quiropráctico</h1>
<p class="lead">Monograma A·H: las iniciales unidas por una columna vertebral en coral, con su curva natural.</p>
<h2>Logo principal</h2>
<div class="fila">${ficha('logo-horizontal-color.svg', '#FBF7F1', 'Horizontal · color')}${ficha('logo-horizontal-negativo.svg', '#0A3F3D', 'Horizontal · negativo')}</div>
<h2>Vertical y símbolo</h2>
<div class="fila">${ficha('logo-vertical-color.svg', '#FBF7F1', 'Vertical · color')}${ficha('logo-vertical-negativo.svg', '#0E5A57', 'Vertical · negativo')}${ficha('simbolo-color.svg', '#fff', 'Símbolo', 's')}</div>
<h2>Una tinta</h2>
<div class="fila">${ficha('logo-horizontal-una-tinta.svg', '#fff', 'Horizontal · una tinta')}${ficha('simbolo-una-tinta-verde.svg', '#fff', 'Símbolo · verde', 's')}${ficha('simbolo-una-tinta-blanco.svg', '#F08A5D', 'Símbolo · blanco', 's')}</div>
<h2>Ícono de app y favicon</h2>
<div class="tam">
  <div><div style="width:220px">${leer('icono-app.svg')}</div>Ícono app</div>
  <div><div style="width:120px">${leer('icono-app.svg')}</div>120 px</div>
  <div><div style="width:60px">${leer('icono-app.svg')}</div>60 px</div>
  <div><div style="width:32px">${leer('favicon.svg')}</div>Favicon 32</div>
  <div><div style="width:16px">${leer('favicon.svg')}</div>16</div>
</div>
<h2>Colores</h2>
<div class="fila">${colores.map(([n, h, u]) => `<div class="color"><div style="background:${h}"></div><div><b>${n}</b>${h} · ${u}</div></div>`).join('')}</div>
<h2>Tipografía</h2>
<p class="lead" style="font-size:15px">Monograma: <b>Fraunces SemiBold</b> · Nombre: <b>Outfit SemiBold</b> · Subtítulo: <b>Outfit Medium</b>, espaciado amplio. Todas con licencia libre (SIL OFL).</p>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 2, viewport: { width: 1400, height: 900 } });

  for (const [archivo, anchos] of exportaciones) {
    const svg = leer(archivo);
    const [w, h] = tam(svg);
    for (const ancho of anchos) {
      const alto = Math.round((ancho * h) / w);
      const pg = await b.newPage({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 1 });
      await pg.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg style="display:block;width:${ancho}px;height:${alto}px" `)}</body></html>`);
      const nombre = archivo.replace('.svg', anchos.length > 1 || archivo.startsWith('icono') || archivo.startsWith('favicon') ? `-${ancho}.png` : '.png');
      await pg.screenshot({ path: path.join(PNG, nombre), omitBackground: true });
      await pg.close();
    }
  }

  await p.setContent(guia, { waitUntil: 'load' });
  await p.screenshot({ path: path.join(__dirname, '..', 'guia-de-marca.png'), fullPage: true });
  await b.close();
  console.log('PNG en', PNG);
})();
