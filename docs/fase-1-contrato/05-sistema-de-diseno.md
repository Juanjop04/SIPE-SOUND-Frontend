# 05 · Sistema de diseño · "Diapasón"

> Toda pantalla nueva o rediseñada cumple este documento. Su objetivo es que
> SIPE-SOUND se reconozca como **una herramienta de música hecha para el aula**,
> no como una plantilla genérica generada por IA.

## 1. Concepto

La interfaz toma su lenguaje de la **anatomía de la guitarra** y de la
**notación que el estudiante ya está aprendiendo** (diagramas de acordes y
tablatura). No se decora con música: se **organiza** como música.

| Elemento de la guitarra | Uso en la interfaz |
|---|---|
| **Mástil** | Eje vertical de la ruta de aprendizaje. Los bloques son trastes que se recorren de arriba abajo. |
| **Trastes** | Divisores: líneas finas de 1 px (`linea`) en lugar de tarjetas con sombra. |
| **Cuerdas** | Barras de progreso: una línea de 2–3 px que pasa de lila (`paper` al 55 %) a **ámbar** (`success`) cuando "suena" (completado). Es la misma lógica de color que ya usa la animación de `AuthLayout`. |
| **Marcadores del mástil** (puntos en trastes 3, 5, 7, 9, 12) | Hitos de la ruta: aparecen solo en bloques que cierran nivel. |
| **Símbolos del diagrama de acorde** | Estados: `×` (cuerda muda) = bloqueado · `○` (cuerda al aire) = disponible · `●` ámbar = aprobado. Coinciden con `ChordDiagram`, que el estudiante ya lee. |
| **Tablatura** | Datos numéricos (BPM, compás, %, fechas, puntajes) en **IBM Plex Mono**, alineados como una tablatura. |
| **Atril** | Nombre visual del panel docente: superficie de trabajo densa y ordenada, como una partitura sobre el atril. |

## 2. Tokens

### 2.1 Color (paleta actual, sin cambios de tono)

Los valores se definen **una sola vez** en `src/styles/tokens.css` como
canales RGB, y Tailwind los consume con `rgb(var(--…) / <alpha-value>)`.

| Token CSS | Clase Tailwind | Hex | Rol |
|---|---|---|---|
| `--color-ink` | `ink` | `#1B1030` | Fondo de la aplicación. |
| `--color-ink-2` *(derivado)* | `ink-2` | `#221640` | Capa intermedia (barra lateral, filas alternas). |
| `--color-surface` | `surface` | `#2A1B4D` | Superficies elevadas (paneles, diálogos). |
| `--color-linea` | `linea` | `#4A3470` | Trastes y divisores **decorativos**. |
| `--color-linea-fuerte` *(derivado)* | `linea-fuerte` | `#7A66A3` | Bordes de **controles** (inputs, selects) — cumple 3:1. |
| `--color-primary` | `primary` | `#7C3AED` | Acción principal (fondo de botón). |
| `--color-primary-hover` | `primary-hover` | `#6B2FD1` | Hover de acción principal. |
| `--color-primary-claro` *(derivado)* | `primary-claro` | `#A78BFA` | Texto violeta sobre fondo oscuro cuando hace falta. |
| `--color-accent` | `accent` | `#E29DE0` | Enlaces, foco (`anillo`), selección actual. |
| `--color-success` | `success` | `#F5B942` | **Solo logro**: completado, aprobado, "suena". |
| `--color-danger` | `danger` | `#F2545B` | Errores y acciones destructivas. |
| `--color-muted` | `muted` | `#C9BEE0` | Texto secundario. |
| `--color-paper` | `paper` | `#F3EEFB` | Texto principal. |

> La clase `border` de la configuración actual se renombra a `linea` en
> HU-F-301 porque `border` choca con la utilidad homónima de Tailwind
> (`border-border`).

### 2.2 Proporción de uso por pantalla

| Color | Proporción aproximada |
|---|---|
| `ink` / `ink-2` / `surface` | ~70 % |
| `paper` / `muted` (texto) | ~20 % |
| `primary` | ≤ 8 % — un único botón primario por vista |
| `accent` | ≤ 2 % |
| `success` | Solo donde hay un logro real |

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
| Espaciado | escala de 4 px de Tailwind; secciones separadas por 48–64 px |
| Radio controles | 6 px (`rounded-md`) |
| Radio contenedores | 10 px (token `rounded-caja` definido en `tailwind.config.js`) |
| Sombras | **Una sola**: `shadow-dialogo` para diálogos y menús flotantes. Nada más tiene sombra. |
| Duración | 120 ms (hover) · 200 ms (paneles) |
| Movimiento con significado | Vibración de cuerda al completar o enviar (ya existe en `Fretboard`). Siempre con `prefers-reduced-motion`. |

## 3. Contraste verificado

Cálculo WCAG 2.1 sobre la paleta real:

| Texto / elemento | Sobre `ink` | Sobre `surface` | Uso permitido |
|---|---|---|---|
| `paper` | 15.8 | 13.5 | Todo texto |
| `muted` | 10.3 | 8.8 | Todo texto |
| `accent` | 8.7 | 7.4 | Enlaces, foco, texto |
| `success` | 10.2 | 8.7 | Texto y marcas de logro |
| `danger` | 5.3 | 4.6 | Texto de error (AA) |
| `primary-claro` | 6.6 | 5.7 | Texto violeta |
| `primary` | **3.2** | **2.7** | ❌ **Nunca como color de texto ni de foco.** Solo fondo de botón (texto `paper` encima: 5.0). |
| `linea-fuerte` | 3.7 | 3.1 | Bordes de controles (WCAG 1.4.11) |
| `linea` | 1.7 | 1.5 | Solo decorativo (trastes) |

