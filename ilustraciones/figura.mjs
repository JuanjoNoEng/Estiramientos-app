// Motor de figuras: dibuja una persona articulada en estilo "silueta rellena" a partir de una postura.
// Sin dependencias: devuelve un string SVG. Lo usan el exportador y, más adelante, la app (para animar).
//
// Coordenadas: SVG (x a la derecha, y hacia abajo). Ángulos en grados: 0 = derecha, 90 = abajo,
// 180 = izquierda, -90 = arriba. La pelvis está en (0, 0) al definir la postura; luego la figura
// se apoya sola en el suelo.

export const PALETA = {
  cuerpo: '#0E5A57',      // lado cercano
  lejano: '#5F9E98',      // lado lejano (vista lateral)
  resalte: '#F08A5D',     // músculo que se estira
  resalteLejano: '#F5B394',
  objeto: '#DDE8E5',      // pared, silla, mesa…
  objetoBorde: '#BFD3CE',
  suelo: '#E2ECE9',
  accesorio: '#7CC6A6',   // toalla, palo, mancuerna
  flecha: '#F08A5D',
};

// Proporciones (unidades del dibujo; una persona mide ~175)
export const LARGO = { cuello: 9, torso: 50, brazo: 28, antebrazo: 25, mano: 8, muslo: 43, pierna: 41, pie: 14 };
const R = {
  cabeza: 12, cuello: 5, pecho: 13.5, pelvis: 12.5,
  hombro: 6.5, codo: 5, muneca: 4, mano: 3.6,
  cadera: 9, rodilla: 6.5, tobillo: 5, punta: 3.2,
};
const ANCHO_HOMBROS = 16; // mitad, vista frontal
const ANCHO_CADERA = 10;

const rad = g => (g * Math.PI) / 180;
const deg = r => (r * 180) / Math.PI;
const n = v => (Math.round(v * 10) / 10).toString();
const sum = (p, ang, len) => [p[0] + Math.cos(rad(ang)) * len, p[1] + Math.sin(rad(ang)) * len];
const angulo = (a, b) => deg(Math.atan2(b[1] - a[1], b[0] - a[0]));
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

// ---------- Geometría ----------
// Cápsula entre dos círculos de radios distintos (miembro que se afina)
function capsula(p1, r1, p2, r2) {
  const d = Math.max(dist(p1, p2), 0.01);
  const th = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
  const ph = Math.acos(Math.max(-1, Math.min(1, (r1 - r2) / d)));
  const pts = [];
  const N = 10;
  for (let i = 0; i <= N; i++) { // arco del extremo 2 (lado lejano)
    const a = th - ph + ((2 * ph) * i) / N;
    pts.push([p2[0] + r2 * Math.cos(a), p2[1] + r2 * Math.sin(a)]);
  }
  for (let i = 0; i <= N; i++) { // arco del extremo 1
    const a = th + ph + ((2 * Math.PI - 2 * ph) * i) / N;
    pts.push([p1[0] + r1 * Math.cos(a), p1[1] + r1 * Math.sin(a)]);
  }
  return 'M' + pts.map(p => n(p[0]) + ' ' + n(p[1])).join('L') + 'Z';
}

// Cinemática inversa de dos huesos: devuelve ángulos para llegar de base a objetivo
function ik(base, objetivo, a, b, doblez) {
  let d = dist(base, objetivo);
  d = Math.min(Math.max(d, Math.abs(a - b) + 0.01), a + b - 0.001);
  const th = angulo(base, objetivo);
  const cosA = (a * a + d * d - b * b) / (2 * a * d);
  const a1 = th + doblez * deg(Math.acos(Math.max(-1, Math.min(1, cosA))));
  const medio = sum(base, a1, a);
  return [a1, angulo(medio, objetivo)];
}

