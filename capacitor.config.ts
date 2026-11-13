import type { CapacitorConfig } from '@capacitor/cli';

// App de Android (APK): envuelve la misma web compilada en dist/
const config: CapacitorConfig = {
  appId: 'com.andreyhernandez.estiramientos',
  appName: 'Estiramientos',
  webDir: 'dist',
  android: {
    backgroundColor: '#FBF7F1',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_notificacion',
      iconColor: '#0E5A57',
    },
  },
};

export default config;
