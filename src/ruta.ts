// Enrutador mínimo por hash (#/ruta?param=valor). Funciona sin servidor y en cualquier carpeta.
import { useSyncExternalStore } from 'react';

export interface Ruta {
  partes: string[];
  params: URLSearchParams;
}

function actual(): string {
  return location.hash.replace(/^#/, '') || '/';
}

export function useRuta(): Ruta {
  const h = useSyncExternalStore(
    f => { addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); },
    actual,
  );
  const [camino, query = ''] = h.split('?');
  return { partes: camino.split('/').filter(Boolean), params: new URLSearchParams(query) };
}

export function ir(destino: string, reemplazar = false) {
  const url = '#' + destino;
  if (reemplazar) history.replaceState(null, '', url);
  else location.hash = destino;
  if (reemplazar) dispatchEvent(new HashChangeEvent('hashchange'));
  scrollTo({ top: 0 });
}

export function volver(porDefecto = '/') {
  if (history.length > 1) history.back();
  else ir(porDefecto, true);
}