// ---------- Resolución de la postura ----------
function resolverRef(ref, J) {
  if (Array.isArray(ref)) return ref;
  if (typeof ref === 'function') return ref(J);
  const [nombre, extra] = ref.split('+');
  const p = nombre.split('.').reduce((o, key) => o?.[key], J);
  if (!p) throw new Error('Referencia desconocida: ' + ref);
  if (extra) { const [ex, ey] = extra.split(',').map(Number); return [p[0] + ex, p[1] + ey]; }
  return p;
}

function cadena(base, spec, largos, J, finalPorDefecto) {
  const esc = spec.escala || [1, 1, 1];
  const L = largos.map((l, i) => l * (esc[i] ?? 1));
  let a1, a2;
  if (spec.a) [a1, a2] = spec.a;
  else [a1, a2] = ik(base, resolverRef(spec.hacia, J), L[0], L[1], spec.doblez ?? 1);
  const p1 = sum(base, a1, L[0]);
  const p2 = sum(p1, a2, L[1]);
  const a3 = spec.fin ?? (spec.a?.[2] ?? finalPorDefecto(a2));
  const p3 = sum(p2, a3, L[2]);
  return [base, p1, p2, p3, a3];
}

export function resolver(pose) {
  const vista = pose.vista || 'lado';
  const torsoA = pose.torso ?? -90;
  const cuelloA = pose.cuello ?? torsoA;
  const pelvis = [0, 0];
  const base = sum(pelvis, torsoA, LARGO.torso); // base del cuello
  const pecho = sum(pelvis, torsoA, LARGO.torso * 0.74);
  const cabeza = sum(base, cuelloA, LARGO.cuello + R.cabeza * 0.75);
  const perp = torsoA + 90;
  const frente = vista === 'frente';
  const J = { pelvis, pecho, base, cabeza, cuello: base };

  // En vista lateral: "N" = cercano, "L" = lejano. En vista frontal: "N" = izquierda del dibujo, "L" = derecha.
  const lados = frente ? { N: -1, L: 1 } : { N: 0, L: 0 };
  for (const lado of ['N', 'L']) {
    const s = lados[lado];
    J['hombro' + lado] = frente ? sum(sum(pelvis, torsoA, LARGO.torso * 0.9), perp, s * ANCHO_HOMBROS) : sum(pelvis, torsoA, LARGO.torso * 0.86);
    J['cadera' + lado] = frente ? sum(pelvis, perp, s * ANCHO_CADERA) : [0, 0];
  }
  const pendientes = [];
  for (const lado of ['N', 'L']) pendientes.push(['pierna' + lado, lado], ['brazo' + lado, lado]);
  // Las piernas primero (los brazos suelen apuntar a tobillos/pies)
  pendientes.sort((a, b) => (a[0].startsWith('pierna') ? -1 : 1) - (b[0].startsWith('pierna') ? -1 : 1));
  for (const [miembro, lado] of pendientes) {
    const spec = pose[miembro] || {};
    const esPierna = miembro.startsWith('pierna');
    const base0 = esPierna ? J['cadera' + lado] : J['hombro' + lado];
    const largos = esPierna ? [LARGO.muslo, LARGO.pierna, LARGO.pie] : [LARGO.brazo, LARGO.antebrazo, LARGO.mano];
    const porDefecto = esPierna ? (spec.mira ?? 1) === 1 ? () => 0 : () => 180 : a2 => a2;
    const defecto = esPierna ? { a: [90, 90] } : { a: [100, 95] };
    const [b, p1, p2, p3, a3] = cadena(base0, ('a' in spec || 'hacia' in spec) ? spec : { ...defecto, ...spec }, largos, J, porDefecto);
    J[miembro] = esPierna ? { cadera: b, rodilla: p1, tobillo: p2, punta: p3, angPie: a3 } : { hombro: b, codo: p1, muneca: p2, punta: p3 };
  }
  return { J, vista, torsoA, cuelloA };
}

