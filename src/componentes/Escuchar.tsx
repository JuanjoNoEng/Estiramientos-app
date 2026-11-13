import { useEffect, useState } from 'react';
import { decir, callar, type Frase } from '../voz';
import { Icono } from './Icono';

/** Botón para escuchar un texto con la voz guía (pulsar otra vez lo detiene). */
export function Escuchar({ frase, texto = 'Escuchar', clase = 'chip' }: { frase: Frase; texto?: string; clase?: string }) {
  const [sonando, setSonando] = useState(false);
  useEffect(() => () => { if (sonando) callar(); }, [sonando]);
  return (
    <button className={clase} aria-pressed={sonando} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }}
      onClick={() => {
        if (sonando) { callar(); setSonando(false); return; }
        setSonando(true);
        decir(frase, true).then(() => setSonando(false));
      }}>
      <span style={{ width: 20, height: 20, display: 'inline-block' }}><Icono nombre={sonando ? 'pausa' : 'sonido'} relleno={sonando} /></span>
      {sonando ? 'Parar' : texto}
    </button>
  );
}
