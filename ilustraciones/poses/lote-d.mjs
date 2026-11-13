// Tanda d: ejercicios 50–65 (sin el 61, ya aprobado). Ver GUIA_POSES.md
import { resolver } from '../figura.mjs';

// ---------- Ayudas para colocar al compañero ----------
// Punto más bajo de una figura (mismo cálculo de caja que el motor)
function maxY(pose) {
  const { J } = resolver(pose);
  const pts = [[J.cabeza, 12], [J.pelvis, 12.5], [J.pecho, 13.5]];
  for (const k of ['piernaN', 'piernaL']) pts.push([J[k].cadera, 9], [J[k].rodilla, 6.5], [J[k].tobillo, 5], [J[k].punta, 3.2]);
  for (const k of ['brazoN', 'brazoL']) pts.push([J[k].codo, 5], [J[k].muneca, 4], [J[k].punta, 3.6]);
  return Math.max(...pts.map(([p, r]) => p[1] + r));
}
// Articulaciones de la figura principal
const art = pose => resolver(pose).J;
// Convierte un punto del dibujo a coordenadas locales del compañero (que apoya en el mismo suelo)
function aLocal(principal, compSinBrazos, dx, p) {
  const suelo = (principal.suelo ?? maxY(principal)) + (principal.sobreSuelo ?? 0);
  const dy = suelo - maxY(compSinBrazos);
  return [p[0] - dx, p[1] - dy];
}
// Colchoneta vista desde arriba (figura tumbada dibujada en planta). Añade la colchoneta a los objetos y
// fija el "suelo" (borde inferior del encuadre) en el borde de la colchoneta para que no quede cortada.
function enColchoneta(pose, m = 10) {
  const { J } = resolver(pose);
  const pts = [J.cabeza, J.pelvis];
  for (const k of ['piernaN', 'piernaL']) pts.push(J[k].rodilla, J[k].tobillo, J[k].punta);
  for (const k of ['brazoN', 'brazoL']) pts.push(J[k].codo, J[k].muneca, J[k].punta);
  const x1 = Math.min(...pts.map(p => p[0])) - m - 6, x2 = Math.max(...pts.map(p => p[0])) + m + 6;
  const y1 = Math.min(...pts.map(p => p[1])) - m - 4, y2 = Math.max(...pts.map(p => p[1])) + m + 4;
  const mat = { tipo: 'svg', delante: false, caja: [x1, y1, x2],
    svg: `<rect x="${x1.toFixed(1)}" y="${y1.toFixed(1)}" width="${(x2 - x1).toFixed(1)}" height="${(y2 - y1).toFixed(1)}" rx="10" fill="#7CC6A6" opacity=".22"/>` };
  const previos = pose.objetos;
  return { ...pose, sinSuelo: true, suelo: y2 - 2, objetos: (J2, ...r) => [mat, ...(previos ? previos(J2, ...r) : [])] };
}
const mezcla = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// ---------- 55 · Abdominales con compañero ----------
const p55 = {
  nombre: 'Abdominales',
  vista: 'lado',
  torso: -44,
  cuello: -60,
  mira: 1,
  piernaN: { a: [180, 180], fin: 180 },
  piernaL: { a: [178, 180], fin: 180 },
  brazoN: { a: [-92, -94], fin: -94 },
  brazoL: { a: [-96, -98], fin: -98 },
  resaltar: ['abdomen'],
};
const dx55 = -6;
const c55base = {
  vista: 'lado',
  torso: -48,
  cuello: -30,
  piernaN: { a: [78, 102], fin: 0 },
  piernaL: { a: [82, 100], fin: 0 },
};
{
  const J = art(p55);
  const agarreN = mezcla(J.brazoN.hombro, J.brazoN.codo, 0.55);
  const agarreL = mezcla(J.brazoL.hombro, J.brazoL.codo, 0.4);
  c55base.brazoN = { hacia: aLocal(p55, c55base, dx55, agarreN), doblez: -1, fin: 30 };
  c55base.brazoL = { hacia: aLocal(p55, c55base, dx55, agarreL), doblez: -1, fin: 30 };
  p55.companero = { dx: dx55, pose: c55base, delante: true };
}

