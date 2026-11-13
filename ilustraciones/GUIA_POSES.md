# Guía para dibujar posturas

Las ilustraciones de los ejercicios no se dibujan a mano: cada una es una **postura** (un objeto JS) que el
motor `figura.mjs` convierte en un SVG con estilo de silueta rellena. Todas las figuras comparten proporciones,
colores y estilo.

**Fuente:** el libro `ESTIRAMIENTOS_PACIENTES.pdf`. La página del PDF coincide con el número impreso:
ej. 1–3 → p.9 · 4–6 → p.10 · 7–9 → p.11 · 10–12 → p.12 · 13–15 → p.13 · 16–18 → p.14 · 19–21 → p.15 ·
22–23 → p.16 · 24–26 → p.17 · 27–29 → p.18 · 30–31 → p.19 · 32–34 → p.20 · 35–37 → p.21 · 38–40 → p.22 ·
41–43 → p.23 · 44–46 → p.24 · 47–49 → p.25 · 50–52 → p.26 · 53–55 → p.27 · 56–58 → p.28 · 59–61 → p.29 ·
62–64 → p.30 · 65–67 → p.31 · 68–70 → p.32 · 71–73 → p.33 · 74–76 → p.34 · 77–79 → p.35 · 80–82 → p.36 ·
83–85 → p.37 · 86–88 → p.38 · 89–91 → p.39.

Dibuja la **posición de máximo estiramiento** (la que se mantiene), como en el libro. Si el libro muestra dos
figuras (inicio y final), dibuja la final.

## Ver lo que dibujas

```bash
ESCALA=2 node ilustraciones/exportar.mjs /ruta/salida.png 4,48,61
```

Genera los SVG en `ilustraciones/svg/` y una hoja PNG con los ids indicados. **Mira siempre la imagen** con la
herramienta de lectura de imágenes y corrige hasta que la postura se entienda a la primera.

## Coordenadas y ángulos

- Coordenadas SVG: x hacia la derecha, **y hacia abajo**.
- Ángulos absolutos en grados: `0` derecha, `90` abajo, `180` izquierda, `-90` arriba (`270` = `-90`).
- La **pelvis está en (0, 0)**. La figura se apoya sola: el punto más bajo del cuerpo toca el suelo.
  Si el cuerpo descansa sobre un objeto (mesa, banco), usa `sobreSuelo: <altura>` para bajar el suelo.
- Largos: cuello 9, torso 50 (pelvis → base del cuello), brazo 28, antebrazo 25, mano 8, muslo 43,
  pierna 41, pie 14. Radio de la cabeza 12. Una persona de pie mide ~175 unidades.

## Estructura de una postura

```js
{
  nombre: 'Pantorrillas',      // opcional, solo para la vista previa
  vista: 'lado',               // 'lado' (perfil) o 'frente' (de frente o de espaldas, se ve igual)
  mira: 1,                     // vista lateral: 1 = mira a la derecha, -1 = a la izquierda.
                               // Tumbado: define dónde está el pecho (ver abajo)
  torso: -90,                  // ángulo pelvis → base del cuello (-90 = erguido)
  cuello: -90,                 // ángulo base del cuello → cabeza (por defecto = torso)
  piernaN: {...}, piernaL: {...}, brazoN: {...}, brazoL: {...},
  resaltar: ['piernaN.pierna'],
  objetos: J => [ ... ],       // función que recibe las articulaciones J (y sueloY)
  espaldas: true,              // vista frontal vista DE ESPALDAS: dibuja columna y omóplatos
  orden: [...],                // opcional: orden de dibujo
}
```

**N y L:** en vista lateral `N` es el lado **cercano** (verde oscuro) y `L` el **lejano** (verde claro).
En vista frontal `N` es el lado **izquierdo del dibujo** y `L` el derecho.

### Miembros (brazo o pierna): 3 segmentos

- Ángulos directos: `{ a: [ánguloMuslo, ánguloPierna], fin: ánguloPie }`
  (brazo: `[ánguloBrazo, ánguloAntebrazo]`, `fin` = ángulo de la mano).
