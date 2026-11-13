# Estiramientos · Andrey Hernández, Quiropráctico

App web instalable (PWA) con los estiramientos que Andrey Hernández comparte con sus pacientes:
ilustraciones propias, rutinas guiadas con temporizador y respiración, y planes personalizados
que Andrey envía por enlace o código QR.

## Qué incluye

- **Biblioteca de 91 ejercicios** con búsqueda y filtros por zona, postura, material y dificultad.
- **Ficha de cada ejercicio**: ilustración, pasos, respiración, precauciones y variantes.
- **Modo guiado**: cuenta atrás, guía de respiración, cambio de lado con la figura en espejo, voz y
  sonidos, pantalla siempre encendida y botón "me molesta".
- **Rutinas**: las del libro (antes de la actividad, vuelta a la calma, fundamentales), por zona y
  rutinas propias del paciente.
- **Plan de Andrey**: en `#/andrey` Andrey elige ejercicios y genera un enlace + QR. El paciente lo
  abre y el plan queda en su inicio. Todo viaja en el enlace; no hay servidor.
- **Progreso**: racha de días, historial y evolución de la molestia para mostrar en consulta.
- **Aprende y seguridad**: tarjetas educativas y contraindicaciones.
- Funciona **sin conexión** una vez instalada. Los datos del paciente se guardan solo en su teléfono.

## Estructura

| Carpeta | Contenido |
|---|---|
| `src/` | App (React + TypeScript + Vite) |
| `datos/` | Ejercicios, rutinas y guía en JSON (adaptados del libro) |
| `ilustraciones/` | Motor de figuras (`figura.mjs`), posturas por ejercicio y guía para dibujarlas |
| `marca/` | Logo, variantes, íconos y guía de marca |
| `public/` | Íconos y logos que usa la app |

## Desarrollo

```bash
npm install
npm run dev        # servidor local
npm run build      # compila en dist/
npm run preview    # sirve dist/ para probar la PWA
```

Exportar las ilustraciones a SVG (y una hoja de vista previa):

```bash
ESCALA=2 node ilustraciones/exportar.mjs hoja.png 1,2,3
```

## Publicar

`npm run build` genera una web estática en `dist/` que se puede subir a cualquier hosting
(GitHub Pages, Netlify, Vercel, Cloudflare Pages…). La app usa rutas con `#`, así que no necesita
configuración de servidor.
