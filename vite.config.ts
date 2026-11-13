import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// base relativa: la app funciona en cualquier carpeta (GitHub Pages, Netlify, un dominio propio…)
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'simbolo.svg', 'logo-horizontal.svg'],
      manifest: {
        name: 'Estiramientos · Andrey Hernández',
        short_name: 'Estiramientos',
        description: 'Tus estiramientos guiados, recomendados por Andrey Hernández, Quiropráctico.',
        lang: 'es',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FBF7F1',
        theme_color: '#0E5A57',
        icons: [
          { src: 'icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icono-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Avisos y nombres de la voz guía van incluidos: la sesión guiada funciona sin internet
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}', 'audio/aviso-*.mp3', 'audio/nombre-*.mp3'],
        // Las lecturas largas (ejercicios, tarjetas, seguridad) se guardan la primera vez que se escuchan
        runtimeCaching: [{
          urlPattern: /\/audio\/(lectura-\d+|tarjeta-[\w-]+|seguridad)\.mp3$/,
          handler: 'CacheFirst',
          options: { cacheName: 'lecturas', expiration: { maxEntries: 120 } },
        }],
      },
    }),
  ],
});
