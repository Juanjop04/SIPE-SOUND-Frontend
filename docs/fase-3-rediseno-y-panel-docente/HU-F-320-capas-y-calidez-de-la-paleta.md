# HU-F-320 · Dar profundidad y calidez a la paleta

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-314 (contraste auditado) |
| Rama | `hu/HU-F-320-capas-y-calidez` |

## Historia
**Como** persona que entra a SIPE-SOUND para aprender guitarra
**quiero** distinguir de un vistazo el menú, el contenido y lo que puedo tocar
**para** que la plataforma se sienta viva y me invite a explorar.

## Contexto
Capturas de `/acordes`, `/ejercicios` y `/ejercicios/1` (revisión del 2026-10-23): todo se ve sobre
un mismo fondo violeta oscuro.

| Problema | Causa | Medida |
|---|---|---|
| El encabezado se funde con la página | Mismo fondo `ink`, separados por una línea `linea` | Línea 1.73:1 frente al fondo |
| Acordes, tabla y panel lateral "pintados" sobre la página | `ink`, `ink-2` y `surface` casi iguales; el sistema prohibía contenedores | `ink-2`/`ink` 1.08:1 · `surface`/`ink` 1.17:1 |
| Selects e inputs parecen fondo | Fondo de control = `ink` | Solo el borde los separa |
| Todo es violeta | Un solo tono para fondo, líneas, paneles, texto secundario y puntos | Sin un color cálido que invite a explorar |

**Decisión del equipo** (comparación visual con los componentes reales): opción C, *capas de
profundidad + madera*.

## Alcance
**Incluye**

### 1. Tokens (`src/styles/tokens.css`, `tailwind.config.js`)

| Token | Antes | Después | Rol |
|---|---|---|---|
| `ink` | `#1B1030` | `#120A21` | Fondo de la página (más profundo: el escenario). |
| `ink-2` | `#221640` | `#1E1436` | Encabezado, barra lateral, barra inferior móvil, filas alternas. |
| `surface` | `#2A1B4D` | `#2C1F52` | Contenedores de lo que se toca o se lee: teselas de acordes, tablas, controles, panel del metrónomo. |
| `surface-2` | — | `#35265E` | **Nuevo.** Lo que flota: `Drawer`, `Dialog`, menú de cuenta, avisos. |
| `linea` | `#4A3470` | `#5A4585` | Divisores (2.41:1 sobre `ink`). |
| `linea-fuerte` | `#7A66A3` | `#8E7BBA` | Bordes de controles (5.22 sobre `ink`, 3.58 sobre `surface-2`). |
| `madera` | — | `#E8A56F` | **Nuevo.** Cobre del palisandro: **lo que se explora** (nombres de acordes, etiquetas de categoría del catálogo). ≤ 5 % por pantalla. Nunca logro (eso es `success`), nunca acción (eso es `primary`). |

Sin cambio: `primary`, `primary-hover`, `primary-claro`, `accent`, `success`, `danger` (`#F56C72`,
HU-F-314), `muted`, `paper`.

### 2. Aplicación en lo que ya existe

| Dónde | Cambio |
|---|---|
| `EstudianteLayout` | Encabezado a todo el ancho en `ink-2` con borde inferior `linea` (sustituye al `TrasteDivider`). Barra inferior móvil en `ink-2`. |
| `DocenteLayout` | Encabezado móvil en `ink-2`. |
| `shared/music/TeselaAcorde` (nuevo) | Tesela `surface` + borde `linea` + `rounded-caja`, diagrama y nombre en `madera`. La usan `/acordes` (botón, hover con borde `accent`) y la lección. |
| `/acordes` | Etiquetas de grupo ("Mayores") en `madera`. Nombre del acorde en el `Drawer` en `madera`. |
| `shared/ui/Table` | Contenedor `rounded-caja` con borde `linea`; cabecera `surface`; filas alternas `ink-2`; hover `surface`. |
| `claseControl`, `ControlBpm` | Fondo `surface` (el control se ve como objeto, no como hueco). |
| `PanelModal`, `MenuCuenta`, `Aviso` | `surface-2`. |
| `MensajeError` | Fondo `ink-2` sólido y borde `danger` (6.02:1); la opacidad `danger/10` bajaba a 4.44 sobre `surface`. |
| Metrónomo | Columna en un panel `surface`; casillas de tiempo vacías en `ink-2`. |
| `Skeleton` | `surface` (visible sobre el fondo nuevo). |
| `Button` fantasma, filas clicables, opciones del menú | Hover `surface` (con `ink-2` en el encabezado ya no se notaría). |

