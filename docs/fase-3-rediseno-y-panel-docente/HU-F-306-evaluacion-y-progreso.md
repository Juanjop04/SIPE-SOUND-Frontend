# HU-F-306 · Rediseñar la evaluación y la vista de progreso

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-304, **HU-B-308** (evaluaciones e intentos), **HU-B-305** (`/progreso/resumen`) |
| Rama | `hu/HU-F-306-evaluacion-progreso` |

## Historia
**Como** estudiante
**quiero** presentar la evaluación con calma, entender en qué fallé y ver cómo he mejorado
**para** sentir que avanzo y saber qué repasar.

## Diseño

### Evaluación (`/evaluacion/:id`; `/quiz/:bloqueId` redirige a la nueva ruta)
- Encabezado: título + `Tablatura` (`5 preguntas │ aprobar con 80 % │ intento 3`).
- **Escritorio**: todas las preguntas en una columna; índice lateral fijo con números en mono que se marcan al responder.
- **Móvil**: una pregunta por pantalla, con "Anterior / Siguiente" y progreso como `Cuerda`.
- Opciones como filas completas (`role="radiogroup"`), letra `A B C D` en mono a la izquierda; seleccionada = borde `accent` 2 px.
- "Enviar" solo activo con todo respondido; si falta algo, indica cuáles (no solo deshabilita).
- **Resultado**:
  - Aprobado: el `Fretboard` vibra una vez y la cifra (`80 %`) aparece en mono grande en `success`. Mensaje: "Bloque superado. Ya puedes seguir con el bloque 3."
  - No aprobado: cifra en `paper`, sin rojo dominante. Mensaje: "Te faltó poco: necesitas 80 %. Repasa las preguntas marcadas."
  - Revisión por pregunta: correcta `●` ámbar / incorrecta `×` `danger` con la respuesta correcta.

### Mi progreso (`/progreso`)
- Franja superior de cifras en mono separadas por trastes: `bloques 2/6 │ lecciones 9/24 │ ejercicios 5/18`.
- "Tu cuerda": una `Cuerda` gruesa del avance global.
- Historial de intentos por evaluación: tabla (fecha, puntaje, aprobado) con una mini-línea de evolución en SVG (sin librería de gráficas).
- Actividad reciente: lista cronológica con fecha en mono.

## Alcance
**Incluye**: ambas vistas consumiendo `/evaluaciones/{id}`, `/evaluaciones/{id}/intentos`, `/progreso/resumen`; redirección de `/quiz/:bloqueId` usando el `evaluacion_id` del bloque en `GET /ruta` (la API ya no tiene `/quiz/*`, HU-B-312).
**No incluye**: logros/insignias (visión futura).

## Prompt de ejecución
```text
Ejecuta HU-F-306 en SIPE-SOUND-FULLSTACK. Describe primero la composición y
espera confirmación. El estado de respuestas vive en un reducer local
(useReducer) de la página de evaluación. Si el usuario intenta salir con
respuestas sin enviar, pide confirmación con Dialog (useBlocker de React Router).
La mini-línea de evolución es un SVG propio de ≤ 60 líneas.
```

## Criterios de aceptación
```gherkin
Escenario: Retroalimentación clara
  Dado que fallé la pregunta 2
  Cuando veo el resultado
  Entonces la pregunta 2 muestra × y la respuesta correcta

Escenario: Salida accidental
  Dado que respondí 3 de 5 preguntas
  Cuando intento ir a otra página
  Entonces un diálogo me pregunta si quiero salir sin enviar

Escenario: Historial
  Dado 3 intentos previos
  Cuando abro Mi progreso
  Entonces veo los 3 intentos y su evolución
```

## Verificación manual
Presentar una evaluación aprobando y otra sin aprobar; revisar móvil; navegar todo con teclado; lector de pantalla en las opciones.

## Definición de hecho específica
- [ ] `QuizBloquePage` eliminado; `/quiz/:bloqueId` redirige.
- [ ] Revisión de anti-patrones declarada en el PR.
