# AUD-2026-01 · Interfaz, contraste y legibilidad

| Campo | Valor |
|---|---|
| HU | [HU-F-314](../fase-3-rediseno-y-panel-docente/HU-F-314-auditoria-de-interfaz-y-contraste.md) |
| Fecha | 2026-10-23 |
| Base | `develop` en `d11e874` (incluye HU-F-301 … HU-F-308 y HU-F-313) |
| Referencia | WCAG 2.2 nivel AA |

## 1. Qué se ejecutó y qué no

| Comprobación | Estado | Resultado |
|---|---|---|
| Matriz de contraste (script de luminancia relativa WCAG con composición alfa, sobre `src/styles/tokens.css`) | ✅ ejecutada | 54 combinaciones: 11 fallaban, 9 corregidas, 2 exentas o mitigadas (§3). |
| axe-core 4.10.3 (`npx @axe-core/cli`, etiquetas `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`) en `/login`, `/registro`, `/terminos`, `/`, `/acordes`, `/ejercicios` | ✅ ejecutada | Antes: 1 violación (`link-in-text-block` en `/registro`). Después: 0 en las seis. |
| axe-core en pantallas con sesión (lección, evaluación, mi progreso, atril) | ⬜ **no ejecutada** | El backend no estaba levantado durante la auditoría; sin API esas pantallas solo muestran su estado de error. Pendiente para el equipo con una cuenta de estudiante y una docente. |
| Lighthouse (Accesibilidad) | ⬜ **no ejecutada** | Requiere Chrome con interfaz y datos reales; se repite en HU-F-312. |
| Recorrido con teclado, Narrador/NVDA, zoom 200 % y ancho 320 px | ⬜ **no ejecutada por el agente** | Verificación manual del PR (contrato R11). |
| Capturas antes/después | ⬜ pendiente | Las toma quien verifica el PR. |

> En las páginas públicas probadas sin backend, axe evaluó también los estados de error y de carga
> (`MensajeError`, `Skeleton`), que es lo que el visitante ve si la API no responde.

## 2. Hallazgos de experiencia

Severidad: **Crítico** impide usar una función · **Alto** afecta mucho la lectura o la tarea ·
**Medio** inconsistencia visual o de navegación · **Bajo** refinamiento.

| ID | Sev. | Pantalla · componente | Hallazgo | Mejora | Resuelve |
|---|---|---|---|---|---|
| C-1 | Crítico | Ruta · `GET /ruta` | Con la base sin las migraciones 0015–0017, `/ruta` responde 500 y la pantalla inicial solo muestra el error. No es un defecto de la interfaz, pero impide usarla. | Aplicar las migraciones (decisión del equipo; 0017 es destructiva aprobada). | Equipo · backend |
| A-1 | Alto | Lección, acordes, editor · `shared/music/ChordDiagram.tsx` | Cuerdas y trastes del diagrama en `linea`: 1.73 sobre `ink` y 1.48 sobre `surface`. Son el dato esencial para leer el acorde. | `stroke-linea-fuerte` (3.66 / 3.12). | ✅ esta HU |
| A-2 | Alto | `ChordDiagram` en paneles (`SelectorAcordes`, vista previa) | Puntos de dedos `primary` sobre `surface`: 2.70. | `fill-primary-claro` (5.66) y número de dedo en `ink` (6.63). | ✅ esta HU |
| A-3 | Alto | `MensajeError` dentro de `Drawer`/`Dialog` · `shared/ui/Estados.tsx` | Texto `danger` sobre `danger/10` compuesto con `surface`: 4.05. `danger` sobre `surface` quedaba al límite (4.55). | Token `danger` +5 % de luminosidad, mismo tono: `#F2545B` → `#F56C72` (4.64 / 5.34). | ✅ esta HU |
| A-4 | Alto | Ruta móvil (tira del mástil fija), editor de contenido (barra de acciones fija), navegación inferior móvil | El elemento enfocado puede quedar debajo de una barra fija (WCAG 2.4.11, nuevo en 2.2). | `scroll-padding` en `styles/index.css` guiado por `data-fijo="arriba|abajo"`. | ✅ esta HU |
| A-5 | Alto | Registro, inicio de sesión, éxito del registro, lección y ejercicio sin sesión, acción del bloque · enlaces dentro de una frase | El enlace se distinguía solo por color: `accent` sobre texto `muted` = 1.18 (WCAG 1.4.1; axe `link-in-text-block`). | Enlaces en texto siempre subrayados (`underline underline-offset-2`). Los enlaces sueltos (menús, tablas) no cambian. | ✅ esta HU |
| A-6 | Alto | Después de iniciar sesión · `RutaPage` | El estudiante aterriza en la ruta: no ve cuánto lleva ni cuál es el siguiente paso sin elegir un bloque o ir a *Mi progreso*. | Inicio del estudiante. | HU-F-315 |
| M-1 | Medio | `Input`, `Textarea` · `shared/ui/claseControl.ts` | *Placeholder* `muted/60`: 4.42. | `muted/70` (5.58). | ✅ esta HU |
| M-2 | Medio | Metrónomo · `Metronomo.tsx` | Pista "espacio" con `opacity-80` sobre el botón primario: 3.75. | Sin opacidad (5.00); se diferencia por la fuente mono pequeña. | ✅ esta HU |
| M-3 | Medio | Controles deshabilitados · `claseControl.ts` | `opacity-50` dejaba el borde en 1.83: el control parecía no existir. | Deshabilitado = `bg-ink-2 text-muted` con borde `linea-fuerte` intacto (3.66). | ✅ esta HU |
| M-4 | Medio | Mi progreso · `MiniLineaEvolucion.tsx` | La línea de aprobación (umbral de 80 %) en `linea`: 1.73. | `stroke-linea-fuerte` (3.66). | ✅ esta HU |
| M-5 | Medio | Lección · `CierreLeccion.tsx` | Al marcar una lección como practicada no hay "siguiente lección": el estudiante vuelve a la ruta y elige. | Continuidad y migas. | HU-F-318 |
| M-6 | Medio | Navegación · `NavEstudiante.tsx` | No hay destino "Inicio"; "Ruta" ocupa `/`. | Cinco destinos con etiqueta. | HU-F-318 |
| M-7 | Medio | Atril · tablas de cursos y contenido (`shared/ui/Table.tsx`) | A 375 px la tabla se desplaza en horizontal dentro de su contenedor (la página no). Usable, pero incómodo en celular. | Filas apiladas bajo 768 px. Ya especificado en HU-F-309 y F-310; para cursos y contenido se propone **HU-F-319 · Tablas del atril en móvil (2 pts)**. | HU-F-309, F-310, propuesta F-319 |
| M-8 | Medio | `Cuerda`, mástil · pista sin sonar | Pista `linea` sobre `ink`: 1.73. | **Sin cambio**: el relleno contrasta 3.97 con su pista y el valor se da en texto y `aria-valuenow`; subir la pista a `linea-fuerte` haría ilegible el relleno lila (≈ 1.5). | Mitigado |
| B-1 | Bajo | Metrónomo · casillas de tiempo | Borde `linea` de las casillas sin pulso: 1.73. | `border-linea-fuerte` (3.66). | ✅ esta HU |
| B-2 | Bajo | Estados vacíos y 404 | Solo texto; ningún recurso visual relacionado con la guitarra. | Ilustraciones SVG propias. | HU-F-316 |
| B-3 | Bajo | `Button` primario deshabilitado | Texto compuesto 3.51. | **Sin cambio**: WCAG exime los controles inactivos y el botón deshabilitado siempre va con el motivo cerca (p. ej. "Responde todas las preguntas"). | Exento |

