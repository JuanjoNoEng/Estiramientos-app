// Tanda c: ver GUIA_POSES.md
// Ejercicios 31–49 (sin el 48, aprobado en ejercicios.mjs): pies, tobillos y piernas.

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
    brazoN: { hacia: [3, -7], doblez: -1, fin: 150 },
    brazoL: { hacia: [1, -9], doblez: -1, fin: 150 },
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
    piernaL: { a: [2, 1], escala: [0.75, 0.75, 1], fin: -80 },
    // Pierna doblada: rodilla hacia fuera en el suelo y el pie vuelve a la ingle (por delante del muslo)
    piernaN: { a: [150, 4], escala: [0.9, 0.8, 0.8], fin: -60 },
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
};
