// Estado guardado en el teléfono del paciente (localStorage). Nada sale del dispositivo.
import { useSyncExternalStore } from 'react';
import type { Rutina } from './datos';

export interface Sesion {
  fecha: string;           // ISO
  rutina: string;          // id o nombre de la rutina
  ejercicios: number;
  segundos: number;
  sensacion?: 1 | 2 | 3;   // 1 = peor, 2 = igual, 3 = mejor
  molestia?: number;       // 0–10
  dolorEn?: number[];      // ejercicios en los que marcó dolor
}

export interface PlanAndrey extends Rutina {
  paciente?: string;
  vecesPorDia?: number;
  nota?: string;
  recibido: string;        // ISO
}

interface Estado {
  bienvenida: boolean;     // ya aceptó el aviso de seguridad
  favoritos: number[];
  sesiones: Sesion[];
  plan?: PlanAndrey;
  propias: Rutina[];
  voz: boolean;
  sonido: boolean;
  vibracion: boolean;
  letra: 'normal' | 'grande' | 'muy-grande';
  modo: 'completo' | 'sencillo';
  animaciones: boolean;
  instalacionVista: boolean;
  recordatorio: string | null; // 'HH:MM' o null
}

const CLAVE = 'estiramientos-ah-v1';
const inicial: Estado = {
  bienvenida: false, favoritos: [], sesiones: [], propias: [], voz: true, sonido: true,
  vibracion: true, letra: 'normal', modo: 'completo', animaciones: true, instalacionVista: false, recordatorio: null,
};

function leer(): Estado {
  try {
    const raw = localStorage.getItem(CLAVE);
    return raw ? { ...inicial, ...JSON.parse(raw) } : inicial;
  } catch {
    return inicial;
  }
}

let estado = leer();
const oyentes = new Set<() => void>();

export function actualizar(cambio: (e: Estado) => Partial<Estado>) {
  estado = { ...estado, ...cambio(estado) };
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    /* modo privado o almacenamiento lleno: se mantiene en memoria */
  }
  oyentes.forEach(f => f());
}

export const leerEstado = () => estado;

export function useEstado() {
  return useSyncExternalStore(
    f => { oyentes.add(f); return () => oyentes.delete(f); },
    () => estado,
  );
}

export const alternarFavorito = (id: number) =>
  actualizar(e => ({ favoritos: e.favoritos.includes(id) ? e.favoritos.filter(x => x !== id) : [...e.favoritos, id] }));

export const guardarSesion = (s: Sesion) => actualizar(e => ({ sesiones: [...e.sesiones, s].slice(-500) }));

// ---------- Estadísticas ----------
const dia = (iso: string) => iso.slice(0, 10);
const hoyISO = () => new Date().toISOString();

export function diasActivos(sesiones: Sesion[]) {
  return new Set(sesiones.map(s => dia(new Date(s.fecha).toLocaleDateString('sv'))));
}

/** Días seguidos con al menos una sesión, terminando hoy (o ayer si hoy aún no hay sesión). */
export function racha(sesiones: Sesion[]) {
  const dias = diasActivos(sesiones);
  const d = new Date();
  const clave = (x: Date) => x.toLocaleDateString('sv');
  if (!dias.has(clave(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (dias.has(clave(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export const hechasHoy = (sesiones: Sesion[]) => sesiones.filter(s => new Date(s.fecha).toLocaleDateString('sv') === new Date().toLocaleDateString('sv')).length;

export { hoyISO };
