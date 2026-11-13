// Posturas iniciales, tanda e (ver GUIA_POSES.md, sección Animación)
export default {
  // 66 · De pie, piernas casi rectas y hombros más altos; manos fijas en la pared. Al estirar flexiona las rodillas y baja los hombros
  66: {
    torso: -100,
    piernaN: { hacia: [21.8, 80], doblez: -1, fin: 0 },
    piernaL: { hacia: [18.1, 81.7], doblez: -1, fin: 0 },
    brazoN: { hacia: [-60.3, -41.4], doblez: 1, fin: -90 },
    brazoL: { hacia: [-60.4, -39.5], doblez: 1, fin: -90 },
  },
  // 67 · Arriba del fondo (brazos casi estirados, cuerpo recto sobre las puntas); baja el pecho hacia el suelo
  67: {
    torso: -12,
    piernaN: { a: [168, 168], fin: 60 },
    piernaL: { a: [169, 169], fin: 62 },
    brazoN: { hacia: J => [J.piernaN.punta[0] + 120.7, J.piernaN.punta[1] - 0.8], doblez: 1, escala: [0.6, 1, 1], fin: 0 },
    brazoL: { hacia: J => [J.piernaN.punta[0] + 123.7, J.piernaN.punta[1] - 0.8], doblez: 1, escala: [0.6, 1, 1], fin: 0 },
  },
  // 68 · Tronco algo más erguido y cabeza alta, antebrazo en la mesa; luego inclina el tronco y baja la cabeza
  68: {
    torso: -47,
    cuello: -25,
    brazoN: { hacia: [67, -5], doblez: 1, fin: 0 },
  },
  // 69 · Antebrazo casi vertical (codo a 90°); rota hacia atrás hasta la altura de la cabeza
  69: {
    brazoN: { a: [92, -105], escala: [0.75, 1, 1] },
  },
  // 70 · Codo separado del cuerpo, la otra mano ya lo sujeta; tira de él hacia el centro de la espalda
  70: {
    brazoN: { a: [117, 0], fin: 0 },
    brazoL: { hacia: 'brazoN.codo+8.4,4.2', doblez: -1, fin: 185 },
  },
  // 71 · Brazos entrelazados con el codo de arriba menos cruzado; al tirar de la muñeca cruza más
  71: {
    brazoN: { a: [50, -100], escala: [0.75, 1, 1], fin: -95 },
    brazoL: { a: [125, -80], escala: [0.86, 1, 1], fin: -95 },
  },
  // 72 · Mano detrás de la cintura, codo algo más bajo; al girar el tronco el codo va hacia atrás y afuera (el giro no se ve de frente)
  72: {
    brazoL: { a: [63, 160], fin: 165 },
  },
  // 73 · Palmas juntas en la zona lumbar con los dedos hacia abajo; giran hacia arriba y suben entre los omóplatos
  73: {
    brazoN: { hacia: [-3, -8], doblez: 1, fin: 85 },
    brazoL: { hacia: [3, -8], doblez: -1, fin: 95 },
  },
  // 74 · Brazos estirados por delante, algo por debajo de la horizontal; pasan por encima de la cabeza hacia atrás
  74: {
    brazoN: { a: [25, 25], fin: 25 },
    brazoL: { a: [23, 23], fin: 23 },
  },
  // 75 · Muñecas cruzadas justo encima de la cabeza con los codos doblados; se estiran hacia arriba (sin pasar por delante de la cara)
  75: {
    brazoN: { hacia: [-3, -84], doblez: -1, fin: -85 },
    brazoL: { hacia: [3, -84], doblez: 1, fin: -95 },
  },
  // 76 · Codo apoyado a 90°, antebrazo casi vertical y la otra mano en la muñeca; baja hasta la mesa
  76: {
    brazoN: { a: [44.4, -75], fin: -75 },
    brazoL: { hacia: 'brazoN.muneca+-1,-4', doblez: 1, fin: -40 },
  },
  // 77 · Más erguido, caderas atrás y cabeza alta, antebrazos en la mesa; lleva los hombros hacia las muñecas
  77: {
    torso: -56,
    cuello: -25,
    piernaN: { a: [86, 86] },
    piernaL: { a: [88, 86] },
    brazoN: { hacia: J => [J.piernaN.punta[0] + 31, J.piernaN.punta[1] - 91], doblez: 1, fin: -10 },
    brazoL: { hacia: J => [J.piernaN.punta[0] + 33, J.piernaN.punta[1] - 91], doblez: 1, fin: -10 },
  },
  // 78 · Mano de arriba algo más alta y codo más abierto; la de abajo tira de la toalla y ambas bajan
  78: {
    brazoL: { hacia: [6.7, -55], doblez: 1, fin: 100 },
    brazoN: { hacia: [0, -25], doblez: 1, fin: -85 },
  },
  // 79 · Dedos ya enganchados, mano de arriba algo más alta; la de abajo tira y el codo de arriba se flexiona más
  79: {
    brazoN: { hacia: [-6, -56], doblez: -1, fin: 80 },
    brazoL: { hacia: 'brazoN.punta+4.3,8.9', doblez: -1, fin: -100 },
  },
};
