# HU-F-317 · Mostrar la constancia de práctica en un gráfico

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Could |
| Estimación | 3 puntos |
| Depende de | HU-F-315, **HU-B-324** (`GET /progreso/actividad`) |
| Rama | `hu/HU-F-317-grafico-practica` |

## Historia
**Como** estudiante
**quiero** ver en qué días de las últimas semanas registré avance
**para** notar mi constancia y no dejar pasar muchos días sin tocar.

## Contexto
El inicio (HU-F-315) muestra cuánto llevo, pero no **cuándo** practiqué. HU-B-324 entrega
`por_dia` (28 días, incluidos los días en cero) y `dias_con_practica`.

Importante: la API cuenta **registros de avance** (lecciones o ejercicios guardados, evaluaciones
presentadas), no minutos tocados. El gráfico y sus textos dicen "días con avance", nunca "horas de
práctica".

## Alcance
**Incluye**
- `src/features/inicio/components/ConstanciaPractica.tsx` en la columna derecha del inicio, debajo de
  "Lo último que hiciste".
- Gráfico **SVG propio** (sin librería de gráficas, como `MiniLineaEvolucion` de HU-F-306): 4 filas
  (semanas) × 7 columnas (lunes a domingo), como **trastes de un diapasón**: cada día es una casilla
  sobre la cuerda; con avance se marca con un punto `success` (como `MarcaEstado` aprobado) cuyo tamaño
  crece en 3 escalones (1, 2–3, 4 o más registros). Sin avance: casilla vacía con borde `linea-fuerte`.
- Encima, en mono: `9 de 28 días con avance`.
- **Alternativa textual**: tabla visualmente oculta (`sr-only`) con fecha y registros por día, y la
  misma información disponible con "Ver como tabla" (botón que alterna la vista, útil también con zoom).
- Escala y leyenda visibles: "1 · 2–3 · 4+ registros"; la información no depende solo del color
  (tamaño del punto + número en la tabla).

**No incluye**: elegir el rango (fijo en 28 días), metas, rachas o notificaciones.

## Diseño
- Escritorio: ocupa el ancho de la columna (5/12); casillas ≥ 24 px (WCAG 2.5.8).
- Móvil: mismas 4 × 7 casillas a ancho completo; la leyenda pasa debajo.
- Etiquetas de días (`L M M J V S D`) y de semanas ("hace 3 sem.", …, "esta semana") en `muted` 13 px.
- Cada casilla con avance es enfocable solo dentro del modo tabla (no 28 paradas de tabulación en el
  gráfico); el gráfico lleva `role="img"` y un `aria-label` con el resumen.

**Estados**: carga (`Skeleton` de 4 × 7), sin avance en el rango ("En las últimas 4 semanas no hay
avance registrado. Una lección corta hoy ya cuenta."), error con reintentar, HU-B-324 no desplegada
(404) → la sección no se muestra.

## Prompt de ejecución
```text
Ejecuta HU-F-317 en SIPE-SOUND-FULLSTACK. Describe el gráfico en viñetas y
espera confirmación. El SVG es un componente de ≤ 80 líneas que recibe
por_dia ya ordenado; la agrupación por semana (lunes a domingo, zona
America/Bogota) es una función pura en features/inicio/utils. Sin
dependencias nuevas. Textos: "días con avance", nunca "práctica de N horas".
```

## Criterios de aceptación
```gherkin
Escenario: Días con avance
  Dado que registré avance 9 de los últimos 28 días
  Entonces veo "9 de 28 días con avance" y 9 casillas marcadas

Escenario: Alternativa textual
  Cuando pulso "Ver como tabla"
  Entonces veo una tabla con cada fecha y su número de registros

Escenario: Sin datos
  Dado que no registré avance en 28 días
  Entonces veo el mensaje de estado vacío y ninguna casilla marcada
```

## Verificación manual
Cuenta con actividad variada (semilla del backend); 1280 y 375 px; lector de pantalla; zoom 200 %.

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR (sin gráfico de dona, sin datos de ejemplo).
- [ ] Contraste ≥ 3:1 de casillas y puntos sobre su fondo, con la cifra en el PR.
