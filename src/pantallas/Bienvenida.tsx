import { useState } from 'react';
import { GUIA } from '../datos';
import { actualizar } from '../almacen';
import { Icono } from '../componentes/Icono';

export function Bienvenida() {
  const [acepto, setAcepto] = useState(false);
  return (
    <main className="pantalla sin-nav" style={{ gap: 20 }}>
      <img src="simbolo.svg" alt="" style={{ width: 120, margin: '28px auto 0' }} />
      <section className="seccion" style={{ textAlign: 'center' }}>
        <h1>Tus estiramientos, guiados</h1>
        <p className="sub">Ejercicios seleccionados por <b>Andrey Hernández, Quiropráctico</b>, con ilustraciones, temporizador y guía de respiración.</p>
      </section>

      <section className="tarjeta coral seccion">
        <div className="aviso"><Icono nombre="aviso" /><h3>No estires si tienes…</h3></div>
        <ul className="lista">{GUIA.seguridad.noEstirarSi.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </section>

      <section className="tarjeta seccion">
        <div className="aviso"><Icono nombre="info" /><h3>Detente si…</h3></div>
        <ul className="lista">{GUIA.seguridad.pararSi.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </section>

      <label className="casilla">
        <input type="checkbox" checked={acepto} onChange={e => setAcepto(e.target.checked)} />
        <span>Entiendo que esta app no reemplaza la consulta y que, ante cualquier duda o dolor, debo consultar con Andrey.</span>
      </label>

      <button className="boton ancho" disabled={!acepto} onClick={() => actualizar(() => ({ bienvenida: true }))}>
        Empezar <Icono nombre="flecha" />
      </button>
    </main>
  );
}
