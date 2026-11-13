// Posturas iniciales, tanda f (ver GUIA_POSES.md, sección Animación)
export default {
  // 80 · Extensores de la muñeca: dorsos de las muñecas juntos, manos colgando; al estirar giran hacia fuera
  80: {
    brazoN: { a: [76, 77], fin: 100, escala: [1, 1, 1.4] },
    brazoL: { a: [104, 103], fin: 80, escala: [1, 1, 1.4] },
  },

  // 81 · Extensores, a cuatro patas con el dorso de las manos en el suelo: hombros por delante de las
  //      muñecas; al estirar el cuerpo se echa atrás (rodillas y manos quietas, la pelvis retrocede)
  81: {
    piernaN: { a: [110, 180], fin: 180 },
    piernaL: { a: [112, 180], fin: 180 },
    brazoN: { hacia: [30.3, 42.9], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
    brazoL: { hacia: [28.3, 42.9], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
  },

  // 82 · Flexores de la muñeca: dedos hacia arriba y la base de la otra mano apoyada; al estirar los empuja atrás
  82: {
    brazoN: { a: [62, -6], fin: -92, escala: [1, 1, 1.6] },
  },

  // 83 · Flexores, palmas en el suelo y dedos hacia la cabeza: hombros encima de las muñecas;
  //      al estirar el cuerpo se adelanta
  83: {
    piernaN: { a: [70, 180], fin: 180 },
    piernaL: { a: [72, 180], fin: 180 },
    brazoN: { hacia: [45.7, 42.9], doblez: 1, fin: 0, escala: [1, 1, 1.5] },
    brazoL: { hacia: [43.7, 42.9], doblez: 1, fin: 0, escala: [1, 1, 1.5] },
  },

  // 84 · Flexores, palmas en el suelo y dedos hacia las rodillas: hombros encima de las muñecas;
  //      al estirar el cuerpo se echa atrás
  84: {
    piernaN: { a: [110, 180], fin: 180 },
    piernaL: { a: [112, 180], fin: 180 },
    brazoN: { hacia: [40.3, 42.9], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
    brazoL: { hacia: [38.3, 42.9], doblez: 1, fin: 180, escala: [1, 1, 1.5] },
  },

  // 85 · Cuello, boca arriba: cabeza apoyada con las manos detrás; al estirar las manos la llevan hacia el pecho
  85: {
    cuello: -20,
    brazoN: { hacia: J => [J.cabeza[0] + 7, J.cabeza[1] + 6], doblez: -1, fin: -120 },
    brazoL: { hacia: J => [J.cabeza[0] + 7, J.cabeza[1] + 5], doblez: -1, fin: -120 },
  },

  // 86 · Cuello, de pie: manos entrelazadas en la nuca con la cabeza casi recta; al estirar baja la barbilla
  86: {
    cuello: -65,
    brazoN: { hacia: J => [J.cabeza[0] - 3, J.cabeza[1] - 11], doblez: 1, fin: 10 },
    brazoL: { hacia: J => [J.cabeza[0] - 2, J.cabeza[1] - 11.5], doblez: 1, fin: 10 },
  },

  // 87 · Cuello, de rodillas sobre los antebrazos: cabeza entre los brazos; al estirar la barbilla va al pecho
  87: {
    cuello: 45,
  },

  // 88 · Cuello, de pie con mancuernas: cabeza casi recta; al estirar baja la barbilla (giro moderado por la nuca fija)
  88: {
    cuello: -60,
  },

  // 90 · Lateral del cuello, de espaldas: brazo ya bloqueado, cabeza recta; al estirar se ladea.
  //      -87 y no -90: con la cabeza exactamente recta el motor pinta el coral en el otro lado del cuello
  90: {
    cuello: -87,
  },

  // 91 · Anterior del cuello: mano en la frente con la cabeza un poco atrás; al estirar se echa atrás del todo
  91: {
    cuello: -105,
    brazoL: { hacia: J => [J.cabeza[0] + 14, J.cabeza[1] - 9], doblez: 1, fin: -130, escala: [1, 1, 1.4] },
  },
};
