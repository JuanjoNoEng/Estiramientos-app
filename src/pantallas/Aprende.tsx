import { GUIA } from '../datos';
import { Cabecera } from '../componentes/comunes';
import { Icono } from '../componentes/Icono';
import { Escuchar } from '../componentes/Escuchar';
import { tarjetaFrase, seguridadFrase } from '../voz';

export function Aprende() {
  return (
    <main className="pantalla">
      <Cabecera titulo="Aprende" />
      <a className="tarjeta coral aviso" href="#/seguridad" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Icono nombre="aviso" />
        <div><h3>Seguridad al estirar</h3><p className="sub">Cuándo no estirar y cuándo detenerte.</p></div>
      </a>
      {GUIA.tarjetas.map(t => (
        <article key={t.id} className="tarjeta seccion" id={t.id}>
          <h2>{t.titulo}</h2>
          <p>{t.texto}</p>
          <Escuchar frase={tarjetaFrase(t)} />
        </article>
      ))}
      <p className="peque-texto" style={{ textAlign: 'center' }}>Contenido basado en el material que Andrey comparte con sus pacientes.</p>
    </main>
  );
}

export function Seguridad() {
  const s = GUIA.seguridad;
  const bloques: [string, string, string[], string?][] = [
    ['Antes de empezar', 'check', s.antesDeEmpezar],
    ['No estires si tienes…', 'aviso', s.noEstirarSi, 'coral'],
    ['Detente si…', 'info', s.pararSi, 'coral'],
    ['Consejos', 'estrella', s.consejos, 'menta'],
  ];
  return (
    <main className="pantalla">
      <Cabecera titulo="Seguridad" atras="/aprende" />
      <Escuchar frase={seguridadFrase(s)} texto="Escuchar todo" clase="boton claro grande" />
      {bloques.filter(b => b[2]?.length).map(([titulo, icono, items, color]) => (
        <section key={titulo} className={'tarjeta seccion ' + (color ?? '')}>
          <div className="aviso"><Icono nombre={icono} /><h3>{titulo}</h3></div>
          <ul className="lista">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </section>
      ))}
      <p className="peque-texto" style={{ textAlign: 'center' }}>Esta app no reemplaza la consulta. Ante cualquier duda, consulta con Andrey.</p>
    </main>
  );
}