// ---------- Dibujo ----------
function dibujarPierna(P, color, frente) {
  const talon = sum(P.tobillo, P.angPie, frente ? -1 : -3);
  return [
    capsula(P.cadera, R.cadera, P.rodilla, R.rodilla),
    capsula(P.rodilla, R.rodilla, P.tobillo, R.tobillo),
    capsula(talon, R.tobillo, P.punta, R.punta),
  ].map((d, i) => ({ d, color: color[i] }));
}
function dibujarBrazo(P, color) {
  return [
    capsula(P.hombro, R.hombro, P.codo, R.codo),
    capsula(P.codo, R.codo, P.muneca, R.muneca),
    capsula(P.muneca, R.muneca, P.punta, R.mano),
  ].map((d, i) => ({ d, color: color[i] }));
}

// Contorno suave cerrado (Catmull-Rom → Bézier)
function contorno(pts) {
  const m = pts.length;
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < m; i++) {
    const p0 = pts[(i - 1 + m) % m], p1 = pts[i], p2 = pts[(i + 1) % m], p3 = pts[(i + 2) % m];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`;
  }
  return d + 'Z';
}

// Perfil del tronco: [u a lo largo del torso, desplazamiento lateral]. u=0 pelvis, u=50 base del cuello.
const PERFIL_LADO = {
  frente: [[49, 6], [45, 11.5], [37, 14.5], [28, 12.5], [18, 10.5], [8, 11.5], [-2, 10.5], [-9, 6.5]],
  espalda: [[-12, -2], [-10, -9], [-3, -13], [6, -11], [16, -9], [27, -10.5], [38, -11.5], [46, -9], [50, -4]],
};
const PERFIL_FRENTE = [[50, 9], [48.5, 17], [44.5, 21.5], [38, 20], [28, 16.5], [18, 14.5], [9, 16.5], [1, 18], [-6, 16], [-11, 9]];

function torsoPath(J, vista, torsoA, mira = 1) {
  const u = [Math.cos(rad(torsoA)), Math.sin(rad(torsoA))];
  const v = [-u[1] * mira, u[0] * mira]; // perpendicular (hacia el frente en vista lateral)
  const P = ([a, b]) => [J.pelvis[0] + u[0] * a + v[0] * b, J.pelvis[1] + u[1] * a + v[1] * b];
  if (vista !== 'frente') return contorno([...PERFIL_LADO.frente, ...PERFIL_LADO.espalda].map(P));
  const der = PERFIL_FRENTE, izq = [...PERFIL_FRENTE].reverse().map(([a, b]) => [a, -b]);
  return contorno([...der, [-12.5, 0], ...izq].map(P));
}

// Zonas del tronco para resaltar (fracciones a lo largo del torso, desde la pelvis)
const ZONAS = {
  pecho: [0.55, 1.1, 'frente'], abdomen: [0.05, 0.6, 'frente'], lumbar: [-0.25, 0.45, 'espalda'],
  espalda: [0.45, 1.1, 'espalda'], gluteo: [-0.35, 0.2, 'espalda'], costado: [0.1, 0.95, 'ambos'],
  tronco: [-0.3, 1.1, 'ambos'],
};

function zonaTronco(nombre, J, torsoA, mira, vista) {
  let [t0, t1, lado] = ZONAS[nombre];
  if (vista === 'frente' && (nombre === 'pecho' || nombre === 'abdomen')) {
    const c = sum(J.pelvis, torsoA, LARGO.torso * (nombre === 'pecho' ? 0.8 : 0.32));
    const rx = nombre === 'pecho' ? 19 : 11, ry = nombre === 'pecho' ? 10 : 14;
    const pts = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * 2 * Math.PI; return sum(sum(c, torsoA, Math.sin(a) * ry), torsoA + 90, Math.cos(a) * rx); });
    return contorno(pts);
  }
  if (vista === 'frente') lado = 'ambos';
  const dir = rad(torsoA);
  const fr = [-Math.sin(dir) * mira, Math.cos(dir) * mira]; // normal hacia el frente
  const a = sum(J.pelvis, torsoA, LARGO.torso * t0), b = sum(J.pelvis, torsoA, LARGO.torso * t1);
  const k = lado === 'frente' ? [0, 40] : lado === 'espalda' ? [-40, 0] : [-40, 40];
  const P = (p, s) => [p[0] + fr[0] * s, p[1] + fr[1] * s];
  const pts = [P(a, k[0]), P(b, k[0]), P(b, k[1]), P(a, k[1])];
  return 'M' + pts.map(p => n(p[0]) + ' ' + n(p[1])).join('L') + 'Z';
}

// ---------- Objetos ----------
function caja(x, y, w, h, r = 3) {
  return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${r}" fill="${PALETA.objeto}" stroke="${PALETA.objetoBorde}" stroke-width="1.5"/>`;
}
function linea(pts, color, ancho) {
  return `<path d="M${pts.map(p => n(p[0]) + ' ' + n(p[1])).join('L')}" fill="none" stroke="${color}" stroke-width="${ancho}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

const OBJETOS = {
  // Pared vertical: x = cara de la pared, lado = hacia dónde está el muro (1 derecha, -1 izquierda)
  pared: (o, suelo) => caja(o.lado === -1 ? o.x - 10 : o.x, o.arriba ?? suelo - 190, 10, suelo - (o.arriba ?? suelo - 190), 2),
  // Marco de puerta: dos postes y dintel
  puerta: (o, suelo) => {
    const top = o.arriba ?? suelo - 205;
    return caja(o.x1 - 8, top, 8, suelo - top, 2) + caja(o.x2, top, 8, suelo - top, 2) + caja(o.x1 - 8, top - 8, o.x2 - o.x1 + 16, 10, 2);
  },
  // Silla de lado: x = borde delantero del asiento, y = altura del asiento, dir = hacia dónde mira (respaldo atrás)
  silla: (o, suelo) => {
    const w = o.ancho ?? 40, d = o.dir ?? 1;
    const x0 = d === 1 ? o.x - w : o.x;
    const resp = o.respaldo === false ? '' : caja(d === 1 ? x0 : x0 + w - 6, o.y - (o.alto ?? 42), 6, (o.alto ?? 42) + 4, 3);
    return resp + caja(x0 + 3, o.y + 4, 5, suelo - o.y - 4, 2) + caja(x0 + w - 8, o.y + 4, 5, suelo - o.y - 4, 2) + caja(x0, o.y, w, 7, 3);
  },
  // Silla de frente (vista frontal)
  sillaFrente: (o, suelo) => {
    const w = o.ancho ?? 46;
    return caja(o.x - w / 2 + 4, o.y - (o.alto ?? 52), w - 8, (o.alto ?? 52) - 2, 4) +
      caja(o.x - w / 2 + 2, o.y + 4, 5, suelo - o.y - 4, 2) + caja(o.x + w / 2 - 7, o.y + 4, 5, suelo - o.y - 4, 2) + caja(o.x - w / 2, o.y, w, 7, 3);
  },
  banqueta: (o, suelo) => OBJETOS.silla({ ...o, respaldo: false }, suelo),
  mesa: (o, suelo) => caja(o.x1 + 4, o.y + 4, 6, suelo - o.y - 4, 2) + caja(o.x2 - 10, o.y + 4, 6, suelo - o.y - 4, 2) + caja(o.x1, o.y, o.x2 - o.x1, 8, 3),
  colchoneta: (o, suelo) => `<rect x="${n(o.x1)}" y="${n(suelo - 5)}" width="${n(o.x2 - o.x1)}" height="6" rx="3" fill="${PALETA.accesorio}" opacity=".45"/>`,
  barra: o => `<circle cx="${n(o.x)}" cy="${n(o.y)}" r="4" fill="${PALETA.objetoBorde}"/>`,
  toalla: o => linea(o.puntos, PALETA.accesorio, 4.5),
  palo: o => linea([o.p1, o.p2], '#C9A27A', 4),
  mancuerna: o => `<g transform="translate(${n(o.x)} ${n(o.y)}) rotate(${n(o.ang ?? 0)})"><rect x="-9" y="-2" width="18" height="4" rx="2" fill="#8FA9A4"/><rect x="-11" y="-6" width="5" height="12" rx="2" fill="#6F8F89"/><rect x="6" y="-6" width="5" height="12" rx="2" fill="#6F8F89"/></g>`,
  // Flecha curva: centro, radio, ángulo inicial y final (grados)
  flecha: o => {
    const p0 = sum(o.c, o.de, o.r), p1 = sum(o.c, o.a, o.r);
    const grande = Math.abs(o.a - o.de) > 180 ? 1 : 0;
    const barrido = o.a > o.de ? 1 : 0;
    const tang = o.a + (barrido ? 90 : -90);
    const h1 = sum(p1, tang + 180 - 28, 7), h2 = sum(p1, tang + 180 + 28, 7);
    return `<path d="M${n(p0[0])} ${n(p0[1])}A${o.r} ${o.r} 0 ${grande} ${barrido} ${n(p1[0])} ${n(p1[1])}" fill="none" stroke="${PALETA.flecha}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="1 5.5"/>` +
      linea([h1, p1, h2], PALETA.flecha, 2.6);
  },
};
const DELANTE = new Set(['toalla', 'palo', 'mancuerna', 'flecha']);

