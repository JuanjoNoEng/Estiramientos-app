// Posturas iniciales, tanda e (ver GUIA_POSES.md, sección Animación)
export default {
  66: {
    torso: -100,
    piernaN: { hacia: [21.8, 80], doblez: -1, fin: 0 },
    piernaL: { hacia: [18.1, 81.7], doblez: -1, fin: 0 },
    brazoN: { hacia: [-60.3, -41.4], doblez: 1, fin: -90 },
    brazoL: { hacia: [-60.4, -39.5], doblez: 1, fin: -90 },
  },
  67: {
    torso: -12,
    piernaN: { a: [168, 168], fin: 60 },
    piernaL: { a: [169, 169], fin: 62 },
    brazoN: { hacia: J => [J.piernaN.punta[0] + 120.7, J.piernaN.punta[1] - 0.8], doblez: 1, escala: [0.6, 1, 1], fin: 0 },
    brazoL: { hacia: J => [J.piernaN.punta[0] + 123.7, J.piernaN.punta[1] - 0.8], doblez: 1, escala: [0.6, 1, 1], fin: 0 },
  },
  68: {
    torso: -50,
    cuello: -35,
    brazoN: { hacia: [67, -5], doblez: 1, fin: 0 },
  },
  69: {
    brazoN: { a: [92, -105], escala: [0.75, 1, 1] },
  },
  70: {
    brazoN: { a: [112, -2], fin: -2 },
    brazoL: { hacia: 'brazoN.codo+8.4,4.2', doblez: -1, fin: 185 },
  },
  71: {
    brazoN: { a: [50, -100], escala: [0.75, 1, 1], fin: -95 },
    brazoL: { a: [125, -80], escala: [0.86, 1, 1], fin: -95 },
  },
  72: {
    brazoL: { a: [63, 160], fin: 165 },
  },
  73: {
    brazoN: { hacia: [-3, -8], doblez: 1, fin: 85 },
    brazoL: { hacia: [3, -8], doblez: -1, fin: 95 },
  },
  74: {
    brazoN: { a: [25, 25], fin: 25 },
    brazoL: { a: [23, 23], fin: 23 },
  },
  75: {
    brazoN: { hacia: [-3, -84], doblez: -1, fin: -85 },
    brazoL: { hacia: [3, -84], doblez: 1, fin: -95 },
  },
  76: {
    brazoN: { a: [44.4, -75], fin: -75 },
    brazoL: { hacia: 'brazoN.muneca+-1,-4', doblez: 1, fin: -40 },
  },
  77: {
    torso: -56,
    cuello: -40,
    piernaN: { a: [86, 86] },
    piernaL: { a: [88, 86] },
    brazoN: { hacia: J => [J.piernaN.punta[0] + 31, J.piernaN.punta[1] - 91], doblez: 1, fin: -10 },
    brazoL: { hacia: J => [J.piernaN.punta[0] + 33, J.piernaN.punta[1] - 91], doblez: 1, fin: -10 },
  },
  78: {
    brazoL: { a: [-87, 128], fin: 110 },
    brazoN: { hacia: [-2, -27], doblez: 1, fin: -85 },
  },
  79: {
    brazoN: { a: [-93, 52], fin: 70 },
    brazoL: { hacia: 'brazoN.punta+4.3,8.9', doblez: -1, fin: -100 },
  },
};
