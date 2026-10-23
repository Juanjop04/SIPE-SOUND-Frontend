# HU-F-320 · Adoptar la paleta del rediseño con capas separadas

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-314 (contraste auditado) |
| Rama | `hu/HU-F-320-capas-y-calidez` |

## Historia
**Como** persona que entra a SIPE-SOUND para aprender guitarra
**quiero** distinguir de un vistazo el menú, las tarjetas y lo que puedo tocar
**para** que la plataforma se sienta viva y me invite a explorar.

## Contexto
Capturas de `/acordes`, `/ejercicios` y `/ejercicios/1` (revisión del 2026-10-23): todo se veía
sobre un mismo fondo violeta (encabezado/página 1.08:1, panel/página 1.17:1, líneas 1.73:1).

El equipo aprobó una **maqueta de inicio** y su paleta (azul profundo, violeta brillante, lavanda,
verde). Esta HU la adopta con los ajustes que exige WCAG 2.2 AA:

| Propuesta | Problema | Ajuste |
|---|---|---|
| Violeta `#6257F5` en "botones, enlaces y progreso" | Como texto da 3.79 / 3.33 (< 4.5) | Solo fondo de botón y relleno; enlaces y foco en lavanda `#B9C8FF` (11.5). |
| Tarjeta `#171D33` sobre fondo `#0B1020` | 1.14:1: el mismo problema de las capturas | Toda tarjeta lleva borde `linea` `#3A4673` (2.08). |
| Hover del botón (no definido) | Un violeta más claro baja el texto a 3.87 | Hover más oscuro `#5348E6` (5.68). |
| Pista de progreso (no definida) | Violeta sobre `linea` da 2.39 | Pista `ink-2` (3.59). |
| Verde `#34D399` para logros | — | Reemplaza al ámbar como `success`; el ámbar queda solo como `suena` (cuerda que suena). |

## Alcance
**Incluye**

### 1. Tokens (`src/styles/tokens.css`, `tailwind.config.js`)
Los de [05-sistema-de-diseno.md §2.1](../fase-1-contrato/05-sistema-de-diseno.md#21-color-enmienda-paleta-de-la-maqueta-con-ajustes-aa-hu-f-320):
`ink #0B1020` · `ink-2 #10162B` · `surface #171D33` · `surface-2 #1F2744` · `linea #3A4673` ·
`linea-fuerte #6B78A8` · `primary #6257F5` · `primary-hover #5348E6` · `primary-claro #9A94FA` ·
`accent #B9C8FF` · `success #34D399` · `suena #F5B942` (nuevo) · `danger #F7707A` · `muted #AEB6D8` ·
`paper #F5F6FF`. Se elimina `madera` (no forma parte de la paleta aprobada).

### 2. Aplicación en lo que ya existe

| Dónde | Cambio |
|---|---|
| `EstudianteLayout`, `DocenteLayout` | Encabezado y barras en `ink-2` con borde `linea`. (La barra lateral del estudiante es de HU-F-318.) |
| `TeselaAcorde` (`/acordes`, lección) | `surface` + borde `linea`; hover y foco: `surface-2` + borde `accent`. Nombre del acorde en `paper`, etiqueta de grupo en `primary-claro`. |
| `shared/ui/Table` | Contenedor con borde `linea`; cabecera `surface`; filas alternas `ink-2`. |
| `claseControl`, `ControlBpm` | Fondo `surface` / `ink-2`; borde `linea-fuerte`. |
| `PanelModal`, `MenuCuenta`, `Aviso` | `surface-2`. |
| `MensajeError` | Fondo `ink-2` sólido y borde `danger`. |
| Metrónomo | Panel `surface` con borde; casillas `ink-2`. |
| `Cuerda`, `Boca`, mástil | Pista `ink-2`, relleno `primary`, completado `success`; la cuerda del mástil y las animaciones usan `suena`. |
| `MarcaEstado`, resultados, requisitos de contraseña | Logro en `success` (verde). |

**No incluye**: barra lateral del estudiante (HU-F-318), composición del inicio (HU-F-315), fotos
(HU-F-321), tema claro.

## Prompt de ejecución
```text
Ejecuta HU-F-320 en SIPE-SOUND-FULLSTACK. Solo tokens y clases de color o
contenedor: no cambies la composición de ninguna pantalla. Recalcula la
matriz de contraste del informe AUD-2026-01 con los valores nuevos (sección
"Después de HU-F-320"). primary nunca como color de texto; suena solo en
cuerdas que suenan.
```

## Criterios de aceptación
```gherkin
Escenario: Capas visibles
  Cuando abro cualquier pantalla
  Entonces el encabezado, las tarjetas y lo que flota se distinguen por fondo y borde

Escenario: Logro en verde, cuerda en ámbar
  Dado que aprobé un bloque
  Entonces su marca ● es verde y la cuerda del mástil se pinta de ámbar hasta ese bloque

Escenario: Enlaces legibles
  Entonces ningún enlace ni texto usa primary como color

Escenario: Sin regresiones de contraste
  Entonces todas las combinaciones de §3 del sistema de diseño cumplen 4.5:1 en texto y 3:1 en componentes
```

## Verificación manual
`/acordes`, `/ejercicios`, `/ejercicios/:id`, una lección, la evaluación, *Mi progreso* y el atril a
1280 y 375 px; capturas antes/después en el PR.

## Definición de hecho específica
- [ ] Sin hex fuera de `tokens.css`; ningún uso de `madera` restante.
- [ ] Informe AUD-2026-01 con la sección "Después de HU-F-320".
- [ ] Revisión de anti-patrones declarada en el PR.
