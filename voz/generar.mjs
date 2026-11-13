// Genera las voces de la app con ElevenLabs (voz: Julieta) a partir de los textos de datos/.
// Solo regenera los audios cuyo texto cambió (se guarda un resumen del texto en el manifiesto).
//
// Uso:
//   ELEVENLABS_API_KEY=... node voz/generar.mjs            → avisos y nombres
//   ELEVENLABS_API_KEY=... node voz/generar.mjs --lecturas → además, la lectura completa de cada ejercicio
//   node voz/generar.mjs --simular                          → muestra qué generaría y cuántos caracteres
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = path.join(RAIZ, 'public', 'audio');
const MANIFIESTO = path.join(RAIZ, 'datos', 'voz.json');
const VOZ = { id: '9EU0h6CVtEDS6vriwwq5', nombre: 'Julieta' };
const MODELO = 'eleven_multilingual_v2';
const AJUSTES = { stability: 0.6, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true };

const args = new Set(process.argv.slice(2));
const ejercicios = JSON.parse(fs.readFileSync(path.join(RAIZ, 'datos', 'ejercicios.json'), 'utf8'));
const guia = JSON.parse(fs.readFileSync(path.join(RAIZ, 'datos', 'guia.json'), 'utf8'));

// ---------- Textos ----------
export const AVISOS = {
  empezamos: 'Empezamos.',
  siguiente: 'Siguiente ejercicio.',
  colocate: 'Colócate en posición.',
  estira: 'Ahora estira suave, sin rebotes, y suelta el aire despacio.',
  'primer-lado': 'Primer lado. Estira suave y suelta el aire despacio.',
  'segundo-lado': 'Segundo lado. Estira suave y respira.',
  cambia: 'Muy bien. Cambia de lado.',
  'tres-segundos': 'Tres segundos más.',
  molesta: 'De acuerdo, pasamos al siguiente. Recuerda comentárselo a Andrey.',
  fin: '¡Muy bien! Terminaste. Tu cuerpo te lo agradece.',
  pausa: 'Pausa. Toca el botón cuando quieras seguir.',
  seguimos: 'Seguimos.',
  bienvenida: 'Hola. Soy tu guía de estiramientos. Andrey preparó estos ejercicios para ti. Hazlos con calma y, si algo te duele, detente.',
};

const lectura = e => [
  `${e.nombre}.`,
  ...e.pasos,
  e.respiracion,
  e.volver + (e.porLado ? ' Luego repite con el otro lado.' : ''),
  ...(e.precauciones.length ? ['Ten en cuenta:', ...e.precauciones] : []),
].join(' ');

export function textoSeguridad(s) {
  return ['Antes de empezar.', ...s.antesDeEmpezar, 'No estires si tienes alguno de estos problemas.', ...s.noEstirarSi,
    'Detente si te pasa algo de esto.', ...s.pararSi, 'Consejos.', ...s.consejos].join(' ');
}

const items = [
  ...Object.entries(AVISOS).map(([k, texto]) => ({ clave: `aviso-${k}`, texto })),
  ...ejercicios.map(e => ({ clave: `nombre-${e.id}`, texto: `${e.nombre}.` })),
  ...(args.has('--lecturas') ? ejercicios.map(e => ({ clave: `lectura-${e.id}`, texto: lectura(e) })) : []),
  // Tarjetas de «Aprende» y guía de seguridad (para quien lee con dificultad)
  ...(args.has('--lecturas') ? guia.tarjetas.map(t => ({ clave: `tarjeta-${t.id}`, texto: `${t.titulo}. ${t.texto}` })) : []),
  ...(args.has('--lecturas') ? [{ clave: 'seguridad', texto: textoSeguridad(guia.seguridad) }] : []),
];

// ---------- Generación ----------
const resumen = t => crypto.createHash('sha1').update(`${VOZ.id}|${MODELO}|${JSON.stringify(AJUSTES)}|${t}`).digest('hex').slice(0, 12);
const manifiesto = fs.existsSync(MANIFIESTO) ? JSON.parse(fs.readFileSync(MANIFIESTO, 'utf8')) : { voz: VOZ, audios: {} };
const pendientes = items.filter(it => manifiesto.audios[it.clave]?.hash !== resumen(it.texto) || !fs.existsSync(path.join(SALIDA, it.clave + '.mp3')));
const caracteres = pendientes.reduce((t, it) => t + it.texto.length, 0);
console.log(`${pendientes.length} audios por generar (${caracteres} caracteres) de ${items.length}`);
if (args.has('--simular') || !pendientes.length) process.exit(0);

const clave = process.env.ELEVENLABS_API_KEY;
if (!clave) { console.error('Falta ELEVENLABS_API_KEY'); process.exit(1); }
fs.mkdirSync(SALIDA, { recursive: true });

async function tts(texto) {
  for (let intento = 1; intento <= 4; intento++) {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOZ.id}?output_format=mp3_44100_64`, {
      method: 'POST',
      headers: { 'xi-api-key': clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: texto, model_id: MODELO, language_code: 'es', voice_settings: AJUSTES }),
    });
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    const msg = await r.text();
    if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 1500 * intento)); continue; }
    throw new Error(`ElevenLabs ${r.status}: ${msg.slice(0, 300)}`);
  }
  throw new Error('ElevenLabs: demasiados reintentos');
}

const guardar = () => fs.writeFileSync(MANIFIESTO, JSON.stringify(manifiesto, null, 2) + '\n');
let hechos = 0;
// De 3 en 3 para no saturar la API
for (let i = 0; i < pendientes.length; i += 3) {
  await Promise.all(pendientes.slice(i, i + 3).map(async it => {
    const mp3 = await tts(it.texto);
    fs.writeFileSync(path.join(SALIDA, it.clave + '.mp3'), mp3);
    manifiesto.audios[it.clave] = { hash: resumen(it.texto), bytes: mp3.length };
    hechos++;
  }));
  guardar();
  process.stdout.write(`\r${hechos}/${pendientes.length}`);
}
console.log('\nListo');
