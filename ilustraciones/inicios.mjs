// Postura inicial de cada ejercicio (desde donde arranca la animación hasta la postura final de ejercicios.mjs).
// Solo hace falta indicar lo que cambia: lo que no se indique se toma de la postura final.
import loteA from './inicio/lote-a.mjs';
import loteB from './inicio/lote-b.mjs';
import loteC from './inicio/lote-c.mjs';
import loteD from './inicio/lote-d.mjs';
import loteE from './inicio/lote-e.mjs';
import loteF from './inicio/lote-f.mjs';

const MUESTRA = {
  // 4 · Pantorrillas: más erguido, brazos casi rectos y rodilla de delante apenas doblada
  4: {
    torso: -60,
    piernaN: { a: [124, 124], fin: 0 },
    piernaL: { hacia: [32, 69], doblez: -1, fin: 0 },
    brazoN: { hacia: [58, -58], doblez: 1, fin: -78 },
    brazoL: { hacia: [60, -60], doblez: 1, fin: -78 },
  },
  // 48 · Cuádriceps: talón ya sujeto por la mano, pero lejos del glúteo; al estirar se acerca
  48: {
    piernaN: { a: [80, -124], fin: -160 },
    brazoN: { hacia: 'piernaN.tobillo+3,-5', doblez: 1, fin: 160 },
  },
  // 61 · Pectorales: brazos en el marco, cuerpo erguido (el giro hacia delante no se ve de frente: brazos más bajos)
  61: {
    brazoN: { a: [170, -70], fin: -75 },
    brazoL: { a: [10, -110], fin: -105 },
  },
  // 89 · Cuello: cabeza recta, la mano ya apoyada encima
  89: {
    cuello: -90,
    brazoL: { a: [-80, 186], fin: 160 },
  },
};

export const INICIOS = { ...loteA, ...loteB, ...loteC, ...loteD, ...loteE, ...loteF, ...MUESTRA };