Consecuencias directas sobre el código actual:
- `hover:text-primary` en enlaces de `Header.jsx` → cambiar a `hover:text-accent`.
- `focus:border-primary` en `input.jsx` → anillo `accent`.
- `border-border` en inputs → `border-linea-fuerte`.

## 4. Componentes clave con identidad

| Componente (`shared/music/`) | Descripción |
|---|---|
| `Cuerda` | Barra de progreso de una línea. Props: `valor` (0–100), `grosor` (1–3), `sonando` (bool → ámbar). Con `role="progressbar"` y `aria-valuenow`. |
| `TrasteDivider` | Separador horizontal de 1 px con un pequeño número de traste en mono a la izquierda (opcional). Sustituye a `<hr>` y a las tarjetas apiladas. |
| `MarcaEstado` | Símbolo `×` / `○` / `●` con texto accesible ("Bloqueado", "Disponible", "Aprobado"). |
| `ChordDiagram` | Ya existe; se mantiene y se tipa. |
| `Fretboard` | Ya existe (animación de cuerdas); se extrae de `AuthLayout` y se reutiliza al aprobar una evaluación. |
| `Tablatura` | Fila de datos en mono con separadores verticales tipo compás: `♩ 60 BPM │ 4/4 │ 20 min`. |

## 5. Patrones de pantalla

### Estudiante
- **Ruta (inicio)**: columna izquierda con el mástil vertical (bloques como trastes, `MarcaEstado` en cada uno, `Cuerda` de avance a lo largo); columna derecha con el bloque seleccionado: lecciones como lista numerada en mono, ejercicios, y botón único "Presentar evaluación". En móvil el mástil se vuelve una tira horizontal desplazable arriba.
- **Lección**: lectura editorial (una columna ≤ 68 caracteres), diagramas de acordes en una fila, `Tablatura` con duración y nivel, acción "Marcar como practicada" al final.
- **Evaluación**: una pregunta por pantalla en móvil, todas en escritorio; opciones como filas completas seleccionables (no radios diminutos); resultado con `Fretboard` vibrando si aprueba.

### Docente ("Atril")
- Barra lateral fija con: Resumen · Cursos · Contenido · Evaluaciones.
- **Resumen**: una franja horizontal de cifras en mono separadas por trastes (no tarjetas con íconos), seguida de "Estudiantes sin actividad en 14 días" como lista accionable.
- **Tablas densas**: filas de 44 px, cabecera fija, orden por columna, `Cuerda` fina para el avance, filtros en la URL.
- **Edición**: panel lateral (drawer) sobre la tabla, no páginas nuevas para editar campos simples.

## 6. Anti-patrones prohibidos (matices genéricos de IA)

| ❌ No | ✅ En su lugar |
|---|---|
| Degradados violeta → rosa en fondos, textos o botones | Colores planos de la paleta. |
| Manchas difuminadas (`blur-3xl`, "blobs") — hoy existe una en `AuthLayout` | El propio `Fretboard` como elemento gráfico. |
| *Glassmorphism* (`backdrop-blur`, `bg-white/10`) | `surface` sólido. |
| Grilla de 3 tarjetas con ícono dentro de un círculo + título + párrafo | Lista o tabla con jerarquía tipográfica. |
| Tarjetas con borde izquierdo de color como único recurso (hoy `Card` usa `border-l-4`) | `TrasteDivider` y espacio en blanco. |
| Emojis como íconos, ícono de destellos (✨ `Sparkles`), cohetes 🚀 | `MarcaEstado`, símbolos musicales, lucide solo para acciones (editar, borrar, buscar). |
| Textos de marketing vacíos: "Desbloquea tu potencial", "Bienvenido de nuevo 👋", "Lleva tu música al siguiente nivel" | Voz de profesor de música, concreta: "Hoy: cambio de Em a Am. 10 minutos." |
| *Hero* centrado con título gigante + subtítulo + dos botones | Contenido útil desde el primer pantallazo (la ruta). |
| Sombras grandes en todo, `rounded-2xl/3xl` en todo | Una sombra, dos radios. |
| Animación de entrada (fade-up) en cada elemento | Movimiento solo con significado (cuerda que suena). |
| Píldoras "Nuevo" / "Pro" decorativas | Sin insignias que no informen algo real. |
| Ilustraciones 3D o de stock | Diagramas y elementos de la guitarra dibujados en SVG. |
| Tablero docente con 4 tarjetas KPI y gráfico de dona | Franja de cifras + lista accionable. |

## 7. Voz y microcopia

- Tuteo, frases cortas, verbos de práctica musical: *afinar, tocar, practicar, repetir, sonar*.
- Errores: qué pasó + qué hacer ("El código no existe o el curso ya cerró. Pídele a tu docente un código nuevo.").
- Estados vacíos con siguiente paso concreto ("Aún no tienes estudiantes. Comparte el código **K7M2Q9XA** con tu grupo.").
- Sin signos de exclamación dobles ni mayúsculas sostenidas.
