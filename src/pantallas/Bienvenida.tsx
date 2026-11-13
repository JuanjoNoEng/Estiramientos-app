import { useState } from 'react';
import { GUIA } from '../datos';
import { useEstado, actualizar } from '../almacen';
import { Icono } from '../componentes/Icono';
import { decir, callar, desbloquearAudio, AVISO } from '../voz';

const LETRAS = [
  { id: 'normal', texto: 'Normal', muestra: '1rem' },
  { id: 'grande', texto: 'Grande', muestra: '1.2rem' },
  { id: 'muy-grande', texto: 'Muy grande', muestra: '1.4rem' },
] as const;

export function Bienvenida() {
  const estado = useEstado();
  const [paso, setPaso] = useState(0);
  const [verLista, setVerLista] = useState(false);
  const siguiente = () => { callar(); setPaso(p => p + 1); scrollTo({ top: 0 }); };

  return (
    <main className="pantalla sin-nav" style={{ gap: 22, minHeight: '100dvh' }}>
      <div className="puntos" aria-label={`Paso ${paso + 1} de 3`} style={{ marginTop: 14 }}>
        {[0, 1, 2].map(k => <i key={k} className={k === paso ? 'si' : ''} />)}
      </div>

      {paso === 0 && (
        <>
          <img src="simbolo.svg" alt="" style={{ width: 110, margin: '6px auto 0' }} />
          <section className="seccion" style={{ textAlign: 'center' }}>
            <h1>¡Hola! Te damos la bienvenida</h1>
            <p className="sub">Tus estiramientos, recomendados por <b>Andrey Hernández, Quiropráctico</b>.</p>
          </section>
          <button className="boton claro grande" style={{ alignSelf: 'center' }} onClick={() => { desbloquearAudio(); decir(AVISO.bienvenida, true); }}>
            <Icono nombre="sonido" /> Escuchar
          </button>
          <section className="seccion">
            <h2>¿Qué tamaño de letra prefieres?</h2>
            <div className="eleccion" role="radiogroup">
              {LETRAS.map(l => (
                <button key={l.id} role="radio" aria-checked={estado.letra === l.id} className={estado.letra === l.id ? 'activo' : ''}
                  onClick={() => actualizar(() => ({ letra: l.id }))}>
                  <span style={{ fontSize: l.muestra, fontFamily: 'var(--titulos)', fontWeight: 700, color: 'var(--verde)', width: 48 }}>Aa</span>
                  <b style={{ fontSize: l.muestra }}>{l.texto}</b>
                </button>
              ))}
            </div>
          </section>
          <button className="boton grande ancho" style={{ marginTop: 'auto' }} onClick={siguiente}>Siguiente <Icono nombre="flecha" /></button>
        </>
      )}

      {paso === 1 && (
        <>
          <section className="seccion">
            <h1>¿Cómo quieres usar la app?</h1>
            <p className="sub">Puedes cambiarlo cuando quieras en Ajustes.</p>
          </section>
          <div className="eleccion" role="radiogroup">
            <button role="radio" aria-checked={estado.modo === 'sencillo'} className={estado.modo === 'sencillo' ? 'activo' : ''} onClick={() => actualizar(() => ({ modo: 'sencillo' }))}>
              <span style={{ fontSize: '2.2rem' }} aria-hidden>👆</span>
              <span><b>Sencilla</b>Un botón grande para hacer mis ejercicios. Sin complicaciones.</span>
            </button>
            <button role="radio" aria-checked={estado.modo === 'completo'} className={estado.modo === 'completo' ? 'activo' : ''} onClick={() => actualizar(() => ({ modo: 'completo' }))}>
              <span style={{ fontSize: '2.2rem' }} aria-hidden>📚</span>
              <span><b>Completa</b>Todos los ejercicios, rutinas, progreso y más.</span>
            </button>
          </div>
          <button className="boton grande ancho" style={{ marginTop: 'auto' }} onClick={siguiente}>Siguiente <Icono nombre="flecha" /></button>
        </>
      )}

      {paso === 2 && (
        <>
          <section className="seccion">
            <h1>Antes de empezar</h1>
            <p className="sub">Tres cosas importantes para estirar sin riesgo.</p>
          </section>
          <div className="pictos">
            <div className="picto"><span className="icono" style={{ background: 'var(--coral-suave)' }} aria-hidden>🩹</span>
              <div><h3>No estires una zona lastimada</h3><p>Si tienes una lesión, fractura, esguince o inflamación, no la estires.</p></div></div>
            <div className="picto"><span className="icono" style={{ background: 'var(--coral-suave)' }} aria-hidden>✋</span>
              <div><h3>Para si te duele</h3><p>Sentir que estira está bien. Sentir dolor, no: detente.</p></div></div>
            <div className="picto"><span className="icono" style={{ background: 'var(--menta-suave)' }} aria-hidden>🩺</span>
              <div><h3>Ante la duda, pregunta a Andrey</h3><p>Esta app no reemplaza la consulta.</p></div></div>
          </div>
          <button className="chip" style={{ alignSelf: 'center' }} onClick={() => setVerLista(!verLista)}>{verLista ? 'Ocultar' : 'Ver la lista completa'}</button>
          {verLista && (
            <section className="tarjeta seccion">
              <h3>No estires si tienes…</h3>
              <ul className="lista">{GUIA.seguridad.noEstirarSi.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </section>
          )}
          <button className="boton grande ancho" style={{ marginTop: 'auto' }} onClick={() => { callar(); actualizar(() => ({ bienvenida: true })); }}>
            <Icono nombre="check" /> Entendido, empezar
          </button>
        </>
      )}
    </main>
  );
}
