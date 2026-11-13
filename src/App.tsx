import { useRuta } from './ruta';
import { useEstado } from './almacen';
import { Navegacion } from './componentes/comunes';
import { Inicio } from './pantallas/Inicio';
import { Biblioteca } from './pantallas/Biblioteca';
import { Ficha } from './pantallas/Ficha';
import { Rutinas, DetalleRutina } from './pantallas/Rutinas';
import { Sesion } from './pantallas/Sesion';
import { Aprende, Seguridad } from './pantallas/Aprende';
import { Bienvenida } from './pantallas/Bienvenida';
import { RecibirPlan, CrearPlan } from './pantallas/Plan';
import { Progreso } from './pantallas/Progreso';

export function App() {
  const { partes, params } = useRuta();
  const estado = useEstado();
  const [p0, p1] = partes;

  // Un plan recibido por enlace se muestra aunque sea la primera vez que se abre la app
  if (p0 === 'plan') return <div className="app"><RecibirPlan params={params} /></div>;
  if (p0 === 'andrey') return <div className="app"><CrearPlan /></div>;
  if (!estado.bienvenida) return <div className="app"><Bienvenida /></div>;
  if (p0 === 'sesion') return <div className="app"><Sesion params={params} /></div>;

  let pantalla, activa = 'inicio';
  switch (p0) {
    case 'ejercicios': pantalla = <Biblioteca params={params} />; activa = 'ejercicios'; break;
    case 'ejercicio': pantalla = <Ficha id={Number(p1)} />; activa = 'ejercicios'; break;
    case 'rutinas': pantalla = <Rutinas />; activa = 'rutinas'; break;
    case 'rutina': pantalla = <DetalleRutina id={decodeURIComponent(p1 ?? '')} />; activa = 'rutinas'; break;
    case 'aprende': pantalla = <Aprende />; activa = 'aprende'; break;
    case 'seguridad': pantalla = <Seguridad />; activa = 'aprende'; break;
    case 'progreso': pantalla = <Progreso />; break;
    default: pantalla = <Inicio />;
  }
  return (
    <div className="app">
      {pantalla}
      <Navegacion activa={activa} />
    </div>
  );
}
