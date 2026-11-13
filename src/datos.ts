// Datos de la app: ejercicios, rutinas y guía (generados a partir del libro) + ilustraciones.
import ejerciciosJSON from '../datos/ejercicios.json';
import rutinasJSON from '../datos/rutinas.json';
import guiaJSON from '../datos/guia.json';
import { dibujar, animacion } from '../ilustraciones/figura.mjs';
import { INICIOS } from '../ilustraciones/inicios.mjs';
import { POSES } from '../ilustraciones/ejercicios.mjs';

export type Zona =
  | 'pies-tobillos' | 'piernas' | 'cadera-gluteos' | 'zona-lumbar' | 'abdomen'
  | 'espalda-alta' | 'pecho' | 'hombros' | 'brazos' | 'munecas' | 'cuello';

export type Posicion =
  | 'de-pie' | 'sentado-silla' | 'sentado-suelo' | 'de-rodillas'
  | 'boca-arriba' | 'boca-abajo' | 'de-lado' | 'colgado';

export interface Ejercicio {
  id: number;
  nombre: string;
  zona: Zona;
  musculos: string[];
  bloque: 'fundamental' | 'especifico';
  posicion: Posicion;
  material: string[];
  porLado: boolean;
  dificultad: 1 | 2 | 3;
  pasos: string[];
  respiracion: string;
  volver: string;
  precauciones: string[];
  variantes: string[];
  duracionSegundos: number;
  paginaLibro: number;
}

export interface Rutina {
  id: string;
  nombre: string;
  descripcion: string;
  intensidad?: string;
  ejercicios: number[];
  /** Duración por ejercicio (s). Si falta, se usa la de cada ejercicio. */
  duracion?: number;
  propia?: boolean;
}

export interface Guia {
  seguridad: { antesDeEmpezar: string[]; noEstirarSi: string[]; pararSi: string[]; consejos: string[] };
  tarjetas: { id: string; titulo: string; texto: string }[];
}

export const EJERCICIOS = ejerciciosJSON as Ejercicio[];
// Rutina corta y suave (de pie o en silla) para quien no tiene plan de Andrey: es la del botón grande del modo sencillo
export const RUTINA_DIARIA: Rutina = {
  id: 'diaria',
  nombre: 'Rutina diaria suave',
  descripcion: 'Siete estiramientos suaves, de pie o en una silla, para cuello, hombros, brazos, espalda y piernas. Necesitas una pared, una silla y el marco de una puerta.',
  intensidad: 'suave',
  ejercicios: [89, 18, 75, 61, 56, 4, 48],
};
export const RUTINAS = [RUTINA_DIARIA, ...(rutinasJSON as Rutina[])];
export const GUIA = guiaJSON as Guia;

const porId = new Map(EJERCICIOS.map(e => [e.id, e]));
export const ejercicio = (id: number) => porId.get(id);
export const rutina = (id: string) => RUTINAS.find(r => r.id === id);

export const ZONAS: { id: Zona; nombre: string; ejemplo: number }[] = [
  { id: 'cuello', nombre: 'Cuello', ejemplo: 89 },
  { id: 'hombros', nombre: 'Hombros', ejemplo: 70 },
  { id: 'espalda-alta', nombre: 'Espalda alta', ejemplo: 16 },
  { id: 'pecho', nombre: 'Pecho', ejemplo: 61 },
  { id: 'brazos', nombre: 'Brazos', ejemplo: 24 },
  { id: 'munecas', nombre: 'Muñecas', ejemplo: 82 },
  { id: 'abdomen', nombre: 'Abdomen', ejemplo: 54 },
  { id: 'zona-lumbar', nombre: 'Zona lumbar', ejemplo: 56 },
  { id: 'cadera-gluteos', nombre: 'Cadera y glúteos', ejemplo: 51 },
  { id: 'piernas', nombre: 'Piernas', ejemplo: 48 },
  { id: 'pies-tobillos', nombre: 'Pies y tobillos', ejemplo: 31 },
];
export const nombreZona = (z: Zona) => ZONAS.find(x => x.id === z)?.nombre ?? z;

export const POSICIONES: Record<Posicion, string> = {
  'de-pie': 'De pie',
  'sentado-silla': 'En silla',
  'sentado-suelo': 'Sentado en el suelo',
  'de-rodillas': 'De rodillas',
  'boca-arriba': 'Boca arriba',
  'boca-abajo': 'Boca abajo',
  'de-lado': 'De lado',
  colgado: 'Colgado',
};

export const MATERIALES: Record<string, string> = {
  pared: 'Pared', silla: 'Silla', mesa: 'Mesa', banco: 'Banco', toalla: 'Toalla', barra: 'Barra',
  puerta: 'Marco de puerta', palo: 'Palo', 'peso-ligero': 'Peso ligero', correa: 'Correa',
  colchoneta: 'Colchoneta', 'escalon-inclinado': 'Escalón inclinado', companero: 'Compañero',
};

export const DIFICULTAD = { 1: 'Suave', 2: 'Moderado', 3: 'Exigente' } as const;

// ---------- Ilustraciones ----------
const cacheSVG = new Map<string, string>();
/** SVG de un ejercicio. `clave` hace únicos los id internos (recortes) cuando hay varias en pantalla. */
export function svgEjercicio(id: number, clave = ''): string | null {
  const pose = (POSES as Record<number, unknown>)[id];
  if (!pose) return null;
  const k = `${id}-${clave}`;
  if (!cacheSVG.has(k)) cacheSVG.set(k, dibujar(pose, { id: `e${id}${clave}`, titulo: ejercicio(id)?.nombre, zoomMax: 1.5 }));
  return cacheSVG.get(k)!;
}

// ---------- Animaciones ----------
export const FOTOGRAMAS = 24;
const cacheAnim = new Map<string, (string | undefined)[]>();
export const tieneAnimacion = (id: number) => !!(INICIOS as Record<number, unknown>)[id] && !!(POSES as Record<number, unknown>)[id];
/** Fotograma i (0 … FOTOGRAMAS) de la animación inicio → final. Se calcula la primera vez que se pide. */
export function fotograma(id: number, i: number, clave = ''): string | null {
  if (!tieneAnimacion(id)) return svgEjercicio(id, clave);
  const k = `${id}-${clave}`;
  let lista = cacheAnim.get(k);
  if (!lista) { lista = []; cacheAnim.set(k, lista); }
  if (!lista[i]) {
    const anim = animacion((INICIOS as Record<number, unknown>)[id], (POSES as Record<number, unknown>)[id], { id: `a${id}${clave}`, titulo: ejercicio(id)?.nombre, zoomMax: 1.5 });
    // Se guardan todos de una vez: preparar la animación es lo costoso
    for (let j = 0; j <= FOTOGRAMAS; j++) lista[j] ??= anim.cuadro(j / FOTOGRAMAS);
  }
  return lista[i]!;
}

/** Duración total aproximada de una rutina en segundos (incluye ambos lados y preparación). */
export function duracionRutina(ids: number[], porEjercicio?: number) {
  return ids.reduce((t, id) => {
    const e = ejercicio(id);
    if (!e) return t;
    const d = porEjercicio ?? e.duracionSegundos;
    return t + (e.porLado ? 2 * d + 5 : d) + 5;
  }, 0);
}

export const minutos = (s: number) => Math.max(1, Math.round(s / 60));
