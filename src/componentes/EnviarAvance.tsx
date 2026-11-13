import { useEstado } from '../almacen';
import { mensajeAvance, enlaceWhatsApp } from '../avance';
import { Icono } from './Icono';

/** Botón que abre WhatsApp con el resumen del progreso listo para enviar a Andrey. */
export function EnviarAvance({ clase = 'boton claro grande ancho' }: { clase?: string }) {
  const { sesiones, plan } = useEstado();
  return (
    <a className={clase} href={enlaceWhatsApp(mensajeAvance(sesiones, plan?.paciente))} target="_blank" rel="noreferrer">
      <Icono nombre="compartir" /> Enviar mi avance a Andrey
    </a>
  );
}
