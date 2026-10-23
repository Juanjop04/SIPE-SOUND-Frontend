# 05 · Sistema de diseño · "Diapasón"

> Toda pantalla nueva o rediseñada cumple este documento. Su objetivo es que
> SIPE-SOUND se reconozca como **una herramienta de música hecha para el aula**,
> no como una plantilla genérica generada por IA.

> **Enmienda 2026-10-23 (rediseño del estudiante).** El equipo aprobó una maqueta de inicio con
> paleta azul profunda, tarjetas de cifras con ícono, fotografías de guitarra y verde para los logros
> (HU-F-320, HU-F-321, HU-F-315). Esta versión del documento ya la incorpora; los cambios respecto a
> la anterior están marcados con *(enmienda)*.

## 1. Concepto

La interfaz toma su lenguaje de la **anatomía de la guitarra** y de la
**notación que el estudiante ya está aprendiendo** (diagramas de acordes y
tablatura). No se decora con música: se **organiza** como música.

| Elemento de la guitarra | Uso en la interfaz |
|---|---|
| **Mástil** | Eje vertical de la ruta de aprendizaje. Los bloques son trastes que se recorren de arriba abajo. |
| **Trastes** | Divisores: líneas finas de 1 px (`linea`). |
| **Cuerdas** | Barras de progreso: pista `ink-2` y relleno `primary` mientras se avanza; **verde** (`success`) al completar *(enmienda)*. |
| **La cuerda que suena** | Vibración y color **ámbar** (`suena`) solo en las animaciones de cuerdas (`Fretboard`, `GuitarraAcustica`) y en la cuerda del mástil hasta el último bloque aprobado *(enmienda)*. |
| **Marcadores del mástil** (puntos en trastes 3, 5, 7, 9, 12) | Hitos de la ruta: aparecen solo en bloques que cierran nivel. |
| **Símbolos del diagrama de acorde** | Estados: `×` (cuerda muda) = bloqueado · `○` (cuerda al aire) = disponible · `●` verde = aprobado. Coinciden con `ChordDiagram`, que el estudiante ya lee. |
| **Tablatura** | Datos numéricos (BPM, compás, %, fechas, puntajes) en **IBM Plex Mono**, alineados como una tablatura. |
| **Atril** | Nombre visual del panel docente: superficie de trabajo densa y ordenada, como una partitura sobre el atril. |

## 2. Tokens

### 2.1 Color *(enmienda: paleta de la maqueta con ajustes AA, HU-F-320)*

Los valores se definen **una sola vez** en `src/styles/tokens.css` como
canales RGB, y Tailwind los consume con `rgb(var(--…) / <alpha-value>)`.

| Token CSS | Clase Tailwind | Hex | Rol |
|---|---|---|---|
| `--color-ink` | `ink` | `#0B1020` | Capa 0: fondo de la página. |
| `--color-ink-2` | `ink-2` | `#10162B` | Capa 1: barra lateral, encabezado, barras fijas, pistas de progreso. |
| `--color-surface` | `surface` | `#171D33` | Capa 2: tarjetas, paneles, tablas, controles. **Siempre con borde `linea`** (frente al fondo solo da 1.14:1). |
| `--color-surface-2` | `surface-2` | `#1F2744` | Capa 3: lo que flota (`Drawer`, `Dialog`, menús, avisos) y el hover de una tarjeta. |
| `--color-linea` | `linea` | `#3A4673` | Bordes de tarjetas y divisores (2.08 sobre `ink`). |
| `--color-linea-fuerte` | `linea-fuerte` | `#6B78A8` | Bordes de **controles** y trazos que hay que leer (`ChordDiagram`): ≥ 3:1 en todas las capas. |
| `--color-primary` | `primary` | `#6257F5` | Violeta brillante: fondo de botón primario, relleno de progreso, ítem activo de la barra lateral. **Nunca texto.** |
| `--color-primary-hover` | `primary-hover` | `#5348E6` | Hover del botón primario (más oscuro: el texto gana contraste). |
| `--color-primary-claro` | `primary-claro` | `#9A94FA` | Violeta legible como texto o trazo: puntos del acorde, categorías, cifras destacadas. |
| `--color-accent` | `accent` | `#B9C8FF` | Lavanda: enlaces, foco (`anillo`), íconos y series de gráficos. |
| `--color-success` | `success` | `#34D399` | **Verde: logro** (completado, aprobado). *(enmienda: antes ámbar)* |
| `--color-suena` | `suena` | `#F5B942` | **Ámbar: la cuerda que suena**, solo en animaciones de cuerdas y en la cuerda del mástil. |
| `--color-danger` | `danger` | `#F7707A` | Errores y acciones destructivas. |
| `--color-muted` | `muted` | `#AEB6D8` | Texto secundario. |
| `--color-paper` | `paper` | `#F5F6FF` | Texto principal. |

