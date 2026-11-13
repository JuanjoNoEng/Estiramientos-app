// Voz guía: reproduce los audios generados con ElevenLabs (voz Julieta) y, si falta alguno,
// usa la voz del teléfono con el mismo texto. También centraliza pitidos y vibración.
import manifiesto from '../datos/voz.json';
import { leerEstado } from './almacen';

const disponibles = new Set(Object.keys((manifiesto as { audios: Record<string, unknown> }).audios));
const url = (clave: string) => `${import.meta.env.BASE_URL}audio/${clave}.mp3`;

export interface Frase {
  clave: string;   // p. ej. 'aviso-cambia', 'nombre-4', 'lectura-4'
  texto: string;   // respaldo para la voz del teléfono
}

let reproductor: HTMLAudioElement | null = null;
let turno = 0; // cada nueva petición cancela la anterior

function vozTelefono(texto: string): Promise<void> {
  return new Promise(resolve => {
    try {
      const s = window.speechSynthesis;
      if (!s) return resolve();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = 'es-ES';
      const voz = s.getVoices().find(v => v.lang.startsWith('es-') && /MX|US|419|CO|AR/.test(v.lang)) ?? s.getVoices().find(v => v.lang.startsWith('es'));
      if (voz) u.voice = voz;
      u.rate = 0.95;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      s.speak(u);
    } catch {
      resolve();
    }
  });
}

function reproducirArchivo(clave: string): Promise<boolean> {
  return new Promise(resolve => {
    try {
      reproductor ??= new Audio();
      const a = reproductor;
      a.onended = () => resolve(true);
      a.onerror = () => resolve(false);
      a.src = url(clave);
      a.play().catch(() => resolve(false));
    } catch {
      resolve(false);
    }
  });
}

/** Dice una o varias frases seguidas. Cancela lo que se estuviera diciendo. */
export async function decir(frases: Frase | Frase[], forzar = false) {
  if (!forzar && !leerEstado().voz) return;
  callar();
  const mio = ++turno;
  for (const f of Array.isArray(frases) ? frases : [frases]) {
    if (mio !== turno) return;
    const ok = disponibles.has(f.clave) && (await reproducirArchivo(f.clave));
    if (mio !== turno) return;
    if (!ok) await vozTelefono(f.texto);
  }
}

export function callar() {
  turno++;
  try { reproductor?.pause(); } catch { /* nada */ }
  try { window.speechSynthesis?.cancel(); } catch { /* nada */ }
}

/** iOS y Android solo dejan sonar audio después de un toque: se llama en el primer botón. */
export function desbloquearAudio() {
  try {
    reproductor ??= new Audio();
    reproductor.muted = true;
    reproductor.src = url('aviso-seguimos');
    reproductor.play().then(() => { reproductor!.pause(); reproductor!.muted = false; }).catch(() => { reproductor!.muted = false; });
    window.speechSynthesis?.getVoices();
  } catch { /* nada */ }
}

// ---------- Pitidos y vibración ----------
let ctx: AudioContext | null = null;
export function pitido(frec = 660, ms = 120, vol = 0.12) {
  if (!leerEstado().sonido) return;
  try {
    ctx ??= new AudioContext();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = frec;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + ms / 1000);
  } catch { /* sin audio */ }
}

export function vibrar(patron: number | number[]) {
  if (!leerEstado().vibracion) return;
  try { navigator.vibrate?.(patron); } catch { /* no disponible (iPhone) */ }
}

// ---------- Frases de la app ----------
export const AVISO = {
  empezamos: { clave: 'aviso-empezamos', texto: 'Empezamos.' },
  siguiente: { clave: 'aviso-siguiente', texto: 'Siguiente ejercicio.' },
  colocate: { clave: 'aviso-colocate', texto: 'Colócate en posición.' },
  estira: { clave: 'aviso-estira', texto: 'Ahora estira suave, sin rebotes, y suelta el aire despacio.' },
  primerLado: { clave: 'aviso-primer-lado', texto: 'Primer lado. Estira suave y suelta el aire despacio.' },
  segundoLado: { clave: 'aviso-segundo-lado', texto: 'Segundo lado. Estira suave y respira.' },
  cambia: { clave: 'aviso-cambia', texto: 'Muy bien. Cambia de lado.' },
  molesta: { clave: 'aviso-molesta', texto: 'De acuerdo, pasamos al siguiente. Recuerda comentárselo a Andrey.' },
  fin: { clave: 'aviso-fin', texto: '¡Muy bien! Terminaste. Tu cuerpo te lo agradece.' },
  pausa: { clave: 'aviso-pausa', texto: 'Pausa. Toca el botón cuando quieras seguir.' },
  seguimos: { clave: 'aviso-seguimos', texto: 'Seguimos.' },
  bienvenida: { clave: 'aviso-bienvenida', texto: 'Hola. Soy tu guía de estiramientos. Andrey preparó estos ejercicios para ti. Hazlos con calma y, si algo te duele, detente.' },
} satisfies Record<string, Frase>;

export const nombreEj = (id: number, nombre: string): Frase => ({ clave: `nombre-${id}`, texto: `${nombre}.` });

export function lecturaEj(e: { id: number; nombre: string; pasos: string[]; respiracion: string; volver: string; porLado: boolean; precauciones: string[] }): Frase {
  const texto = [
    `${e.nombre}.`, ...e.pasos, e.respiracion,
    e.volver + (e.porLado ? ' Luego repite con el otro lado.' : ''),
    ...(e.precauciones.length ? ['Ten en cuenta:', ...e.precauciones] : []),
  ].join(' ');
  return { clave: `lectura-${e.id}`, texto };
}

export const tarjetaFrase = (t: { id: string; titulo: string; texto: string }): Frase => ({ clave: `tarjeta-${t.id}`, texto: `${t.titulo}. ${t.texto}` });

export function seguridadFrase(s: { antesDeEmpezar: string[]; noEstirarSi: string[]; pararSi: string[]; consejos: string[] }): Frase {
  const texto = ['Antes de empezar.', ...s.antesDeEmpezar, 'No estires si tienes alguno de estos problemas.', ...s.noEstirarSi,
    'Detente si te pasa algo de esto.', ...s.pararSi, 'Consejos.', ...s.consejos].join(' ');
  return { clave: 'seguridad', texto };
}
