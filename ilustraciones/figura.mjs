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
  fondo: '#FBF7F1',       // color de la tarjeta donde se muestra la figura
};
const CONTORNO = 3.2;

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
  if (Array.isArray(p) && p.length === 2) { /* ok */ } else if (p) throw new Error('Referencia desconocida: ' + ref);
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
  const mira = pose.mira ?? 1;
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
  // Se resuelven en varias pasadas: un miembro puede apuntar a otro (p. ej. la mano al codo contrario)
  let pendientes = ['piernaN', 'piernaL', 'brazoN', 'brazoL'];
  for (let pasada = 0; pendientes.length && pasada < 4; pasada++) {
    const quedan = [];
    for (const miembro of pendientes) {
      const lado = miembro.slice(-1);
      const spec = pose[miembro] || {};
      const esPierna = miembro.startsWith('pierna');
      const base0 = esPierna ? J['cadera' + lado] : J['hombro' + lado];
      const largos = esPierna ? [LARGO.muslo, LARGO.pierna, LARGO.pie] : [LARGO.brazo, LARGO.antebrazo, LARGO.mano];
      const porDefecto = esPierna ? (vista === 'frente' ? () => 90 : mira === 1 ? () => 0 : () => 180) : a2 => a2;
      const defecto = esPierna ? { a: [90, 90] } : { a: [100, 95] };
      let r;
      try {
        r = cadena(base0, ('a' in spec || 'hacia' in spec) ? spec : { ...defecto, ...spec }, largos, J, porDefecto);
      } catch (err) {
        if (pasada < 3 && String(err.message).startsWith('Referencia desconocida')) { quedan.push(miembro); continue; }
        throw err;
      }
      const [b, p1, p2, p3, a3] = r;
      J[miembro] = esPierna ? { cadera: b, rodilla: p1, tobillo: p2, punta: p3, angPie: a3 } : { hombro: b, codo: p1, muneca: p2, punta: p3 };
    }
    pendientes = quedan;
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

// Cuello anatómico: masa que baja en pendiente (trapecio) desde la base del cráneo hasta los hombros.
// lado = -1 / +1 en el eje perpendicular al torso (vista lateral: +1 = frente, -1 = nuca).
function cuelloGeo(J, vista, torsoA, mira) {
  const u = [Math.cos(rad(torsoA)), Math.sin(rad(torsoA))];
  const v = [-u[1] * mira, u[0] * mira];
  const P = (a, b) => [J.pelvis[0] + u[0] * a + v[0] * b, J.pelvis[1] + u[1] * a + v[1] * b];
  const dn = [(J.cabeza[0] - J.base[0]) / dist(J.base, J.cabeza), (J.cabeza[1] - J.base[1]) / dist(J.base, J.cabeza)];
  const frente = vista === 'frente';
  const borde = s => {
    let pn = [-dn[1], dn[0]];
    if (pn[0] * v[0] + pn[1] * v[1] < 0) pn = [-pn[0], -pn[1]];
    pn = [pn[0] * s, pn[1] * s];
    const A = frente ? P(45.5, s * 15) : P(44, s * (s > 0 ? 9 : 9.5));
    const H = [J.cabeza[0] - dn[0] * R.cabeza * 0.45 + pn[0] * R.cabeza * (frente ? 0.62 : 0.6),
               J.cabeza[1] - dn[1] * R.cabeza * 0.45 + pn[1] * R.cabeza * (frente ? 0.62 : 0.6)];
    // punto medio hundido: la pendiente del trapecio es cóncava
    const M = [(A[0] + H[0]) / 2 - pn[0] * (frente ? 2.2 : 1.2), (A[1] + H[1]) / 2 - pn[1] * (frente ? 2.2 : 1.2)];
    return [A, M, H];
  };
  const izq = borde(-1), der = borde(1);
  const fondo = P(38, 0), arriba = [J.cabeza[0], J.cabeza[1]];
  const forma = contorno([fondo, izq[0], izq[1], izq[2], arriba, der[2], der[1], der[0]]);
  return { forma, borde };
}

function bandaCuello(geo, lado) {
  const [A, M, H] = geo.borde(lado);
  const N = 14, l1 = [], l2 = [];
  const curva = t => [(1 - t) ** 2 * A[0] + 2 * (1 - t) * t * (2 * M[0] - (A[0] + H[0]) / 2) + t * t * H[0],
                      (1 - t) ** 2 * A[1] + 2 * (1 - t) * t * (2 * M[1] - (A[1] + H[1]) / 2) + t * t * H[1]];
  for (let i = 0; i <= N; i++) {
    const t = i / N, p = curva(t), q = curva(Math.min(1, t + 0.01)), r0 = curva(Math.max(0, t - 0.01));
    const d = [q[0] - r0[0], q[1] - r0[1]], L = Math.hypot(d[0], d[1]);
    const w = 7.5 - 2.5 * t;
    l1.push([p[0] - (d[1] / L) * w, p[1] + (d[0] / L) * w]);
    l2.push([p[0] + (d[1] / L) * w, p[1] - (d[0] / L) * w]);
  }
  return contorno([...l1, ...l2.reverse()]);
}

// Vista de espaldas: línea de la columna y omóplatos, para que se lea que vemos la espalda
function marcasEspalda(J, torsoA, mira) {
  const u = [Math.cos(rad(torsoA)), Math.sin(rad(torsoA))];
  const v = [-u[1] * mira, u[0] * mira];
  const P = (a, b) => [J.pelvis[0] + u[0] * a + v[0] * b, J.pelvis[1] + u[1] * a + v[1] * b];
  const col = '#3F8580';
  const columna = linea([P(47, 0), P(30, 0.4), P(12, -0.3), P(-2, 0)], col, 1.8);
  const omoplato = s => {
    const a = P(42, s * 4.5), b = P(34, s * 11.5), c = P(27, s * 6);
    return `<path d="M${n(a[0])} ${n(a[1])}Q${n(b[0])} ${n(b[1])} ${n(c[0])} ${n(c[1])}" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round"/>`;
  };
  return `<g opacity=".9">${columna}${omoplato(-1)}${omoplato(1)}</g>`;
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
  // Barra horizontal fija a una pared (vista lateral: se ve como un círculo con soporte)
  barra: o => {
    const sop = o.pared != null ? linea([[o.pared, o.y], [o.x, o.y]], PALETA.objetoBorde, 3) : '';
    return sop + `<circle cx="${n(o.x)}" cy="${n(o.y)}" r="4.5" fill="${PALETA.objetoBorde}"/>`;
  },
  // Banco bajo (como una mesa baja): x1, x2, y (superficie)
  banco: (o, suelo) => OBJETOS.mesa(o, suelo),
  // Tabla inclinada / escalón en cuña: x1 (lado bajo), x2 (lado alto), alto
  cuna: (o, suelo) => {
    const a = o.alto ?? 12;
    return `<path d="M${n(o.x1)} ${n(suelo)}L${n(o.x2)} ${n(suelo - (o.x2 > o.x1 ? 0 : a))}L${n(o.x2)} ${n(suelo - a)}Z" fill="${PALETA.objeto}" stroke="${PALETA.objetoBorde}" stroke-width="1.5" stroke-linejoin="round"/>`;
  },
  // Correa o cinta (como la toalla, más fina)
  correa: o => linea(o.puntos, PALETA.accesorio, 3),
  // Comodín: SVG libre (o.svg). capa: 'adelante' | 'atras' con o.delante
  svg: o => o.svg,
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
const DELANTE = new Set(['toalla', 'palo', 'mancuerna', 'flecha', 'correa']);
const delante = o => o.delante ?? DELANTE.has(o.tipo);

// ---------- Render principal ----------
const PALETA_COMPANERO = { cuerpo: '#8DB3AE', lejano: '#B7D0CC', resalte: '#8DB3AE', resalteLejano: '#B7D0CC' };

// Construye las piezas de una figura. Devuelve el SVG del cuerpo, sus articulaciones, su caja y sus recortes.
function construirFigura(pose, idp, pal) {
  const { J, vista, torsoA } = resolver(pose);
  const frente = vista === 'frente';
  const mira = pose.mira ?? 1;
  const resaltar = new Set(pose.resaltar || []);
  const col = (id, lejano) => resaltar.has(id) ? (lejano ? pal.resalteLejano : pal.resalte) : (lejano ? pal.lejano : pal.cuerpo);

  const miembro = (tipo, lado) => {
    const lejano = !frente && lado === 'L';
    const id = tipo + lado;
    const P = J[id];
    const piezas = tipo === 'pierna'
      ? dibujarPierna(P, [col(id + '.muslo', lejano), col(id + '.pierna', lejano), col(id + '.pie', lejano)], frente)
      : dibujarBrazo(P, [col(id + '.brazo', lejano), col(id + '.antebrazo', lejano), col(id + '.mano', lejano)]);
    if (resaltar.has(id)) piezas.forEach(p => (p.color = lejano ? pal.resalteLejano : pal.resalte));
    return piezas;
  };

  const orden = pose.orden || (frente
    ? ['piernaN', 'piernaL', 'torso', 'brazoN', 'brazoL']
    : ['brazoL', 'piernaL', 'torso', 'piernaN', 'brazoN']);
  const piezas = [];
  const geoCuello = cuelloGeo(J, vista, torsoA, mira);
  for (const k of orden) {
    if (k === 'torso') {
      piezas.push({ d: torsoPath(J, vista, torsoA, mira), color: pal.cuerpo });
      piezas.push({ d: geoCuello.forma, color: pal.cuerpo });
      for (const z of pose.resaltar || []) if (ZONAS[z]) piezas.push({ zona: z });
      if (resaltar.has('cuello')) {
        const lado = frente ? (pose.ladoCuello ?? ((pose.cuello ?? torsoA) > torsoA ? -1 : 1)) : (pose.cuelloLado === 'frente' ? 1 : -1);
        piezas.push({ d: bandaCuello(geoCuello, lado), color: pal.resalte, recorte: 'cuello' });
      }
      if (pose.espaldas && frente) piezas.push({ raw: marcasEspalda(J, torsoA, mira) });
      if (!orden.includes('cabeza')) piezas.push({ cabeza: true });
    } else if (k === 'cabeza') {
      piezas.push({ cabeza: true });
    } else piezas.push({ grupo: miembro(k.replace(/[NL]$/, ''), k.slice(-1)) });
  }

  const caja = { minX: 1e9, maxX: -1e9, minY: 1e9, maxY: -1e9 };
  const incluye = (p, r = 0) => { caja.minX = Math.min(caja.minX, p[0] - r); caja.maxX = Math.max(caja.maxX, p[0] + r); caja.minY = Math.min(caja.minY, p[1] - r); caja.maxY = Math.max(caja.maxY, p[1] + r); };
  incluye(J.cabeza, R.cabeza); incluye(J.pelvis, R.pelvis); incluye(J.pecho, R.pecho);
  for (const k of ['piernaN', 'piernaL']) { const P = J[k]; incluye(P.rodilla, R.rodilla); incluye(P.tobillo, R.tobillo); incluye(P.punta, R.punta); incluye(P.cadera, R.cadera); }
  for (const k of ['brazoN', 'brazoL']) { const P = J[k]; incluye(P.codo, R.codo); incluye(P.muneca, R.muneca); incluye(P.punta, R.mano); }

  const tp = torsoPath(J, vista, torsoA, mira);
  const defs = `<clipPath id="${idp}-torso"><path d="${tp}"/></clipPath><clipPath id="${idp}-cuello"><path d="${geoCuello.forma}"/></clipPath>`;
  const svg = piezas.map(p => {
    if (p.cabeza) return `<circle cx="${n(J.cabeza[0])}" cy="${n(J.cabeza[1])}" r="${R.cabeza}" fill="${col('cabeza')}" stroke="${PALETA.fondo}" stroke-width="${CONTORNO}" paint-order="stroke"/>`;
    if (p.zona) return `<path d="${zonaTronco(p.zona, J, torsoA, mira, vista)}" fill="${pal.resalte}" clip-path="url(#${idp}-torso)"/>`;
    if (p.grupo) {
      // Contorno color fondo alrededor del miembro completo: lo separa de lo que tiene detrás
      const borde = p.grupo.map(q => `<path d="${q.d}" fill="${PALETA.fondo}" stroke="${PALETA.fondo}" stroke-width="${CONTORNO}" stroke-linejoin="round"/>`).join('');
      return '<g>' + borde + p.grupo.map(q => `<path d="${q.d}" fill="${q.color}"/>`).join('') + '</g>';
    }
    if (p.recorte) return `<path d="${p.d}" fill="${p.color}" clip-path="url(#${idp}-${p.recorte})"/>`;
    if (p.raw) return p.raw;
    return `<path d="${p.d}" fill="${p.color}"/>`;
  }).join('');
  return { J, caja, defs, svg };
}

// Prepara una postura: figura, compañero, objetos evaluados, suelo y caja total (sin dibujar todavía)
function preparar(pose, opciones = {}) {
  const id = opciones.id || 'f';
  const fig = construirFigura(pose, id, PALETA);
  const { J } = fig;
  let { minX, maxX, minY, maxY } = fig.caja;
  const sueloY = (pose.suelo != null ? pose.suelo : maxY) + (pose.sobreSuelo ?? 0);

  // Compañero (opcional): otra figura apoyada en el mismo suelo, desplazada dx respecto a la pelvis principal
  let comp = null;
  if (pose.companero) {
    const c = pose.companero;
    comp = construirFigura(c.pose, id + '-c', PALETA_COMPANERO);
    const dx = c.dx ?? 60;
    const dy = c.dy ?? (sueloY - comp.caja.maxY);
    comp.dx = dx; comp.dy = dy;
    minX = Math.min(minX, comp.caja.minX + dx); maxX = Math.max(maxX, comp.caja.maxX + dx);
    minY = Math.min(minY, comp.caja.minY + dy);
    // Articulaciones del compañero en coordenadas del dibujo (para objetos o para apuntar manos)
    comp.Jg = JSON.parse(JSON.stringify(comp.J), (k, v) => Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' ? [v[0] + dx, v[1] + dy] : v);
  }

  // Objetos (pueden usar las articulaciones)
  const objetos = opciones.objetosFijos ?? (typeof pose.objetos === 'function' ? pose.objetos(J, sueloY, comp?.Jg) : (pose.objetos || []));
  for (const o of objetos) {
    for (const v of ['x', 'x1', 'x2']) if (o[v] != null) { minX = Math.min(minX, o[v] - 12); maxX = Math.max(maxX, o[v] + 12); }
    if (o.tipo === 'silla' || o.tipo === 'banqueta') { const w = o.ancho ?? 40, d = o.dir ?? 1; minX = Math.min(minX, d === 1 ? o.x - w : o.x); maxX = Math.max(maxX, d === 1 ? o.x : o.x + w); }
    if (o.arriba != null) minY = Math.min(minY, o.arriba - 10);
    if (o.y != null) minY = Math.min(minY, o.y - (o.alto ?? 0));
    if (o.caja) { minX = Math.min(minX, o.caja[0]); minY = Math.min(minY, o.caja[1]); maxX = Math.max(maxX, o.caja[2]); }
  }
  return { id, pose, fig, J, comp, objetos, sueloY, caja: { minX, maxX, minY } };
}

function camaraPara(caja, sueloY, opciones) {
  const ANCHO = opciones.ancho ?? 280, ALTO = opciones.alto ?? 220, MARGEN = 14;
  const bw = caja.maxX - caja.minX, bh = sueloY - caja.minY;
  // zoomMax > 1 permite agrandar figuras pequeñas (tumbadas, encogidas) para que llenen el cuadro
  const esc = Math.min(opciones.zoomMax ?? 1, (ANCHO - 2 * MARGEN) / bw, (ALTO - 2 * MARGEN) / bh);
  const vbW = ANCHO / esc, vbH = ALTO / esc;
  return { ANCHO, ALTO, esc, vbW, vbH, vbX: (caja.minX + caja.maxX) / 2 - vbW / 2, vbY: sueloY + MARGEN / esc - vbH };
}

// Pinta una postura preparada. `cuerpo` permite sustituir la figura (fotogramas de animación) y desplazarla.
function pintar(P, cam, opciones = {}, cuerpo = null) {
  const { pose, comp, objetos, sueloY, id } = P;
  const fig = cuerpo?.fig ?? P.fig;
  const mover = cuerpo ? `translate(${n(cuerpo.dx)} ${n(cuerpo.dy)})` : '';
  const svgObj = capa => objetos.filter(o => delante(o) === (capa === 'adelante')).map(o => OBJETOS[o.tipo](o, sueloY)).join('');
  const compSVG = comp ? `<g transform="translate(${n(comp.dx)} ${n(comp.dy)})">${comp.svg}</g>` : '';
  const compDelante = pose.companero?.delante;
  const figSVG = mover ? `<g transform="${mover}">${fig.svg}</g>` : fig.svg;
  const { vbX, vbY, vbW, vbH, esc, ANCHO, ALTO } = cam;
  const sueloSVG = pose.sinSuelo ? '' : `<line x1="${n(vbX + 12 / esc)}" y1="${n(sueloY + 2)}" x2="${n(vbX + vbW - 12 / esc)}" y2="${n(sueloY + 2)}" stroke="${PALETA.suelo}" stroke-width="4" stroke-linecap="round"/>`;
  const defs = `<defs>${fig.defs}${comp ? comp.defs : ''}</defs>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n(vbX)} ${n(vbY)} ${n(vbW)} ${n(vbH)}" width="${ANCHO}" height="${ALTO}">` +
    (opciones.titulo ? `<title>${opciones.titulo}</title>` : '') + defs + sueloSVG + svgObj('atras') +
    (compDelante ? '' : compSVG) + figSVG + (compDelante ? compSVG : '') + svgObj('adelante') + '</svg>';
  return idsUnicos(svg, id);
}

export function dibujar(pose, opciones = {}) {
  const P = preparar(pose, opciones);
  return pintar(P, camaraPara(P.caja, P.sueloY, opciones), opciones);
}

// ---------- Animación ----------
// Postura con todos los ángulos explícitos (resuelve la cinemática inversa y las referencias)
const MIEMBROS = ['piernaN', 'piernaL', 'brazoN', 'brazoL'];
function explicita(pose) {
  const { J } = resolver(pose);
  const r = { torso: pose.torso ?? -90, cuello: pose.cuello ?? pose.torso ?? -90 };
  for (const m of MIEMBROS) {
    const P = J[m];
    const p = m.startsWith('pierna') ? [P.cadera, P.rodilla, P.tobillo, P.punta] : [P.hombro, P.codo, P.muneca, P.punta];
    r[m] = { a: [angulo(p[0], p[1]), angulo(p[1], p[2])], fin: angulo(p[2], p[3]), escala: pose[m]?.escala ?? [1, 1, 1] };
  }
  return r;
}
const mezclaAng = (a, b, t) => a + ((((b - a) % 360) + 540) % 360 - 180) * t;
const mezclaNum = (a, b, t) => a + (b - a) * t;

/** Punto de apoyo que no debe moverse durante la animación (por defecto, la articulación más baja de la postura final). */
const CANDIDATOS_ANCLA = ['piernaN.punta', 'piernaN.tobillo', 'piernaL.punta', 'piernaL.tobillo', 'piernaN.rodilla', 'piernaL.rodilla',
  'brazoN.punta', 'brazoL.punta', 'pelvis', 'cabeza'];
function nombreAncla(J) {
  let mejor = CANDIDATOS_ANCLA[0];
  for (const c of CANDIDATOS_ANCLA) if (resolverRef(c, J)[1] > resolverRef(mejor, J)[1] + 0.5) mejor = c;
  return mejor;
}
function puntoAncla(pose, J) {
  return resolverRef(pose.ancla ?? nombreAncla(J), J);
}

/**
 * Prepara la animación de `inicio` a `fin` (la postura del ejercicio). Devuelve `cuadro(t)` con t de 0 a 1.
 * Los objetos, el suelo y la cámara quedan fijos; el punto de apoyo no se desliza.
 */
export function animacion(inicio, fin, opciones = {}) {
  const P = preparar(fin, opciones);
  const B = explicita(fin);
  const A = explicita({ ...fin, ...inicio, objetos: undefined });
  const base = { ...fin };
  delete base.objetos;
  // En vista frontal, la franja del cuello se queda en el lado que tiene en la postura final
  const tF = fin.torso ?? -90;
  if ((fin.vista || 'lado') === 'frente') base.ladoCuello = fin.ladoCuello ?? ((fin.cuello ?? tF) > tF ? -1 : 1);
  // El punto de apoyo puede indicarse en la postura inicial o en la final
  const refAncla = { ancla: inicio.ancla ?? fin.ancla ?? nombreAncla(P.J) };
  const anclaFin = puntoAncla(refAncla, P.J);
  const posePara = t => {
    const x = { ...base, torso: mezclaAng(A.torso, B.torso, t), cuello: mezclaAng(A.cuello, B.cuello, t) };
    for (const m of MIEMBROS) {
      x[m] = {
        a: [mezclaAng(A[m].a[0], B[m].a[0], t), mezclaAng(A[m].a[1], B[m].a[1], t)],
        fin: mezclaAng(A[m].fin, B[m].fin, t),
        escala: A[m].escala.map((e, i) => mezclaNum(e, B[m].escala[i], t)),
      };
    }
    return x;
  };
  const cuerpoPara = t => {
    const pose = posePara(t);
    const fig = construirFigura(pose, P.id, PALETA);
    const ancla = puntoAncla(refAncla, fig.J);
    // x: el apoyo no se desliza; y: el punto más bajo sigue tocando la misma altura que al final
    return { fig, dx: anclaFin[0] - ancla[0], dy: P.fig.caja.maxY - fig.caja.maxY };
  };
  // Cámara fija que abarca todo el recorrido
  const caja = { ...P.caja };
  for (const t of [0, 0.25, 0.5, 0.75]) {
    const c = cuerpoPara(t);
    caja.minX = Math.min(caja.minX, c.fig.caja.minX + c.dx);
    caja.maxX = Math.max(caja.maxX, c.fig.caja.maxX + c.dx);
    caja.minY = Math.min(caja.minY, c.fig.caja.minY + c.dy);
  }
  const cam = camaraPara(caja, P.sueloY, opciones);
  return { cuadro: t => (t >= 1 ? pintar(P, cam, opciones) : pintar(P, cam, opciones, cuerpoPara(Math.max(0, t)))) };
}

// Los objetos 'svg' de las posturas pueden traer ids fijos (recortes, máscaras). Cuando la misma figura aparece
// varias veces en una página, los ids se repetirían: se les añade el prefijo único de este dibujo.
function idsUnicos(svg, id) {
  const propios = new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]).filter(x => !x.startsWith(id + '-')));
  if (!propios.size) return svg;
  let r = svg;
  for (const x of propios) {
    const nuevo = `${id}-${x}`;
    r = r.split(`id="${x}"`).join(`id="${nuevo}"`).split(`url(#${x})`).join(`url(#${nuevo})`).split(`href="#${x}"`).join(`href="#${nuevo}"`);
  }
  return r;
}
