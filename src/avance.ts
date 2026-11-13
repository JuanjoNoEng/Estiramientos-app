// Resumen del progreso para enviárselo a Andrey por WhatsApp (sin servidores: el paciente elige enviarlo).
import { ejercicio } from './datos';
import { racha, diasActivos, type Sesion } from './almacen';

/** Número de WhatsApp de la consulta (con código de país, solo dígitos, p. ej. '573001234567'). Vacío: el paciente elige el contacto. */
export const WHATSAPP_ANDREY = '';

export function mensajeAvance(sesiones: Sesion[], paciente?: string) {
  const hace7 = Date.now() - 7 * 864e5;
  const semana = sesiones.filter(s => new Date(s.fecha).getTime() >= hace7);
  const dias7 = [...diasActivos(semana)].length;
  const sens = { 1: 'peor', 2: 'igual', 3: 'mejor' } as const;
  const conSens = semana.filter(s => s.sensacion);
  const promedio = (k: 1 | 2 | 3) => conSens.filter(s => s.sensacion === k).length;
  const molestias = new Map<number, number>();
  for (const s of semana) for (const id of s.dolorEn ?? []) molestias.set(id, (molestias.get(id) ?? 0) + 1);
  const ultima = sesiones[sesiones.length - 1];
  const lineas = [
    `Hola Andrey${paciente ? `, soy ${paciente}` : ''}. Te comparto mi avance con los estiramientos:`,
    `• Últimos 7 días: estiré ${dias7} ${dias7 === 1 ? 'día' : 'días'} (${semana.length} ${semana.length === 1 ? 'sesión' : 'sesiones'}).`,
    `• Días seguidos: ${racha(sesiones)}.`,
  ];
  if (conSens.length) lineas.push(`• Después de estirar me sentí: mejor ${promedio(3)}, igual ${promedio(2)}, peor ${promedio(1)} ${conSens.length === 1 ? 'vez' : 'veces'}.`);
  if (molestias.size) lineas.push(`• Noté molestia en: ${[...molestias].map(([id, n]) => `${ejercicio(id)?.nombre ?? id}${n > 1 ? ` (${n} veces)` : ''}`).join(', ')}.`);
  if (ultima) lineas.push(`• Última sesión: ${new Date(ultima.fecha).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}, ${ultima.rutina}${ultima.sensacion ? ` (me sentí ${sens[ultima.sensacion]})` : ''}.`);
  if (!sesiones.length) lineas.push('• Todavía no he hecho ninguna sesión.');
  return lineas.join('\n');
}

export function enlaceWhatsApp(texto: string) {
  return `https://wa.me/${WHATSAPP_ANDREY}?text=${encodeURIComponent(texto)}`;
}
