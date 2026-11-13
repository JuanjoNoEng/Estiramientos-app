import { useState } from 'react';
import { RUTINAS, EJERCICIOS, ejercicio, duracionRutina, minutos, type Rutina } from '../datos';
import { useEstado, actualizar } from '../almacen';
import { ir } from '../ruta';
import { Cabecera, FilaRutina, Ilustracion } from '../componentes/comunes';
import { Icono } from '../componentes/Icono';

type Estado = ReturnType<typeof useEstado>;

/** Busca una rutina por id: el plan de Andrey, una rutina propia o una del libro. */
export function obtenerRutina(id: string, estado: Estado): Rutina | undefined {
  if (id === 'plan') return estado.plan;
  return estado.propias.find(r => r.id === id) ?? RUTINAS.find(r => r.id === id);
}

export function Rutinas() {
  const estado = useEstado();
  const libro = RUTINAS.filter(r => !r.id.startsWith('zona-'));
  const zonas = RUTINAS.filter(r => r.id.startsWith('zona-'));
  return (
    <main className="pantalla">
      <Cabecera titulo="Rutinas" derecha={<a className="boton peque" href="#/rutina/nueva"><Icono nombre="mas" /> Crear</a>} />

      {estado.plan && (
        <section className="seccion">
          <h2>Tu plan de Andrey</h2>
          <FilaRutina r={estado.plan} destino="#/rutina/plan" />
        </section>
      )}

      {estado.propias.length > 0 && (
        <section className="seccion">
          <h2>Mis rutinas</h2>
          {estado.propias.map(r => <FilaRutina key={r.id} r={r} />)}
        </section>
      )}

      <section className="seccion">
        <h2>Recomendadas</h2>
        {libro.map(r => <FilaRutina key={r.id} r={r} />)}
      </section>

      <section className="seccion">
        <h2>Por zona del cuerpo</h2>
        {zonas.map(r => <FilaRutina key={r.id} r={r} />)}
      </section>
    </main>
  );
}

export function DetalleRutina({ id }: { id: string }) {
  const estado = useEstado();
  if (id === 'nueva') return <EditorRutina />;
  const r = obtenerRutina(id, estado);
  if (!r) return <main className="pantalla"><Cabecera titulo="Rutina" atras="/rutinas" /><p className="vacio">No encontramos esta rutina.</p></main>;
  const seg = duracionRutina(r.ejercicios, r.duracion);
  const borrar = () => {
    if (!confirm('¿Borrar esta rutina?')) return;
    actualizar(e => ({ propias: e.propias.filter(x => x.id !== r.id) }));
    ir('/rutinas', true);
  };

  return (
    <main className="pantalla">
      <Cabecera atras="/rutinas" titulo={<span style={{ flex: 1 }} />}
        derecha={r.propia ? <button className="boton-icono" aria-label="Borrar rutina" onClick={borrar}><Icono nombre="basura" /></button> : undefined} />
      <section className="seccion">
        {id === 'plan' && <span className="etiqueta" style={{ alignSelf: 'flex-start' }}><Icono nombre="medico" /> Recomendado por Andrey</span>}
        <h1>{r.nombre}</h1>
        {r.descripcion && <p className="sub">{r.descripcion}</p>}
        <div className="chips">
          <span className="etiqueta">{r.ejercicios.length} ejercicios</span>
          <span className="etiqueta"><Icono nombre="reloj" /> {minutos(seg)} min</span>
        </div>
      </section>
      <a className="boton coral ancho" href={`#/sesion?r=${encodeURIComponent(r.id)}`}><Icono nombre="play" relleno /> Empezar rutina</a>
      <section className="seccion">
        {r.ejercicios.map((eid, i) => {
          const e = ejercicio(eid);
          if (!e) return null;
          return (
            <a key={eid + '-' + i} className="tarjeta fila-rutina" href={`#/ejercicio/${eid}`}>
              <Ilustracion id={eid} clave="d" />
              <div>
                <h3>{i + 1}. {e.nombre}</h3>
                <span className="peque-texto">{r.duracion ?? e.duracionSegundos} s{e.porLado ? ' por lado' : ''}</span>
              </div>
              <Icono nombre="flecha" className="flecha" />
            </a>
          );
        })}
      </section>
    </main>
  );
}

