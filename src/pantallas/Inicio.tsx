import { RUTINAS, RUTINA_DIARIA, ZONAS, GUIA, duracionRutina, minutos } from '../datos';
import { useEstado, racha, hechasHoy, diasActivos, actualizar } from '../almacen';
import { estaInstalada } from '../plataforma';
import { Ilustracion, TarjetaRutina } from '../componentes/comunes';
import { Icono } from '../componentes/Icono';
import { SemanaActual } from './Progreso';

const DESTACADAS = ['diaria', 'antes-de-la-actividad', 'vuelta-a-la-calma', 'fundamentales'];

function saludo() {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

function CabeceraInicio() {
  return (
    <header className="cabecera">
      <img className="logo" src="logo-horizontal.svg" alt="Andrey Hernández, Quiropráctico" style={{ flex: 'none' }} />
      <span style={{ flex: 1 }} />
      <a className="boton-icono" href="#/ajustes" aria-label="Ajustes"><Icono nombre="ajustes" /></a>
    </header>
  );
}

function AvisoInstalar() {
  const estado = useEstado();
  if (estado.instalacionVista || estaInstalada()) return null;
  return (
    <section className="tarjeta menta seccion" style={{ gap: 10 }}>
      <div className="aviso"><Icono nombre="subir" /><div><h3>Pon la app en tu teléfono</h3><p className="sub">Así la encuentras fácil y funciona sin internet.</p></div></div>
      <div style={{ display: 'flex', gap: 8 }}>
        <a className="boton peque" href="#/instalar" style={{ flex: 1 }}>Ver cómo</a>
        <button className="boton claro peque" onClick={() => actualizar(() => ({ instalacionVista: true }))}>Ahora no</button>
      </div>
    </section>
  );
}

/** Inicio del modo sencillo: un solo botón grande para hacer los ejercicios. */
function InicioSencillo() {
  const estado = useEstado();
  const plan = estado.plan;
  const rutina = plan ?? RUTINA_DIARIA;
  const destino = plan ? 'plan' : RUTINA_DIARIA.id;
  const hoy = hechasHoy(estado.sesiones);
  const lunes = new Date(); lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7));
  const estaSemana = [...diasActivos(estado.sesiones)].filter(d => d >= lunes.toLocaleDateString('sv')).length;
  return (
    <main className="pantalla" style={{ gap: 24 }}>
      <CabeceraInicio />
      <section className="seccion">
        <h1 style={{ fontSize: '2rem' }}>{saludo()}{plan?.paciente ? `, ${plan.paciente}` : ''}</h1>
        <p className="sub" style={{ fontSize: '1.1rem' }}>{hoy > 0 ? '¡Ya estiraste hoy! Muy bien.' : 'Es momento de estirar.'}</p>
      </section>
      <a className="boton coral gigante" href={`#/sesion?r=${destino}`}><Icono nombre="play" relleno /> Hacer mis ejercicios</a>
      <p className="sub" style={{ textAlign: 'center', marginTop: -10 }}>
        {plan ? 'Plan de Andrey' : rutina.nombre} · {rutina.ejercicios.length} ejercicios · {minutos(duracionRutina(rutina.ejercicios, rutina.duracion))} minutos
      </p>
      {plan?.nota && <p className="tarjeta menta" style={{ fontSize: '1.05rem' }}>“{plan.nota}” — Andrey</p>}
      <section className="tarjeta seccion" style={{ alignItems: 'center', textAlign: 'center' }}>
        <h2>Esta semana estiraste {estaSemana} {estaSemana === 1 ? 'día' : 'días'}</h2>
        <SemanaActual sesiones={estado.sesiones} />
      </section>
      <AvisoInstalar />
      <a className="boton claro grande ancho" href={`#/rutina/${destino}`}><Icono nombre="rutinas" /> Ver mis ejercicios</a>
      <footer className="pie">
        <a href="#/seguridad">Recomendaciones de seguridad</a>
        <span className="peque-texto">Ante cualquier dolor, consulta con Andrey.</span>
      </footer>
    </main>
  );
}

