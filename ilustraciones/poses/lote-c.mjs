// Tanda c: ver GUIA_POSES.md
// Ejercicios 31–49 (sin el 48, aprobado en ejercicios.mjs): pies, tobillos y piernas.

// Colchoneta vista desde arriba (para posturas tumbadas dibujadas en planta, sin línea de suelo)
const esterilla = (x1, y1, x2, y2) => ({
  tipo: 'svg',
  svg: `<rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" rx="8" fill="#7CC6A6" opacity=".22"/>`,
  caja: [x1, y1, x2],
});

export default {
  // 31 · Arco plantar: sentado, pierna cruzada sobre la rodilla; tira de los dedos hacia la espinilla
  31: {
    nombre: 'Arco plantar',
    vista: 'frente',
    torso: -90,
    piernaN: { a: [115, 92], escala: [0.4, 0.95, 0.55], fin: 100 },
    piernaL: { a: [-26.6, 166.6], escala: [0.364, 1.154, 1.1], fin: -112 },
    brazoN: { hacia: 'piernaL.punta+-4,-2', doblez: 1, fin: 10 },
    brazoL: { hacia: 'piernaL.tobillo+3,3', doblez: 1, fin: 180 },
    orden: ['piernaN', 'torso', 'brazoL', 'piernaL', 'brazoN'],
    resaltar: ['piernaL.pie'],
    objetos: () => [{ tipo: 'mesa', x1: -32, x2: 32, y: 8 }],
  },

  // 32 · Tobillos: sentado, pierna cruzada; una mano sobre el tobillo y la otra gira el pie
  32: {
    nombre: 'Tobillos',
    vista: 'frente',
    torso: -90,
    piernaN: { a: [115, 92], escala: [0.4, 0.95, 0.55], fin: 100 },
    piernaL: { a: [-26.6, 166.6], escala: [0.364, 1.154, 1.25], fin: 128 },
    brazoN: { hacia: 'piernaL.tobillo+-12,-1', doblez: 1, fin: 62 },
    brazoL: { hacia: 'piernaL.tobillo+13,-6', doblez: 1, fin: 175 },
    orden: ['piernaN', 'torso', 'piernaL', 'brazoL', 'brazoN'],
    resaltar: ['piernaL.pie'],
    objetos: J => [
      { tipo: 'sillaFrente', x: 0, y: 8, ancho: 64 },
      { tipo: 'flecha', c: J.piernaL.tobillo, r: 25, de: 105, a: 200 },
    ],
  },
  // 33 · Gemelos: espalda (glúteos) contra la pared, pies adelantados, tronco flexionado, manos en la cadera
  33: {
    nombre: 'Gemelos',
    vista: 'lado',
    torso: -14,
    cuello: -4,
    piernaN: { a: [70, 70], fin: 0 },
    piernaL: { a: [73, 73], fin: 0 },
    brazoN: { hacia: [4, -7], doblez: 1, fin: 120 },
    brazoL: { hacia: [2, -9], doblez: 1, fin: 120 },
    resaltar: ['piernaN.pierna', 'piernaL.pierna'],
    objetos: () => [{ tipo: 'pared', x: -14, lado: -1 }],
  },

  // 34 · Tendón de Aquiles: boca arriba, pierna estirada en alto sujeta tras la rodilla, pie en flexión dorsal
  34: {
    nombre: 'Tendón de Aquiles',
    vista: 'lado',
    torso: 180,
    cuello: 175,
    mira: 1,
    piernaN: { a: [-105, -105], fin: 130 },
    piernaL: { hacia: [52, 6], doblez: -1, fin: 0 },
    // Manos por detrás de la rodilla (cara posterior del muslo, la que mira a los pies)
    brazoN: { hacia: J => [J.piernaN.rodilla[0] + 9, J.piernaN.rodilla[1] + 7], doblez: 1, fin: -110 },
    brazoL: { hacia: J => [J.piernaN.rodilla[0] + 8, J.piernaN.rodilla[1] + 11], doblez: 1, fin: -110 },
    orden: ['brazoL', 'piernaL', 'torso', 'brazoN', 'piernaN'],
    resaltar: ['piernaN.pierna'],
    objetos: J => [
      { tipo: 'colchoneta', x1: J.cabeza[0] - 16, x2: J.piernaL.punta[0] + 10 },
      { tipo: 'flecha', c: J.piernaN.tobillo, r: 15, de: -40, a: 30 },
    ],
  },

  // 35 · Región posterior de la pierna: de pie sobre una tabla inclinada, manos en la pared
  35: {
    nombre: 'Región posterior de la pierna',
    vista: 'lado',
    torso: -80,
    sobreSuelo: 6.5,
    piernaN: { a: [98, 98], fin: -21 },
    piernaL: { a: [96, 96], fin: -21 },
    brazoN: { a: [-8, -8], fin: -80 },
    brazoL: { a: [-10, -10], fin: -80 },
    resaltar: ['piernaN.pierna', 'piernaL.pierna'],
    objetos: J => [
      // Tabla inclinada bajo toda la planta: talones abajo, dedos arriba
      { tipo: 'cuna', x1: J.piernaN.tobillo[0] - 22, x2: J.piernaN.punta[0] + 6, alto: 0.384 * (J.piernaN.punta[0] + 28 - J.piernaN.tobillo[0]) },
      { tipo: 'pared', x: J.brazoN.punta[0] + 2, lado: 1 },
    ],
  },

  // 36 · Pierna completa: sentado, una pierna estirada y la otra doblada con el talón en la ingle (de frente)
  36: {
    nombre: 'Pierna completa',
    vista: 'frente',
    torso: -68,
    cuello: -50,
    piernaL: { a: [9, 9], escala: [0.75, 0.75, 1], fin: -75 },
    // Pierna doblada: rodilla hacia fuera en el suelo y el pie vuelve a la ingle (por delante del muslo)
    piernaN: { a: [150, -12], escala: [0.75, 0.8, 0.8], fin: -70 },
    brazoL: { hacia: 'piernaL.punta+-5,4', doblez: -1, fin: -30 },
    // Mano de apoyo en el suelo, por detrás de la pierna doblada
    brazoN: { hacia: [-26, 8], doblez: -1, fin: 110 },
    orden: ['torso', 'brazoN', 'piernaN', 'piernaL', 'brazoL'],
    resaltar: ['piernaL'],
  },

  // 37 · Parte superior de la pierna: de pie, caderas abajo, manos sobre las rodillas, plantas apoyadas
  37: {
    nombre: 'Parte superior de la pierna',
    vista: 'lado',
    torso: -35,
    cuello: -25,
    piernaN: { a: [42, 110], fin: 0 },
    piernaL: { a: [39, 112], fin: 0 },
    brazoN: { hacia: 'piernaN.rodilla+2,-5', doblez: 1, fin: 100 },
    brazoL: { hacia: 'piernaL.rodilla+2,-5', doblez: 1, fin: 100 },
    resaltar: ['piernaN.muslo', 'piernaL.muslo'],
  },
  // 38 · Flexores de las piernas (1): sentado, una pierna doblada; tronco sobre el muslo, manos al tobillo
  38: {
    nombre: 'Flexores de las piernas',
    vista: 'lado',
    torso: -28,
    cuello: -14,
    piernaN: { a: [0, 0], fin: -75 },
    // Pierna lejana doblada con el talón en la ingle (se ve plegada detrás)
    piernaL: { a: [10, 176], escala: [0.6, 0.5, 0.5], fin: -100 },
    brazoN: { hacia: 'piernaN.tobillo+-3,-6', doblez: 1, fin: 60 },
    brazoL: { hacia: 'piernaN.tobillo+-6,-7', doblez: 1, fin: 60 },
    resaltar: ['piernaN.muslo'],
  },

  // 39 · Flexores de las piernas (2): boca arriba en el quicio de la puerta, pierna estirada apoyada en el marco
  39: {
    nombre: 'Flexores de las piernas',
    vista: 'lado',
    torso: 180,
    mira: 1,
    piernaN: { a: [-90, -90], fin: 180 },
    piernaL: { a: [0, 0], fin: -80 },
    brazoN: { hacia: [-14, -7], doblez: -1, fin: 0 },
    brazoL: { hacia: [-17, -9], doblez: -1, fin: 0 },
    resaltar: ['piernaN.muslo'],
    objetos: J => [{ tipo: 'pared', x: J.piernaN.rodilla[0] + 7, lado: 1, arriba: J.piernaN.punta[1] - 62 }],
  },

  // 40 · Flexores de las piernas (3): boca arriba, rodilla contraria doblada; tira de la pierna estirada hacia la cara
  40: {
    nombre: 'Flexores de las piernas',
    vista: 'lado',
    // Hombros y cabeza ligeramente despegados del suelo para llegar a la pantorrilla
    torso: 191,
    cuello: 205,
    mira: 1,
    piernaN: { a: [-115, -115], fin: 175 },
    piernaL: { hacia: [50, 6], doblez: -1, fin: 0 },
    brazoN: { hacia: J => [(J.piernaN.rodilla[0] + J.piernaN.tobillo[0]) / 2 + 4, (J.piernaN.rodilla[1] + J.piernaN.tobillo[1]) / 2 + 2], doblez: 1, fin: -110 },
    brazoL: { hacia: J => [(J.piernaN.rodilla[0] + J.piernaN.tobillo[0]) / 2 + 6, (J.piernaN.rodilla[1] + J.piernaN.tobillo[1]) / 2 + 9], doblez: 1, fin: -110 },
    orden: ['brazoL', 'piernaL', 'torso', 'piernaN', 'brazoN'],
    resaltar: ['piernaN.muslo'],
    objetos: J => [{ tipo: 'colchoneta', x1: J.cabeza[0] - 16, x2: J.piernaL.punta[0] + 10 }],
  },

  // 41 · Flexores de las piernas (4): sentado de lado en un banco, una pierna sobre él y la otra al suelo; manos tras la nuca
  41: {
    nombre: 'Flexores de las piernas',
    vista: 'lado',
    torso: -42,
    cuello: -30,
    piernaL: { a: [0, 0], fin: -80 },
    piernaN: { a: [95, 94], escala: [0.55, 1, 1], fin: 0 },
    brazoN: { hacia: J => [J.cabeza[0] - 9, J.cabeza[1] - 6], doblez: -1, escala: [0.75, 0.85, 1], fin: 60 },
    brazoL: { hacia: J => [J.cabeza[0] - 7, J.cabeza[1] - 9], doblez: -1, escala: [0.75, 0.85, 1], fin: 60 },
    resaltar: ['piernaL.muslo'],
    objetos: J => [{ tipo: 'banco', x1: -32, x2: J.piernaL.punta[0] + 6, y: 9 }],
  },
  // 42 · Aductores (1): boca arriba, plantas juntas y rodillas abiertas hacia el suelo (vista desde arriba)
  42: {
    nombre: 'Aductores',
    vista: 'frente',
    sinSuelo: true,
    suelo: 96,
    torso: 180,
    // Rodillas muy abiertas hacia los lados, talones cerca de las nalgas
    piernaN: { a: [60, -75], fin: 2 },
    piernaL: { a: [-60, 75], fin: -2 },
    brazoN: { a: [35, 30], fin: 30 },
    brazoL: { a: [-35, -30], fin: -30 },
    orden: ['brazoN', 'brazoL', 'torso', 'piernaN', 'piernaL'],
    resaltar: ['piernaN.muslo', 'piernaL.muslo'],
    objetos: J => [esterilla(J.cabeza[0] - 18, -62, J.piernaN.punta[0] + 22, 62)],
  },

  // 43 · Aductores (2): boca arriba, piernas en alto y abiertas, tirando de dos correas (vista desde arriba)
  43: {
    nombre: 'Aductores',
    vista: 'frente',
    sinSuelo: true,
    suelo: 96,
    torso: 180,
    piernaN: { a: [62, 62], escala: [0.85, 0.85, 0.8], fin: 40 },
    piernaL: { a: [-62, -62], escala: [0.85, 0.85, 0.8], fin: -40 },
    brazoN: { hacia: [-6, 30], doblez: -1, fin: 40 },
    brazoL: { hacia: [-6, -30], doblez: 1, fin: -40 },
    resaltar: ['piernaN.muslo', 'piernaL.muslo'],
    objetos: J => [
      esterilla(J.cabeza[0] - 18, J.piernaL.punta[1] - 12, J.piernaN.punta[0] + 16, J.piernaN.punta[1] + 12),
      { tipo: 'correa', puntos: [J.brazoN.punta, [J.piernaN.tobillo[0] - 4, J.piernaN.tobillo[1] + 2], [J.piernaN.punta[0] - 2, J.piernaN.punta[1] + 3]] },
      { tipo: 'correa', puntos: [J.brazoL.punta, [J.piernaL.tobillo[0] - 4, J.piernaL.tobillo[1] - 2], [J.piernaL.punta[0] - 2, J.piernaL.punta[1] - 3]] },
    ],
  },

  // 44 · Aductores (3): sentado con las piernas muy abiertas, tronco girado y estirado sobre una pierna (de frente)
  44: {
    nombre: 'Aductores',
    vista: 'frente',
    torso: -32,
    cuello: -18,
    piernaL: { a: [4, 4], escala: [0.82, 0.82, 1], fin: -80 },
    piernaN: { a: [167, 167], escala: [0.82, 0.82, 1], fin: -100 },
    // Brazo de arriba por encima de la cabeza hasta el pie; el de abajo sujeta el pie por dentro
    brazoN: { hacia: 'piernaL.punta+-3,2', doblez: 1, fin: 10 },
    brazoL: { hacia: 'piernaL.tobillo+-5,-3', doblez: 1, fin: -20 },
    orden: ['brazoL', 'piernaN', 'piernaL', 'torso', 'brazoN'],
    resaltar: ['piernaN.muslo', 'piernaL.muslo'],
  },

  // 45 · Aductores (4): sentado contra la pared en mariposa, plantas juntas, manos en los pies (de frente)
  45: {
    nombre: 'Aductores',
    vista: 'frente',
    torso: -90,
    cuello: -90,
    // Rodillas abiertas a los lados, pies juntos delante (más cerca, por eso más abajo)
    piernaN: { a: [184, 23], escala: [0.75, 1, 0.5], fin: 90 },
    piernaL: { a: [-4, 157], escala: [0.75, 1, 0.5], fin: 90 },
    brazoN: { hacia: 'piernaN.tobillo+-3,-9', doblez: 1, fin: 75 },
    brazoL: { hacia: 'piernaL.tobillo+3,-9', doblez: -1, fin: 105 },
    resaltar: ['piernaN.muslo', 'piernaL.muslo'],
    objetos: (J, suelo) => [{
      tipo: 'svg',
      svg: `<rect x="-95" y="${suelo - 118}" width="190" height="118" fill="#DDE8E5"/><line x1="-95" y1="${suelo - 0.5}" x2="95" y2="${suelo - 0.5}" stroke="#BFD3CE" stroke-width="2"/>`,
      caja: [-80, suelo - 100, 80],
    }],
  },

  // 46 · Cuádriceps (1): boca abajo, talón hacia el glúteo sujetando el tobillo
  46: {
    nombre: 'Cuádriceps',
    vista: 'lado',
    torso: 180,
    mira: -1,
    piernaL: { a: [0, 0], fin: 15 },
    piernaN: { a: [1, -157], fin: -95 },
    brazoN: { hacia: 'piernaN.tobillo+-4,1', doblez: -1, fin: 0 },
    brazoL: { a: [8, 2], fin: 2 },
    resaltar: ['piernaN.muslo'],
    objetos: J => [{ tipo: 'colchoneta', x1: J.cabeza[0] - 16, x2: J.piernaL.punta[0] + 10 }],
  },

  // 47 · Cuádriceps (2): tumbado de lado, brazo de abajo como almohada; talón al glúteo (vista desde arriba)
  47: {
    nombre: 'Cuádriceps',
    vista: 'lado',
    sinSuelo: true,
    suelo: 96,
    torso: 180,
    mira: 1,
    piernaL: { a: [0, 0], fin: -88 },
    piernaN: { a: [4, 162], fin: 150 },
    brazoN: { hacia: 'piernaN.tobillo+-3,-2', doblez: -1, fin: 30 },
    brazoL: { a: [182, 178], fin: 178 },
    resaltar: ['piernaN.muslo'],
    objetos: J => [esterilla(J.brazoL.punta[0] - 10, -34, J.piernaL.punta[0] + 14, 34)],
  },

  // 49 · Cuádriceps (4): de pie, de espaldas a un taburete, empeine apoyado en el borde
  49: {
    nombre: 'Cuádriceps',
    vista: 'lado',
    torso: -86,
    piernaL: { a: [84, 99], fin: 0 },
    piernaN: { a: [115, 190], fin: 172 },
    brazoN: { hacia: [5, -8], doblez: 1, fin: 120 },
    brazoL: { hacia: [3, -10], doblez: 1, fin: 120 },
    resaltar: ['piernaN.muslo'],
    objetos: J => [{ tipo: 'banqueta', x: J.piernaN.tobillo[0] + 7, y: J.piernaN.tobillo[1] + 5, dir: 1, ancho: 32 }],
  },
};