/** Selector de ejercicios reutilizable (rutinas propias y planes de Andrey). */
export function SelectorEjercicios({ elegidos, setElegidos }: { elegidos: number[]; setElegidos: (x: number[]) => void }) {
  const [q, setQ] = useState('');
  const normal = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const lista = EJERCICIOS.filter(e => !q || normal(`${e.id} ${e.nombre} ${e.musculos.join(' ')} ${e.zona}`).includes(normal(q)));
  const mover = (i: number, d: number) => {
    const x = [...elegidos];
    [x[i], x[i + d]] = [x[i + d], x[i]];
    setElegidos(x);
  };
  return (
    <>
      {elegidos.length > 0 && (
        <section className="seccion">
          <h3>Orden ({elegidos.length})</h3>
          {elegidos.map((id, i) => (
            <div key={id} className="tarjeta" style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto auto auto', gap: 8, alignItems: 'center', padding: 10 }}>
              <Ilustracion id={id} clave="o" />
              <span style={{ fontWeight: 600, color: 'var(--verde)' }}>{i + 1}. {ejercicio(id)?.nombre}</span>
              <button className="boton-icono plano" aria-label="Subir" disabled={i === 0} onClick={() => mover(i, -1)}><Icono nombre="subir" /></button>
              <button className="boton-icono plano" aria-label="Bajar" disabled={i === elegidos.length - 1} onClick={() => mover(i, 1)}><Icono nombre="bajar" /></button>
              <button className="boton-icono plano" aria-label="Quitar" onClick={() => setElegidos(elegidos.filter(x => x !== id))}><Icono nombre="cerrar" /></button>
            </div>
          ))}
        </section>
      )}
      <section className="seccion">
        <h3>Añadir ejercicios</h3>
        <div className="buscador"><Icono nombre="buscar" /><input type="search" placeholder="Buscar por nombre, zona o número" value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="rejilla">
          {lista.map(e => {
            const sel = elegidos.includes(e.id);
            return (
              <button key={e.id} className="tarjeta-ej" style={{ border: 0, padding: 0, textAlign: 'left', boxShadow: sel ? 'inset 0 0 0 3px var(--verde)' : undefined }}
                aria-pressed={sel} onClick={() => setElegidos(sel ? elegidos.filter(x => x !== e.id) : [...elegidos, e.id])}>
                <Ilustracion id={e.id} clave="s" />
                <div className="info">
                  <span className="nombre"><span className="num">{e.id}</span>{e.nombre}</span>
                  <span className="meta">{sel ? '✓ Añadido' : 'Toca para añadir'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

function EditorRutina() {
  const [nombre, setNombre] = useState('');
  const [elegidos, setElegidos] = useState<number[]>([]);
  const guardar = () => {
    const id = 'propia-' + Date.now().toString(36);
    actualizar(e => ({ propias: [...e.propias, { id, nombre: nombre.trim() || 'Mi rutina', descripcion: '', ejercicios: elegidos, propia: true }] }));
    ir(`/rutina/${id}`, true);
  };
  return (
    <main className="pantalla">
      <Cabecera titulo="Nueva rutina" atras="/rutinas" />
      <label className="campo">Nombre
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej.: Pausa en la oficina" />
      </label>
      <SelectorEjercicios elegidos={elegidos} setElegidos={setElegidos} />
      <div style={{ position: 'sticky', bottom: 'calc(var(--nav) + 12px)' }}>
        <button className="boton ancho" disabled={!elegidos.length} onClick={guardar}><Icono nombre="check" /> Guardar rutina</button>
      </div>
    </main>
  );
}
