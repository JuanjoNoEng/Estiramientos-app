// Tanda a: ejercicios 1–15 (pies y tobillos, piernas, tronco inferior y lateral del tronco). Ver GUIA_POSES.md

const CORAL = '#F08A5D';
const rad = g => (g * Math.PI) / 180;

// Catmull-Rom cerrado → Bézier (igual que el motor), para recortar zonas a la silueta del tronco
function contorno(pts) {
  const m = pts.length;
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < m; i++) {
    const p0 = pts[(i - 1 + m) % m], p1 = pts[i], p2 = pts[(i + 1) % m], p3 = pts[(i + 2) % m];
    const c = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c.map(v => v.toFixed(1)).join(' ')} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

// Costado de un tronco en vista frontal (lado: -1 izquierda del dibujo, 1 derecha).
// Reproduce el perfil frontal del motor para recortar una franja coral solo en ese costado.
const PERFIL_FRENTE = [[50, 9], [48.5, 17], [44.5, 21.5], [38, 20], [28, 16.5], [18, 14.5], [9, 16.5], [1, 18], [-6, 16], [-11, 9]];
function costadoFrontal(J, torsoA, lado, id, ancho = 9) {
  const u = [Math.cos(rad(torsoA)), Math.sin(rad(torsoA))];
  const v = [-u[1], u[0]];
  const P = ([a, b]) => [J.pelvis[0] + u[0] * a + v[0] * b, J.pelvis[1] + u[1] * a + v[1] * b];
  const der = PERFIL_FRENTE, izq = [...PERFIL_FRENTE].reverse().map(([a, b]) => [a, -b]);
  const silueta = contorno([...der, [-12.5, 0], ...izq].map(P));
  // Franja: desde el borde exterior hacia dentro "ancho" unidades, entre la cintura y la axila
  const franja = [[4, 30 * lado], [40, 30 * lado], [40, (21.5 - ancho - 2) * lado], [28, (16.5 - ancho) * lado], [16, (14.5 - ancho) * lado], [4, (17 - ancho) * lado]].map(P);
  const d = 'M' + franja.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
  return `<clipPath id="${id}"><path d="${silueta}"/></clipPath><path d="${d}" fill="${CORAL}" clip-path="url(#${id})"/>`;
}