- Cinemática inversa: `{ hacia: [x, y], doblez: 1 | -1, fin }`. El extremo (tobillo o muñeca) va a ese punto.
  `doblez` elige hacia qué lado se dobla la rodilla o el codo: **prueba los dos valores**.
  `hacia` también acepta referencias: `'piernaN.tobillo'`, `'piernaL.punta+3,-5'` (con desplazamiento)
  o una función `J => [x, y]`. Un brazo puede apuntar al otro (`'brazoL.codo'`): el motor resuelve el orden.
- `escala: [s1, s2, s3]` acorta segmentos para simular escorzo (p. ej. muslos de alguien sentado visto de
  frente: `[0.42, 0.95, 0.55]`).
- Pie por defecto: plano hacia donde mira la figura. Pie en punta o apoyado de otra forma: usa `fin`.

### Articulaciones disponibles en `J`

`J.pelvis`, `J.pecho`, `J.base` (base del cuello), `J.cabeza`, `J.hombroN/L`, `J.caderaN/L`,
`J.piernaN.{cadera, rodilla, tobillo, punta}`, `J.brazoN.{hombro, codo, muneca, punta}` (igual con L).

### Tumbado y otras orientaciones

- Boca arriba, cabeza a la izquierda: `torso: 180, mira: 1` (con `mira` el pecho queda hacia arriba).
  Boca abajo: `torso: 180, mira: -1`. Con la cabeza a la derecha: `torso: 0` (invierte `mira`).
- Regla general: el "frente" del tronco es el torso girado 90° en sentido horario multiplicado por `mira`.
  Si el pecho y la espalda quedan al revés, cambia el signo de `mira`.
- Sentado en el suelo: torso más o menos vertical y piernas hacia delante (`a: [0, 0]` mirando a la derecha).
- De rodillas: muslo hacia abajo (`90`) y pierna hacia atrás, apoyada en el suelo (`180` si mira a la derecha).

### Resaltado (coral = músculo que se estira)

- Segmentos: `'piernaN.muslo'`, `'piernaN.pierna'` (pantorrilla), `'piernaN.pie'`, `'brazoL.brazo'`,
  `'brazoL.antebrazo'`, `'brazoL.mano'`. Un miembro entero: `'piernaN'`.
  En el lado lejano se usa automáticamente un coral más claro.
- Zonas del tronco: `'pecho'`, `'abdomen'`, `'lumbar'`, `'espalda'` (espalda alta), `'gluteo'`,
  `'costado'`, `'tronco'`.
- Cuello: `'cuello'`. En vista frontal se resalta el lado contrario a la inclinación.
  En vista lateral se resalta la **nuca** por defecto, o la parte delantera con `cuelloLado: 'frente'`.
- Resalta **solo** el músculo que el ejercicio estira (el título del libro lo dice).

### Objetos

Se pasan como función `J => [...]` para colocarlos según las articulaciones. Coordenadas en el mismo sistema.

| tipo | parámetros |
|---|---|
| `pared` | `x` (cara de la pared), `lado` (1: el muro está a la derecha de x; -1: a la izquierda), `arriba` opcional |
| `puerta` | `x1`, `x2` (caras internas de los postes), `arriba` |
| `silla` | `x` (borde delantero del asiento), `y` (altura del asiento), `dir` (1: mira a la derecha), `respaldo: false`, `alto` |
| `sillaFrente` | `x` (centro), `y` (asiento), `ancho`, `alto` |
| `banqueta` | como `silla` sin respaldo |
| `mesa`, `banco` | `x1`, `x2`, `y` (superficie) |
| `colchoneta` | `x1`, `x2` |
| `cuna` | escalón inclinado: `x1` (lado bajo), `x2` (lado alto), `alto` |
| `barra` | barra horizontal vista de lado: `x`, `y`, `pared` (x de la pared para el soporte) |
| `toalla`, `correa` | `puntos: [[x,y], ...]` (se dibuja por delante del cuerpo) |
| `palo` | `p1`, `p2` |
| `mancuerna` | `x`, `y`, `ang` (sirve para "un tetrabrik lleno" del libro) |
| `flecha` | arco punteado: `c` (centro), `r`, `de`, `a` (ángulos). Úsala con moderación, solo si aclara el movimiento |
| `svg` | comodín: `svg` (string SVG), `delante` (bool), `caja: [minX, minY, maxX]` para encuadrar |

Las patas de sillas y mesas y las paredes llegan solas hasta el suelo.

