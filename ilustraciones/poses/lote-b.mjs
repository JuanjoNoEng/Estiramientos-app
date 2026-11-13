// Tanda b: ejercicios 16–30 (espalda alta, pectorales, hombros, brazos, muñecas y cuello). Ver GUIA_POSES.md

// Disco de pesas visto de lado (barra con peso del ejercicio 29)
const disco = (c, r = 11) =>
  `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="#8FA9A4"/><circle cx="${c[0]}" cy="${c[1]}" r="${r - 4}" fill="none" stroke="#6F8F89" stroke-width="1.5"/><circle cx="${c[0]}" cy="${c[1]}" r="2.5" fill="#6F8F89"/>`;

export default {
  // 16 · Parte superior de la espalda: tronco horizontal, brazos estirados agarrando una barra
  16: {
    nombre: 'Parte superior de la espalda',
    vista: 'lado',
    torso: 6,
    cuello: 16,
    piernaN: { a: [90, 90] },
    piernaL: { a: [92, 90] },
    brazoN: { a: [-6, -6], fin: -6 },
    brazoL: { a: [-7, -7], fin: -7 },
    // El brazo cercano por detrás del tronco para que se vea la espalda resaltada; la cabeza entre los brazos
    orden: ['brazoL', 'piernaL', 'cabeza', 'brazoN', 'torso', 'piernaN'],
    resaltar: ['espalda'],
    objetos: J => [{ tipo: 'barra', x: J.brazoN.punta[0] + 2, y: J.brazoN.punta[1] - 1, pared: J.brazoN.punta[0] + 22 },
      { tipo: 'pared', x: J.brazoN.punta[0] + 22, lado: 1 }],
  },

  // 17 · Pectorales: de rodillas, antebrazos en el asiento de la silla y la cabeza colgando
  17: {
    nombre: 'Pectorales',
    vista: 'lado',
    torso: 14,
    cuello: 75,
    piernaN: { a: [84, 178], fin: 180 },
    piernaL: { a: [88, 178], fin: 180 },
    brazoN: { a: [-8, 175], escala: [1, 0.55, 0.7], fin: 175 },
    brazoL: { a: [-10, 175], escala: [1, 0.55, 0.7], fin: 175 },
    resaltar: ['pecho'],
    objetos: J => [{ tipo: 'silla', x: J.cabeza[0] + 6, y: J.brazoN.codo[1] + 5, dir: -1 }],
  },

  // 18 · Rotadores externos del hombro: sentado, manos en las caderas, hombros hacia las rodillas
  18: {
    nombre: 'Rotadores externos del hombro (parte posterior)',
    vista: 'lado',
    torso: -32,
    cuello: 32,
    piernaN: { a: [0, 90] },
    piernaL: { a: [-2, 92] },
    brazoN: { hacia: [7, -6], doblez: -1, fin: 150 },
    brazoL: { hacia: [5, -7], doblez: -1, fin: 150 },
    resaltar: ['espalda'],
    objetos: () => [{ tipo: 'banqueta', x: 22, y: 9.5, dir: 1, ancho: 44 }],
  },

  // 19 · Parte interna del hombro: sentado en un banco, manos entre las piernas, inclinado a un lado
  19: {
    nombre: 'Parte interna del hombro',
    vista: 'frente',
    torso: -100,
    cuello: -96,
    piernaN: { a: [150, 95], escala: [0.42, 0.95, 0.55], fin: 120 },
    piernaL: { a: [30, 85], escala: [0.42, 0.95, 0.55], fin: 60 },
    brazoN: { hacia: [-6, 4], doblez: 1, fin: 90 },
    brazoL: { hacia: [6, 4], doblez: -1, fin: 90 },
    resaltar: ['brazoN.brazo', 'brazoL.brazo'],
    objetos: () => [{ tipo: 'banco', x1: -26, x2: 26, y: 6 }],
  },

  // 20 · Parte lateral del hombro: sentado, brazo cruzado delante del pecho, la otra mano tira del codo
  20: {
    nombre: 'Parte lateral del hombro',
    vista: 'frente',
    torso: -90,
    piernaN: { a: [128, 93], escala: [0.42, 0.95, 0.55], fin: 120 },
    piernaL: { a: [52, 87], escala: [0.42, 0.95, 0.55], fin: 60 },
    // Variante del texto con el antebrazo estirado: se lee mejor de frente que con la mano al hombro
    brazoN: { a: [12, -6], escala: [1.05, 1, 1], fin: -6 },
    brazoL: { hacia: 'brazoN.codo+1,3', doblez: -1, fin: -150 },
    resaltar: ['brazoN.brazo'],
    objetos: () => [{ tipo: 'sillaFrente', x: 0, y: 6, ancho: 64 }],
  },

  // 21 · Parte anterior de los hombros: fondos en una silla, codos flexionados, piernas estiradas
  21: {
    nombre: 'Parte anterior de los hombros',
    vista: 'lado',
    torso: -98,
    piernaN: { a: [20, 20], fin: -70 },
    piernaL: { a: [22, 20], fin: -70 },
    brazoN: { hacia: [-18, -10], doblez: 1, fin: 70 },
    brazoL: { hacia: [-20, -11], doblez: 1, fin: 70 },
    resaltar: ['brazoN.brazo', 'brazoL.brazo'],
    objetos: J => [{ tipo: 'silla', x: J.brazoN.muneca[0] + 4, y: J.brazoN.muneca[1] + 4, dir: 1 }],
  },

  // 22 · Rotadores internos del hombro: antebrazo apoyado en el marco de la puerta, el otro brazo relajado
  22: {
    nombre: 'Rotadores internos del hombro (parte anterior)',
    vista: 'frente',
    torso: -90,
    piernaN: { a: [97, 92], fin: 115, escala: [1, 1, 0.5] },
    piernaL: { a: [84, 96], fin: 65, escala: [0.96, 1, 0.5] },
    brazoN: { a: [96, 92], fin: 92 },
    brazoL: { a: [0, -90], fin: -90 },
    resaltar: ['brazoL.brazo'],
    objetos: J => [{ tipo: 'pared', x: J.brazoL.codo[0] - 4, lado: 1 }],
  },

  // 23 · Extensores del hombro: boca arriba en un banco, brazos estirados por detrás de la cabeza con peso
  23: {
    nombre: 'Extensores del hombro',
    vista: 'lado',
    torso: 180,
    mira: 1,
    piernaN: { hacia: [52, 6], doblez: -1, fin: 0 },
    piernaL: { a: [0, 0], fin: -85 },
    brazoN: { a: [162, 162], fin: 162 },
    brazoL: { a: [164, 164], fin: 164 },
    resaltar: ['brazoN.brazo', 'brazoL.brazo'],
    sobreSuelo: 42,
    objetos: J => [
      { tipo: 'mesa', x1: -38, x2: 72, y: 12 },
      { tipo: 'mancuerna', x: J.brazoN.punta[0], y: J.brazoN.punta[1], ang: 72 },
      { tipo: 'flecha', c: J.brazoN.hombro, r: 62, de: -85, a: -150 },
    ],
  },

  // 24 · Tríceps braquial: codo junto a la cabeza, la otra mano tira de él (vista de espaldas)
  24: {
    nombre: 'Tríceps braquial',
    vista: 'frente',
    torso: -90,
    piernaN: { a: [97, 92], fin: 115, escala: [1, 1, 0.5] },
    piernaL: { a: [83, 88], fin: 65, escala: [1, 1, 0.5] },
    cuello: -82,
    // Vista de frente: el antebrazo flexionado y la mano que sujeta el codo pasan por detrás de la cabeza
    brazoN: { a: [-102, 40], fin: 45 },
    brazoL: { hacia: 'brazoN.codo+4,1', doblez: 1, fin: 175 },
    orden: ['piernaN', 'piernaL', 'brazoN', 'torso', 'brazoL', 'cabeza'],
    resaltar: ['brazoN.brazo'],
  },

  // 25 · Bíceps braquial: de espaldas al marco, brazo estirado hacia atrás agarrando el marco
  25: {
    nombre: 'Bíceps braquial',
    vista: 'lado',
    torso: -90,
    piernaN: { hacia: [18, 82], doblez: 1 },
    piernaL: { a: [92, 90] },
    brazoN: { a: [172, 172], fin: 172 },
    brazoL: { a: [96, 92], fin: 92 },
    resaltar: ['brazoN.brazo'],
    objetos: J => [{ tipo: 'pared', x: J.brazoN.punta[0] + 3, lado: -1 }],
  },

  // 26 · Extensores de las muñecas: brazos en cruz, antebrazos hacia abajo sujetando un palo
  26: {
    nombre: 'Extensores de las muñecas',
    vista: 'frente',
    torso: -90,
    piernaN: { a: [97, 92], fin: 115, escala: [1, 1, 0.5] },
    piernaL: { a: [83, 88], fin: 65, escala: [1, 1, 0.5] },
    brazoN: { a: [180, 90], fin: 75 },
    brazoL: { a: [0, 90], fin: 105 },
    resaltar: ['brazoN.antebrazo', 'brazoL.antebrazo'],
    objetos: J => [{ tipo: 'palo', p1: [J.brazoN.punta[0] - 30, J.brazoN.punta[1] - 2], p2: [J.brazoL.punta[0] + 30, J.brazoL.punta[1] - 2] }],
  },

  // 27 · Flexores de las muñecas: a cuatro patas, dedos hacia las rodillas, nalgas hacia atrás
  27: {
    nombre: 'Flexores de las muñecas',
    vista: 'lado',
    torso: 6,
    cuello: -4,
    piernaN: { a: [56, 178], fin: 180 },
    piernaL: { a: [58, 178], fin: 180 },
    brazoN: { hacia: J => [J.pecho[0] + 46, J.piernaN.rodilla[1] + 2.5], doblez: 1, fin: 180 },
    brazoL: { hacia: J => [J.pecho[0] + 43, J.piernaN.rodilla[1] + 2.5], doblez: 1, fin: 180 },
    resaltar: ['brazoN.antebrazo', 'brazoL.antebrazo'],
  },

  // 28 · Parte lateral del cuello: de pie, peso en una mano y la otra inclina la cabeza
  28: {
    nombre: 'Parte lateral del cuello',
    vista: 'frente',
    torso: -90,
    cuello: -60,
    piernaN: { a: [92, 90], fin: 110, escala: [1, 1, 0.5] },
    piernaL: { a: [88, 90], fin: 70, escala: [1, 1, 0.5] },
    brazoN: { a: [97, 92], fin: 92 },
    brazoL: { a: [-64, 184], fin: 172 },
    orden: ['piernaN', 'piernaL', 'torso', 'brazoN', 'brazoL', 'cabeza'],
    resaltar: ['cuello'],
    objetos: J => [{ tipo: 'mancuerna', x: J.brazoN.punta[0], y: J.brazoN.punta[1] - 1, ang: 0 }],
  },

  // 29 · Parte posterior del cuello: de pie, barra con peso delante, barbilla al pecho
  29: {
    nombre: 'Parte posterior del cuello',
    vista: 'lado',
    torso: -88,
    cuello: -22,
    piernaN: { a: [90, 90] },
    piernaL: { a: [91, 90] },
    brazoN: { a: [82, 86], fin: 88 },
    brazoL: { a: [83, 86], fin: 88 },
    resaltar: ['cuello'],
    objetos: J => [{ tipo: 'svg', svg: disco(J.brazoN.muneca.map((v, i) => +(v + (i ? 5 : 1)).toFixed(1))), delante: true }],
  },

  // 30 · Parte anterior del cuello: boca arriba en una mesa con la cabeza colgando fuera del borde
  30: {
    nombre: 'Parte anterior del cuello',
    vista: 'lado',
    torso: 180,
    mira: 1,
    cuello: 125,
    piernaN: { a: [0, 0], fin: -80 },
    piernaL: { a: [-1, 0], fin: -82 },
    brazoN: { a: [8, 2], fin: 2 },
    brazoL: { a: [7, 2], fin: 2 },
    resaltar: ['cuello'],
    cuelloLado: 'frente',
    sobreSuelo: 34,
    objetos: () => [{ tipo: 'mesa', x1: -44, x2: 100, y: 12 }],
  },
};
