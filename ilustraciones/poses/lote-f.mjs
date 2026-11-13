// Tanda f: ver GUIA_POSES.md
// Ejercicios 80–91 (excepto 89): muñecas y cuello.

// Cuadrupedia de lado, mirando a la derecha: muslos verticales, piernas y empeines apoyados hacia atrás.
const RODILLAS = {
  piernaN: { a: [90, 180], fin: 180 },
  piernaL: { a: [92, 180], fin: 180 },
};
const ANTEBRAZOS = ['brazoN.antebrazo', 'brazoN.mano', 'brazoL.antebrazo', 'brazoL.mano'];

// Apaño: en vista lateral el brazo cercano nace en la base del cuello y tapa la banda coral de la nuca.
// Esta función repite la geometría de cuelloGeo/bandaCuello de figura.mjs (lado nuca) para volver a pintar
// la banda por encima del brazo con un objeto `svg`.
const rad = g => (g * Math.PI) / 180;
const f1 = v => (Math.round(v * 10) / 10).toString();
function suave(pts) {
  const m = pts.length;
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < m; i++) {
    const p0 = pts[(i - 1 + m) % m], p1 = pts[i], p2 = pts[(i + 1) % m], p3 = pts[(i + 2) % m];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + 'Z';
}
function nucaEncima(J, torsoA, id, mira = 1, lado = -1) {
  const u = [Math.cos(rad(torsoA)), Math.sin(rad(torsoA))];
  const v = [-u[1] * mira, u[0] * mira];
  const P = (a, b) => [J.pelvis[0] + u[0] * a + v[0] * b, J.pelvis[1] + u[1] * a + v[1] * b];
  const L = Math.hypot(J.cabeza[0] - J.base[0], J.cabeza[1] - J.base[1]);
  const dn = [(J.cabeza[0] - J.base[0]) / L, (J.cabeza[1] - J.base[1]) / L];
  const borde = s => {
    let pn = [-dn[1], dn[0]];
    if (pn[0] * v[0] + pn[1] * v[1] < 0) pn = [-pn[0], -pn[1]];
    pn = [pn[0] * s, pn[1] * s];
    const A = P(44, s * (s > 0 ? 9 : 9.5));
    const H = [J.cabeza[0] - dn[0] * 12 * 0.45 + pn[0] * 12 * 0.6, J.cabeza[1] - dn[1] * 12 * 0.45 + pn[1] * 12 * 0.6];
    const M = [(A[0] + H[0]) / 2 - pn[0] * 1.2, (A[1] + H[1]) / 2 - pn[1] * 1.2];
    return [A, M, H];
  };
  const izq = borde(-1), der = borde(1);
  const forma = suave([P(38, 0), ...izq, J.cabeza, der[2], der[1], der[0]]);
  const [A, M, H] = lado < 0 ? izq : der;
  const curva = t => [0, 1].map(k => (1 - t) ** 2 * A[k] + 2 * (1 - t) * t * (2 * M[k] - (A[k] + H[k]) / 2) + t * t * H[k]);
  const l1 = [], l2 = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14, p = curva(t), q = curva(Math.min(1, t + 0.01)), r0 = curva(Math.max(0, t - 0.01));
    const d = [q[0] - r0[0], q[1] - r0[1]], n = Math.hypot(d[0], d[1]), w = 7.5 - 2.5 * t;
    l1.push([p[0] - (d[1] / n) * w, p[1] + (d[0] / n) * w]);
    l2.push([p[0] + (d[1] / n) * w, p[1] - (d[0] / n) * w]);
  }
  // Máscara: la banda no pisa la cabeza (en el dibujo normal la cabeza la tapa)
  const [cx, cy] = J.cabeza.map(f1);
  return {
    tipo: 'svg', delante: true,
    svg: `<clipPath id="${id}"><path d="${forma}"/></clipPath>` +
      `<mask id="${id}-m"><rect x="-500" y="-500" width="1000" height="1000" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="13.6" fill="#000"/></mask>` +
      `<g mask="url(#${id}-m)"><path d="${suave([...l1, ...l2.reverse()])}" fill="#F08A5D" clip-path="url(#${id})"/></g>`,
  };
}

