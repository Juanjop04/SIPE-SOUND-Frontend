# HU-F-322 · Dar acabado a las barras de progreso, el gráfico y el encabezado del inicio

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Should |
| Estimación | 2 puntos |
| Depende de | HU-F-315, HU-F-317 |
| Rama | `hu/HU-F-322-acabados-progreso` |

## Historia
**Como** estudiante
**quiero** que las barras, el gráfico y el encabezado del inicio se vean pulidos, como en la maqueta
**para** que la plataforma se sienta profesional y motive a seguir practicando.

## Contexto
Revisión del equipo sobre la maqueta aprobada (2026-10-23): las barras de progreso eran líneas de
2–3 px de color plano, el gráfico era una línea quebrada sin área y la foto del encabezado ocupaba una
columna con bordes rectos. La maqueta usa barras más gruesas con degradado, curva suave con área que se
desvanece y la foto fundida con la tarjeta. Esto exige una **enmienda acotada** del sistema de diseño
(§6): los degradados siguen prohibidos salvo en tres usos concretos.

## Alcance
**Incluye**
- `Cuerda`: grosores 4 (6 px) y 5 (8 px); relleno `primary → primary-claro` (3.59 y 6.82:1 frente a
  la pista `ink-2`) y `success/60 → success` al completar (4.09 y 9.32:1). Grosor 4 en `TarjetaCifra`
  y en "Tu progreso por bloques"; 5 en la franja de *Mi progreso*.
- `Boca`: el arco con el mismo degradado.
- "Tu evolución": curva suave **monótona** (Fritsch–Carlson; nunca baja de 0 ni supera el máximo) y
  área `accent` 35 % → 0 % bajo la curva. La línea sigue siendo el dato (10.1:1).
- Encabezado del inicio: la foto ocupa el fondo derecho y se desvanece hacia la izquierda con
  `mask-image`; el texto queda sobre `surface` sólido y la `Boca` en su propia tarjeta `surface-2`.
- Enmienda de `05-sistema-de-diseno.md` §4 y §6.

**No incluye**: desenfoque (`blur`) de la foto ni *glassmorphism*; degradados en fondos, botones o
textos.

## Criterios de aceptación
```gherkin
Escenario: Barra legible
  Entonces ambos extremos del degradado contrastan al menos 3:1 con la pista

Escenario: Curva sin datos inventados
  Dado un día sin avance entre dos días con avance
  Entonces la curva toca 0 ese día y no baja de la línea de base

Escenario: Texto legible junto a la foto
  Entonces ningún texto del encabezado queda encima de la foto
```

## Verificación manual
Inicio a 1280 y 375 px con la cuenta de prueba; Safari o WebKit (máscara con prefijo `-webkit-`).
