import { useEstado, racha, diasActivos, type Sesion } from '../almacen';
import { minutos } from '../datos';
import { Cabecera } from '../componentes/comunes';

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const clave = (d: Date) => d.toLocaleDateString('sv');

/** Semana actual (lunes a domingo) con los días en que hubo sesión. */
export function SemanaActual({ sesiones }: { sesiones: Sesion[] }) {
  const activos = diasActivos(sesiones);
  const hoy = new Date();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  return (
    <div className="semana" aria-label="Días con estiramientos esta semana">
      {DIAS.map((letra, k) => {
        const d = new Date(lunes);
        d.setDate(lunes.getDate() + k);
        const si = activos.has(clave(d));
        return <span key={k}>{letra}<i className={(si ? 'si' : '') + (clave(d) === clave(hoy) ? ' hoy' : '')} title={si ? 'Estiraste' : ''} /></span>;
      })}
    </div>
  );
}

export function Progreso() {
  const { sesiones } = useEstado();
  const dias = racha(sesiones);
  const total = sesiones.reduce((t, s) => t + s.segundos, 0);
  const ultimas = [...sesiones].reverse().slice(0, 20);
  const conMolestia = sesiones.filter(s => s.molestia != null).slice(-10);
  const sensaciones = { 1: '😣 Peor', 2: '😐 Igual', 3: '😌 Mejor' } as const;

  return (
    <main className="pantalla">
      <Cabecera titulo="Mi progreso" atras="/" />
      <section className="tarjeta seccion">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center' }}>
          <div><div className="racha"><span className="numero" style={{ margin: '0 auto' }}>{dias}</span></div><span className="peque-texto">días seguidos</span></div>
          <div><div className="racha"><span className="numero" style={{ margin: '0 auto', color: 'var(--verde)' }}>{sesiones.length}</span></div><span className="peque-texto">sesiones</span></div>
          <div><div className="racha"><span className="numero" style={{ margin: '0 auto', color: 'var(--menta)' }}>{total ? minutos(total) : 0}</span></div><span className="peque-texto">minutos</span></div>
        </div>
        <SemanaActual sesiones={sesiones} />
      </section>

      {conMolestia.length > 1 && (
        <section className="tarjeta seccion">
          <h3>Molestia después de estirar</h3>
          <p className="peque-texto">Tus últimas {conMolestia.length} sesiones (0 = nada, 10 = mucha). Puedes enseñárselo a Andrey.</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110 }} role="img" aria-label={'Molestia: ' + conMolestia.map(s => s.molestia).join(', ')}>
            {conMolestia.map((s, k) => (
              <div key={k} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <span className="peque-texto" style={{ fontSize: 11 }}>{s.molestia}</span>
                <div style={{ width: '100%', maxWidth: 26, height: `${Math.max(4, (s.molestia ?? 0) * 8)}px`, background: 'var(--coral)', borderRadius: 6 }} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="seccion">
        <h2>Historial</h2>
        {ultimas.length === 0 && <p className="vacio">Aún no hay sesiones. ¡Empieza hoy con una rutina corta!</p>}
        {ultimas.map((s, k) => (
          <div key={k} className="tarjeta" style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: 14 }}>
            <div>
              <h3 style={{ fontSize: 16 }}>{s.rutina}</h3>
              <span className="peque-texto">{new Date(s.fecha).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })} · {minutos(s.segundos)} min</span>
            </div>
            <span className="peque-texto" style={{ textAlign: 'right' }}>{s.sensacion ? sensaciones[s.sensacion] : ''}{s.dolorEn?.length ? <><br /><span style={{ color: '#B24E22' }}>molestia en {s.dolorEn.length}</span></> : null}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