> La clase `border` de la configuración original se renombró a `linea` en
> HU-F-301 porque `border` choca con la utilidad homónima de Tailwind
> (`border-border`).

### 2.2 Proporción de uso por pantalla

| Color | Proporción aproximada |
|---|---|
| `ink` / `ink-2` / `surface` / `surface-2` | ~70 % |
| `paper` / `muted` (texto) | ~20 % |
| `primary` | ≤ 8 % — un único botón primario por vista, rellenos de progreso, ítem activo |
| `accent` | ≤ 4 % — enlaces, foco, íconos de tarjeta, series de gráficos |
| `success` | Solo donde hay un logro real |
| `suena` | Solo en la cuerda que suena |

### 2.3 Tipografía

| Rol | Familia | Tamaños (px) | Peso |
|---|---|---|---|
| Títulos (`font-display`) | Baloo 2 | 40 · 32 · 24 · 20 | 600 |
| Texto (`font-sans`) | Inter | 16 (base) · 14 (secundario) | 400 / 500 |
| Datos (`font-mono`) | IBM Plex Mono | 14 · 13 | 400 / 500 |

- Títulos alineados a la izquierda. Longitud de línea de lectura ≤ 68 caracteres.
- Números en tablas: `font-mono tabular-nums`, alineados a la derecha.

### 2.4 Espaciado, radios, sombras, movimiento

| Token | Valor |
|---|---|
| Espaciado | escala de 4 px de Tailwind; secciones separadas por 24–48 px (inicio en retícula) o 48–64 px (lectura) |
| Radio controles | 6 px (`rounded-md`) |
| Radio contenedores | 10 px (token `rounded-caja` definido en `tailwind.config.js`) |
| Sombras | **Una sola**: `shadow-dialogo` para diálogos y menús flotantes. Las tarjetas se separan con borde, no con sombra. |
| Duración | 120 ms (hover) · 200 ms (paneles) |
| Movimiento con significado | Vibración de cuerda al completar o enviar (`Fretboard`, `GuitarraAcustica`). Siempre con `prefers-reduced-motion`. |

## 3. Contraste verificado

Referencia: **WCAG 2.2 nivel AA** (4.5:1 texto normal, 3:1 texto grande y componentes). Cálculo
sobre los colores puros de la paleta de HU-F-320; el detalle por estado está en el
[informe AUD-2026-01](../auditorias/AUD-2026-01-interfaz-y-contraste.md).

| Texto / elemento | `ink` | `ink-2` | `surface` | `surface-2` | Uso permitido |
|---|---|---|---|---|---|
| `paper` | 17.6 | 16.7 | 15.5 | 13.6 | Todo texto |
| `muted` | 9.5 | 9.0 | 8.3 | 7.3 | Todo texto |
| `accent` | 11.5 | 10.9 | 10.1 | 8.9 | Enlaces, foco, íconos, texto |
| `primary-claro` | 7.2 | 6.8 | 6.3 | 5.6 | Texto y trazos violeta |
| `success` | 9.9 | 9.3 | 8.7 | 7.6 | Texto y marcas de logro |
| `suena` | 10.7 | 10.2 | 9.5 | 8.3 | Cuerda que suena |
| `danger` | 6.8 | 6.5 | 6.0 | 5.3 | Texto de error |
| `linea-fuerte` | 4.4 | 4.2 | 3.9 | 3.4 | Bordes de controles (1.4.11) |
| `linea` | 2.1 | — | 1.8 | 1.6 | Bordes de tarjetas y divisores (decorativos) |
| `primary` | **3.8** | 3.6 | **3.3** | — | ❌ **Nunca como texto** (no llega a 4.5). Fondo de botón (texto `paper` encima: 4.64; en hover `primary-hover`: 5.68) y relleno de progreso sobre pista `ink-2` (3.59). |