## 3. Matriz de contraste

Umbrales: 4.5:1 texto normal · 3:1 texto grande y componentes o gráficos (1.4.11). Las opacidades se
calculan como color compuesto (`a·frente + (1 − a)·fondo`).

### 3.1 Combinaciones que cambiaron

| Combinación | Dónde | Antes | Después |
|---|---|---|---|
| `danger` sobre `danger/10` + `surface` | `MensajeError` en `Drawer` | 4.05 ❌ | 4.64 ✅ |
| `danger` sobre `surface` | Errores de campo en paneles | 4.55 ⚠ | 5.34 ✅ |
| `danger` sobre `ink-2` | Errores en la barra lateral | 4.93 | 5.78 |
| `danger` sobre `ink` | Errores | 5.32 | 6.25 |
| `ink` sobre `danger` (y `danger/90` en hover) | `Button` peligro | 5.32 (4.52) | 6.25 (5.27) |
| Cuerdas y trastes del diagrama | `ChordDiagram` sobre `ink` / `surface` | 1.73 / 1.48 ❌ | 3.66 / 3.12 ✅ |
| Puntos de dedos | `ChordDiagram` sobre `surface` / `ink` | 2.70 ❌ / 3.17 | 5.66 / 6.63 ✅ |
| Número de dedo dentro del punto | `ChordDiagram` | 5.00 (`paper`/`primary`) | 6.63 (`ink`/`primary-claro`) |
| *Placeholder* | `Input`, `Textarea` | 4.42 ❌ | 5.58 ✅ |
| "espacio" en el botón del metrónomo | `Metronomo` | 3.75 ❌ | 5.00 ✅ |
| Borde de control deshabilitado | `claseControl` | 1.83 ❌ | 3.66 ✅ |
| Línea de aprobación | `MiniLineaEvolucion` | 1.73 ❌ | 3.66 ✅ |
| Casilla de tiempo sin pulso | `Metronomo` | 1.73 ❌ | 3.66 ✅ |

### 3.2 Combinaciones que ya cumplían (sin cambio)

