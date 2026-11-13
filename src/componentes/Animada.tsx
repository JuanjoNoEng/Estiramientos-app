import { useEffect, useRef } from 'react';
import { ejercicio, fotograma, tieneAnimacion, FOTOGRAMAS } from '../datos';
import { useEstado } from '../almacen';
import { Ilustracion } from './comunes';

const suave = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const reducido = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Ciclo de la ficha: quieto en el inicio, entra en el estiramiento (al soltar el aire), mantiene y vuelve. */
function tCiclo(ms: number) {
  const s = (ms / 1000) % 8.4;
  if (s < 1.2) return 0;
  if (s < 4.2) return suave((s - 1.2) / 3);
  if (s < 6.4) return 1;
  return 1 - suave((s - 6.4) / 2);
}

/**
 * Ilustración animada. Sin `t`, se anima en bucle; con `t` (0–1) la controla quien la usa (modo guiado).
 * Si no hay animación, si el paciente las desactivó o si el teléfono pide reducir movimiento, se ve estática.
 */
export function Animada({ id, t, espejo = false, clave = 'an' }: { id: number; t?: number; espejo?: boolean; clave?: string }) {
  const { animaciones } = useEstado();
  const ref = useRef<HTMLDivElement>(null);
  const actual = useRef(-1);
  const activa = animaciones && tieneAnimacion(id) && !reducido();

  const pintar = (valor: number) => {
    const i = Math.round(Math.min(1, Math.max(0, valor)) * FOTOGRAMAS);
    if (i === actual.current || !ref.current) return;
    actual.current = i;
    ref.current.innerHTML = fotograma(id, i, clave) ?? '';
  };

  // Controlada desde fuera
  useEffect(() => { if (activa && t != null) pintar(t); }, [activa, t, id]);

  // Bucle propio
  useEffect(() => {
    if (!activa || t != null) return;
    actual.current = -1;
    let raf = 0;
    const inicio = performance.now();
    const paso = (ahora: number) => { pintar(tCiclo(ahora - inicio)); raf = requestAnimationFrame(paso); };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [activa, t == null, id]);

  useEffect(() => { actual.current = -1; }, [id]);

  if (!activa) return <Ilustracion id={id} espejo={espejo} clave={clave} />;
  return <div ref={ref} className={'ilus' + (espejo ? ' espejo' : '')} role="img" aria-label={ejercicio(id)?.nombre} />;
}