// ---------- 59 · Romboides con compañero (tumbado en una mesa) ----------
const p59 = {
  nombre: 'Romboides',
  vista: 'lado',
  torso: 0,
  mira: 1,
  cuello: -6,
  piernaN: { a: [180, 180], fin: 180 },
  piernaL: { a: [179, 180], fin: 180 },
  // Codo flexionado, antebrazo descansando sobre la zona lumbar
  brazoN: { hacia: [8, -12], doblez: -1, fin: 180 },
  brazoL: { a: [176, 178], fin: 178 },
  sobreSuelo: 72,
  resaltar: ['espalda'],
  objetos: (J, sueloY) => [{ tipo: 'mesa', x1: -95, x2: 72, y: sueloY - 72, delante: true }],
};
const dx59 = 36;
const c59base = {
  vista: 'frente',
  torso: -90,
  piernaN: { a: [97, 92], fin: 115, escala: [1, 1, 0.5] },
  piernaL: { a: [83, 88], fin: 65, escala: [1, 1, 0.5] },
};
{
  const J = art(p59);
  const h = J.brazoN.hombro;
  c59base.brazoN = { hacia: aLocal(p59, c59base, dx59, [h[0] - 9, h[1] - 10]), doblez: -1, fin: 60 };
  c59base.brazoL = { hacia: aLocal(p59, c59base, dx59, [h[0] + 6, h[1] + 4]), doblez: 1, fin: 120 };
  p59.companero = { dx: dx59, pose: c59base, delante: false };
}

// ---------- 64 · Pectorales con compañero (sentado) ----------
const brazoNuca = (J, lado) => J.cabeza; // marcador (no se usa)
const p64 = {
  nombre: 'Pectorales',
  vista: 'lado',
  torso: -90,
  piernaN: { a: [0, 90], fin: 0 },
  piernaL: { a: [-2, 92], fin: 0 },
  brazoN: { hacia: J => [J.cabeza[0] - 10, J.cabeza[1] + 2], doblez: -1, escala: [0.7, 0.85, 1], fin: 20 },
  brazoL: { hacia: J => [J.cabeza[0] - 9, J.cabeza[1]], doblez: -1, escala: [0.7, 0.85, 1], fin: 20 },
  resaltar: ['pecho'],
  objetos: J => [{ tipo: 'banqueta', x: 18, y: 12, ancho: 38 }],
};
const dx64 = -42;
const c64base = {
  vista: 'lado',
  torso: -82,
  piernaN: { a: [96, 90], fin: 0 },
  piernaL: { a: [84, 92], fin: 0 },
};
{
  const J = art(p64);
  c64base.brazoN = { hacia: aLocal(p64, c64base, dx64, [J.brazoN.codo[0] - 2, J.brazoN.codo[1]]), doblez: 1, fin: 0 };
  c64base.brazoL = { hacia: aLocal(p64, c64base, dx64, [J.brazoL.codo[0] - 2, J.brazoL.codo[1] - 1]), doblez: 1, fin: 0 };
  p64.companero = { dx: dx64, pose: c64base, delante: false };
}

