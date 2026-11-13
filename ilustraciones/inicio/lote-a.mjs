// Posturas iniciales, tanda a (ver GUIA_POSES.md, sección Animación)

// Mano en un punto fijo respecto a la punta del pie de apoyo (barra o suelo, que no se mueven con el cuerpo)
const desdePunta = (dx, dy) => J => [J.piernaN.punta[0] + dx, J.piernaN.punta[1] + dy];

export default {
  // 1 · A cuatro patas con los dedos flexionados; al estirar, las nalgas van hacia atrás y abajo
  1: {
    torso: -8,
    cuello: 8,
    piernaN: { a: [65, 195], fin: 100 },
    piernaL: { a: [63, 195], fin: 100 },
    brazoN: { hacia: 'piernaN.rodilla+16.8,2.3', doblez: 1, fin: 0 },
    brazoL: { hacia: 'piernaN.rodilla+19.8,2.2', doblez: 1, fin: 0 },
  },

  // 2 · Pierna cruzada con el pie relajado; la mano empuja los dedos hasta la hiperflexión
  2: {
    piernaL: { hacia: [-19, 6], doblez: -1, escala: [0.42, 1, 0.7], fin: -150 },
    brazoN: { hacia: 'piernaL.punta+-2,-8', doblez: 1, fin: 30 },
  },

  // 3 · Dorso de los dedos apoyado sin cargar; al estirar, la rodilla avanza y el peso presiona los dedos
  3: {
    torso: -78,
    piernaN: { hacia: [8.8 - 14 * Math.cos(85 * Math.PI / 180), 85 - 14 * Math.sin(85 * Math.PI / 180)], doblez: -1, fin: 85 },
    brazoN: { hacia: 'piernaN.rodilla+-2.3,-21.2', doblez: 1, fin: 70 },
    brazoL: { hacia: 'piernaN.rodilla+-5.3,-22.2', doblez: 1, fin: 70 },
  },

  // 5 · De rodillas con los brazos rectos y la pelvis atrás; al estirar, la pelvis avanza y el tronco se inclina atrás
  5: {
    torso: -116,
    cuello: -98,
    piernaN: { a: [12, 182], fin: 180 },
    piernaL: { a: [9, 182], fin: 180 },
    brazoN: { hacia: 'piernaN.rodilla+-83.4,0.3', doblez: -1, fin: 180 },
    brazoL: { hacia: 'piernaN.rodilla+-79.4,0.3', doblez: -1, fin: 180 },
  },

  // 6 · Tronco más erguido con las manos en la espinilla; al estirar, baja hacia el muslo y las manos llegan al tobillo
  6: {
    torso: -50,
    cuello: -36,
    brazoN: { hacia: [72, -6], doblez: 1, fin: 0 },
    brazoL: { hacia: [70, -7], doblez: 1, fin: 0 },
  },

  // 7 · (Vista desde arriba) A cuatro patas sobre los codos, rodillas poco separadas; al estirar, las rodillas se
  //     abren y los brazos se extienden hacia delante deslizando los antebrazos
  7: {
    piernaN: { hacia: [29.3, 51.9], doblez: 1, escala: [0.6, 0.75, 0.8], fin: 75 },
    piernaL: { hacia: [29.3, -51.9], doblez: -1, escala: [0.6, 0.75, 0.8], fin: -75 },
    brazoN: { a: [175, 180], escala: [0.35, 1, 1], fin: 180 },
    brazoL: { a: [185, 180], escala: [0.35, 1, 1], fin: 180 },
  },

  // 8 · Sentado sobre los talones sujetando los empeines; al estirar, el tronco va algo atrás tirando de los pies
  8: {
    torso: -85,
    cuello: -85,
  },

  // 9 · Triángulo con las dos piernas casi estiradas y el talón de atrás levantado, caderas algo más adelantadas;
  //     al estirar, la rodilla de delante se dobla, las caderas bajan hacia atrás y el talón presiona el suelo
  9: {
    piernaN: { hacia: [-44.8, 69.5], doblez: -1, fin: 40 },
    piernaL: { hacia: [-34.0, 68.0], doblez: -1, fin: 55 },
    brazoN: { hacia: [50.2, 78.8], doblez: 1, fin: 5 },
    brazoL: { hacia: [52.3, 77.0], doblez: 1, fin: 5 },
  },

  // 10 · Sentado más erguido sujetando la toalla, pies relajados; al estirar, el tronco baja y los pies vienen hacia él
  10: {
    torso: -73,
    cuello: -62,
    piernaN: { a: [0, 0], fin: -65 },
    piernaL: { a: [-1, 1], fin: -65 },
  },

  // 11 · Pierna flexionada con el pie bajo; al estirar, el pie sube hacia el hombro contrario
  11: {
    piernaN: { a: [-148, -2], escala: [0.8, 1, 0.7], fin: -12 },
  },

  // 12 · Boca arriba con la pelvis en el suelo y los talones cerca de las nalgas; al estirar, rodillas al pecho
  //      y caderas despegadas
  12: {
    torso: 178,
    cuello: 180,
    piernaN: { a: [-110, 30], fin: -55 },
    piernaL: { a: [-113, 26], fin: -60 },
  },

  // 13 · De pie frente a la barra, sujeta con los brazos estirados y el cuerpo recto; al estirar, la pelvis
  //      cae hacia la pared y el cuerpo se arquea
  13: {
    torso: -127,
    cuello: -127,
    piernaN: { a: [53, 55], fin: 95 },
    piernaL: { a: [51, 53], fin: 95 },
    brazoN: { hacia: desdePunta(-28.9 - 53.9, -91.3 - 77.3), doblez: 1, fin: -104 },
    brazoL: { hacia: desdePunta(-27.1 - 53.9, -91.7 - 77.3), doblez: 1, fin: -102 },
  },

  // 14 · En cuclillas, tronco sobre los muslos y manos en el suelo; al estirar, las rodillas se extienden
  14: {
    torso: 25,
    cuello: 80,
    piernaN: { a: [45, 115], fin: 0 },
    piernaL: { a: [47, 113], fin: 0 },
    brazoN: { hacia: 'piernaN.punta+27.8,-0.3', doblez: 1, fin: 0 },
    brazoL: { hacia: 'piernaN.punta+25.4,0.2', doblez: 1, fin: 0 },
  },

  // 15 · De pie junto a la barra, sujeta con las manos juntas y el cuerpo casi recto; al estirar, se deja colgar
  //      y el cuerpo se arquea de lado
  15: {
    torso: -112,
    cuello: -114,
    piernaN: { a: [67, 68], fin: 70 },
    piernaL: { a: [65, 66], fin: 70 },
    brazoN: { hacia: desdePunta(-30.4 - 34.0, -91.8 - 90.4), doblez: 1, fin: -104 },
    brazoL: { hacia: desdePunta(-22.3 - 34.0, -94.2 - 90.4), doblez: -1, fin: -104 },
  },
};
