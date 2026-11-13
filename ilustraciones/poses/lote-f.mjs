// Tanda f: ver GUIA_POSES.md
// Ejercicios 80–91 (excepto 89): muñecas y cuello.

// Cuadrupedia de lado, mirando a la derecha: muslos verticales, piernas y empeines apoyados hacia atrás.
const RODILLAS = {
  piernaN: { a: [90, 180], fin: 180 },
  piernaL: { a: [92, 180], fin: 180 },
};
const ANTEBRAZOS = ['brazoN.antebrazo', 'brazoN.mano', 'brazoL.antebrazo', 'brazoL.mano'];

export default {
  // 80 · Extensores de la muñeca, de pie: dorsos de las muñecas juntos, palmas hacia fuera
  80: {
    nombre: 'Braquiorradiales o extensores de la muñeca',
    vista: 'frente',
    torso: -90,
    piernaN: { a: [95, 90], fin: 115, escala: [1, 1, 0.5] },
    piernaL: { a: [85, 90], fin: 65, escala: [1, 1, 0.5] },
    brazoN: { a: [76, 77], fin: 140, escala: [1, 1, 1.4] },
    brazoL: { a: [104, 103], fin: 40, escala: [1, 1, 1.4] },
    resaltar: ANTEBRAZOS,
    objetos: J => [
      { tipo: 'flecha', c: J.brazoN.muneca, r: 22, de: 108, a: 160 },
      { tipo: 'flecha', c: J.brazoL.muneca, r: 22, de: 72, a: 20 },
    ],
  },

  // 81 · Extensores de la muñeca, a cuatro patas con el dorso de las manos en el suelo
  81: {
    nombre: 'Braquiorradiales o extensores de la muñeca',
    vista: 'lado',
    torso: -6,
    cuello: 15,
    ...RODILLAS,
    brazoN: { hacia: [45, 45.5], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
    brazoL: { hacia: [43, 45.5], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
    resaltar: ANTEBRAZOS,
    objetos: J => [
      { tipo: 'flecha', c: J.brazoN.muneca, r: 72, de: -82, a: -110 },
      // Dedos que se curvan hacia arriba: la palma mira al techo (dorso en el suelo)
      { tipo: 'svg', delante: true, svg: `<path d="M${J.brazoN.punta[0] + 2} ${J.brazoN.punta[1]}q-4 0 -5 -5" fill="none" stroke="#F08A5D" stroke-width="6" stroke-linecap="round"/>` },
    ],
  },

  // 82 · Flexores de la muñeca, de pie: la base de una mano empuja los dedos de la otra hacia atrás
  82: {
    nombre: 'Flexores de la muñeca',
    vista: 'lado',
    torso: -90,
    piernaN: { a: [90, 90] },
    piernaL: { a: [90, 90] },
    brazoN: { a: [62, -6], fin: -118, escala: [1, 1, 1.6] },
    // La otra mano, por delante, apoya la base de la palma sobre los dedos y los empuja hacia el cuerpo
    brazoL: {
      hacia: J => [(J.brazoN.muneca[0] + J.brazoN.punta[0]) / 2 + 6, (J.brazoN.muneca[1] + J.brazoN.punta[1]) / 2 - 3],
      doblez: 1, fin: -118, escala: [1, 1, 1.5],
    },
    resaltar: ['brazoN.antebrazo', 'brazoN.mano'],
    objetos: J => [{ tipo: 'flecha', c: J.brazoN.muneca, r: 29, de: -92, a: -136 }],
  },

  // 83 · Flexores de la muñeca, a cuatro patas: palmas en el suelo, dedos hacia la cabeza,
  //      el cuerpo se adelanta por delante de las manos
  83: {
    nombre: 'Flexores de la muñeca',
    vista: 'lado',
    torso: -8,
    cuello: 15,
    ...RODILLAS,
    brazoN: { hacia: [31, 45.5], doblez: 1, fin: 0, escala: [1, 1, 1.5] },
    brazoL: { hacia: [29, 45.5], doblez: 1, fin: 0, escala: [1, 1, 1.5] },
    resaltar: ANTEBRAZOS,
    objetos: J => [{ tipo: 'flecha', c: J.brazoN.muneca, r: 72, de: -98, a: -70 }],
  },

  // 84 · Flexores de la muñeca, a cuatro patas: palmas en el suelo, dedos hacia las rodillas,
  //      el cuerpo se echa hacia atrás
  84: {
    nombre: 'Flexores de la muñeca',
    vista: 'lado',
    torso: -8,
    cuello: 15,
    ...RODILLAS,
    brazoN: { hacia: [55, 45.5], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
    brazoL: { hacia: [53, 45.5], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
    resaltar: ANTEBRAZOS,
    objetos: J => [{ tipo: 'flecha', c: J.brazoN.muneca, r: 72, de: -82, a: -110 }],
  },

  // 85 · Parte posterior del cuello, tumbado boca arriba tirando de la cabeza hacia el pecho
  85: {
    nombre: 'Parte posterior del cuello',
    vista: 'lado',
    torso: 0,
    mira: -1,
    cuello: -52,
    piernaN: { a: [-130, 95], fin: 180 },
    piernaL: { a: [-127, 98], fin: 180 },
    // Manos entrelazadas detrás de la cabeza (la cabeza las tapa), codos hacia arriba
    brazoN: { hacia: J => [J.cabeza[0] + 7, J.cabeza[1] + 6], doblez: -1, fin: -120 },
    brazoL: { hacia: J => [J.cabeza[0] + 7, J.cabeza[1] + 5], doblez: -1, fin: -120 },
    orden: ['brazoL', 'brazoN', 'piernaL', 'torso', 'piernaN', 'cabeza'],
    resaltar: ['cuello'],
  },

  // 86 · Parte posterior del cuello, de pie con las manos entrelazadas en la nuca
  86: {
    nombre: 'Parte posterior del cuello',
    vista: 'lado',
    torso: -90,
    cuello: -25,
    piernaN: { a: [90, 90] },
    piernaL: { a: [90, 90] },
    // Manos sobre la parte alta y posterior de la cabeza, codos hacia delante y abajo
    brazoN: { hacia: J => [J.cabeza[0] - 1, J.cabeza[1] - 12], doblez: 1, fin: 25 },
    brazoL: { hacia: J => [J.cabeza[0], J.cabeza[1] - 12.5], doblez: 1, fin: 25 },
    resaltar: ['cuello'],
  },

  // 87 · Parte posterior del cuello, de rodillas con los antebrazos en el suelo y la barbilla al pecho
  87: {
    nombre: 'Parte posterior del cuello',
    vista: 'lado',
    torso: 23,
    cuello: 118,
    ...RODILLAS,
    brazoN: { a: [84, 0], fin: 0 },
    brazoL: { a: [86, 0], fin: 0 },
    resaltar: ['cuello'],
  },

  // 88 · Parte posterior del cuello, de pie con mancuernas, hombros caídos y barbilla al pecho
  88: {
    nombre: 'Parte posterior del cuello',
    vista: 'lado',
    torso: -90,
    cuello: -22,
    piernaN: { a: [90, 90] },
    piernaL: { a: [90, 90] },
    brazoN: { a: [93, 91], fin: 90 },
    brazoL: { a: [90, 90], fin: 90 },
    resaltar: ['cuello'],
    objetos: J => [
      { tipo: 'mancuerna', x: J.brazoN.punta[0], y: J.brazoN.punta[1] - 3, ang: 0 },
    ],
  },

  // 90 · Parte lateral del cuello, de pie (de espaldas) con los brazos a la espalda
  90: {
    nombre: 'Parte lateral del cuello',
    vista: 'frente',
    torso: -90,
    cuello: -62,
    piernaN: { a: [95, 90], fin: 115, escala: [1, 1, 0.5] },
    piernaL: { a: [85, 90], fin: 65, escala: [1, 1, 0.5] },
    // Brazo bloqueado: codo junto a la cintura, antebrazo cruzando la espalda
    brazoN: { a: [92, 0], fin: 0 },
    // La otra mano sujeta el codo
    brazoL: { hacia: J => [J.brazoN.codo[0] + 2, J.brazoN.codo[1] - 1], doblez: -1, fin: 180 },
    resaltar: ['cuello'],
    objetos: J => [{ tipo: 'flecha', c: J.base, r: 40, de: -118, a: -76 }],
  },

  // 91 · Parte anterior del cuello: mano en la frente, cabeza hacia atrás
  91: {
    nombre: 'Parte anterior del cuello',
    vista: 'lado',
    torso: -94,
    cuello: -130,
    cuelloLado: 'frente',
    piernaN: { a: [88, 90] },
    piernaL: { a: [90, 90] },
    brazoN: { hacia: J => [J.cabeza[0] + 9, J.cabeza[1] - 10], doblez: 1, fin: -165 },
    brazoL: { a: [95, 92] },
    resaltar: ['cuello'],
  },
};
