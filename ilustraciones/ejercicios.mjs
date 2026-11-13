// Posturas de cada ejercicio. Clave = número del ejercicio.
// Cada pose: vista ('lado' | 'frente'), torso/cuello (ángulos), piernaN/piernaL/brazoN/brazoL, resaltar, objetos.
// Miembro: { a: [ángulo1, ángulo2], fin } o { hacia: [x, y] | 'referencia', doblez: ±1, fin }.

export const POSES = {
  // 4 · Pantorrillas: inclinado contra la pared, pierna trasera estirada
  4: {
    vista: 'lado',
    torso: -48,
    piernaN: { a: [132, 132], fin: 0 },
    piernaL: { hacia: [30, 62.4], doblez: -1, fin: 0 },
    brazoN: { hacia: [64, -40], doblez: 1, fin: -78 },
    brazoL: { hacia: [66, -42], doblez: 1, fin: -78 },
    resaltar: ['piernaN.pierna'],
    objetos: J => [{ tipo: 'pared', x: Math.max(J.brazoN.punta[0], J.brazoL.punta[0]) + 2, lado: 1 }],
  },

  // 48 · Cuádriceps de pie, apoyado en la pared
  48: {
    vista: 'lado',
    torso: -86,
    piernaL: { a: [90, 90], fin: 0 },
    piernaN: { a: [102, -112], fin: -150 },
    brazoN: { hacia: 'piernaN.tobillo+3,-5', doblez: 1, fin: 160 },
    brazoL: { a: [-4, -4], fin: -4 },
    resaltar: ['piernaN.muslo'],
    objetos: J => [{ tipo: 'pared', x: J.brazoL.punta[0] + 3, lado: 1 }],
  },

  // 89 · Lateral del cuello, sentado sujetando la silla
  89: {
    vista: 'frente',
    torso: -90,
    cuello: -64,
    piernaN: { a: [128, 93], escala: [0.42, 0.95, 0.55], fin: 120 },
    piernaL: { a: [52, 87], escala: [0.42, 0.95, 0.55], fin: 60 },
    brazoN: { hacia: [-28, 11], doblez: -1, fin: 92 },
    brazoL: { a: [-66, 196], fin: 212 },
    resaltar: ['cuello'],
    objetos: () => [{ tipo: 'sillaFrente', x: 0, y: 6, ancho: 64 }],
  },

  // 61 · Pectorales en el marco de la puerta
  61: {
    vista: 'frente',
    torso: -90,
    piernaN: { a: [97, 92], fin: 115, escala: [1, 1, 0.5] },
    piernaL: { a: [83, 88], fin: 65, escala: [1, 1, 0.5] },
    brazoN: { a: [165, -90], fin: -90 },
    brazoL: { a: [15, -90], fin: -90 },
    resaltar: ['pecho'],
    objetos: J => [{ tipo: 'puerta', x1: J.brazoN.codo[0] + 2, x2: J.brazoL.codo[0] - 2, arriba: J.cabeza[1] - 45 }],
  },
};
