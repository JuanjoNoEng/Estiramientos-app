import type { ReactNode } from 'react';
import { svgEjercicio, ejercicio, nombreZona, minutos, duracionRutina, type Rutina } from '../datos';
import { volver } from '../ruta';
import { Icono } from './Icono';

export function Ilustracion({ id, espejo = false, clave = '' }: { id: number; espejo?: boolean; clave?: string }) {
  const svg = svgEjercicio(id, clave);
  if (!svg) return <div className="ilus vacia">Ilustración en preparación</div>;
  return <div className={'ilus' + (espejo ? ' espejo' : '')} role="img" aria-label={ejercicio(id)?.nombre} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function Cabecera({ titulo, atras, derecha }: { titulo?: ReactNode; atras?: string | true; derecha?: ReactNode }) {
  return (
    <header className="cabecera">
      {atras && (
        <button className="boton-icono" aria-label="Volver" onClick={() => volver(typeof atras === 'string' ? atras : '/')}>
          <Icono nombre="atras" />
        </button>
      )}
      {typeof titulo === 'string' ? <h1>{titulo}</h1> : titulo}
      {derecha}
    </header>
  );
}

export function TarjetaEjercicio({ id, clave = 'r' }: { id: number; clave?: string }) {
  const e = ejercicio(id);
  if (!e) return null;
  return (
    <a className="tarjeta-ej" href={`#/ejercicio/${id}`}>
      <Ilustracion id={id} clave={clave} />
      <div className="info">
        <span className="nombre">{e.nombre}</span>
        <span className="meta">{nombreZona(e.zona)} · {e.porLado ? `${e.duracionSegundos} s por lado` : `${e.duracionSegundos} s`}</span>
      </div>
    </a>
  );
}

export function TarjetaRutina({ r, destino }: { r: Rutina; destino?: string }) {
  const seg = duracionRutina(r.ejercicios, r.duracion);
  return (
    <a className="tarjeta tarjeta-rutina" href={destino ?? `#/rutina/${r.id}`}>
      <div className="miniaturas">
        {r.ejercicios.slice(0, 3).map(id => <Ilustracion key={id} id={id} clave={'m' + r.id} />)}
      </div>
      <h3>{r.nombre}</h3>
      <span className="peque-texto">{r.ejercicios.length} ejercicios · {minutos(seg)} min</span>
    </a>
  );
}

export function FilaRutina({ r, destino }: { r: Rutina; destino?: string }) {
  const seg = duracionRutina(r.ejercicios, r.duracion);
  return (
    <a className="tarjeta fila-rutina" href={destino ?? `#/rutina/${r.id}`}>
      <Ilustracion id={r.ejercicios[0]} clave={'f' + r.id} />
      <div>
        <h3>{r.nombre}</h3>
        <span className="peque-texto">{r.ejercicios.length} ejercicios · {minutos(seg)} min</span>
      </div>
      <Icono nombre="flecha" className="flecha" />
    </a>
  );
}

export function Navegacion({ activa }: { activa: string }) {
  const items = [
    { id: 'inicio', ruta: '#/', texto: 'Inicio' },
    { id: 'ejercicios', ruta: '#/ejercicios', texto: 'Ejercicios' },
    { id: 'rutinas', ruta: '#/rutinas', texto: 'Rutinas' },
    { id: 'aprende', ruta: '#/aprende', texto: 'Aprende' },
  ];
  return (
    <nav className="nav" aria-label="Principal">
      <ul>
        {items.map(i => (
          <li key={i.id}>
            <a href={i.ruta} className={activa === i.id ? 'activo' : ''} aria-current={activa === i.id ? 'page' : undefined}>
              <Icono nombre={i.id} />
              {i.texto}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
