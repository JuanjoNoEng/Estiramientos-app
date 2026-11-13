import { useEstado, actualizar } from '../almacen';
import { Cabecera } from '../componentes/comunes';
import { Icono } from '../componentes/Icono';
import { useState } from 'react';
import { esApp } from '../plataforma';
import { programarNotificacion, quitarNotificacion, descargarEventoCalendario } from '../recordatorio';

function Recordatorio() {
  const e = useEstado();
  const [hora, setHora] = useState(e.recordatorio ?? '08:00');
  const [mensaje, setMensaje] = useState('');
  const nativo = esApp();
  const activar = async () => {
    if (nativo) {
      const ok = await programarNotificacion(hora);
      if (!ok) { setMensaje('No se pudo activar. Revisa que la app tenga permiso para enviar notificaciones.'); return; }
      actualizar(() => ({ recordatorio: hora }));
      setMensaje(`Listo: te avisaremos todos los días a las ${hora}.`);
    } else {
      descargarEventoCalendario(hora);
      actualizar(() => ({ recordatorio: hora }));
      setMensaje('Abre el archivo descargado y toca «Agregar» para guardarlo en tu calendario.');
    }
  };
  const quitar = async () => { await quitarNotificacion(); actualizar(() => ({ recordatorio: null })); setMensaje('Recordatorio quitado.'); };
  return (
    <section className="tarjeta seccion">
      <h2>Recordatorio diario</h2>
      <p className="sub">{nativo ? 'Tu teléfono te avisará cada día para que no olvides estirar.' : 'Agrega un aviso diario en el calendario de tu teléfono.'}</p>
      <label className="campo">¿A qué hora?
        <input type="time" value={hora} onChange={ev => setHora(ev.target.value)} style={{ fontSize: '1.4rem', fontWeight: 600 }} />
      </label>
      <button className="boton grande ancho" onClick={activar}><Icono nombre="reloj" /> {nativo ? (e.recordatorio ? 'Cambiar la hora' : 'Activar recordatorio') : 'Agregar a mi calendario'}</button>
      {nativo && e.recordatorio && <button className="boton claro" onClick={quitar}>Quitar recordatorio</button>}
      {mensaje && <p className="tarjeta menta" role="status">{mensaje}</p>}
    </section>
  );
}

function Interruptor({ titulo, detalle, valor, cambiar }: { titulo: string; detalle?: string; valor: boolean; cambiar: (v: boolean) => void }) {
  return (
    <div className="ajuste">
      <div><h3 style={{ fontSize: '1.05rem' }}>{titulo}</h3>{detalle && <p className="peque-texto">{detalle}</p>}</div>
      <button className="interruptor" role="switch" aria-checked={valor} aria-label={titulo} onClick={() => cambiar(!valor)} />
    </div>
  );
}

export function Ajustes() {
  const e = useEstado();
  const borrar = () => {
    if (!confirm('¿Borrar tu progreso, tus rutinas y tu plan? Esto no se puede deshacer.')) return;
    actualizar(() => ({ sesiones: [], propias: [], favoritos: [], plan: undefined }));
  };
  return (
    <main className="pantalla">
      <Cabecera titulo="Ajustes" atras="/" />

      <section className="tarjeta seccion">
        <h2>Tamaño de letra</h2>
        <div className="opciones">
          {([['normal', 'Normal', '1rem'], ['grande', 'Grande', '1.2rem'], ['muy-grande', 'Muy grande', '1.4rem']] as const).map(([id, txt, tam]) => (
            <button key={id} className={'opcion' + (e.letra === id ? ' activo' : '')} aria-pressed={e.letra === id} onClick={() => actualizar(() => ({ letra: id }))}>
              <span style={{ fontSize: tam, fontWeight: 700, fontFamily: 'var(--titulos)', color: 'var(--verde)' }}>Aa</span>{txt}
            </button>
          ))}
        </div>
      </section>

      <Recordatorio />

      <section className="tarjeta seccion" style={{ gap: 0 }}>
        <Interruptor titulo="Modo sencillo" detalle="Inicio con un solo botón grande para tus ejercicios." valor={e.modo === 'sencillo'} cambiar={v => actualizar(() => ({ modo: v ? 'sencillo' : 'completo' }))} />
        <Interruptor titulo="Voz guía" detalle="Una voz te dice qué hacer en cada paso." valor={e.voz} cambiar={v => actualizar(() => ({ voz: v }))} />
        <Interruptor titulo="Sonidos" detalle="Pitidos al cambiar de paso." valor={e.sonido} cambiar={v => actualizar(() => ({ sonido: v }))} />
        <Interruptor titulo="Vibración" detalle="El teléfono vibra al cambiar de paso (solo Android)." valor={e.vibracion} cambiar={v => actualizar(() => ({ vibracion: v }))} />
        <Interruptor titulo="Animaciones" detalle="Las figuras se mueven para mostrar el ejercicio." valor={e.animaciones} cambiar={v => actualizar(() => ({ animaciones: v }))} />
      </section>

      <section className="seccion">
        {!esApp() && <a className="tarjeta aviso" href="#/instalar" style={{ textDecoration: 'none', color: 'inherit' }}><Icono nombre="subir" /><div><h3>Instalar la app en tu teléfono</h3><p className="peque-texto">Paso a paso, para Android y iPhone.</p></div></a>}
        <a className="tarjeta aviso" href="#/seguridad" style={{ textDecoration: 'none', color: 'inherit' }}><Icono nombre="aviso" /><div><h3>Seguridad al estirar</h3></div></a>
        <a className="tarjeta aviso" href="#/progreso" style={{ textDecoration: 'none', color: 'inherit' }}><Icono nombre="estrella" /><div><h3>Mi progreso</h3></div></a>
      </section>

      <button className="boton claro" style={{ color: 'var(--coral-texto)' }} onClick={borrar}><Icono nombre="basura" /> Borrar mis datos</button>
      <p className="peque-texto" style={{ textAlign: 'center' }}>Tus datos se guardan solo en este teléfono.</p>
    </main>
  );
}
