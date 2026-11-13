// Recordatorio diario para estirar.
// - En la app de Android (APK): notificación local que se repite cada día a la hora elegida.
// - En la web (iPhone u otros): se descarga un evento diario para el calendario del teléfono.
import { LocalNotifications } from '@capacitor/local-notifications';
import { esApp } from './plataforma';

const ID = 1;

export async function programarNotificacion(hora: string): Promise<boolean> {
  const [h, m] = hora.split(':').map(Number);
  try {
    const permiso = await LocalNotifications.requestPermissions();
    if (permiso.display !== 'granted') return false;
    await LocalNotifications.cancel({ notifications: [{ id: ID }] });
    await LocalNotifications.schedule({
      notifications: [{
        id: ID,
        title: 'Hora de estirar',
        body: 'Tus ejercicios te esperan. Solo unos minutos.',
        schedule: { on: { hour: h, minute: m }, repeats: true, allowWhileIdle: true },
        smallIcon: 'ic_stat_notificacion',
      }],
    });
    return true;
  } catch {
    return false;
  }
}

export async function quitarNotificacion() {
  try { await LocalNotifications.cancel({ notifications: [{ id: ID }] }); } catch { /* nada */ }
}

/** Evento de calendario que se repite cada día (formato .ics, lo abren iPhone y Android). */
export function descargarEventoCalendario(hora: string) {
  const [h, m] = hora.split(':').map(Number);
  const hoy = new Date();
  const d = (n: number) => String(n).padStart(2, '0');
  const fecha = `${hoy.getFullYear()}${d(hoy.getMonth() + 1)}${d(hoy.getDate())}`;
  const inicio = `${fecha}T${d(h)}${d(m)}00`;
  const fin = `${fecha}T${d(h)}${d((m + 10) % 60)}00`.replace(/T(\d\d)(\d\d)/, (_, hh, mm) => `T${Number(mm) < m ? d((Number(hh) + 1) % 24) : hh}${mm}`);
  const enlace = location.href.split('#')[0];
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Andrey Hernandez//Estiramientos//ES', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:estiramientos-${Date.now()}@andreyhernandez`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART:${inicio}`, `DTEND:${fin}`,
    'RRULE:FREQ=DAILY',
    'SUMMARY:Hora de estirar',
    `DESCRIPTION:Tus ejercicios de Andrey te esperan. Abre la app: ${enlace}`,
    `URL:${enlace}`,
    'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:Hora de estirar', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'recordatorio-estiramientos.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export const recordatorioNativo = esApp;
