// Posturas iniciales, tanda d (ver GUIA_POSES.md, sección Animación)
export default {
  // 50 · Zancada más alta y retrasada: muslo de atrás casi vertical; la cadera baja y avanza (pie delantero y rodilla de atrás no se mueven)
  50: {
    torso: -90,
    piernaL: { a: [97, 180], fin: 180 },
    piernaN: { hacia: [54.6, 44.1], doblez: -1, fin: 0 },
  },
  // 51 · Pierna ya cruzada con la rodilla aún levantada (muslo en escorzo); la mano la empuja hasta el suelo
  51: {
    ancla: 'pelvis',
    piernaL: { a: [38, 38], escala: [0.7, 1, 0.5], fin: 4 },
  },
  // 52 · Rodillas juntas en la vertical (muslos en escorzo); caen juntas hacia un lado
  52: {
    ancla: 'pelvis',
    piernaN: { a: [104, 180], escala: [0.25, 1, 0.5], fin: 180 },
    piernaL: { a: [96, 180], escala: [0.05, 1, 0.5], fin: 180 },
  },
  // 53 · Tronco sin girar, mirada al frente; gira hacia la mano apoyada (de perfil solo se ve el tronco y la cabeza)
  53: {
    ancla: 'pelvis',
    torso: -88,
    cuello: -76,
  },
  // 54 · Boca abajo en el suelo, manos junto al pecho (codos abiertos, en escorzo); se eleva el tronco
  54: {
    torso: -5,
    cuello: 0,
    brazoN: { hacia: [29, 8], doblez: -1, escala: [0.4, 0.6, 1], fin: 0 },
    brazoL: { hacia: [27, 8], doblez: -1, escala: [0.4, 0.6, 1], fin: 0 },
  },
  // 55 · Tronco algo elevado con los brazos ya sujetos por el compañero; este tira y lo eleva más
  55: {
    torso: -30,
    cuello: -40,
    brazoN: { a: [-118, -120], fin: -120 },
    brazoL: { a: [-121, -123], fin: -123 },
  },
  // 56 · Sentado inclinado hacia delante, brazos colgando; el tronco se dobla hasta los muslos
  56: {
    ancla: 'pelvis',
    torso: -55,
    cuello: -40,
    brazoN: { a: [88, 84], fin: 84 },
    brazoL: { a: [91, 86], fin: 86 },
  },
  // 57 · Rodillas en la vertical sujetas por detrás, cadera en el suelo; las rodillas van al pecho y la cadera se eleva
  57: {
    ancla: 'cabeza',
    torso: 180,
    cuello: 180,
    piernaN: { a: [-100, -15], fin: -5 },
    piernaL: { a: [-104, -19], fin: -9 },
  },
  // 58 · Pecho sobre los muslos, cabeza alta; se inclina y redondea la espalda tirando de los muslos
  58: {
    torso: -60,
    cuello: -25,
    brazoN: { hacia: [21.2, -10.6], doblez: -1, escala: [1, 0.5, 0.6], fin: -155 },
    brazoL: { hacia: [19.7, -11.3], doblez: -1, escala: [1, 0.5, 0.6], fin: -150 },
  },
  // 59 · Hombro relajado sobre la mesa (codo bajo); el compañero levanta el hombro
  59: {
    ancla: 'pelvis',
    torso: 2,
    cuello: 0,
    brazoN: { hacia: [2, -12], doblez: 1, escala: [1, 0.84, 1], fin: 180 },
  },
  // 60 · Sentado erguido con las manos en la nuca; se inclina hacia atrás sobre el respaldo
  60: {
    ancla: 'pelvis',
    torso: -97,
    cuello: -97,
  },
  // 62 · Como el 61 aprobado: codos ligeramente bajos y antebrazos algo inclinados; al inclinarse quedan verticales
  62: {
    brazoN: { a: [186, -78], fin: -80 },
    brazoL: { a: [-6, -102], fin: -100 },
  },
  // 63 · Igual que el 62 con los codos por encima de los hombros
  63: {
    brazoN: { a: [-150, -76], fin: -78 },
    brazoL: { a: [-30, -104], fin: -102 },
  },
  // 64 · Codos más adelantados (brazo en escorzo); el compañero los lleva hacia atrás sin soltarlos
  64: {
    ancla: 'pelvis',
    brazoN: { hacia: J => [J.cabeza[0] - 10, J.cabeza[1] + 2], doblez: -1, escala: [0.5, 0.85, 1], fin: 20 },
    brazoL: { hacia: J => [J.cabeza[0] - 9, J.cabeza[1]], doblez: -1, escala: [0.5, 0.85, 1], fin: 20 },
  },
  // 65 · Brazos a la vertical sobre el pecho, codos algo doblados; bajan hasta quedar colgando a los lados del banco
  65: {
    ancla: 'pelvis',
    brazoN: { a: [-80, -96], escala: [1, 1, 1], fin: -96 },
    brazoL: { a: [-78, -94], escala: [1, 1, 1], fin: -94 },
  },
};
