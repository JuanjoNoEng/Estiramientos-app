import { useEffect, useMemo, useRef, useState } from 'react';
import { ejercicio, minutos, type Ejercicio } from '../datos';
import { useEstado, actualizar, guardarSesion } from '../almacen';
import { ir, volver } from '../ruta';
import { Ilustracion } from '../componentes/comunes';
import { Icono } from '../componentes/Icono';
import { obtenerRutina } from './Rutinas';

interface Paso {
  tipo: 'prep' | 'estira' | 'cambio';
  e: Ejercicio;
  indice: number;     // posición del ejercicio en la rutina
  lado?: 1 | 2;
  seg: number;
}

const PREP_PRIMERO = 8, PREP = 6, CAMBIO = 5;
const CICLO_RESPIRA = 10, INHALA = 4; // 4 s inhalar, 6 s exhalar

function construirPasos(ids: number[], duracion?: number): Paso[] {
  const pasos: Paso[] = [];
  ids.map(ejercicio).filter((e): e is Ejercicio => !!e).forEach((e, i) => {
    const d = duracion ?? e.duracionSegundos;
    pasos.push({ tipo: 'prep', e, indice: i, seg: i === 0 ? PREP_PRIMERO : PREP });
    if (e.porLado) {
      pasos.push({ tipo: 'estira', e, indice: i, lado: 1, seg: d });
      pasos.push({ tipo: 'cambio', e, indice: i, lado: 2, seg: CAMBIO });
      pasos.push({ tipo: 'estira', e, indice: i, lado: 2, seg: d });
    } else pasos.push({ tipo: 'estira', e, indice: i, seg: d });
  });
  return pasos;
}

// ---------- Sonido y voz ----------
let audio: AudioContext | null = null;
function pitido(frec = 660, ms = 120, vol = 0.12) {
  try {
    audio ??= new AudioContext();
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = frec;
    g.gain.setValueAtTime(vol, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + ms / 1000);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + ms / 1000);
  } catch { /* sin audio */ }
}
function decir(texto: string) {
  try {
    const s = window.speechSynthesis;
    if (!s) return;
    s.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-ES';
    const voz = s.getVoices().find(v => v.lang.startsWith('es-') && /MX|US|419|CO|AR/.test(v.lang)) ?? s.getVoices().find(v => v.lang.startsWith('es'));
    if (voz) u.voice = voz;
    u.rate = 0.95;
    s.speak(u);
  } catch { /* sin voz */ }
}

