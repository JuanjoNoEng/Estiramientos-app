import { useEffect, useState } from 'react';
import { ejercicio, nombreZona, POSICIONES, MATERIALES, DIFICULTAD } from '../datos';
import { useEstado, alternarFavorito } from '../almacen';
import { Cabecera } from '../componentes/comunes';
import { Animada } from '../componentes/Animada';
import { decir, callar, lecturaEj } from '../voz';
import { Icono } from '../componentes/Icono';

export function Ficha({ id }: { id: number }) {
  const e = ejercicio(id);
  const estado = useEstado();
  const [espejo, setEspejo] = useState(false);
  const [hablando, setHablando] = useState(false);
  useEffect(() => () => callar(), [id]);
  if (!e) return <main className="pantalla"><Cabecera titulo="Ejercicio" atras="/ejercicios" /><p className="vacio">No encontramos este ejercicio.</p></main>;
  const fav = estado.favoritos.includes(id);

  return (
    <main className="pantalla">
      <Cabecera
        atras="/ejercicios"
        titulo={<span style={{ flex: 1 }} />}
        derecha={
          <button className="boton-icono" aria-label={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'} aria-pressed={fav} onClick={() => alternarFavorito(id)} style={{ color: fav ? 'var(--coral)' : undefined }}>
            <Icono nombre="corazon" relleno={fav} />
          </button>
        }
      />

      <div className="ficha-ilus">
        <Animada id={id} espejo={espejo} clave="ficha" />
      </div>
      {e.porLado && (
        <button className="chip" style={{ alignSelf: 'center', marginTop: -10 }} onClick={() => setEspejo(!espejo)}>
          ↔ Ver con el otro lado
        </button>
      )}

      <section className="seccion">
        <h1>{e.nombre}</h1>
        <div className="chips">
          <span className="etiqueta">{nombreZona(e.zona)}</span>
          <span className="etiqueta">{POSICIONES[e.posicion]}</span>
          <span className="etiqueta"><Icono nombre="reloj" /> {e.duracionSegundos} s{e.porLado ? ' por lado' : ''}</span>
          <span className={'etiqueta' + (e.dificultad === 3 ? ' coral' : '')}>{DIFICULTAD[e.dificultad]}</span>
        </div>
        {e.musculos.length > 0 && <p className="sub">Estira: {e.musculos.join(', ')}.</p>}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button className="boton claro grande" aria-pressed={hablando} onClick={() => {
          if (hablando) { callar(); setHablando(false); return; }
          setHablando(true);
          decir(lecturaEj(e), true).then(() => setHablando(false));
        }}><Icono nombre={hablando ? 'pausa' : 'sonido'} relleno={hablando} /> {hablando ? 'Parar' : 'Escuchar'}</button>
        <a className="boton coral grande" href={`#/sesion?e=${id}`}><Icono nombre="play" relleno /> Hacer</a>
      </div>

      <section className="tarjeta seccion">
        <h2>Cómo hacerlo</h2>
        <ol className="pasos">
          {e.pasos.map((p, i) => <li key={i}>{p}</li>)}
        </ol>
      </section>

      <section className="tarjeta menta seccion">
        <div className="aviso"><Icono nombre="respira" /><div><h3>Respiración</h3><p>{e.respiracion}</p></div></div>
        <div className="aviso"><Icono nombre="atras" /><div><h3>Al terminar</h3><p>{e.volver}{e.porLado ? ' Luego repite con el otro lado.' : ''}</p></div></div>
      </section>

      {e.precauciones.length > 0 && (
        <section className="tarjeta coral seccion">
          <div className="aviso"><Icono nombre="aviso" /><div><h3>Precauciones</h3>
            <ul className="lista">{e.precauciones.map((p, i) => <li key={i}>{p}</li>)}</ul>
          </div></div>
        </section>
      )}

      {e.variantes.length > 0 && (
        <section className="tarjeta seccion">
          <h3>Variantes</h3>
          <ul className="lista">{e.variantes.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </section>
      )}

      {e.material.length > 0 && (
        <section className="seccion">
          <h3>Necesitas</h3>
          <div className="chips">{e.material.map(m => <span key={m} className="etiqueta">{MATERIALES[m] ?? m}</span>)}</div>
        </section>
      )}

      <p className="peque-texto" style={{ textAlign: 'center' }}>Ejercicio {e.id} · Si sientes dolor agudo, detente y consulta con Andrey.</p>
    </main>
  );
}