export function Inicio() {
  const estado = useEstado();
  if (estado.modo === 'sencillo') return <InicioSencillo />;
  const dias = racha(estado.sesiones);
  const hoy = hechasHoy(estado.sesiones);
  const plan = estado.plan;
  const destacadas = DESTACADAS.map(id => RUTINAS.find(r => r.id === id)).filter(Boolean) as typeof RUTINAS;
  // Una tarjeta educativa distinta cada día
  const diaDelAno = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 864e5);
  const tarjeta = GUIA.tarjetas.length ? GUIA.tarjetas[diaDelAno % GUIA.tarjetas.length] : null;

  return (
    <main className="pantalla">
      <CabeceraInicio />

      <section className="seccion">
        <h1>{saludo()}{plan?.paciente ? `, ${plan.paciente}` : ''}</h1>
        <p className="sub">{hoy > 0 ? '¡Ya estiraste hoy! Tu cuerpo te lo agradece.' : 'Unos minutos de estiramiento hoy marcan la diferencia.'}</p>
      </section>

      {plan ? (
        <section className="tarjeta verde seccion">
          <span className="etiqueta" style={{ alignSelf: 'flex-start' }}><Icono nombre="medico" /> Tu plan de Andrey</span>
          <h2>{plan.nombre}</h2>
          <p style={{ opacity: .9 }}>
            {plan.ejercicios.length} ejercicios · {minutos(duracionRutina(plan.ejercicios, plan.duracion))} min
            {plan.vecesPorDia ? ` · ${plan.vecesPorDia} ${plan.vecesPorDia === 1 ? 'vez' : 'veces'} al día` : ''}
          </p>
          {plan.nota && <p style={{ opacity: .9, fontStyle: 'italic' }}>“{plan.nota}”</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <a className="boton coral" href="#/sesion?r=plan" style={{ flex: 1 }}><Icono nombre="play" relleno /> Empezar</a>
            <a className="boton claro" href="#/rutina/plan">Ver</a>
          </div>
        </section>
      ) : (
        <section className="tarjeta menta aviso">
          <Icono nombre="medico" />
          <p className="sub">Si Andrey te recomienda ejercicios, abre el enlace o escanea el código que te dé y tu plan aparecerá aquí.</p>
        </section>
      )}

      <a className="tarjeta seccion" href="#/progreso" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="racha">
          <span className="numero">{dias}</span>
          <div>
            <h3>{dias === 1 ? 'día seguido' : 'días seguidos'}</h3>
            <span className="peque-texto">La constancia es lo que da resultados</span>
          </div>
        </div>
        <SemanaActual sesiones={estado.sesiones} />
      </a>

      <AvisoInstalar />

      <section className="seccion">
        <div className="seccion-titulo"><h2>Rutinas</h2><a href="#/rutinas">Ver todas</a></div>
        <div className="carrusel">
          {destacadas.map(r => <TarjetaRutina key={r.id} r={r} />)}
        </div>
      </section>

      <section className="seccion">
        <div className="seccion-titulo"><h2>¿Dónde lo sientes?</h2></div>
        <div className="zonas">
          {ZONAS.map(z => (
            <a key={z.id} className="zona" href={`#/ejercicios?zona=${z.id}`}>
              <Ilustracion id={z.ejemplo} clave={'z'} />
              <span>{z.nombre}</span>
            </a>
          ))}
        </div>
      </section>

      {tarjeta && (
        <a className="tarjeta seccion" href="#/aprende" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="etiqueta coral" style={{ alignSelf: 'flex-start' }}><Icono nombre="info" /> ¿Sabías que…?</span>
          <h3>{tarjeta.titulo}</h3>
          <p className="sub">{tarjeta.texto}</p>
        </a>
      )}

      <footer className="pie">
        <a href="#/seguridad">Antes de estirar: recomendaciones de seguridad</a>
        <span className="peque-texto">Esta app no reemplaza la consulta. Ante cualquier dolor, consulta con Andrey.</span>
        <a href="#/andrey" className="peque-texto">¿Eres Andrey? Crear un plan para un paciente</a>
      </footer>
    </main>
  );
}
