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

Referencia: **WCAG 2.2 nivel AA** (4.5:1 texto normal, 3:1 texto grande y componentes). La tabla
es el cálculo sobre los colores puros; HU-F-314 revalida las combinaciones reales (opacidades,
estados hover/foco/deshabilitado, `ink-2`) y registra aquí cada ajuste de luminosidad.

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
| `Cuerda` (`shared/music`) | Barra de progreso: pista `ink-2`, relleno `primary`; `completado` → `success`. `role="progressbar"` y `aria-valuenow`. |
| `TrasteDivider` | Separador horizontal de 1 px con un pequeño número de traste en mono a la izquierda (opcional). |
| `MarcaEstado` | Símbolo `×` / `○` / `●` con texto accesible ("Bloqueado", "Disponible", "Aprobado"). |
| `ChordDiagram` | Diagrama del acorde; trazos `linea-fuerte`, dedos `primary-claro`. |
| `Fretboard` | Animación de cuerdas que suenan en ámbar (`suena`). |
| `Tablatura` | Fila de datos en mono con separadores verticales tipo compás: `♩ 60 BPM │ 4/4 │ 20 min`. |
| `Boca` | Anillo de progreso con la forma de la **boca de la guitarra** (HU-F-315): cifra en mono al centro, arco ámbar cuando suena el 100 %. Es el **único indicador circular** permitido y se usa una vez por pantalla, solo para el avance global del estudiante. `role="progressbar"`. |
| Ilustraciones (`shared/music/ilustraciones/`) | SVG propios en trazo de línea con tokens: guitarra acústica, mano en acorde, atril, estuche (HU-F-316). El texto nunca va encima de una ilustración. |

## 5. Patrones de pantalla

### Estudiante
- **Inicio** (`/` con sesión, HU-F-315): saludo con el nombre y una frase concreta, **siguiente paso** con la única acción primaria, `Boca` + franja de cifras del avance, ruta resumida por bloques (filas como trastes, no tarjetas) y lo último que hizo. Solo datos reales; si falta un dato, estado vacío.
- **Ruta** (`/ruta`; sin sesión también en `/`): columna izquierda con el mástil vertical (bloques como trastes, `MarcaEstado` en cada uno, `Cuerda` de avance a lo largo); columna derecha con el bloque seleccionado: lecciones como lista numerada en mono, ejercicios, y botón único "Presentar evaluación". En móvil el mástil se vuelve una tira horizontal desplazable arriba.
- **Lección**: lectura editorial (una columna ≤ 68 caracteres), diagramas de acordes en una fila, `Tablatura` con duración y nivel, acción "Marcar como practicada" al final.
- **Evaluación**: una pregunta por pantalla en móvil, todas en escritorio; opciones como filas completas seleccionables (no radios diminutos); resultado con `Fretboard` vibrando si aprueba.

### Docente ("Atril")
- Barra lateral fija con: Resumen · Cursos · Contenido · Evaluaciones.
- **Resumen**: franja de cifras + "Estudiantes sin actividad en 14 días" como lista accionable.
- **Tablas densas**: filas de 44 px, cabecera fija, orden por columna, `Cuerda` fina para el avance, filtros en la URL.
- **Edición**: panel lateral (drawer) sobre la tabla, no páginas nuevas para editar campos simples.

## 6. Anti-patrones prohibidos (matices genéricos de IA)

| ❌ No | ✅ En su lugar |
|---|---|
| Degradados en fondos, textos, botones **o rellenos de gráficos** | Colores planos de la paleta. |
| Manchas difuminadas (`blur-3xl`, "blobs") y brillos decorativos | Bordes `linea` y capas sólidas. |
| *Glassmorphism* (`backdrop-blur`, `bg-white/10`) | `surface` sólido. |
| Grilla de 3 tarjetas con ícono dentro de un círculo + título + párrafo | Lista o tabla con jerarquía tipográfica. |
| Tarjetas con borde izquierdo de color como único recurso (hoy `Card` usa `border-l-4`) | `TrasteDivider` y espacio en blanco. |
| Emojis como íconos, ícono de destellos (✨ `Sparkles`), cohetes 🚀 | `MarcaEstado`, símbolos musicales, lucide solo para acciones (editar, borrar, buscar). |
| Textos de marketing vacíos: "Desbloquea tu potencial", "Bienvenido de nuevo 👋", "Lleva tu música al siguiente nivel" | Voz de profesor de música, concreta: "Hoy: cambio de Em a Am. 10 minutos." |
| *Hero* centrado con título gigante + subtítulo + dos botones | Encabezado alineado a la izquierda con el nombre, una frase concreta y **una** acción (el siguiente paso), junto a una ilustración propia. |
| Sombras grandes en todo, `rounded-2xl/3xl` en todo | Una sombra, dos radios. |
| Animación de entrada (fade-up) en cada elemento | Movimiento solo con significado (cuerda que suena). |
| Píldoras "Nuevo" / "Pro" decorativas | Sin insignias que no informen algo real. |
| Ilustraciones 3D, de *stock* o fotografías de bancos de imágenes | Diagramas y elementos de la guitarra dibujados en SVG (HU-F-316). Fotografías: fuera de esta fase (peso y licencias). |
| Gráficos decorativos o con datos de ejemplo | Un gráfico solo con datos reales, con alternativa en tabla; sin datos, estado vacío (HU-F-317). |
| Tablero docente con 4 tarjetas KPI y gráfico de dona | Franja de cifras + lista accionable. |

## 7. Voz y microcopia

- Tuteo, frases cortas, verbos de práctica musical: *afinar, tocar, practicar, repetir, sonar*.
- Errores: qué pasó + qué hacer ("El código no existe o el curso ya cerró. Pídele a tu docente un código nuevo.").
- Estados vacíos con siguiente paso concreto ("Aún no tienes estudiantes. Comparte el código **K7M2Q9XA** con tu grupo.").
- Sin signos de exclamación dobles ni mayúsculas sostenidas.
- Saludo del inicio: "Hola, Ana." + un dato concreto ("Vas en el bloque 2 · Cambio entre Em y Am."), no "Bienvenido de nuevo 👋".