export default {
  // 50 · Glúteos: zancada con la rodilla de atrás en el suelo, manos en la cadera
  50: {
    nombre: 'Glúteos',
    vista: 'lado',
    torso: -88,
    piernaN: { a: [0, 90], fin: 0 },
    piernaL: { a: [113, 180], fin: 180 },
    orden: ['brazoL', 'piernaL', 'piernaN', 'torso', 'brazoN'],
    brazoN: { hacia: [-1, -5], doblez: 1, fin: 95 },
    brazoL: { hacia: [-3, -7], doblez: 1, fin: 95 },
    resaltar: ['gluteo'],
  },

  // 51 · Glúteos y otros músculos de la cadera: tumbado boca arriba (visto desde arriba, sobre una
  // colchoneta), rodilla cruzada al otro lado, empujada con la mano contraria; el otro brazo en cruz
  51: enColchoneta({
    nombre: 'Glúteos y otros músculos de la cadera',
    vista: 'frente',
    torso: 180,
    piernaN: { a: [1, 0], fin: 0, escala: [1, 1, 0.5] },
    piernaL: { a: [84, 6], fin: 6, escala: [1, 1, 0.5] },
    brazoN: { hacia: 'piernaL.rodilla+-2,-3', doblez: -1, fin: 20 },
    orden: ['piernaN', 'torso', 'piernaL', 'brazoN', 'brazoL'],
    brazoL: { a: [-92, -90], fin: -90 },
    resaltar: ['gluteo'],
  }),

  // 52 · Parte inferior del abdomen: tumbado boca arriba (visto desde arriba), rodillas juntas
  // caídas a un lado, brazos en cruz
  52: enColchoneta({
    nombre: 'Parte inferior del abdomen',
    vista: 'frente',
    torso: 0,
    piernaN: { a: [104, 178], fin: 178, escala: [1, 1, 0.5] },
    piernaL: { a: [96, 182], fin: 182, escala: [1, 1, 0.5] },
    brazoN: { a: [-88, -90], fin: -90 },
    brazoL: { a: [88, 90], fin: 90 },
    orden: ['piernaL', 'piernaN', 'torso', 'brazoN', 'brazoL'],
    resaltar: ['abdomen'],
  }),

  // 53 · Sentado, pierna cruzada sobre la estirada, codo contra la rodilla, giro del tronco
  53: {
    nombre: 'Glúteos y músculos de la cadera y la parte inferior del abdomen',
    vista: 'lado',
    torso: -97,
    cuello: -88,
    piernaL: { a: [3, 1], fin: -70 },
    piernaN: { hacia: [22, 7.5], doblez: -1, fin: 0 },
    // Codo contrario por fuera de la rodilla elevada (queda detrás de ella), antebrazo hacia arriba
    brazoL: { hacia: J => [J.piernaN.rodilla[0] + 4, J.piernaN.rodilla[1] - 14], doblez: 1, fin: -70 },
    // Mano apoyada en el suelo, detrás de la cadera
    brazoN: { hacia: [-20, 8.5], doblez: 1, fin: 180 },
    orden: ['piernaL', 'torso', 'brazoL', 'piernaN', 'brazoN'],
    resaltar: ['gluteo', 'abdomen'],
  },

  // 54 · Abdominales: boca abajo, se eleva el tronco con los brazos (cobra)
  54: {
    nombre: 'Abdominales',
    vista: 'lado',
    torso: -58,
    cuello: -72,
    mira: 1,
    piernaN: { a: [180, 180], fin: 180 },
    piernaL: { a: [179, 180], fin: 180 },
    brazoN: { hacia: [29, 8], doblez: -1, fin: 0 },
    brazoL: { hacia: [27, 8], doblez: -1, fin: 0 },
    resaltar: ['abdomen'],
  },

  55: p55,

  // 56 · Región lumbar: sentado en una silla, tronco doblado hacia delante, brazos colgando
  56: {
    nombre: 'Región lumbar',
    vista: 'lado',
    torso: 18,
    cuello: 85,
    piernaN: { a: [0, 92], fin: 0 },
    piernaL: { a: [-2, 94], fin: 0 },
    brazoN: { hacia: [50, 41], doblez: 1, fin: 90 },
    brazoL: { hacia: [48, 41], doblez: 1, fin: 90 },
    resaltar: ['lumbar'],
    objetos: J => [{ tipo: 'silla', x: 16, y: 12, dir: 1 }],
  },

  // 57 · Región lumbar: boca arriba, rodillas al pecho sujetas por detrás, cadera algo elevada
  57: {
    nombre: 'Región lumbar',
    vista: 'lado',
    torso: 172,
    mira: 1,
    piernaN: { a: [-140, -70], fin: -60 },
    piernaL: { a: [-144, -74], fin: -64 },
    brazoN: { hacia: 'piernaN.rodilla+4,2', doblez: 1, fin: -40 },
    brazoL: { hacia: 'piernaL.rodilla+3,0', doblez: 1, fin: -40 },
    resaltar: ['lumbar'],
  },

  // 58 · Romboides: sentado en el suelo, pecho sobre los muslos, manos bajo las rodillas
  58: {
    nombre: 'Romboides',
    vista: 'lado',
    torso: -28,
    cuello: 10,
    piernaN: { a: [-10, 22], fin: -40 },
    piernaL: { a: [-12, 24], fin: -40 },
    brazoN: { hacia: 'piernaN.rodilla+-2,8', doblez: -1, fin: 60 },
    brazoL: { hacia: 'piernaL.rodilla+-3,8', doblez: -1, fin: 60 },
    resaltar: ['espalda'],
  },

  59: p59,

  // 60 · Pectorales: sentado, se inclina hacia atrás sobre el respaldo bajo, manos tras la nuca
  60: {
    nombre: 'Pectorales',
    vista: 'lado',
    torso: -122,
    cuello: -110,
    piernaN: { a: [2, 88], fin: 0 },
    piernaL: { a: [-4, 94], fin: 0 },
    brazoN: { hacia: J => [J.cabeza[0] - 8, J.cabeza[1] + 5], doblez: -1, escala: [0.7, 0.85, 1], fin: 20 },
    brazoL: { hacia: J => [J.cabeza[0] - 7, J.cabeza[1] + 3], doblez: -1, escala: [0.7, 0.85, 1], fin: 20 },
    resaltar: ['pecho'],
    objetos: J => [{ tipo: 'silla', x: 18, y: 12, dir: 1, alto: 28 }],
  },

  // 62 · Pectorales en el marco de la puerta: codos a la altura de los hombros
  62: {
    nombre: 'Pectorales',
    vista: 'frente',
    torso: -90,
    piernaN: { a: [97, 92], fin: 115, escala: [1, 1, 0.5] },
    piernaL: { a: [83, 88], fin: 65, escala: [1, 1, 0.5] },
    brazoN: { a: [180, -90], fin: -90 },
    brazoL: { a: [0, -90], fin: -90 },
    resaltar: ['pecho'],
    objetos: J => [{ tipo: 'puerta', x1: J.brazoN.codo[0] + 2, x2: J.brazoL.codo[0] - 2, arriba: J.cabeza[1] - 45 }],
  },

  // 63 · Pectorales en el marco de la puerta: codos por encima de los hombros
  63: {
    nombre: 'Pectorales',
    vista: 'frente',
    torso: -90,
    piernaN: { a: [97, 92], fin: 115, escala: [1, 1, 0.5] },
    piernaL: { a: [83, 88], fin: 65, escala: [1, 1, 0.5] },
    brazoN: { a: [-145, -92], fin: -92 },
    brazoL: { a: [-35, -88], fin: -88 },
    resaltar: ['pecho'],
    objetos: J => [{ tipo: 'puerta', x1: J.brazoN.codo[0] + 2, x2: J.brazoL.codo[0] - 2, arriba: J.brazoN.punta[1] - 12 }],
  },

  64: p64,

  // 65 · Pectorales: boca arriba en un banco, brazos abiertos con mancuernas
  65: {
    nombre: 'Pectorales',
    vista: 'lado',
    torso: 180,
    mira: 1,
    piernaN: { a: [0, 0], fin: -80 },
    piernaL: { a: [1, 0], fin: -80 },
    brazoN: { a: [96, 80], escala: [0.85, 0.85, 1], fin: 80 },
    brazoL: { a: [100, 84], escala: [0.85, 0.85, 1], fin: 84 },
    suelo: 70,
    resaltar: ['pecho'],
    objetos: J => [
      { tipo: 'banco', x1: J.cabeza[0] - 10, x2: J.piernaN.punta[0] + 4, y: 12 },
      { tipo: 'mancuerna', x: J.brazoN.punta[0], y: J.brazoN.punta[1], ang: 0 },
      { tipo: 'mancuerna', x: J.brazoL.punta[0], y: J.brazoL.punta[1], ang: 0 },
    ],
  },
};