Reglas que se mantienen de HU-F-314:
- Puntos de dedos del `ChordDiagram` en `primary-claro` con número en `ink`.
- *Placeholder* en `muted/70` (4.77 sobre `surface`); controles deshabilitados sin opacidad.
- Enlaces dentro de una frase siempre subrayados (1.4.1).
- Barras fijas marcadas con `data-fijo="arriba|abajo"` para que el foco no quede tapado (2.4.11).

## 4. Componentes clave con identidad

| Componente | Descripción |
|---|---|
| `Cuerda` (`shared/music`) | Barra de progreso: pista `ink-2`, relleno degradado `primary → primary-claro`; completado → `success/60 → success`. Grosores 1–5 (las tarjetas usan 4 = 6 px). `role="progressbar"` y `aria-valuenow`. |
| `TrasteDivider` | Separador horizontal de 1 px con un pequeño número de traste en mono a la izquierda (opcional). |
| `MarcaEstado` | Símbolo `×` / `○` / `●` con texto accesible ("Bloqueado", "Disponible", "Aprobado"). |
| `ChordDiagram` | Diagrama del acorde; trazos `linea-fuerte`, dedos `primary-claro`. |
| `Fretboard` | Animación de cuerdas que suenan en ámbar (`suena`). |
| `Tablatura` | Fila de datos en mono con separadores verticales tipo compás: `♩ 60 BPM │ 4/4 │ 20 min`. |
| `Boca` | Anillo de progreso con la forma de la **boca de la guitarra** (HU-F-315): pista `ink-2`, arco `primary` (verde al 100 %), cifra en mono al centro. Uno por pantalla, solo para el avance global. |
| `TarjetaCifra` *(enmienda)* | Tarjeta de una cifra real: ícono lucide en un recuadro `ink-2` (decorativo, `aria-hidden`), etiqueta, cifra en mono `hecho / total` y `Cuerda`. Máximo 4 por fila; **nunca** una cifra inventada ni un dato que la API no da. |
| `TeselaAcorde` | Acorde como objeto: `surface` con borde `linea`, sin sombra. |
| Ilustraciones (`shared/music/ilustraciones/`) | SVG propios: guitarra, mano en acorde, atril, estuche (HU-F-316). |
| Fotografías (`src/assets/fotos/`) *(enmienda)* | Fotos de guitarra locales con licencia registrada (HU-F-321). |

## 5. Patrones de pantalla

### Estudiante *(enmienda: maqueta aprobada, HU-F-315 y HU-F-318)*
- **Barra lateral** en `ink-2` (escritorio): Inicio · Ruta · Ejercicios · Acordes · Mi progreso; ítem activo con fondo `primary`. En móvil, barra inferior con los mismos destinos.
- **Inicio** (`/` con sesión): encabezado con saludo, nivel y foto de guitarra (texto nunca encima de la foto sin un fondo que garantice 4.5:1) junto a la `Boca` del avance global; fila de `TarjetaCifra` (lecciones, bloques, días con avance); "Continuar aprendiendo" con el siguiente paso y su único botón primario; progreso por bloques; evolución por día; bloques de la ruta con su estado; actividad reciente. Solo datos reales; si falta un dato, estado vacío.
- **Ruta** (`/ruta`; sin sesión también en `/`): mástil vertical con el bloque seleccionado al lado; en móvil, tira horizontal desplazable arriba.
- **Lección**: lectura editorial (una columna ≤ 68 caracteres), acordes en teselas, `Tablatura` con duración y nivel, acción "Marcar como practicada" al final.
- **Evaluación**: una pregunta por pantalla en móvil, todas en escritorio; opciones como filas completas seleccionables; resultado con `Fretboard` vibrando si aprueba.

