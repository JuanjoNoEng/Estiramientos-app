// Tanda e: ejercicios 66–79 (hombros, bíceps y tríceps). Ver GUIA_POSES.md
// Las vistas frontales de brazos por detrás de la espalda se leen como vista de espaldas
// (los brazos se dibujan por encima del tronco).

const DE_PIE_FRENTE = {
  piernaN: { a: [97, 92], fin: 115, escala: [1, 1, 0.5] },
  piernaL: { a: [83, 88], fin: 65, escala: [1, 1, 0.5] },
};
const SENTADO_FRENTE = {
  piernaN: { a: [128, 93], escala: [0.42, 0.95, 0.55], fin: 120 },
  piernaL: { a: [52, 87], escala: [0.42, 0.95, 0.55], fin: 60 },
};

export default {
  // 66 · De espaldas a la pared, brazos estirados hacia atrás, manos en la pared, piernas flexionadas
  66: {
    nombre: 'Parte anterior de los hombros',
    vista: 'lado',
    torso: -100,
    piernaN: { a: [50, 98] },
    piernaL: { a: [54, 100] },
    brazoN: { a: [186, 186], fin: -90 },
    brazoL: { a: [184, 184], fin: -90 },
    resaltar: ['brazoN.brazo', 'brazoL.brazo'],
    objetos: J => [{ tipo: 'pared', x: Math.min(J.brazoN.muneca[0], J.brazoL.muneca[0]) - 4, lado: -1 }],
  },

  // 67 · Fondos con los brazos abiertos, pecho casi en el suelo
  67: {
    nombre: 'Parte anterior de los hombros',
    vista: 'lado',
    torso: -5,
    piernaN: { a: [175, 175], fin: 60 },
    piernaL: { a: [176, 176], fin: 62 },
    brazoN: { hacia: [48, 18.6], doblez: 1, fin: 0 },
    brazoL: { hacia: [52, 18.6], doblez: 1, fin: 0 },
    resaltar: ['brazoN.brazo', 'brazoL.brazo'],
  },

  // 68 · Sentado de costado a una mesa, antebrazo apoyado a lo largo del borde, tronco inclinado
  68: {
    nombre: 'Rotadores internos de los hombros',
    vista: 'lado',
    torso: -45,
    cuello: 10,
    piernaN: { a: [15, 95] },
    piernaL: { a: [18, 96] },
    brazoN: { hacia: [67, -5], doblez: 1, fin: 0 },
    brazoL: { a: [80, 60] },
    resaltar: ['brazoN.brazo'],
    objetos: J => [
      { tipo: 'silla', x: 18, y: 12.5, dir: 1 },
      { tipo: 'mesa', x1: 30, x2: 100, y: J.brazoN.codo[1] + 5 },
    ],
  },

  // 69 · Tumbado en un banco, brazo en cruz y codo a 90°, la mancuerna baja hacia la cabeza
  69: {
    nombre: 'Rotadores internos de los hombros',
    vista: 'lado',
    torso: 180,
    mira: 1,
    piernaN: { a: [3, 3], fin: -70 },
    piernaL: { a: [2, 2], fin: -72 },
    brazoN: { a: [90, 175], escala: [0.45, 1, 1] },
    brazoL: { a: [8, 5] },
    resaltar: ['brazoN.brazo'],
    sobreSuelo: 30,
    objetos: J => [
      { tipo: 'banco', x1: -84, x2: 100, y: 12 },
      { tipo: 'mancuerna', x: J.brazoN.punta[0], y: J.brazoN.punta[1], ang: 175 + 90 },
      { tipo: 'flecha', c: J.brazoN.codo, r: 30, de: -88, a: -172 },
    ],
  },

  // 70 · De pie, brazos por detrás de la espalda: una mano tira del codo contrario (vista de espaldas)
  70: {
    nombre: 'Rotadores externos de los hombros (parte posterior)',
    vista: 'frente',
    ...DE_PIE_FRENTE,
    brazoN: { a: [97, -10], fin: -10 },
    brazoL: { hacia: [-11, -13], doblez: -1, fin: 185 },
    resaltar: ['brazoN.brazo'],
  },

  // 71 · Brazos entrelazados por delante del cuerpo (codo sobre codo, antebrazos verticales)
  71: {
    nombre: 'Rotadores externos de los hombros (parte posterior)',
    vista: 'frente',
    ...DE_PIE_FRENTE,
    brazoN: { a: [35, -95], escala: [0.75, 1, 1], fin: -90 },
    brazoL: { a: [135, -82], escala: [0.86, 1, 1], fin: -95 },
    resaltar: ['brazoN.brazo'],
  },

  // 72 · Sentado, una mano por detrás de la cintura; gira cabeza y tronco hacia ese lado
  72: {
    nombre: 'Rotadores externos de los hombros (parte posterior)',
    vista: 'frente',
    torso: -90,
    ...SENTADO_FRENTE,
    brazoN: { hacia: [-31, 8], doblez: -1, fin: 95 },
    brazoL: { a: [55, 155], fin: 160 },
    orden: ['piernaN', 'piernaL', 'brazoL', 'torso', 'brazoN'],
    resaltar: ['brazoL.brazo'],
    objetos: J => [
      { tipo: 'sillaFrente', x: 0, y: 6, ancho: 64 },
      { tipo: 'flecha', c: J.cabeza, r: 20, de: -140, a: -40 },
    ],
  },

  // 73 · Palmas juntas por detrás de la espalda, dedos hacia arriba (vista de espaldas)
  73: {
    nombre: 'Rotadores externos de los hombros (parte posterior)',
    vista: 'frente',
    ...DE_PIE_FRENTE,
    brazoN: { hacia: [-3, -26], doblez: 1, fin: -90 },
    brazoL: { hacia: [3, -26], doblez: -1, fin: -90 },
    resaltar: ['brazoN.brazo', 'brazoL.brazo'],
  },

  // 74 · Toalla con los brazos estirados, pasándola por encima de la cabeza hacia atrás
  74: {
    nombre: 'Rotadores externos de los hombros (parte posterior)',
    vista: 'lado',
    torso: -90,
    piernaN: { a: [92, 90] },
    piernaL: { a: [88, 90] },
    brazoN: { a: [-118, -118], fin: -118 },
    brazoL: { a: [-120, -120], fin: -120 },
    resaltar: ['brazoN.brazo', 'brazoL.brazo'],
    objetos: J => {
      const p = J.brazoN.muneca;
      return [
        { tipo: 'toalla', puntos: [[p[0] - 12, p[1] + 8], [p[0] + 12, p[1] - 8]] },
        { tipo: 'flecha', c: J.hombroN, r: 66, de: 50, a: -215 },
      ];
    },
  },

  // 75 · Muñecas cruzadas y brazos estirados por encima de la cabeza
  75: {
    nombre: 'Extensores de los hombros',
    vista: 'frente',
    ...DE_PIE_FRENTE,
    brazoN: { a: [-75, -78], fin: -85 },
    brazoL: { a: [-105, -102], fin: -95 },
    resaltar: ['brazoN.brazo', 'brazoL.brazo'],
  },

  // 76 · Sentado a la mesa, codo apoyado; la otra mano baja la muñeca hasta la mesa
  76: {
    nombre: 'Bíceps braquial',
    vista: 'lado',
    torso: -82,
    piernaN: { a: [0, 90] },
    piernaL: { a: [3, 92] },
    brazoN: { hacia: [51, -23], doblez: 1, fin: 0 },
    brazoL: { hacia: [50, -27], doblez: 1, fin: 10 },
    resaltar: ['brazoN.brazo'],
    objetos: J => [
      { tipo: 'silla', x: 15, y: 12.5, dir: 1 },
      { tipo: 'mesa', x1: 20, x2: 95, y: J.brazoN.codo[1] + 5 },
      { tipo: 'flecha', c: J.brazoN.codo, r: 32, de: -88, a: -8 },
    ],
  },

  // 77 · De pie frente a una mesa, antebrazos apoyados, el cuerpo se inclina hacia las muñecas
  77: {
    nombre: 'Tríceps braquial',
    vista: 'lado',
    torso: -53,
    cuello: 20,
    piernaN: { a: [90, 90] },
    piernaL: { a: [92, 90] },
    brazoN: { hacia: [45, -7], doblez: 1, fin: -10 },
    brazoL: { hacia: [47, -7], doblez: 1, fin: -10 },
    resaltar: ['brazoN.brazo', 'brazoL.brazo'],
    objetos: [{ tipo: 'mesa', x1: 16, x2: 80, y: -2 }],
  },

  // 78 · Un brazo por detrás de la cabeza y otro por detrás de la espalda, sujetando una toalla (de espaldas)
  78: {
    nombre: 'Tríceps braquial',
    vista: 'frente',
    ...DE_PIE_FRENTE,
    brazoL: { a: [-85, 118], fin: 100 },
    brazoN: { hacia: [-2, -21], doblez: 1, fin: -85 },
    resaltar: ['brazoL.brazo'],
    objetos: J => [{ tipo: 'toalla', puntos: [J.brazoL.punta, [J.brazoL.punta[0] - 1, J.brazoN.punta[1] - 4], [J.brazoN.muneca[0] - 1, J.brazoN.muneca[1] + 14]] }],
  },

  // 79 · Igual sin toalla: los dedos de ambas manos se enganchan entre los omóplatos (de espaldas)
  79: {
    nombre: 'Tríceps braquial',
    vista: 'frente',
    ...DE_PIE_FRENTE,
    brazoN: { a: [-95, 62], fin: 80 },
    brazoL: { hacia: [-1, -34], doblez: -1, fin: -100 },
    resaltar: ['brazoN.brazo'],
  },
};
