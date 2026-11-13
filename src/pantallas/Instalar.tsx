import { useEffect, useState } from 'react';
import { Cabecera } from '../componentes/comunes';
import { Icono } from '../componentes/Icono';
import { esAndroid, esIPhone, estaInstalada, URL_APK } from '../plataforma';

// Chrome en Android ofrece instalar la app web con este evento
interface EventoInstalar extends Event { prompt: () => Promise<void> }
let eventoGuardado: EventoInstalar | null = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); eventoGuardado = e as EventoInstalar; });

function Paso({ n, children }: { n: number; children: React.ReactNode }) {
  return <div className="paso-instalar"><span className="n">{n}</span><div style={{ paddingTop: 7 }}>{children}</div></div>;
}

export function Instalar() {
  const [sistema, setSistema] = useState<'iphone' | 'android'>(esIPhone() ? 'iphone' : 'android');
  const [puedeInstalar, setPuedeInstalar] = useState(!!eventoGuardado);
  useEffect(() => {
    const f = () => setPuedeInstalar(true);
    addEventListener('beforeinstallprompt', f);
    return () => removeEventListener('beforeinstallprompt', f);
  }, []);

  return (
    <main className="pantalla">
      <Cabecera titulo="Instalar la app" atras="/" />
      {estaInstalada() ? (
        <section className="tarjeta menta aviso"><Icono nombre="check" /><p>¡Ya tienes la app instalada en este teléfono!</p></section>
      ) : (
        <p className="sub">Así la tendrás en la pantalla de tu teléfono, como cualquier otra app, y funcionará sin internet.</p>
      )}

      <div className="opciones" style={{ gridTemplateColumns: '1fr 1fr' }} role="tablist">
        <button role="tab" aria-selected={sistema === 'android'} className={'opcion' + (sistema === 'android' ? ' activo' : '')} onClick={() => setSistema('android')}><span className="emoji" aria-hidden>🤖</span>Android</button>
        <button role="tab" aria-selected={sistema === 'iphone'} className={'opcion' + (sistema === 'iphone' ? ' activo' : '')} onClick={() => setSistema('iphone')}><span className="emoji" aria-hidden>🍎</span>iPhone</button>
      </div>

      {sistema === 'android' ? (
        <section className="tarjeta seccion" style={{ gap: 16 }}>
          <h2>En Android</h2>
          <Paso n={1}><b>Toca el botón verde</b> para descargar la app.</Paso>
          <a className="boton grande ancho" href={URL_APK}><Icono nombre="bajar" /> Descargar la app</a>
          <Paso n={2}>Cuando termine, <b>abre el archivo descargado</b> (aparece arriba, en las notificaciones).</Paso>
          <Paso n={3}>Si el teléfono pregunta, toca <b>«Configuración»</b> y activa <b>«Permitir de esta fuente»</b>. Es normal: la app no viene de la tienda.</Paso>
          <Paso n={4}>Toca <b>«Instalar»</b> y luego <b>«Abrir»</b>. ¡Listo!</Paso>
          {esAndroid() && puedeInstalar && (
            <>
              <p className="peque-texto">¿Prefieres no descargar nada? También puedes instalarla desde el navegador:</p>
              <button className="boton claro" onClick={() => eventoGuardado?.prompt()}>Instalar desde el navegador</button>
            </>
          )}
        </section>
      ) : (
        <section className="tarjeta seccion" style={{ gap: 16 }}>
          <h2>En iPhone</h2>
          <Paso n={1}>Abre este enlace en <b>Safari</b> (la brújula azul).</Paso>
          <Paso n={2}>Toca el botón <b>Compartir</b>: un cuadrado con una flecha hacia arriba <span aria-hidden style={{ display: 'inline-block', verticalAlign: 'middle', width: 24, height: 24, color: 'var(--verde)' }}><Icono nombre="compartir" /></span>, abajo en el centro.</Paso>
          <Paso n={3}>Baja y toca <b>«Agregar a inicio»</b>.</Paso>
          <Paso n={4}>Toca <b>«Agregar»</b> arriba a la derecha. Aparecerá el ícono de Andrey en tu pantalla.</Paso>
        </section>
      )}
      <p className="peque-texto" style={{ textAlign: 'center' }}>¿Necesitas ayuda? Pídela en tu próxima consulta con Andrey.</p>
    </main>
  );
}