export default {
  // 1 · De rodillas, manos en el suelo, dedos de los pies flexionados hacia arriba y nalgas hacia los talones
  1: {
    nombre: 'Dedos y arco plantar',
    vista: 'lado',
    torso: -32,
    cuello: -15,
    piernaN: { a: [35, 195], fin: 100 },
    piernaL: { a: [33, 195], fin: 100 },
    brazoN: { hacia: [52, 27], doblez: 1, fin: 0 },
    brazoL: { hacia: [55, 27], doblez: 1, fin: 0 },
    resaltar: ['piernaN.pie', 'piernaL.pie'],
  },

  // 2 · Sentado, una pierna cruzada sobre la rodilla contraria; una mano sujeta el tobillo y otra empuja el empeine
  2: {
    nombre: 'Dedos y cara anterior e interna del tobillo',
    vista: 'frente',
    torso: -92,
    piernaN: { a: [100, 92], escala: [0.42, 0.95, 0.55], fin: 115 },
    piernaL: { hacia: [-19, 6], doblez: -1, escala: [0.42, 1, 1], fin: 172 },
    brazoN: { hacia: [-37, -2], doblez: 1, fin: 60 },
    brazoL: { hacia: [-8, 4], doblez: -1, fin: 180 },
    orden: ['piernaN', 'torso', 'piernaL', 'brazoN', 'brazoL'],
    resaltar: ['piernaL.pie'],
    objetos: () => [{ tipo: 'sillaFrente', x: 0, y: 7, ancho: 64 }],
  },

  // 3 · De pie, el pie adelantado apoya el dorso de los dedos en el suelo; manos en la rodilla
  3: {
    nombre: 'Parte anterior del pie y dedos',
    vista: 'lado',
    torso: -68,
    piernaL: { a: [90, 90], fin: 0 },
    piernaN: { hacia: [14, 72], doblez: -1, fin: 112 },
    brazoN: { hacia: [25, 12], doblez: 1, fin: 70 },
    brazoL: { hacia: [22, 11], doblez: 1, fin: 70 },
    resaltar: ['piernaN.pie'],
  },

  // 5 · De rodillas, inclinado hacia atrás apoyado en los brazos estirados
  5: {
    nombre: 'Cuádriceps',
    vista: 'lado',
    torso: -128,
    cuello: -105,
    piernaN: { a: [20, 182], fin: 180 },
    piernaL: { a: [17, 182], fin: 180 },
    brazoN: { hacia: [-43, 15], doblez: -1, fin: 180 },
    brazoL: { hacia: [-39, 15], doblez: -1, fin: 180 },
    resaltar: ['piernaN.muslo', 'piernaL.muslo'],
  },

  // 6 · Sentado, una pierna estirada y la otra doblada; tronco hacia el muslo, manos al tobillo
  6: {
    nombre: 'Flexores de las piernas',
    vista: 'lado',
    torso: -40,
    cuello: -25,
    piernaN: { a: [0, 0], fin: -82 },
    piernaL: { a: [10, 175], escala: [0.75, 0.75, 0.8], fin: 175 },
    brazoN: { hacia: 'piernaN.tobillo+-4,-5', doblez: 1, fin: 0 },
    brazoL: { hacia: 'piernaN.tobillo+-7,-6', doblez: 1, fin: 0 },
    resaltar: ['piernaN.muslo'],
  },

  // 7 · Aductores: posición final (figura inferior del libro) vista desde arriba: tumbado boca abajo sobre
  //     una colchoneta, rodillas muy separadas, pies hacia fuera y brazos estirados hacia delante
  7: {
    nombre: 'Aductores',
    vista: 'frente',
    sinSuelo: true,
    torso: 180,
    piernaN: { a: [92, 2], fin: 75, escala: [0.95, 0.75, 0.8] },
    piernaL: { a: [-92, -2], fin: -75, escala: [0.95, 0.75, 0.8] },
    brazoN: { a: [172, 178], fin: 178 },
    brazoL: { a: [188, 182], fin: 182 },
    resaltar: ['piernaN.muslo', 'piernaL.muslo'],
    objetos: J => {
      const x0 = J.brazoN.punta[0] - 10, x1 = J.piernaN.punta[0] + 14;
      return [{
        tipo: 'svg', fijo: true, delante: false, caja: [x0, -62, x1],
        svg: `<rect x="${x0.toFixed(1)}" y="-60" width="${(x1 - x0).toFixed(1)}" height="120" rx="10" fill="#7CC6A6" opacity=".22"/>`,
      }];
    },
  },

  // 8 · De rodillas sentado sobre los talones, dedos hacia atrás, manos tirando de los empeines
  8: {
    nombre: 'Pierna anterior y lateral',
    vista: 'lado',
    torso: -95,
    piernaN: { a: [24, 182], fin: 180 },
    piernaL: { a: [22, 182], fin: 180 },
    brazoN: { hacia: 'piernaN.tobillo+-7,-8', doblez: 1, fin: 115 },
    brazoL: { hacia: 'piernaL.tobillo+-5,-8', doblez: 1, fin: 115 },
    resaltar: ['piernaN.pierna'],
    objetos: J => [{ tipo: 'colchoneta', x1: J.piernaN.punta[0] - 14, x2: J.piernaN.rodilla[0] + 16 }],
  },

  // 9 · Triángulo (caderas arriba), una rodilla flexionada y el talón de la otra pierna contra el suelo
  9: {
    nombre: 'Tendón de Aquiles y parte posterior de la pantorrilla',
    vista: 'lado',
    torso: 52,
    piernaN: { a: [117, 117], fin: 0 },
    piernaL: { hacia: [-24, 64], doblez: -1, fin: 55 },
    brazoN: { hacia: [62, 77], doblez: 1, fin: 5 },
    brazoL: { hacia: [66, 77], doblez: 1, fin: 5 },
    resaltar: ['piernaN.pierna'],
  },

  // 10 · Sentado con las piernas estiradas, tronco hacia delante, tirando de una toalla en las plantas
  10: {
    nombre: 'Parte posterior de las rodillas',
    vista: 'lado',
    torso: -58,
    cuello: -45,
    piernaN: { a: [0, 0], fin: -80 },
    piernaL: { a: [-1, 1], fin: -80 },
    brazoN: { hacia: [53, -10], doblez: 1, fin: -5 },
    brazoL: { hacia: [55, -12], doblez: 1, fin: -5 },
    objetos: J => {
      const r = J.piernaN.rodilla, h = J.brazoN.muneca, t = J.piernaN.tobillo, p = J.piernaN.punta;
      return [
        // Corva: franja coral alrededor de la parte posterior de la rodilla
        // (franja con el mismo grosor que la pierna estirada en esa zona)
        { tipo: 'svg', delante: true, svg: `<path d="M${(r[0] - 16).toFixed(1)} ${(r[1] - 7.4).toFixed(1)}L${r[0].toFixed(1)} ${(r[1] - 6.5).toFixed(1)}L${(r[0] + 14).toFixed(1)} ${(r[1] - 6).toFixed(1)}L${(r[0] + 14).toFixed(1)} ${(r[1] + 6).toFixed(1)}L${r[0].toFixed(1)} ${(r[1] + 6.5).toFixed(1)}L${(r[0] - 16).toFixed(1)} ${(r[1] + 7.4).toFixed(1)}Z" fill="${CORAL}"/>` },
        { tipo: 'toalla', puntos: [[h[0] + 7, h[1] - 1], [p[0] + 3.5, p[1] - 1], [t[0] + 6, t[1] + 3], [h[0] + 7, h[1] + 1.5]] },
      ];
    },
  },

  // 11 · Sentado contra la pared, una pierna estirada; la otra flexionada y llevada hacia el pecho
  11: {
    nombre: 'Cadera y glúteos',
    vista: 'frente',
    torso: -90,
    piernaL: { a: [5, 0], fin: -80 },
    piernaN: { hacia: [3, -33], doblez: -1, escala: [0.8, 1, 0.7], fin: -25 },
    brazoN: { hacia: 'piernaN.rodilla+-3,-3', doblez: 1, fin: 30 },
    brazoL: { hacia: 'piernaN.tobillo+6,4', doblez: -1, fin: 200 },
    orden: ['piernaL', 'torso', 'piernaN', 'brazoN', 'brazoL'],
    resaltar: ['gluteo'],
  },

  // 12 · Boca arriba, rodillas al pecho sujetando los muslos, caderas despegadas del suelo
  12: {
    nombre: 'Parte inferior del tronco',
    vista: 'lado',
    mira: 1,
    torso: 167,
    cuello: 180,
    piernaN: { a: [-122, -15], fin: -80 },
    piernaL: { a: [-126, -19], fin: -84 },
    brazoN: { hacia: 'piernaN.rodilla+7,4', doblez: -1, fin: -40 },
    brazoL: { hacia: 'piernaL.rodilla+5,3', doblez: -1, fin: -40 },
    resaltar: ['lumbar'],
  },

  // 13 · Colgado de una barra en la pared, de cara a ella, pies alejados y cuerpo arqueado hacia atrás
  13: {
    nombre: 'Abdominales',
    vista: 'lado',
    mira: -1,
    torso: -112,
    cuello: -124,
    piernaN: { a: [48, 50], fin: 95 },
    piernaL: { a: [46, 48], fin: 95 },
    brazoN: { a: [-104, -104], fin: -104 },
    brazoL: { a: [-102, -102], fin: -102 },
    resaltar: ['abdomen'],
    objetos: J => {
      const m = J.brazoN.muneca, bx = m[0] - 1, by = m[1] - 4;
      const px = Math.min(bx - 12, J.cabeza[0] - 18);
      return [
        { tipo: 'pared', x: px, lado: -1, arriba: by - 25 },
        { tipo: 'barra', x: bx, y: by, pared: px },
      ];
    },
  },

  // 14 · Desde cuclillas, rodillas extendidas: tronco colgando pegado a los muslos y manos en el suelo junto a los pies
  14: {
    nombre: 'Zona lumbar',
    vista: 'lado',
    torso: 48,
    cuello: 120,
    piernaN: { a: [87, 94], fin: 0 },
    piernaL: { a: [89, 92], fin: 0 },
    // brazos estirados hasta el suelo (objetivo fuera de alcance: quedan rectos)
    brazoN: { hacia: [44, 95], doblez: 1, fin: 0 },
    brazoL: { hacia: [41, 95], doblez: 1, fin: 0 },
    resaltar: ['lumbar'],
  },

  // 15 · Colgado de lado de una barra en la pared, manos juntas, brazos tras las orejas y cuerpo arqueado lateralmente
  15: {
    nombre: 'Parte lateral del tronco',
    vista: 'frente',
    torso: -106,
    cuello: -112,
    piernaN: { a: [62, 63], fin: 70 },
    piernaL: { a: [60, 61], fin: 70 },
    brazoN: { hacia: [-31, -103], doblez: 1, fin: -104 },
    brazoL: { hacia: [-27, -103], doblez: -1, fin: -104 },
    orden: ['piernaN', 'piernaL', 'torso', 'brazoN', 'brazoL', 'cabeza'],
    objetos: J => {
      const bx = (J.brazoN.punta[0] + J.brazoL.punta[0]) / 2 - 3, by = J.brazoN.muneca[1] - 3;
      const px = Math.min(bx - 12, J.brazoN.codo[0] - 9);
      return [
        { tipo: 'pared', x: px, lado: -1, arriba: by - 25 },
        { tipo: 'barra', x: bx, y: by, pared: px },
        { tipo: 'svg', delante: true, svg: costadoFrontal(J, -106, -1, 'lote-a-15-costado') },
      ];
    },
  },
};