### 3. Sistema de diseño
`05-sistema-de-diseno.md`: tabla de tokens, proporciones (§2.2), contraste (§3) y la regla de
contenedores: **un contenedor sólido `surface` para lo que se toca** (acorde, ejercicio, metrónomo,
tabla) está permitido; siguen prohibidas las sombras, el borde izquierdo de color y la grilla de
tarjetas con ícono en círculo.

**No incluye**: tema claro, cambios de composición de pantallas (HU-F-315…F-318), ilustraciones
(cambian solas por usar tokens).

## Contraste (WCAG 2.2 AA, calculado)

| Combinación | Relación |
|---|---|
| `paper` / `muted` sobre `ink` | 16.89 / 10.93 |
| `muted` sobre `ink-2` · `surface` · `surface-2` | 9.87 · 8.37 · 7.50 |
| `madera` sobre `ink` · `ink-2` · `surface` · `surface-2` | 9.20 · 8.31 · 7.05 · 6.32 |
| `danger` sobre `ink-2` · `surface` · `surface-2` | 6.02 · 5.10 · 4.57 |
| `primary-claro` sobre `surface` · `surface-2` | 5.42 · 4.85 |
| `linea-fuerte` sobre `ink` · `ink-2` · `surface` · `surface-2` | 5.22 · 4.71 · 3.99 · 3.58 |
| `Cuerda` sin sonar (`paper/55`) frente a su pista `linea` | 3.35 |
| `success` frente a `linea` | 4.53 |
| *Placeholder* `muted/70` sobre `surface` | 4.86 |
| Capas: `ink-2`/`ink` · `surface`/`ink` · `surface-2`/`ink` | 1.11 · 1.31 · 1.46 (más borde `linea` entre capas) |

## Prompt de ejecución
```text
Ejecuta HU-F-320 en SIPE-SOUND-FULLSTACK. Solo tokens y clases de color o
contenedor: no cambies la composición de ninguna pantalla. Recalcula la
matriz de contraste del informe AUD-2026-01 con los valores nuevos y
añade una sección "Después de HU-F-320". madera no puede aparecer en
botones, enlaces ni estados de logro.
```

## Criterios de aceptación
```gherkin
Escenario: Encabezado separado
  Cuando abro cualquier pantalla del estudiante
  Entonces el encabezado se distingue del contenido por su fondo y su borde

Escenario: Lo que se toca se ve como objeto
  Cuando abro /acordes
  Entonces cada acorde está en una tesela con su nombre en color madera
  Y al pasar el puntero o enfocar, el borde de la tesela cambia a accent

Escenario: Lo que flota está por encima
  Cuando abro el panel de un acorde
  Entonces el panel usa surface-2 y se distingue de la página

Escenario: Sin regresiones de contraste
  Entonces todas las combinaciones de la tabla cumplen 4.5:1 en texto y 3:1 en componentes
```

## Verificación manual
`/acordes`, `/ejercicios`, `/ejercicios/:id`, una lección, la evaluación, *Mi progreso* y el atril a
1280 y 375 px; capturas antes/después en el PR.

## Definición de hecho específica
- [ ] Sin hex fuera de `tokens.css`.
- [ ] Informe AUD-2026-01 con la sección "Después de HU-F-320".
- [ ] Revisión de anti-patrones declarada en el PR.