### Docente ("Atril")
- Barra lateral fija con: Resumen · Cursos · Contenido · Evaluaciones.
- **Resumen**: franja de cifras + "Estudiantes sin actividad en 14 días" como lista accionable.
- **Tablas densas**: filas de 44 px, cabecera fija, orden por columna, `Cuerda` fina para el avance, filtros en la URL.
- **Edición**: panel lateral (drawer) sobre la tabla, no páginas nuevas para editar campos simples.

## 6. Anti-patrones prohibidos (matices genéricos de IA)

| ❌ No | ✅ En su lugar |
|---|---|
| Degradados en fondos, textos, botones o decoración | Colores planos de la paleta. **Excepciones acotadas** *(enmienda HU-F-322)*: (1) relleno de `Cuerda` y arco de `Boca`: `primary → primary-claro`, o `success/60 → success` al completar, con ambos extremos ≥ 3:1 frente a la pista; (2) área bajo la curva de un gráfico: `primary` 55 % → 0 %, decorativa (el dato es la línea `primary-claro`, 6.3:1); (3) foto que se funde con su tarjeta mediante máscara, sin texto encima. |
| Manchas difuminadas (`blur-3xl`, "blobs"), brillos y `backdrop-blur` | Bordes `linea` y capas sólidas. Una foto puede desvanecerse en su tarjeta (excepción 3 de arriba), nunca desenfocarse detrás de un texto. |
| *Glassmorphism* (`backdrop-blur`, `bg-white/10`) | `surface` sólido. |
| Grilla de tarjetas con ícono + título + párrafo de marketing | `TarjetaCifra` solo con una cifra real; si no hay dato, la tarjeta no existe. |
| Tarjetas con borde izquierdo de color como único recurso | Borde completo `linea` y espacio. |
| Emojis como íconos, ícono de destellos (✨ `Sparkles`), cohetes 🚀 | `MarcaEstado`, símbolos musicales, lucide para acciones y para el ícono de `TarjetaCifra`. |
| Textos de marketing vacíos y frases motivacionales de relleno ("La práctica constante hace la diferencia", "Desbloquea tu potencial") | Voz de profesor de música, concreta: "Hoy: cambio de Em a Am. 10 minutos." |
| *Hero* centrado con título gigante + dos botones | Encabezado alineado a la izquierda con nombre, nivel y una frase concreta; la acción va en "Continuar aprendiendo". |
| Sombras grandes en todo, `rounded-2xl/3xl` en todo | Una sombra, dos radios. |
| Animación de entrada (fade-up) en cada elemento | Movimiento solo con significado (cuerda que suena). |
| Píldoras "Nuevo" / "Pro" decorativas | Píldoras de estado solo con estado real (Completado, En curso, Pendiente), con texto. |
| Fotos de *stock* sin licencia, por URL externa o que simulen el contenido de una lección concreta | Fotos locales con licencia registrada (HU-F-321), por tipo de contenido. |
| Gráficos decorativos o con datos de ejemplo | Un gráfico solo con datos reales, con alternativa en tabla; sin datos, estado vacío (HU-F-317). |
| Enlaces a funciones que no existen (Logros, Perfil, Notificaciones) | Se agregan cuando exista su HU. |
| Tablero docente con 4 tarjetas KPI y gráfico de dona | Franja de cifras + lista accionable. |

## 7. Voz y microcopia

- Tuteo, frases cortas, verbos de práctica musical: *afinar, tocar, practicar, repetir, sonar*.
- Errores: qué pasó + qué hacer ("El código no existe o el curso ya cerró. Pídele a tu docente un código nuevo.").
- Estados vacíos con siguiente paso concreto ("Aún no tienes estudiantes. Comparte el código **K7M2Q9XA** con tu grupo.").
- Sin signos de exclamación dobles ni mayúsculas sostenidas.
- Saludo del inicio: "Hola, Ana." + un dato concreto ("Vas en el bloque 2 · Cambio entre Em y Am.").
