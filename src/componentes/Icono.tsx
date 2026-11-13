// Íconos de trazo (24×24), dibujados para la app.
const RUTAS: Record<string, string> = {
  inicio: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  ejercicios: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  rutinas: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  aprende: 'M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h6',
  atras: 'M15 5l-7 7 7 7',
  flecha: 'M9 5l7 7-7 7',
  play: 'M7 4.5v15a.6.6 0 0 0 .9.5l12-7.5a.6.6 0 0 0 0-1l-12-7.5a.6.6 0 0 0-.9.5z',
  pausa: 'M7 4h3v16H7zM14 4h3v16h-3z',
  siguiente: 'M5 5l9 7-9 7zM18 5v14',
  anterior: 'M19 5l-9 7 9 7zM6 5v14',
  cerrar: 'M6 6l12 12M18 6 6 18',
  corazon: 'M12 20s-7-4.4-9-9.2C1.8 7.6 4 4.5 7.2 4.5c2 0 3.6 1.2 4.8 2.9 1.2-1.7 2.8-2.9 4.8-2.9 3.2 0 5.4 3.1 4.2 6.3C19 15.6 12 20 12 20z',
  reloj: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  aviso: 'M12 9v4M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  info: 'M12 11v6M12 7.5h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  respira: 'M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7',
  buscar: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  check: 'M5 12.5 10 17 19 7',
  compartir: 'M12 15V3M7.5 7.5 12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7',
  copiar: 'M9 9h10v12H9zM5 15V3h10',
  mas: 'M12 5v14M5 12h14',
  menos: 'M5 12h14',
  lados: 'M8 7 4 11l4 4M16 7l4 4-4 4M4 11h16',
  sonido: 'M4 9v6h4l5 4V5L8 9zM17 9a4 4 0 0 1 0 6',
  silencio: 'M4 9v6h4l5 4V5L8 9zM17 9l4 6M21 9l-4 6',
  estrella: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z',
  medico: 'M9 3v4a3 3 0 0 0 6 0V3M12 10v4a5 5 0 0 0 10 0v-2M22 12h-.01M9 3H7M15 3h2',
  usuario: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  subir: 'M12 19V5M6 11l6-6 6 6',
  bajar: 'M12 5v14M6 13l6 6 6-6',
  ajustes: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  basura: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
};

export function Icono({ nombre, relleno = false, className }: { nombre: keyof typeof RUTAS | string; relleno?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={relleno ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={RUTAS[nombre] ?? ''} />
    </svg>
  );
}
