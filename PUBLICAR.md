# Cómo publicar la app

La misma app se distribuye de dos formas:

| Pacientes con… | Cómo la reciben |
|---|---|
| **Android** | Una **APK** que se descarga e instala (no hace falta la Play Store). |
| **iPhone** | La **web**, que se abre en Safari y se agrega a la pantalla de inicio. |

Todo se compila solo en GitHub (pestaña **Actions**). No hace falta instalar nada en un computador.

---

## 1. Una sola vez: la llave de firma de Android

La APK se firma con una llave propia. Así cada versión nueva se instala **encima** de la anterior y el
paciente no pierde su progreso.

1. Guarda en un lugar seguro los archivos `estiramientos-release.keystore` y `SECRETOS-GITHUB.txt`
   (se entregaron aparte; **no se suben al repositorio**). Si se pierden, las próximas versiones no
   podrán instalarse encima de la actual.
2. En GitHub: **Settings → Secrets and variables → Actions → New repository secret** y crea los cuatro
   secretos que indica `SECRETOS-GITHUB.txt`:
   `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` y `ANDROID_KEY_PASSWORD`.

Sin estos secretos se genera igualmente una APK "de prueba" (debug), útil para probar, pero no para
repartir a pacientes.

## 2. Una sola vez: activar la web (para iPhone)

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Cada vez que se actualiza la rama `main`, la web se publica sola en
   `https://<usuario>.github.io/Estiramientos-app/`.

Esa es la dirección que se comparte con los pacientes de iPhone. Los planes que crea Andrey en
`…/#/andrey` usan esa misma dirección.

> También puede usarse un dominio propio (por ejemplo `estiramientos.andreyhernandez.com`) desde
> **Settings → Pages → Custom domain**.

## 3. Cada vez que haya una versión nueva

1. Llevar los cambios a `main` (por ejemplo, aprobando el *pull request*). Eso publica la web.
2. Crear una etiqueta de versión, por ejemplo desde **Releases → Draft a new release → Choose a tag:
   `v1.0.0` → Publish**. El flujo **APK Android** compila la APK y la adjunta a esa versión con el
   nombre `estiramientos-andrey-hernandez.apk`.
3. El botón **Descargar la app** (pantalla *Instalar la app*) siempre apunta a la última versión:
   `https://github.com/JuanjoNoEng/Estiramientos-app/releases/latest/download/estiramientos-andrey-hernandez.apk`

> Para que los pacientes puedan descargar la APK desde ese enlace, el repositorio debe ser **público**,
> o la APK debe alojarse en otro sitio (por ejemplo, la web de Andrey) y actualizarse `URL_APK` en
> `src/plataforma.ts`.

## Probar una APK sin publicarla

Cada ejecución de **Actions → APK Android** deja la APK como **artefacto** descargable al final de la
página de la ejecución (requiere iniciar sesión en GitHub).

## Voces

Las voces de la guía se generan con ElevenLabs (voz **Julieta**):

```bash
ELEVENLABS_API_KEY=... node voz/generar.mjs             # avisos y nombres
ELEVENLABS_API_KEY=... node voz/generar.mjs --lecturas  # lectura completa de cada ejercicio
```

Solo se regeneran los audios cuyo texto cambió. Los archivos van en `public/audio/`.