function usePantallaEncendida(activa: boolean) {
  useEffect(() => {
    if (!activa || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    const pedir = () => navigator.wakeLock.request('screen').then(l => (lock = l)).catch(() => {});
    pedir();
    const vis = () => document.visibilityState === 'visible' && pedir();
    document.addEventListener('visibilitychange', vis);
    return () => { document.removeEventListener('visibilitychange', vis); lock?.release().catch(() => {}); };
  }, [activa]);
}

export function Sesion({ params }: { params: URLSearchParams }) {
  const estado = useEstado();
  const rutina = params.get('r') ? obtenerRutina(params.get('r')!, estado) : undefined;
  const ids = rutina?.ejercicios ?? (params.get('e') ?? '').split(',').map(Number).filter(Boolean);
  const duracion = rutina?.duracion ?? (params.get('d') ? Number(params.get('d')) : undefined);
  const titulo = rutina?.nombre ?? (ids.length === 1 ? ejercicio(ids[0])?.nombre ?? 'Ejercicio' : 'Sesión');
  const pasos = useMemo(() => construirPasos(ids, duracion), [ids.join(','), duracion]);
  const total = new Set(pasos.map(p => p.indice)).size;

  const [fase, setFase] = useState<'inicio' | 'activa' | 'fin'>('inicio');
  const [i, setI] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [restante, setRestante] = useState(pasos[0]?.seg ?? 0); // segundos (con decimales)
  const [dolor, setDolor] = useState<number[]>([]);
  const [verPasos, setVerPasos] = useState(false);
  const [reinicio, setReinicio] = useState(0); // fuerza reiniciar el reloj aunque el paso sea el mismo
  const inicio = useRef(Date.now());
  const fin = useRef(0);
  const anunciado = useRef(-1);

  usePantallaEncendida(fase === 'activa' && !pausado);
  const paso = pasos[i];

  // Anunciar cada paso al entrar en él
  useEffect(() => {
    if (fase !== 'activa' || !paso || anunciado.current === i) return;
    anunciado.current = i;
    const sig = paso.e.nombre;
    if (estado.sonido) pitido(paso.tipo === 'estira' ? 880 : 520, 160);
    if (!estado.voz) return;
    if (paso.tipo === 'prep') decir(`${paso.indice === 0 ? 'Empezamos con' : 'Siguiente'}: ${sig}. Colócate en posición.`);
    else if (paso.tipo === 'cambio') decir('Cambia de lado.');
    else decir(paso.lado === 2 ? 'Segundo lado. Estira suave y respira.' : 'Estira suave, sin rebotes, y respira.');
  }, [fase, i]);

  // Temporizador basado en la hora real (no se desfasa si el teléfono va lento)
  useEffect(() => {
    if (fase !== 'activa' || pausado || !paso) return;
    fin.current = Date.now() + restante * 1000;
    const t = setInterval(() => {
      const r = Math.max(0, (fin.current - Date.now()) / 1000);
      setRestante(r);
      if (estado.sonido && paso.tipo === 'estira' && r > 0 && r <= 3 && Math.abs(r - Math.round(r)) < 0.13) pitido(440, 70, 0.08);
      if (r <= 0) { clearInterval(t); avanzar(1); }
    }, 125);
    return () => clearInterval(t);
  }, [fase, pausado, i, reinicio]);

  function irA(n: number) {
    if (n >= pasos.length) { terminar(); return; }
    const k = Math.max(0, n);
    setI(k);
    setRestante(pasos[k].seg);
    setReinicio(r => r + 1);
  }
  function avanzar(d: number) { irA(i + d); }
  function siguienteEjercicio() {
    const k = pasos.findIndex((p, j) => j > i && p.indice > paso.indice);
    irA(k === -1 ? pasos.length : k);
  }
  function anteriorEjercicio() {
    const actual = pasos.findIndex(p => p.indice === paso.indice);
    const destino = i > actual ? actual : pasos.findIndex(p => p.indice === Math.max(0, paso.indice - 1));
    irA(destino);
  }
  function terminar() {
    setFase('fin');
    if (estado.sonido) { pitido(660, 150); setTimeout(() => pitido(880, 220), 170); }
    if (estado.voz) decir('¡Muy bien! Terminaste.');
  }
  function meMolesta() {
    setDolor(d => d.includes(paso.e.id) ? d : [...d, paso.e.id]);
    if (estado.voz) decir('De acuerdo. Pasamos al siguiente. Recuerda comentárselo a Andrey.');
    siguienteEjercicio();
  }
  function salir() {
    if (fase === 'activa' && !confirm('¿Salir de la sesión? No se guardará el progreso.')) return;
    window.speechSynthesis?.cancel();
    volver('/');
  }

  if (!pasos.length) return <main className="pantalla sin-nav"><p className="vacio">No hay ejercicios en esta sesión.</p><button className="boton" onClick={() => ir('/', true)}>Volver al inicio</button></main>;

  // ---------- Pantalla de inicio ----------
  if (fase === 'inicio') {
    const seg = pasos.reduce((t, p) => t + p.seg, 0);
    return (
      <main className="sesion">
        <div className="cabecera"><button className="boton-icono" aria-label="Cerrar" onClick={salir}><Icono nombre="cerrar" /></button></div>
        <Ilustracion id={pasos[0].e.id} clave="si" />
        <div className="estado">
          <span className="fase">{total} {total === 1 ? 'ejercicio' : 'ejercicios'} · {minutos(seg)} min</span>
          <h1>{titulo}</h1>
        </div>
        <div className="tarjeta menta seccion" style={{ gap: 8 }}>
          <div className="aviso"><Icono nombre="respira" /><p>Estira <b>suave y sin rebotes</b>. Suelta el aire al estirar y respira con calma mientras mantienes.</p></div>
          <div className="aviso"><Icono nombre="aviso" /><p>Si sientes <b>dolor agudo</b>, detente. Una tensión agradable es normal; el dolor no.</p></div>
        </div>
        <div className="chips" style={{ justifyContent: 'center' }}>
          <button className={'chip' + (estado.voz ? ' activo' : '')} onClick={() => actualizar(e => ({ voz: !e.voz }))}>Voz guía</button>
          <button className={'chip' + (estado.sonido ? ' activo' : '')} onClick={() => actualizar(e => ({ sonido: !e.sonido }))}>Sonidos</button>
        </div>
        <button className="boton coral ancho" style={{ marginTop: 'auto' }} onClick={() => {
          inicio.current = Date.now();
          if (estado.sonido) pitido(1, 10, 0.0001); // desbloquea el audio con el toque
          window.speechSynthesis?.getVoices();
          setFase('activa');
        }}><Icono nombre="play" relleno /> Empezar</button>
      </main>
    );
  }

  // ---------- Pantalla final ----------
  if (fase === 'fin') return <Final titulo={titulo} ejercicios={total} segundos={Math.round((Date.now() - inicio.current) / 1000)} dolor={dolor} />;

  // ---------- Sesión en curso ----------
  const transcurrido = paso.seg - restante;
  const enCiclo = transcurrido % CICLO_RESPIRA;
  const inhalando = enCiclo < INHALA;
  const progreso = (paso.indice + (paso.tipo === 'estira' && (!paso.e.porLado || paso.lado === 2) ? 1 - restante / paso.seg : 0)) / total;
  const R = 74, C = 2 * Math.PI * R;
  const titulos = { prep: paso.indice === 0 ? 'Colócate en posición' : 'Siguiente ejercicio', estira: 'Mantén y respira', cambio: 'Cambia de lado' };

  return (
    <main className="sesion">
      <div className="cabecera" style={{ minHeight: 42 }}>
        <button className="boton-icono" aria-label="Salir" onClick={salir}><Icono nombre="cerrar" /></button>
        <div style={{ flex: 1 }}>
          <div className="barra"><i style={{ width: `${progreso * 100}%` }} /></div>
        </div>
        <span className="peque-texto" style={{ minWidth: 44, textAlign: 'right' }}>{paso.indice + 1} / {total}</span>
        <button className="boton-icono plano" aria-label={estado.voz || estado.sonido ? 'Silenciar' : 'Activar sonido'}
          onClick={() => actualizar(e => (e.voz || e.sonido ? { voz: false, sonido: false } : { voz: true, sonido: true }))}>
          <Icono nombre={estado.voz || estado.sonido ? 'sonido' : 'silencio'} />
        </button>
      </div>

      <Ilustracion id={paso.e.id} espejo={paso.lado === 2} clave="ses" />

      <div className="estado">
        <span className="fase">{titulos[paso.tipo]}</span>
        <h2>{paso.e.nombre}</h2>
        {paso.e.porLado && <span className="etiqueta"><Icono nombre="lados" /> {paso.lado === 2 ? 'Segundo lado' : 'Primer lado'}</span>}
      </div>

      <div className="reloj" role="timer" aria-live="off">
        {paso.tipo === 'estira' && <div className={'respira' + (inhalando ? '' : ' exhala')} />}
        <svg viewBox="0 0 168 168">
          <circle cx="84" cy="84" r={R} fill="none" stroke="var(--borde)" strokeWidth="9" />
          <circle cx="84" cy="84" r={R} fill="none" stroke={paso.tipo === 'estira' ? 'var(--coral)' : 'var(--menta)'} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - restante / paso.seg)} style={{ transition: 'stroke-dashoffset .13s linear' }} />
        </svg>
        <div className="cifra">
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
            {Math.ceil(restante)}
            {paso.tipo === 'estira' && <small style={{ fontSize: 14, fontWeight: 500, color: 'var(--gris)', marginTop: 6, fontFamily: 'var(--texto)' }}>{inhalando ? 'Inhala' : 'Exhala y relaja'}</small>}
          </span>
        </div>
      </div>

      {paso.tipo === 'prep' ? (
        <button className="chip" style={{ alignSelf: 'center' }} onClick={() => setVerPasos(!verPasos)}>{verPasos ? 'Ocultar pasos' : 'Cómo se hace'}</button>
      ) : (
        <button className="chip" style={{ alignSelf: 'center', color: '#B24E22' }} onClick={meMolesta}>Me molesta · pasar al siguiente</button>
      )}
      {verPasos && paso.tipo === 'prep' && (
        <ol className="pasos tarjeta">{paso.e.pasos.map((p, k) => <li key={k}>{p}</li>)}</ol>
      )}

      <div className="controles">
        <button className="boton-icono" aria-label="Ejercicio anterior" onClick={anteriorEjercicio}><Icono nombre="anterior" /></button>
        <button className="principal" aria-label={pausado ? 'Continuar' : 'Pausar'} onClick={() => setPausado(!pausado)}>
          <Icono nombre={pausado ? 'play' : 'pausa'} relleno />
        </button>
        <button className="boton-icono" aria-label="Siguiente" onClick={() => avanzar(1)}><Icono nombre="siguiente" /></button>
      </div>
    </main>
  );
}