| Combinación | Relación |
|---|---|
| `paper` sobre `ink` / `ink-2` / `surface` | 15.84 / 14.67 / 13.53 |
| `muted` sobre `ink` / `ink-2` / `surface` | 10.25 / 9.49 / 8.75 |
| `accent` sobre `ink` / `surface` (enlaces, foco, pestaña activa, acorde elegido) | 8.71 / 7.44 |
| `success` sobre `ink` / `surface` | 10.23 / 8.74 |
| `primary-claro` sobre `ink` / `surface` | 6.63 / 5.66 |
| `paper` sobre `primary` / `primary-hover` (`Button` primario) | 5.00 / 6.24 |
| `linea-fuerte` sobre `ink` / `ink-2` / `surface` (bordes de controles) | 3.66 / 3.39 / 3.12 |
| Anillo de foco `accent` sobre `ink` / `ink-2` / `surface` | 8.71 / 8.06 / 7.44 |
| `Cuerda` sin sonar (`paper/55`) frente a su pista / frente a `ink` | 3.97 / 5.47 |
| `Cuerda` sonando (`success`) frente a su pista | 5.90 |
| Marcador de cierre de nivel (`accent/70`) | 4.86 |
| `MiniLineaEvolucion`: línea de puntajes (`paper/55`) | 5.47 |
| `EstadoPunto`: borrador (`muted`) / archivado (`linea-fuerte`) | 10.25 / 3.66 |

### 3.3 Exentas o mitigadas
`Button` primario deshabilitado (3.51, exento) y pista de `Cuerda` (1.73, mitigado). Ver B-3 y M-8.

## 4. Otros criterios de WCAG 2.2 revisados en el código

| Criterio | Resultado |
|---|---|
| 2.4.7 Foco visible | `:focus-visible` global con contorno `accent` de 2 px y separación de 2 px (`styles/index.css`). |
| 2.4.11 Foco no tapado | Corregido (A-4). |
| 2.5.8 Tamaño del objetivo | Botones `sm` de 32 × 40 px (Subir/Bajar/Quitar de `ListaEditable`), casillas de acordes ≥ 48 px, destinos de la barra inferior ≥ 44 px: cumplen 24 × 24. |
| 1.4.1 Uso del color | Estados con símbolo y texto (`MarcaEstado`, `EstadoPunto`); enlaces en texto corregidos (A-5). |
| 2.3.3 / movimiento | Vibración con `motion-safe:` y `prefers-reduced-motion`. |

## 5. HU nuevas propuestas

| HU | Alcance | Estimación |
|---|---|---|
| HU-F-319 · Tablas del atril en móvil | `TablaCursos` y `TablaContenido` como filas apiladas bajo 768 px, como en HU-F-309/F-310 (M-7). | 2 puntos |

## 6. Después de HU-F-320

Revisión del 2026-10-23 sobre capturas reales de `/acordes`, `/ejercicios` y `/ejercicios/1`: el
texto cumplía, pero **las capas no se distinguían**. El equipo aprobó después una maqueta de inicio con
su paleta; [HU-F-320](../fase-3-rediseno-y-panel-docente/HU-F-320-capas-y-calidez-de-la-paleta.md) la
adopta con ajustes AA (enlaces en lavanda y no en violeta, borde en toda tarjeta, hover más oscuro,
pista de progreso en `ink-2`).

Matriz recalculada con el mismo script (66 combinaciones): **64 cumplen**; las 2 restantes son las
excepciones ya documentadas (B-3 exenta, M-8 decorativa: la cuerda del mástil sin sonar, 2.08).

| Separación | Antes | Después |
|---|---|---|
| Tarjeta (`surface`) / fondo | 1.17, sin borde | 1.14 **+ borde `linea` 2.08** |
| Lo que flota (`surface-2`) / fondo | — | 1.29 + sombra de diálogo |
| Divisores (`linea`) / fondo | 1.73 | 2.08 |

| Combinación | Relación |
|---|---|
| `paper` sobre `ink` · `ink-2` · `surface` · `surface-2` | 17.59 · 16.65 · 15.48 · 13.62 |
| `muted` sobre `ink` · `surface` · `surface-2` | 9.45 · 8.32 · 7.32 |
| `accent` (enlaces, foco) sobre `ink` · `surface` · `surface-2` | 11.51 · 10.13 · 8.92 |
| `success` (logro, verde) sobre `ink` · `surface` | 9.85 · 8.67 |
| `danger` sobre `ink-2` (`MensajeError`) · `surface` · `surface-2` | 6.45 · 5.99 · 5.28 |
| `primary-claro` (dedos del acorde, etiquetas) sobre `ink` · `surface` | 7.20 · 6.34 |
| `paper` sobre `primary` · `primary-hover` (botón) | 4.64 · 5.68 |
| `ink` sobre `danger` (botón peligro) | 6.81 |
| `linea-fuerte` sobre `ink` · `ink-2` · `surface` · `surface-2` | 4.40 · 4.16 · 3.87 · 3.41 |
| Relleno `primary` de `Cuerda` frente a su pista `ink-2` · completado `success` | 3.59 · 9.32 |
| Cuerda que suena (`suena`, ámbar) sobre `ink` | 10.73 |
| *Placeholder* `muted/70` sobre `ink` | 5.14 |

`primary` (`#6257F5`) no se usa como texto en ninguna parte: sobre el fondo daría 3.79.

Comprobado en Chrome sin interfaz con el CSS de producción; las pantallas con datos del backend
quedan para la verificación manual del PR.
