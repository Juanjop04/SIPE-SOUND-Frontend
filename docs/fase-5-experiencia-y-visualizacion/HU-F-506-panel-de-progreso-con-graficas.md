# HU-F-506 · Panel de progreso del docente con gráficas, filtros y evaluaciones

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 13 puntos |
| Depende de | HU-F-406, HU-F-502, **HU-B-503** |
| Rama | `hu/HU-F-506-panel-progreso-graficas` |

## Historia
**Como** docente
**quiero** un panel limpio con gráficas que desglosen cómo va mi grupo, con filtros y control sobre mis evaluaciones
**para** decidir qué repasar y qué evaluación abrir o cerrar sin cambiar de pantalla.

## Contexto
- HU-F-406 muestra cifras, la matriz y "Necesitan apoyo", pero sin gráficas ni evaluaciones.
- HU-B-503 entrega las series: actividad por día, distribución del avance, estados y evaluaciones.
- Habilitar o deshabilitar una evaluación es publicar o cerrarla: `PATCH /docente/evaluaciones/{id}/estado`
  (ya existe; decisiones fase 5 §2.5).
- Los componentes de gráfico se reutilizan de HU-F-502 (`src/shared/ui/graficos/`).

## Alcance
**Incluye**
1. **Filtros en la URL** (barra única arriba, siempre visible): curso, bloque, rango (7 · 28 · 90
   días) y grupo (Todos · Al día · Sin actividad · Necesitan apoyo). Un filtro activo se ve como
   ficha con "×"; "Quitar filtros".
2. **Línea de cifras** (sin tarjetas con ícono): estudiantes, avance promedio, al día, sin actividad,
   evaluaciones abiertas.
3. **Gráficas** (de `GET /docente/progreso/series`, cada una con título, unidad, frase de lectura
   y "Ver como tabla"):
   - **Estados del grupo**: una barra apilada horizontal `Sin iniciar · En curso · Finalizado`
     con los conteos escritos (no dona).
   - **Distribución del avance**: barras por tramos (0–19 … 80–100 %).
   - **Actividad**: barras por día con estudiantes activos.
   - **Aprobación por bloque**: barras `aprobados/total` por bloque; clic filtra por ese bloque.
   - **Evaluaciones**: promedio de puntaje y % de aprobación por evaluación.
4. **Evaluaciones del curso** (tarjetas o filas): título, bloque, estado (`Borrador`, `Abierta`,
   `Cerrada`), intentos, aprobados, promedio y la pregunta más fallada recortada. **Interruptor
   "Abierta/Cerrada"** con la función escrita al lado (como HU-F-404): cerrar pide confirmación
   ("Los estudiantes ya no podrán presentarla"); abrir no. Enlaces "Editar" y "Resultados".
5. **Matriz y "Necesitan apoyo"** de HU-F-406 debajo, sin cambios de comportamiento; "Ver progreso"
   abre el `Drawer`; "Escribirle" abre el redactor de HU-F-407 con la persona puesta.
6. **Flujo**: desde una barra o un bloque del gráfico se pasa a la matriz filtrada en un clic; el
   resumen vive arriba y el detalle abajo, sin pestañas.
7. **Exportar CSV** de la matriz visible y de la tabla de evaluaciones (sin correos).
8. Móvil: filtros en un `Drawer`, gráficas en una columna, evaluaciones como lista.

**No incluye**
- Excepciones por estudiante, reportes en PDF ni programados.

## Diseño
- **Composición**: filtros → cifras → rejilla de gráficas (2 columnas en escritorio) → evaluaciones →
  matriz y apoyo. Mucho aire; un solo énfasis por gráfica.
- **Metáfora**: tablatura de grupo; las barras son cuerdas con su valor escrito.
- **Estados**: carga (esqueletos con el alto de cada gráfica), vacío ("Aún no tienes estudiantes
  en este curso. Comparte el código **K7M2Q9XA**"), error (`MensajeError` por gráfica).

## Prompt de ejecución
```text
Ejecuta HU-F-506 en SIPE-SOUND-FULLSTACK. Amplía /docente/progreso con filtros en la URL (curso,
bloque, rango, grupo), línea de cifras y gráficas SVG de GET /docente/progreso/series (estados
apilados, distribución, actividad, aprobación por bloque, evaluaciones), reutilizando
src/shared/ui/graficos. Agrega las evaluaciones del curso con un interruptor Abierta/Cerrada con
confirmación al cerrar (PATCH /docente/evaluaciones/{id}/estado). Conserva la matriz y "Necesitan
apoyo" y agrega "Escribirle" hacia el redactor de mensajes. CSV sin correos. Antes de escribir
JSX describe la composición y espera confirmación. Prohibido: dona, tarjetas KPI con ícono,
degradados. Sin pruebas unitarias.
```

## Pasos
1. Filtros en la URL y consulta de series.
2. Gráficas y sus tablas alternativas.
3. Evaluaciones con interruptor y confirmación.
4. Integración con la matriz, "Escribirle" y CSV.
5. Móvil y documentos.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Desglose visual
  Cuando elijo el curso "Guitarra 7A" y 28 días
  Entonces veo estados, distribución, actividad, aprobación por bloque y evaluaciones, cada una con su título y unidad

Escenario: Filtrar por bloque
  Cuando pulso el bloque 3 en el gráfico de aprobación
  Entonces los filtros muestran "Bloque 3" y la matriz y las gráficas se limitan a él

Escenario: Cerrar una evaluación
  Cuando apago el interruptor de "Evaluación del bloque 2"
  Entonces veo "Los estudiantes ya no podrán presentarla" y, al confirmar, su estado pasa a "Cerrada"

Escenario: Abrir una evaluación
  Cuando enciendo el interruptor de una evaluación cerrada
  Entonces pasa a "Abierta" sin pedir confirmación

Escenario: Escribirle
  Cuando pulso "Escribirle" en un estudiante que necesita apoyo
  Entonces se abre el redactor con esa persona elegida

Escenario: Tabla alternativa
  Cuando pulso "Ver como tabla" en una gráfica
  Entonces veo los mismos datos en una tabla
```

## Verificación manual
- Curso con 30 estudiantes y 3 evaluaciones; filtros combinados; teclado y lector de pantalla.
- Capturas en 1280 px y 375 px, claro y oscuro.

## Definición de hecho específica
- [ ] Las sumas de las gráficas coinciden con las cifras y la matriz.
- [ ] Ningún correo ni respuesta correcta en pantalla ni en el CSV.
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
