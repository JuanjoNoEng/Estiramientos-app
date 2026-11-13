// Posturas iniciales, tanda d (ver GUIA_POSES.md, sección Animación)
export default {
  50: {
    torso: -90,
    piernaL: { a: [97, 180], fin: 180 },
    piernaN: { hacia: [54.6, 44.1], doblez: -1, fin: 0 },
  },
  51: {
    ancla: 'pelvis',
    piernaL: { a: [38, 38], escala: [0.7, 1, 0.5], fin: 4 },
  },
  52: {
    ancla: 'pelvis',
    piernaN: { a: [104, 180], escala: [0.25, 1, 0.5], fin: 180 },
    piernaL: { a: [96, 180], escala: [0.05, 1, 0.5], fin: 180 },
  },
  53: {
    ancla: 'pelvis',
    torso: -90,
    cuello: -82,
  },
  54: {
    torso: -5,
    cuello: 0,
    brazoN: { hacia: [29, 8], doblez: -1, escala: [0.4, 0.6, 1], fin: 0 },
    brazoL: { hacia: [27, 8], doblez: -1, escala: [0.4, 0.6, 1], fin: 0 },
  },
  55: {
    torso: -30,
    cuello: -40,
    brazoN: { a: [-118, -120], fin: -120 },
    brazoL: { a: [-121, -123], fin: -123 },
  },
  56: {
    ancla: 'pelvis',
    torso: -55,
    cuello: -40,
    piernaN: { a: [8, 92], fin: 0 },
    piernaL: { a: [6, 90], fin: 0 },
    brazoN: { a: [88, 84], fin: 84 },
    brazoL: { a: [91, 86], fin: 86 },
  },
  57: {
    ancla: 'cabeza',
    torso: 180,
    cuello: 180,
    piernaN: { a: [-100, -15], fin: -5 },
    piernaL: { a: [-104, -19], fin: -9 },
  },
  58: {
    torso: -60,
    cuello: -25,
    brazoN: { hacia: [21.2, -10.6], doblez: 1, escala: [1, 0.5, 0.6], fin: -155 },
    brazoL: { hacia: [19.7, -11.3], doblez: 1, escala: [1, 0.5, 0.6], fin: -150 },
  },
  59: {
    torso: 2,
    cuello: 0,
    brazoN: { hacia: [12, -9], doblez: 1, fin: 180 },
  },
  60: {
    ancla: 'pelvis',
    torso: -97,
    cuello: -97,
  },
  62: {
    brazoN: { a: [186, -78], fin: -80 },
    brazoL: { a: [-6, -102], fin: -100 },
  },
  63: {
    brazoN: { a: [-150, -76], fin: -78 },
    brazoL: { a: [-30, -104], fin: -102 },
  },
  64: {
    ancla: 'pelvis',
    brazoN: { hacia: J => [J.cabeza[0] - 10, J.cabeza[1] + 2], doblez: -1, escala: [0.5, 0.85, 1], fin: 20 },
    brazoL: { hacia: J => [J.cabeza[0] - 9, J.cabeza[1]], doblez: -1, escala: [0.5, 0.85, 1], fin: 20 },
  },
  65: {
    ancla: 'pelvis',
    brazoN: { a: [-80, -96], escala: [1, 1, 1], fin: -96 },
    brazoL: { a: [-78, -94], escala: [1, 1, 1], fin: -94 },
  },
};