export default {
  // 80 · Extensores de la muñeca, de pie: dorsos de las muñecas juntos, palmas hacia fuera
  80: {
    nombre: 'Braquiorradiales o extensores de la muñeca',
    vista: 'frente',
    torso: -90,
    piernaN: { a: [95, 90], fin: 115, escala: [1, 1, 0.5] },
    piernaL: { a: [85, 90], fin: 65, escala: [1, 1, 0.5] },
    brazoN: { a: [76, 77], fin: 140, escala: [1, 1, 1.4] },
    brazoL: { a: [104, 103], fin: 40, escala: [1, 1, 1.4] },
    resaltar: ANTEBRAZOS,
    objetos: J => [
      { tipo: 'flecha', c: J.brazoN.muneca, r: 22, de: 108, a: 160 },
      { tipo: 'flecha', c: J.brazoL.muneca, r: 22, de: 72, a: 20 },
    ],
  },

  // 81 · Extensores de la muñeca, a cuatro patas con el dorso de las manos en el suelo
  81: {
    nombre: 'Braquiorradiales o extensores de la muñeca',
    vista: 'lado',
    torso: -6,
    cuello: 15,
    ...RODILLAS,
    brazoN: { hacia: [45, 45.5], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
    brazoL: { hacia: [43, 45.5], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
    resaltar: ANTEBRAZOS,
    objetos: J => [
      { tipo: 'flecha', c: J.brazoN.muneca, r: 72, de: -82, a: -110 },
      // Dedos que se curvan hacia arriba: la palma mira al techo (dorso en el suelo)
      { tipo: 'svg', delante: true, svg: `<path d="M${J.brazoN.punta[0] + 2} ${J.brazoN.punta[1]}q-4 0 -5 -5" fill="none" stroke="#F08A5D" stroke-width="6" stroke-linecap="round"/>` },
    ],
  },

  // 82 · Flexores de la muñeca, de pie: la base de una mano empuja los dedos de la otra hacia atrás
  82: {
    nombre: 'Flexores de la muñeca',
    vista: 'lado',
    torso: -90,
    piernaN: { a: [90, 90] },
    piernaL: { a: [90, 90] },
    brazoN: { a: [62, -6], fin: -118, escala: [1, 1, 1.6] },
    // La otra mano, por delante, apoya la base de la palma sobre los dedos y los empuja hacia el cuerpo
    brazoL: {
      hacia: J => [(J.brazoN.muneca[0] + J.brazoN.punta[0]) / 2 + 6, (J.brazoN.muneca[1] + J.brazoN.punta[1]) / 2 - 3],
      doblez: 1, fin: -118, escala: [1, 1, 1.5],
    },
    resaltar: ['brazoN.antebrazo', 'brazoN.mano'],
    objetos: J => [{ tipo: 'flecha', c: J.brazoN.muneca, r: 29, de: -92, a: -136 }],
  },

  // 83 · Flexores de la muñeca, a cuatro patas: palmas en el suelo, dedos hacia la cabeza,
  //      el cuerpo se adelanta por delante de las manos
  83: {
    nombre: 'Flexores de la muñeca',
    vista: 'lado',
    torso: -8,
    cuello: 15,
    ...RODILLAS,
    brazoN: { hacia: [31, 45.5], doblez: 1, fin: 0, escala: [1, 1, 1.5] },
    brazoL: { hacia: [29, 45.5], doblez: 1, fin: 0, escala: [1, 1, 1.5] },
    resaltar: ANTEBRAZOS,
    objetos: J => [{ tipo: 'flecha', c: J.brazoN.muneca, r: 72, de: -98, a: -70 }],
  },

  // 84 · Flexores de la muñeca, a cuatro patas: palmas en el suelo, dedos hacia las rodillas,
  //      el cuerpo se echa hacia atrás
  84: {
    nombre: 'Flexores de la muñeca',
    vista: 'lado',
    torso: -8,
    cuello: 15,
    ...RODILLAS,
    brazoN: { hacia: [55, 45.5], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
    brazoL: { hacia: [53, 45.5], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
    resaltar: ANTEBRAZOS,
    objetos: J => [{ tipo: 'flecha', c: J.brazoN.muneca, r: 72, de: -82, a: -110 }],
  },

  // 85 · Parte posterior del cuello, tumbado boca arriba tirando de la cabeza hacia el pecho
  85: {
    nombre: 'Parte posterior del cuello',
    vista: 'lado',
    torso: 0,
    mira: -1,
    cuello: -52,
    piernaN: { a: [-130, 95], fin: 180 },
    piernaL: { a: [-127, 98], fin: 180 },
    // Manos entrelazadas detrás de la cabeza (la cabeza las tapa), codos hacia arriba
    brazoN: { hacia: J => [J.cabeza[0] + 7, J.cabeza[1] + 6], doblez: -1, fin: -120 },
    brazoL: { hacia: J => [J.cabeza[0] + 7, J.cabeza[1] + 5], doblez: -1, fin: -120 },
    orden: ['brazoL', 'piernaL', 'torso', 'piernaN', 'brazoN', 'cabeza'],
    resaltar: ['cuello'],
    objetos: J => [nucaEncima(J, 0, 'lote-f-nuca-85', -1)],
  },

  // 86 · Parte posterior del cuello, de pie con las manos entrelazadas en la nuca
  86: {
    nombre: 'Parte posterior del cuello',
    vista: 'lado',
    torso: -90,
    cuello: -30,
    piernaN: { a: [90, 90] },
    piernaL: { a: [90, 90] },
    // Manos sobre la parte alta y posterior de la cabeza, codos hacia delante
    brazoN: { hacia: J => [J.cabeza[0] - 8, J.cabeza[1] - 6], doblez: 1, fin: -55 },
    brazoL: { hacia: J => [J.cabeza[0] - 7, J.cabeza[1] - 7], doblez: 1, fin: -55 },
    resaltar: ['cuello'],
    objetos: J => [nucaEncima(J, -90, 'lote-f-nuca-86')],
  },

  // 87 · Parte posterior del cuello, de rodillas con los antebrazos en el suelo y la barbilla al pecho
  87: {
    nombre: 'Parte posterior del cuello',
    vista: 'lado',
    torso: 23,
    cuello: 80,
    ...RODILLAS,
    brazoN: { a: [84, 0], fin: 0 },
    brazoL: { a: [86, 0], fin: 0 },
    resaltar: ['cuello'],
    objetos: J => [nucaEncima(J, 23, 'lote-f-nuca-87')],
  },

  // 88 · Parte posterior del cuello, de pie con mancuernas, hombros caídos y barbilla al pecho
  88: {
    nombre: 'Parte posterior del cuello',
    vista: 'lado',
    torso: -90,
    cuello: -28,
    piernaN: { a: [90, 90] },
    piernaL: { a: [90, 90] },
    brazoN: { a: [93, 91], fin: 90 },
    brazoL: { a: [90, 90], fin: 90 },
    resaltar: ['cuello'],
    objetos: J => [
      { tipo: 'mancuerna', x: J.brazoN.punta[0], y: J.brazoN.punta[1] - 3, ang: 0 },
      nucaEncima(J, -90, 'lote-f-nuca-88'),
    ],
  },

  // 90 · Parte lateral del cuello, de pie (de espaldas) con los brazos a la espalda
  90: {
    nombre: 'Parte lateral del cuello',
    vista: 'frente',
    torso: -90,
    cuello: -62,
    piernaN: { a: [95, 90], fin: 115, escala: [1, 1, 0.5] },
    piernaL: { a: [85, 90], fin: 65, escala: [1, 1, 0.5] },
    espaldas: true,
    // Brazo bloqueado: codo junto a la cintura, antebrazo cruzando la espalda con el dorso de la mano hacia el tronco
    brazoN: { a: [93, 0], fin: 0 },
    // La otra mano sujeta el codo y tira de él hacia el centro de la espalda
    brazoL: { hacia: 'brazoN.codo+3,-1', doblez: -1, fin: 185 },
    resaltar: ['cuello'],
    objetos: J => [{ tipo: 'flecha', c: J.base, r: 40, de: -118, a: -76 }],
  },

  // 91 · Parte anterior del cuello: mano en la frente, cabeza hacia atrás
  91: {
    nombre: 'Parte anterior del cuello',
    vista: 'lado',
    torso: -94,
    cuello: -130,
    cuelloLado: 'frente',
    piernaN: { a: [88, 90] },
    piernaL: { a: [90, 90] },
    // Mano sobre la frente empujando la cabeza hacia atrás, codo hacia delante y arriba
    brazoN: { hacia: J => [J.cabeza[0] + 12, J.cabeza[1] - 9], doblez: 1, fin: -150, escala: [1, 1, 1.4] },
    brazoL: { a: [95, 92] },
    resaltar: ['cuello'],
    objetos: J => [nucaEncima(J, -94, 'lote-f-cuello-91', 1, 1)],
  },
};
