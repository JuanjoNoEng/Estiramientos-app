import { useMemo, useState } from 'react';
import { EJERCICIOS, ZONAS, POSICIONES, nombreZona, type Zona, type Posicion } from '../datos';
import { useEstado } from '../almacen';
import { ir } from '../ruta';
import { Cabecera, TarjetaEjercicio } from '../componentes/comunes';
import { Icono } from '../componentes/Icono';

// Para buscar sin importar tildes ni mayúsculas
const normal = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const FILTROS_POSICION: { id: string; texto: string; incluye: Posicion[] }[] = [
  { id: 'de-pie', texto: 'De pie', incluye: ['de-pie'] },
  { id: 'silla', texto: 'En silla', incluye: ['sentado-silla'] },
  { id: 'suelo', texto: 'En el suelo', incluye: ['sentado-suelo', 'de-rodillas', 'boca-arriba', 'boca-abajo', 'de-lado'] },
];

export function Biblioteca({ params }: { params: URLSearchParams }) {
  const estado = useEstado();
  const zona = (params.get('zona') as Zona | null) ?? null;
  const [texto, setTexto] = useState('');
  const [posicion, setPosicion] = useState<string | null>(null);
  const [sinMaterial, setSinMaterial] = useState(false);
  const [suaves, setSuaves] = useState(false);
  const [favoritos, setFavoritos] = useState(false);

  const lista = useMemo(() => {
    const q = normal(texto.trim());
    const pos = FILTROS_POSICION.find(p => p.id === posicion);
    return EJERCICIOS.filter(e =>
      (!zona || e.zona === zona) &&
      (!pos || pos.incluye.includes(e.posicion)) &&
      (!sinMaterial || e.material.every(m => ['pared', 'silla', 'toalla', 'puerta', 'mesa'].includes(m))) &&
      (!suaves || e.dificultad === 1) &&
      (!favoritos || estado.favoritos.includes(e.id)) &&
      (!q || normal(`${e.nombre} ${e.musculos.join(' ')} ${nombreZona(e.zona)} ${POSICIONES[e.posicion]} ${e.id}`).includes(q)),
    );
  }, [texto, zona, posicion, sinMaterial, suaves, favoritos, estado.favoritos]);

  const ponerZona = (z: Zona | null) => ir(z ? `/ejercicios?zona=${z}` : '/ejercicios', true);

  return (
    <main className="pantalla">
      <Cabecera titulo={zona ? nombreZona(zona) : 'Ejercicios'} atras={zona ? '/ejercicios' : undefined} />

      <div className="buscador">
        <Icono nombre="buscar" />
        <input type="search" placeholder="Buscar: cuello, pantorrilla, lumbar…" value={texto} onChange={e => setTexto(e.target.value)} aria-label="Buscar ejercicios" />
      </div>

      <div className="chips desliza" role="group" aria-label="Zona del cuerpo">
        <button className={'chip' + (!zona ? ' activo' : '')} onClick={() => ponerZona(null)}>Todas</button>
        {ZONAS.map(z => (
          <button key={z.id} className={'chip' + (zona === z.id ? ' activo' : '')} onClick={() => ponerZona(z.id)}>{z.nombre}</button>
        ))}
      </div>

      <div className="chips" role="group" aria-label="Filtros">
        {FILTROS_POSICION.map(p => (
          <button key={p.id} className={'chip' + (posicion === p.id ? ' activo' : '')} onClick={() => setPosicion(posicion === p.id ? null : p.id)}>{p.texto}</button>
        ))}
        <button className={'chip' + (sinMaterial ? ' activo' : '')} onClick={() => setSinMaterial(!sinMaterial)}>Con lo que hay en casa</button>
        <button className={'chip' + (suaves ? ' activo' : '')} onClick={() => setSuaves(!suaves)}>Suaves</button>
        <button className={'chip' + (favoritos ? ' activo' : '')} onClick={() => setFavoritos(!favoritos)}>♥ Favoritos</button>
      </div>

      <p className="peque-texto" aria-live="polite">{lista.length} {lista.length === 1 ? 'ejercicio' : 'ejercicios'}</p>

      {lista.length ? (
        <div className="rejilla">
          {lista.map(e => <TarjetaEjercicio key={e.id} id={e.id} clave="b" />)}
        </div>
      ) : (
        <div className="vacio">
          <p>No hay ejercicios con esos filtros.</p>
          <button className="boton claro peque" onClick={() => { setTexto(''); setPosicion(null); setSinMaterial(false); setSuaves(false); setFavoritos(false); }}>Quitar filtros</button>
        </div>
      )}
    </main>
  );
}
