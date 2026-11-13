// Posturas iniciales, tanda c (ver GUIA_POSES.md, sección Animación)
export default {
  // 31 · Arco plantar: pie relajado (dedos hacia fuera); al estirar, la mano lleva los dedos hacia la espinilla
  31: {
    piernaL: { a: [-26.6, 166.6], escala: [0.364, 1.154, 1.1], fin: -145 },
  },
  // 32 · Tobillos: pie colgando hacia abajo; al estirar, gira el tobillo hacia arriba
  32: {
    piernaL: { a: [-26.6, 166.6], escala: [0.364, 1.154, 1.25], fin: 95 },
  },
  // 33 · Gemelos: espalda apoyada en la pared, tronco erguido; al estirar, flexiona el tronco hacia delante
  33: {
    torso: -91,
    cuello: -87,
    // Codos hacia los lados (escorzo) para que no atraviesen la pared
    brazoN: { hacia: [4, -7], doblez: 1, escala: [0.72, 0.8, 1], fin: 100 },
    brazoL: { hacia: [2, -9], doblez: 1, escala: [0.72, 0.8, 1], fin: 100 },
  },
  // 34 · Tendón de Aquiles: pierna ya en alto, pie relajado; al estirar, flexión dorsal del pie
  34: {
    piernaN: { a: [-105, -105], fin: 172 },
  },
  // 35 · Región posterior: erguido sobre la tabla, brazos al frente; al estirar, se inclina hacia la pared
  35: {
    torso: -90,
    piernaN: { a: [90, 90], fin: -21 },
    piernaL: { a: [88, 88], fin: -21 },
    brazoN: { a: [0, 0], fin: -80 },
    brazoL: { a: [-2, -2], fin: -80 },
  },
  // 36 · Pierna completa: tronco menos inclinado, mano en la espinilla y pie relajado; al estirar, llega al pie y tira de él
  36: {
    torso: -78,
    cuello: -66,
    piernaL: { hacia: [71.5, 13.6], doblez: -1, escala: [0.75, 0.75, 1], fin: -50 },
    // Rodilla y pie de la pierna doblada en el mismo sitio del suelo (las caderas giran con el tronco en vista frontal)
    piernaN: { a: [152.1, -12], escala: [0.72, 0.8, 0.8], fin: -70 },
    brazoL: { hacia: 'piernaL.rodilla+12,-4', doblez: -1, fin: -10 },
  },
  // 37 · Parte superior de la pierna: caderas más altas; al estirar, baja las caderas sin despegar los pies
  37: {
    torso: -42,
    cuello: -32,
    piernaN: { a: [62, 104], fin: 0 },
    piernaL: { a: [60, 106], fin: 0 },
  },
  // 38 · Flexores (1): ya sujeta el tobillo con el tronco más alto; al estirar, baja el tronco hacia el muslo
  38: {
    torso: -46,
    cuello: -38,
  },
  // 39 · Flexores (2): talón apoyado en el marco con la rodilla algo doblada; al estirar, extiende la pierna contra el marco
  39: {
    piernaN: { a: [-100, -75], fin: -165 },
  },
  // 40 · Flexores (3): pierna vertical sujeta por el muslo; al estirar, la acerca a la cara y las manos bajan hacia el tobillo
  40: {
    torso: 184,
    cuello: 190,
    piernaN: { a: [-93, -93], fin: 175 },
    brazoN: { hacia: J => [J.piernaN.rodilla[0] * 0.75 + 7, J.piernaN.rodilla[1] * 0.75 + 2], doblez: 1, fin: -95 },
    brazoL: { hacia: J => [J.piernaN.rodilla[0] * 0.72 + 8, J.piernaN.rodilla[1] * 0.72 + 8], doblez: 1, fin: -95 },
  },
  // 41 · Flexores (4): tronco erguido, manos tras la nuca; al estirar, flexiona el tronco sobre el muslo
  41: {
    torso: -84,
    cuello: -80,
  },
  // 42 · Aductores (1): rodillas más levantadas y juntas; al estirar, se abren hacia el suelo
  42: {
    piernaN: { a: [35, -69], escala: [0.7, 0.51, 1], fin: 2 },
    piernaL: { a: [-35, 69], escala: [0.7, 0.51, 1], fin: -2 },
  },
  // 43 · Aductores (2): piernas ya abiertas, manos algo más adelante en las correas; al estirar, tira de ellas
  43: {
    brazoN: { hacia: [0.3, 37.5], doblez: -1, fin: 45 },
    brazoL: { hacia: [0.3, -37.5], doblez: 1, fin: -45 },
  },
  // 44 · Aductores (3): sentado más erguido, una mano en la rodilla y el otro brazo arriba; al estirar, se extiende hasta el pie
  44: {
    torso: -62,
    cuello: -58,
    // En vista frontal las caderas giran con el tronco: piernas rectas reajustadas para que los talones sigan en el suelo
    piernaL: { a: [7.2, 7.2], escala: [0.82, 0.82, 1], fin: -80 },
    piernaN: { a: [170.2, 170.2], escala: [0.82, 0.82, 1], fin: -100 },
    brazoL: { hacia: 'piernaL.rodilla+6,-4', doblez: 1, fin: 0 },
    brazoN: { a: [-95, -75], fin: -60 },
  },
  // 45 · Aductores (4): rodillas más altas; al estirar (inclinarse), las rodillas bajan hacia el suelo
  45: {
    // Pies clavados en el mismo sitio; la espinilla se alarga un poco porque, al subir la rodilla, se ve menos escorzada
    piernaN: { hacia: [-4.4, 13.8], doblez: 1, escala: [0.75, 1.063, 0.5], fin: 90 },
    piernaL: { hacia: [4.4, 13.8], doblez: -1, escala: [0.75, 1.063, 0.5], fin: 90 },
  },
  // 46 · Cuádriceps (1): talón más lejos del glúteo, ya sujeto; al estirar, lo empuja hacia el glúteo
  46: {
    piernaN: { a: [1, -146], fin: -88 },
  },
  // 47 · Cuádriceps (2): rodilla algo adelantada y menos doblada; al estirar, talón al glúteo y muslo hacia atrás
  47: {
    piernaN: { a: [-8, 145], fin: 158 },
  },
  // 49 · Cuádriceps (4): rodilla de apoyo estirada; al estirar, la flexiona ligeramente
  49: {
    piernaL: { a: [91, 91], fin: 0 },
    piernaN: { hacia: [-58.1, 32.6], doblez: -1, fin: 172 },
  },
};