function Final({ titulo, ejercicios, segundos, dolor }: { titulo: string; ejercicios: number; segundos: number; dolor: number[] }) {
  const [sensacion, setSensacion] = useState<1 | 2 | 3 | undefined>();
  const [molestia, setMolestia] = useState(0);
  const guardar = () => {
    guardarSesion({ fecha: new Date().toISOString(), rutina: titulo, ejercicios, segundos, sensacion, molestia, dolorEn: dolor });
    ir('/', true);
  };
  return (
    <main className="sesion" style={{ gap: 20 }}>
      <div className="estado" style={{ marginTop: 24 }}>
        <span style={{ fontSize: 56 }} aria-hidden>🎉</span>
        <h1>¡Muy bien!</h1>
        <p className="sub">Completaste «{titulo}»: {ejercicios} {ejercicios === 1 ? 'ejercicio' : 'ejercicios'} en {minutos(segundos)} min.</p>
      </div>

      <section className="seccion">
        <h3>¿Cómo te sientes?</h3>
        <div className="opciones">
          {([[1, '😣', 'Peor'], [2, '😐', 'Igual'], [3, '😌', 'Mejor']] as const).map(([v, emoji, txt]) => (
            <button key={v} className={'opcion' + (sensacion === v ? ' activo' : '')} onClick={() => setSensacion(v)} aria-pressed={sensacion === v}>
              <span className="emoji" aria-hidden>{emoji}</span>{txt}
            </button>
          ))}
        </div>
      </section>

      <section className="seccion">
        <h3>Molestia o rigidez ahora: {molestia}/10</h3>
        <input className="rango" type="range" min={0} max={10} value={molestia} onChange={e => setMolestia(Number(e.target.value))} aria-label="Nivel de molestia de 0 a 10" />
        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="peque-texto"><span>Nada</span><span>Mucha</span></div>
      </section>

      {dolor.length > 0 && (
        <section className="tarjeta coral aviso">
          <Icono nombre="aviso" />
          <p>Marcaste molestia en: <b>{dolor.map(id => ejercicio(id)?.nombre).join(', ')}</b>. Coméntaselo a Andrey en tu próxima visita.</p>
        </section>
      )}

      <button className="boton ancho" style={{ marginTop: 'auto' }} onClick={guardar}><Icono nombre="check" /> Guardar y terminar</button>
    </main>
  );
}
