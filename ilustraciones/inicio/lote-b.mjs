// Posturas iniciales, tanda b (ver GUIA_POSES.md, sección Animación)
export default {
  16: {
    torso: -12,
    cuello: -6,
    piernaN: { a: [93, 90] },
    piernaL: { a: [95, 90] },
    brazoN: { hacia: J => [J.piernaN.punta[0] + 95.5 - 14, J.piernaN.punta[1] - 85], doblez: 1, fin: -8 },
    brazoL: { hacia: J => [J.piernaN.punta[0] + 95.5 - 14, J.piernaN.punta[1] - 85], doblez: 1, fin: -9 },
  },
  17: {
    torso: -5,
    cuello: 30,
    brazoN: { a: [21, 175], escala: [1, 0.55, 0.7], fin: 175 },
    brazoL: { a: [19, 175], escala: [1, 0.55, 0.7], fin: 175 },
  },
  18: {
    torso: -46,
    cuello: -15,
  },
  19: {
    torso: -90,
    cuello: -90,
  },
  20: {
    brazoN: { a: [6, -8], escala: [0.6, 1, 1], fin: -8 },
  },
  21: {
    torso: -114,
    piernaN: { a: [37, 37], fin: -60 },
    piernaL: { a: [39, 37], fin: -60 },
    brazoN: { hacia: J => [J.piernaL.tobillo[0] - 96.4, J.piernaL.tobillo[1] - 40.1], doblez: 1, fin: 70 },
    brazoL: { hacia: J => [J.piernaL.tobillo[0] - 98.4, J.piernaL.tobillo[1] - 41.1], doblez: 1, fin: 70 },
  },
  22: {
    torso: -89,
    piernaN: { a: [99.5, 94.5], fin: 115, escala: [1, 1, 0.5] },
    piernaL: { a: [86.5, 98.5], fin: 65, escala: [0.96, 1, 0.5] },
    brazoL: { a: [0, -90], escala: [0.85, 1, 1], fin: -90 },
  },
  // 23 · Brazos verticales con la mancuerna que bajan por detrás de la cabeza (la pelvis queda fija sobre la mesa)
  23: { ancla: 'pelvis', brazoN: { a: [-92, -92], fin: -92 }, brazoL: { a: [-90, -90], fin: -90 } },
  24: {
    brazoN: { a: [-126, 28], fin: 38 },
  },
  25: {
    torso: -93,
    brazoN: { hacia: [-52.5, -35.6], doblez: 1, fin: 172 },
  },
  26: {
    brazoN: { a: [180, 82], fin: 100 },
    brazoL: { a: [0, 98], fin: 80 },
  },
  27: {
    torso: 3,
    piernaN: { a: [90, 178], fin: 180 },
    piernaL: { a: [92, 178], fin: 180 },
    brazoN: { hacia: J => [J.piernaL.punta[0] + 115, J.piernaL.punta[1] + 0.2], doblez: 1, fin: 180 },
    brazoL: { hacia: J => [J.piernaL.punta[0] + 112, J.piernaL.punta[1] + 0.2], doblez: 1, fin: 180 },
  },
  28: {
    cuello: -90,
    brazoL: { hacia: [-8, -70.7], doblez: 1, fin: 142 },
  },
  29: {
    cuello: -80,
  },
  30: {
    ancla: 'pelvis',
    cuello: 150,
  },
};
