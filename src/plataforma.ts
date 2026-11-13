// Dónde se está usando la app: dentro de la APK de Android, instalada como app web o en el navegador.
declare global {
  interface Window { Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string } }
}

/** Enlace de descarga de la APK para Android (última versión publicada en GitHub). */
export const URL_APK = 'https://github.com/JuanjoNoEng/Estiramientos-app/releases/latest/download/estiramientos-andrey-hernandez.apk';

export const esApp = () => !!window.Capacitor?.isNativePlatform?.();
export const esIPhone = () => /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
export const esAndroid = () => /Android/i.test(navigator.userAgent);
export const estaInstalada = () =>
  esApp() || matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
