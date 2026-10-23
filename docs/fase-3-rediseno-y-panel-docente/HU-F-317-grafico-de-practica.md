# HU-F-317 · Mostrar la evolución de la práctica en un gráfico

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
- `src/features/inicio/components/TuEvolucion.tsx` en la columna izquierda del inicio, junto a
  "Actividad reciente" (maqueta aprobada: "Tu evolución").
- **Gráfico de línea SVG propio** (sin librería de gráficas, como `MiniLineaEvolucion` de HU-F-306):
  registros de avance por día; eje X con los días (`Lun … Dom`), eje Y con escala entera, línea
  `accent` de 2 px y puntos en cada día. **Sin relleno degradado** bajo la línea (sistema de diseño §6).
- Selector de rango "Últimos 7 días" / "Últimos 28 días" (`?dias=` de HU-B-324), en la URL.
- Encima, en mono: `9 de 28 días con avance`.
- **Alternativa textual**: tabla visualmente oculta (`sr-only`) con fecha y registros por día, y
  "Ver como tabla" (botón que alterna la vista, útil también con zoom).
- La información no depende solo del color: valor visible al enfocar o pasar sobre un punto y en la tabla.

**No incluye**: metas, rachas o notificaciones; tiempo de práctica (la API no lo registra).

## Diseño
- Tarjeta `surface` con borde `linea`; rejilla horizontal en `linea`; etiquetas de ejes en `muted` 13 px.
- Escritorio: 7 columnas del inicio; alto 200 px. Móvil: ancho completo, alto 160 px; con 28 días las
  etiquetas del eje X se muestran cada 7.
- Puntos ≥ 24 px de área de toque (WCAG 2.5.8); el gráfico lleva `role="img"` y un `aria-label` con
  el resumen; los puntos no son paradas de tabulación (la tabla sí).

**Estados**: carga (`Skeleton` del área del gráfico), sin avance en el rango ("En los últimos 7 días
no hay avance registrado. Una lección corta hoy ya cuenta."), error con reintentar, HU-B-324 no
desplegada (404) → la sección no se muestra.

## Prompt de ejecución
```text
Ejecuta HU-F-317 en SIPE-SOUND-FULLSTACK. Describe el gráfico en viñetas y
espera confirmación. El SVG es un componente de ≤ 80 líneas que recibe
por_dia ya ordenado; escalas y etiquetas (zona America/Bogota) son
funciones puras en features/inicio/utils. Sin
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