### Compañero (ejercicios en pareja)

```js
companero: { dx: 55, pose: { ...otra postura... }, delante: false }
```

Se dibuja en un verde grisáceo, apoyado en el mismo suelo y desplazado `dx` respecto a la pelvis principal.
`objetos: (J, sueloY, Jc) => ...` recibe también sus articulaciones (`Jc`, en coordenadas del dibujo).

### Orden de dibujo

Por defecto, en vista lateral: `['brazoL', 'piernaL', 'torso', 'piernaN', 'brazoN']`; en vista frontal:
`['piernaN', 'piernaL', 'torso', 'brazoN', 'brazoL']`. La cabeza se dibuja con el torso, salvo que
pongas `'cabeza'` en `orden` (útil si un brazo debe pasar **por detrás** de la cabeza, como en el 89).

## Ejemplos aprobados (ver `ejercicios.mjs`)

- **4** Pantorrillas: vista lateral, inclinado contra la pared, IK para el pie adelantado y las manos.
- **48** Cuádriceps de pie: talón al glúteo con IK de la mano al tobillo.
- **61** Pectorales en el marco de la puerta: vista frontal, `resaltar: ['pecho']`.
- **89** Lateral del cuello sentado: vista frontal, brazo por detrás de la cabeza, `flecha`.

## Criterios de calidad

1. La postura se entiende sin leer el texto y coincide con el dibujo del libro.
2. Los apoyos son creíbles: pies, rodillas, manos o glúteos tocan el suelo u objeto donde se apoyan; nada flota
   ni atraviesa objetos.
3. Las articulaciones se doblan en sentido natural (las rodillas no se doblan hacia delante, los codos no al revés).
4. El coral marca exactamente el músculo del título.
5. Usa vista lateral salvo que la frontal explique mejor (cuello lateral, brazos en cruz, rotaciones vistas de
   espaldas…).
6. Los ejercicios que repiten la misma idea con otra postura deben distinguirse a simple vista.

No modifiques `figura.mjs`. Si falta algo, usa el objeto `svg` o anótalo en tu informe.

## Animación: postura inicial

Cada ejercicio se anima desde una **postura inicial** hasta la postura final (la de `ejercicios.mjs`).
El motor interpola los ángulos de cada articulación. Los objetos, el suelo y la cámara quedan fijos, y el
**punto de apoyo** no se desliza.

- Las posturas iniciales van en `ilustraciones/inicio/lote-X.mjs` (`export default { id: {...} }`).
- **Solo se escribe lo que cambia.** Todo lo que no indiques (vista, mira, resaltar, objetos y los miembros
  que no mencionas) se toma de la postura final. Los objetos **siempre** son los de la postura final.
- Se usa la misma sintaxis: `torso`, `cuello`, `piernaN`, `brazoL`… con `a` o `hacia` y `doblez`.
  Las coordenadas son relativas a la pelvis de la postura inicial.
- **Punto de apoyo:** por defecto es la articulación más baja de la postura final (un pie, una rodilla…).
  Si no es la adecuada, indica en la postura **final** `ancla: 'piernaL.punta'`, o en la inicial `ancla`
  para cambiarla solo en la animación. Es el punto que se queda clavado en el suelo.

### Qué movimiento dibujar

- La postura inicial es la **posición de partida que describe el libro** justo antes de estirar: el
  estiramiento ocurre al pasar de la inicial a la final, mientras se suelta el aire.
- El movimiento debe ser **moderado y realista**: normalmente de 15 a 45 grados en las articulaciones que
  trabajan. No hace falta mostrar cómo se coloca la persona desde cero (sentarse, tumbarse…).
- Los apoyos deben mantenerse: si una mano está en la pared o sujeta un pie, en la inicial también debe
  estar en contacto (o muy cerca). Comprueba que la mano llega (la cinemática inversa no estira más allá
  del largo del brazo).
- En la inicial no debe haber posturas imposibles ni miembros que atraviesen objetos.

### Ver la animación

```bash
node ilustraciones/animar.mjs /ruta/salida.png 4,48,61,89
```

Genera una fila por ejercicio con 5 fotogramas (0 %, 25 %, 50 %, 75 % y 100 %). Ejemplos aprobados en
`ilustraciones/inicios.mjs` (4, 48, 61 y 89).
