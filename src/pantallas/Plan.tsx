// Planes de Andrey: él arma un plan, la app genera un enlace + código QR y el paciente lo abre en su teléfono.
// Todo viaja dentro del enlace: no hay servidor ni datos guardados fuera del teléfono.
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ejercicio, duracionRutina, minutos } from '../datos';
import { useEstado, actualizar, type PlanAndrey } from '../almacen';
import { ir } from '../ruta';
import { Cabecera, Ilustracion } from '../componentes/comunes';
import { Icono } from '../componentes/Icono';
import { SelectorEjercicios } from './Rutinas';

function leerPlan(p: URLSearchParams): PlanAndrey | null {
  const ids = (p.get('e') ?? '').split(',').map(Number).filter(id => ejercicio(id));
  if (!ids.length) return null;
  const d = Number(p.get('d')) || undefined;
  return {
    id: 'plan',
    nombre: p.get('t') || 'Tu plan de estiramientos',
    descripcion: 'Plan recomendado por Andrey Hernández.',
    ejercicios: ids,
    duracion: d && d >= 10 && d <= 120 ? d : undefined,
    paciente: p.get('n') || undefined,
    vecesPorDia: Number(p.get('v')) || undefined,
    nota: p.get('m') || undefined,
    recibido: new Date().toISOString(),
  };
}

export function enlacePlan(datos: { ids: number[]; d?: number; v?: number; n?: string; t?: string; m?: string }) {
  const p = new URLSearchParams();
  p.set('e', datos.ids.join(','));
  if (datos.d) p.set('d', String(datos.d));
  if (datos.v) p.set('v', String(datos.v));
  if (datos.n) p.set('n', datos.n);
  if (datos.t) p.set('t', datos.t);
  if (datos.m) p.set('m', datos.m);
  return location.href.split('#')[0] + '#/plan?' + p.toString();
}

export function RecibirPlan({ params }: { params: URLSearchParams }) {
  const estado = useEstado();
  const plan = leerPlan(params);
  if (!plan) return <main className="pantalla sin-nav"><p className="vacio">Este enlace no contiene un plan válido.</p><a className="boton" href="#/">Ir al inicio</a></main>;
  const guardar = () => { actualizar(() => ({ plan })); ir('/', true); };
  return (
    <main className="pantalla sin-nav">
      <header className="cabecera"><img className="logo" src="logo-horizontal.svg" alt="Andrey Hernández, Quiropráctico" /></header>
      <section className="seccion">
        <span className="etiqueta" style={{ alignSelf: 'flex-start' }}><Icono nombre="medico" /> Plan de Andrey</span>
        <h1>{plan.paciente ? `${plan.paciente}, aquí está tu plan` : 'Aquí está tu plan'}</h1>
        <p className="sub">
          {plan.nombre} · {plan.ejercicios.length} ejercicios · {minutos(duracionRutina(plan.ejercicios, plan.duracion))} min
          {plan.vecesPorDia ? ` · ${plan.vecesPorDia} ${plan.vecesPorDia === 1 ? 'vez' : 'veces'} al día` : ''}
        </p>
        {plan.nota && <p className="tarjeta menta">“{plan.nota}” — Andrey</p>}
      </section>
      <div className="rejilla">
        {plan.ejercicios.map((id, i) => (
          <div key={id} className="tarjeta-ej">
            <Ilustracion id={id} clave="p" />
            <div className="info"><span className="nombre">{i + 1}. {ejercicio(id)?.nombre}</span></div>
          </div>
        ))}
      </div>
      {estado.plan && <p className="peque-texto" style={{ textAlign: 'center' }}>Este plan reemplazará el que tenías guardado.</p>}
      <button className="boton coral ancho" onClick={guardar}><Icono nombre="check" /> Guardar mi plan</button>
    </main>
  );
}

export function CrearPlan() {
  const [ids, setIds] = useState<number[]>([]);
  const [paciente, setPaciente] = useState('');
  const [titulo, setTitulo] = useState('');
  const [duracion, setDuracion] = useState(0);
  const [veces, setVeces] = useState(1);
  const [nota, setNota] = useState('');
  const [qr, setQr] = useState('');
  const [copiado, setCopiado] = useState(false);

  const enlace = ids.length ? enlacePlan({ ids, d: duracion || undefined, v: veces, n: paciente.trim(), t: titulo.trim(), m: nota.trim() }) : '';
  useEffect(() => {
    if (!enlace) { setQr(''); return; }
    QRCode.toDataURL(enlace, { margin: 1, width: 440, color: { dark: '#0A3F3D', light: '#FFFFFF' } }).then(setQr).catch(() => setQr(''));
  }, [enlace]);

  const mensaje = `Hola${paciente ? ' ' + paciente.trim() : ''}, aquí tienes tus estiramientos. Ábrelo en tu teléfono: ${enlace}`;
  const copiar = async () => {
    try { await navigator.clipboard.writeText(enlace); setCopiado(true); setTimeout(() => setCopiado(false), 2000); } catch { prompt('Copia el enlace:', enlace); }
  };
  const compartir = async () => {
    if (navigator.share) { try { await navigator.share({ title: 'Tu plan de estiramientos', text: mensaje }); } catch { /* cancelado */ } }
    else copiar();
  };

  return (
    <main className="pantalla sin-nav">
      <Cabecera titulo="Crear plan para un paciente" atras="/" />
      <p className="sub">Elige los ejercicios y comparte el enlace o el código QR. El plan queda guardado en el teléfono del paciente; no se envían datos a ningún servidor.</p>

      <section className="tarjeta seccion">
        <label className="campo">Nombre del paciente (opcional)
          <input value={paciente} onChange={e => setPaciente(e.target.value)} placeholder="Ej.: María" />
        </label>
        <label className="campo">Título del plan
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Tu plan de estiramientos" />
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label className="campo">Tiempo por ejercicio
            <select value={duracion} onChange={e => setDuracion(Number(e.target.value))}>
              <option value={0}>El recomendado</option>
              {[15, 20, 30, 45, 60].map(s => <option key={s} value={s}>{s} segundos</option>)}
            </select>
          </label>
          <label className="campo">Veces al día
            <select value={veces} onChange={e => setVeces(Number(e.target.value))}>
              {[1, 2, 3].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
        </div>
        <label className="campo">Nota para el paciente (opcional)
          <textarea rows={2} value={nota} onChange={e => setNota(e.target.value)} placeholder="Ej.: Hazlos por la mañana y al terminar el trabajo." />
        </label>
      </section>

      <SelectorEjercicios elegidos={ids} setElegidos={setIds} />

      {enlace && (
        <section className="tarjeta seccion" style={{ position: 'sticky', bottom: 12, boxShadow: '0 -4px 30px rgba(14,90,87,.15)' }}>
          <h3>Listo para compartir · {ids.length} ejercicios · {minutos(duracionRutina(ids, duracion || undefined))} min</h3>
          {qr && <img className="qr" src={qr} alt="Código QR del plan" />}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button className="boton claro peque" onClick={copiar}><Icono nombre={copiado ? 'check' : 'copiar'} /> {copiado ? 'Copiado' : 'Copiar enlace'}</button>
            <a className="boton peque" href={`https://wa.me/?text=${encodeURIComponent(mensaje)}`} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
          <button className="boton coral peque" onClick={compartir}><Icono nombre="compartir" /> Compartir</button>
          <a className="peque-texto" href={enlace.slice(enlace.indexOf('#'))} style={{ textAlign: 'center' }}>Ver cómo lo recibe el paciente</a>
        </section>
      )}
    </main>
  );
}