// ---------- Render principal ----------
export function dibujar(pose, opciones = {}) {
  const { J, vista, torsoA } = resolver(pose);
  const frente = vista === 'frente';
  const mira = pose.mira ?? 1;
  const resaltar = new Set(pose.resaltar || []);
  const col = (id, lejano) => resaltar.has(id) ? (lejano ? PALETA.resalteLejano : PALETA.resalte) : (lejano ? PALETA.lejano : PALETA.cuerpo);

  const capas = { atras: [], torso: [], adelante: [] };
  const miembro = (tipo, lado) => {
    const lejano = !frente && lado === 'L';
    const id = tipo + lado;
    const P = J[id];
    const piezas = tipo === 'pierna'
      ? dibujarPierna(P, [col(id + '.muslo', lejano), col(id + '.pierna', lejano), col(id + '.pie', lejano)], frente)
      : dibujarBrazo(P, [col(id + '.brazo', lejano), col(id + '.antebrazo', lejano), col(id + '.mano', lejano)]);
    // Un id sin sub-parte resalta el miembro entero
    if (resaltar.has(id)) piezas.forEach(p => (p.color = lejano ? PALETA.resalteLejano : PALETA.resalte));
    return piezas;
  };

  const orden = pose.orden || (frente
    ? ['piernaN', 'piernaL', 'torso', 'brazoN', 'brazoL']
    : ['brazoL', 'piernaL', 'torso', 'piernaN', 'brazoN']);
  const piezas = [];
  for (const k of orden) {
    if (k === 'torso') {
      piezas.push({ d: capsula(J.base, R.cuello, J.cabeza, R.cuello), color: col('cuello') });
      piezas.push({ d: torsoPath(J, vista, torsoA, mira), color: PALETA.cuerpo, torso: true });
      for (const z of pose.resaltar || []) if (ZONAS[z]) piezas.push({ zona: z });
      if (resaltar.has('cuello')) {
        const estirado = frente ? ((pose.cuello ?? torsoA) > torsoA ? J.hombroN : J.hombroL) : null;
        if (estirado) piezas.push({ d: capsula(sum(J.base, angulo(J.base, estirado), dist(J.base, estirado) * 0.75), 4.5, J.cabeza, 5.5), color: PALETA.resalte });
        piezas.push({ d: capsula(J.base, 6, J.cabeza, 6), color: PALETA.resalte });
      }
      piezas.push({ cabeza: true });
    } else piezas.push(...miembro(k.replace(/[NL]$/, ''), k.slice(-1)));
  }

  // Caja de la figura (para apoyarla en el suelo y encuadrar)
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  const incluye = (p, r = 0) => { minX = Math.min(minX, p[0] - r); maxX = Math.max(maxX, p[0] + r); minY = Math.min(minY, p[1] - r); maxY = Math.max(maxY, p[1] + r); };
  incluye(J.cabeza, R.cabeza); incluye(J.pelvis, R.pelvis); incluye(J.pecho, R.pecho);
  for (const k of ['piernaN', 'piernaL']) { const P = J[k]; incluye(P.rodilla, R.rodilla); incluye(P.tobillo, R.tobillo); incluye(P.punta, R.punta); incluye(P.cadera, R.cadera); }
  for (const k of ['brazoN', 'brazoL']) { const P = J[k]; incluye(P.codo, R.codo); incluye(P.muneca, R.muneca); incluye(P.punta, R.mano); }
  const sueloY = (pose.suelo != null ? pose.suelo : maxY) + (pose.sobreSuelo ?? 0);

  // Objetos (pueden usar las articulaciones)
  const objetos = typeof pose.objetos === 'function' ? pose.objetos(J, sueloY) : (pose.objetos || []);
  for (const o of objetos) {
    // Encuadre aproximado de cada objeto
    for (const v of ['x', 'x1', 'x2']) if (o[v] != null) { minX = Math.min(minX, o[v] - 12); maxX = Math.max(maxX, o[v] + 12); }
    if (o.tipo === 'silla' || o.tipo === 'banqueta') { const w = o.ancho ?? 40, d = o.dir ?? 1; minX = Math.min(minX, d === 1 ? o.x - w : o.x); maxX = Math.max(maxX, d === 1 ? o.x : o.x + w); }
    if (o.arriba != null) minY = Math.min(minY, o.arriba - 10);
    if (o.y != null) minY = Math.min(minY, o.y - (o.alto ?? 0));
  }

  const ANCHO = opciones.ancho ?? 280, ALTO = opciones.alto ?? 220, MARGEN = 14;
  const bw = maxX - minX, bh = sueloY - minY;
  const esc = Math.min(1, (ANCHO - 2 * MARGEN) / bw, (ALTO - 2 * MARGEN) / bh);
  const vbW = ANCHO / esc, vbH = ALTO / esc;
  const vbX = (minX + maxX) / 2 - vbW / 2;
  const vbY = sueloY + MARGEN / esc - vbH;

  const svgObj = capa => objetos.filter(o => DELANTE.has(o.tipo) === (capa === 'adelante')).map(o => OBJETOS[o.tipo](o, sueloY)).join('');
  const cuerpo = piezas.map(p => {
    if (p.cabeza) return `<circle cx="${n(J.cabeza[0])}" cy="${n(J.cabeza[1])}" r="${R.cabeza}" fill="${col('cabeza')}"/>`;
    if (p.zona) return `<path d="${zonaTronco(p.zona, J, torsoA, mira, vista)}" fill="${PALETA.resalte}" clip-path="url(#${opciones.id || 'f'}-torso)"/>`;
    return `<path d="${p.d}" fill="${p.color}"/>`;
  }).join('');
  const sueloSVG = pose.sinSuelo ? '' : `<line x1="${n(vbX + 12 / esc)}" y1="${n(sueloY + 2)}" x2="${n(vbX + vbW - 12 / esc)}" y2="${n(sueloY + 2)}" stroke="${PALETA.suelo}" stroke-width="4" stroke-linecap="round"/>`;
  const clip = `<defs><clipPath id="${opciones.id || 'f'}-torso"><path d="${torsoPath(J, vista, torsoA, mira)}"/></clipPath></defs>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n(vbX)} ${n(vbY)} ${n(vbW)} ${n(vbH)}" width="${ANCHO}" height="${ALTO}">` +
    (opciones.titulo ? `<title>${opciones.titulo}</title>` : '') + clip + sueloSVG + svgObj('atras') + cuerpo + svgObj('adelante') + '</svg>';
}
