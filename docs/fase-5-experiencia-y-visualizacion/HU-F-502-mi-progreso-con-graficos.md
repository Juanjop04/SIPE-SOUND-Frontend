# HU-F-502 · Mi progreso con gráficos claros

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Should |
| Estimación | 8 puntos |
| Depende de | HU-F-317, HU-F-322 |
| Rama | `hu/HU-F-502-mi-progreso-graficos` |

## Historia
**Como** estudiante
**quiero** ver mi avance en gráficos donde se entienda a qué corresponde cada cifra
**para** saber qué llevo, qué me falta y cuándo practiqué.

## Contexto
- `/progreso` (`ProgresoPage`) muestra cifras y una lista; no es evidente a qué pertenece cada avance.
- Datos que ya existen: `GET /progreso/resumen`, `GET /progreso/actividad?dias=`, `GET /ruta`
  (estado y mejor puntaje por bloque) y, con HU-B-502, el avance por curso.
- Contrato 05 §6: un gráfico solo con datos reales y **con alternativa en tabla**; sin dona decorativa.

## Alcance
**Incluye**
1. **Resumen**: línea de cifras (lecciones `12/40`, ejercicios `5/18`, bloques aprobados `2/6`,
   días con práctica) donde cada cifra nombra su unidad; sin tarjetas KPI con ícono.
2. **Avance por bloque** (gráfico principal): barras horizontales, una por bloque de la ruta,
   con el nombre del bloque a la izquierda, el porcentaje a la derecha en mono y el estado en texto
   (`Aprobado`, `En curso`, `Bloqueado`) además del color. Clic o Enter abre el bloque en la ruta.
3. **Avance por curso** (si está inscrito): una barra por curso con su estado (`Sin iniciar`,
   `En curso`, `Finalizado`) y enlace "Ver ruta del curso".
4. **Actividad**: barras por día de los últimos 28 días (selector 7 · 28 · 90), eje con fechas,
   y encima el texto "Practicaste 9 de los últimos 28 días". Hoy marcado.
5. **Mejores puntajes**: puntos por evaluación con la línea de aprobación (`aprobacion`) marcada;
   quien no aprobó se distingue por forma (○ / ●), no solo por color.
6. **Leyenda y lectura**: cada gráfico con título, unidad y una frase de lectura
   ("Llevas 40 % del bloque 3"). Tooltip al enfocar con teclado, no solo con el mouse.
7. **Alternativa en tabla**: botón "Ver como tabla" por gráfico (`<table>` con los mismos datos).
8. **Gráficos con Recharts** (decisión de fase 5 §2.3), ya instalada con su base en
   `src/shared/ui/graficos/` (`BarrasHorizontales`, `BarrasPorDia`, `BarraApilada`, marco con
   "Ver como tabla"): esta HU las usa y agrega `PuntosConLinea` (puntajes con la línea de
   aprobación). Se importan solo desde páginas cargadas bajo demanda (Recharts no entra al
   paquete inicial).

**No incluye**
- Comparar con otros estudiantes ni rankings.
- Exportar.

## Diseño
- **Composición**: encabezado + línea de cifras; debajo, rejilla de 2 columnas en escritorio
  (avance por bloque a la izquierda y por curso a la derecha), actividad a todo el ancho,
  puntajes al final. Móvil: una columna.
- **Colores**: solo tokens (`relleno-*`, `success`, `accent`, `muted`, `danger` para el umbral);
  nunca un color sin etiqueta. Sin degradados dentro de los gráficos.
- **Estados**: carga (esqueleto del alto del gráfico, sin salto), vacío ("Aún no hay avances.
  Empieza por la lección 1." con enlace), error (`MensajeError` por gráfico).

## Prompt de ejecución
```text
Ejecuta HU-F-502 en SIPE-SOUND-FULLSTACK. Rediseña /progreso con los gráficos de Recharts que ya
están en src/shared/ui/graficos (no agregues otra librería): barras por bloque con estado en texto, barras por curso con
estado, actividad por día y puntajes con línea de aprobación. Cada gráfico lleva título, unidad,
frase de lectura y botón "Ver como tabla". Solo tokens; el estado nunca va solo por color. Antes
de escribir JSX describe la composición y espera confirmación. Sin pruebas unitarias.
```

## Pasos
1. Usar la base de `shared/ui/graficos` y agregar `PuntosConLinea`.
2. Composición de `/progreso` y frases de lectura (funciones puras).
3. Interacción con teclado y tooltips; estados.
4. Documentos (05 §4: gráficos; 04-consumo-api).

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: A qué corresponde el avance
  Cuando abro Mi progreso
  Entonces cada barra dice a qué bloque o curso pertenece, su porcentaje y su estado en texto

Escenario: Estado sin depender del color
  Dado un bloque aprobado y uno bloqueado
  Entonces se distinguen por el texto "Aprobado" / "Bloqueado" y por su forma

Escenario: Tabla alternativa
  Cuando pulso "Ver como tabla" en un gráfico
  Entonces veo los mismos datos en una tabla

Escenario: Teclado
  Cuando recorro las barras con Tab
  Entonces cada una anuncia "Bloque 3, 40 %, En curso" y Enter abre el bloque

Escenario: Sin avances
  Dado un estudiante nuevo
  Entonces veo "Aún no hay avances" y un enlace a la primera lección, sin gráficos vacíos
```

## Verificación manual
- Estudiante nuevo, con un bloque en curso y con todo aprobado; claro y oscuro; 375 px.
- Lector de pantalla recorriendo un gráfico; capturas en 1280 px y 375 px.

## Definición de hecho específica
- [ ] Recharts solo en chunks de páginas con gráficos (el paquete inicial no crece), comprobado con `npm run build`.
- [ ] Ningún gráfico sin título, unidad y tabla alternativa.
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
