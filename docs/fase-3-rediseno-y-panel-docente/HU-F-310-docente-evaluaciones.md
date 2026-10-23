# HU-F-310 · Panel docente: crear evaluaciones y analizar resultados

| Campo | Valor |
|---|---|
| Fase | 3 · Panel docente |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-308, **HU-B-311** |
| Rama | `hu/HU-F-310-docente-evaluaciones` |

## Historia
**Como** docente
**quiero** armar evaluaciones para mi curso, publicarlas con fecha límite y ver qué preguntas fallan más
**para** decidir qué reforzar en la siguiente clase.

## Diseño

### Lista (`/docente/evaluaciones` y pestaña del curso)
- Tabla: Título · Curso · Preguntas (mono) · Estado · Fecha límite (mono) · Presentaron (`22/25`) · Aprobación (% mono) · Acciones.

### Editor (`/docente/evaluaciones/:id`)
- Datos generales: título, curso, descripción, % de aprobación (50–100, con explicación "Los estudiantes aprueban con …"), intentos máximos (opcional), fecha límite (opcional).
- Preguntas como lista numerada (mono `01`, `02`…); cada una: enunciado, 2–6 opciones, selector de respuesta correcta (radio junto a cada opción, etiquetado "Correcta"). Reordenar con Subir/Bajar. Agregar/duplicar/eliminar pregunta.
- Si la evaluación ya tiene intentos: preguntas en solo lectura con nota "Ya hay intentos: para cambiar preguntas, duplica la evaluación". Acción "Duplicar como borrador".
- "Vista de estudiante": abre la evaluación como la verá el alumno (componentes de HU-F-306 en modo vista previa, sin enviar).
- Publicar exige ≥ 1 pregunta y opciones válidas; muestra los errores en la pregunta concreta.

### Resultados (`/docente/evaluaciones/:id/resultados`)
- Franja de cifras: `presentaron 22/25 │ aprobaron 68 % │ promedio 74 %`.
- **Preguntas de la más difícil a la más fácil**: cada fila con enunciado y una `Cuerda` de % de aciertos (ámbar si ≥ 80 %, `paper` si menos). Es la vista principal: responde "¿qué repaso mañana?".
- Tabla de estudiantes: mejor puntaje, intentos, aprobado (`●` / `×`), enlace al detalle (HU-F-309).
- Quienes no han presentado: lista aparte con acción "Enviar recordatorio" (crea una retroalimentación).

## Alcance
**Incluye**: `features/docente/evaluaciones` (api, hooks, editor, resultados), esquemas Zod alineados con HU-B-311.
**No incluye**: tipos de pregunta distintos a opción única; banco de preguntas compartido.

## Claves de `GET /docente/evaluaciones/{id}/resultados`
`intentos`, `estudiantes_que_presentaron`, `estudiantes_del_curso`, `promedio_mejor_puntaje`,
`aprobaron_pct` (% de estudiantes que aprobaron), `minimo_requerido` (umbral),
`preguntas[]` ya ordenadas de la más difícil a la más fácil (`aciertos_pct`),
`estudiantes[]` (`mejor_puntaje`, `intentos`, `aprobado`) y `sin_presentar[]` (lista "Quienes no han presentado").
Errores: 422 al reemplazar preguntas o cambiar el umbral con intentos; 409 `sugerencia: cerrar` al borrar.

## Validación de campos
Constructores de `shared/validacion` ([contrato 08](../fase-1-contrato/08-validacion-de-formularios.md)); los mismos límites aplican la API y la base (contrato del backend §7).

| Campo | Regla | Control |
|---|---|---|
| Título | 3–120 | `maxLength=120` |
| Descripción | ≤ 2000, opcional | `textarea` `maxLength=2000` + contador |
| % de aprobación | entero 50–100 | `type="number"` `min=50` `max=100` |
| Intentos máximos | entero 1–10, opcional | `type="number"` `min=1` `max=10` |
| Fecha límite | opcional; posterior a hoy | `type="date"` con `min` = mañana |
| Enunciado | 3–300 | `textarea` `maxLength=300` + contador |
| Opciones | 2–6 por pregunta, 1–120 caracteres cada una, sin repetidas (sin distinguir mayúsculas) | `maxLength=120`; "Agregar opción" deshabilitado en 6 |
| Respuesta correcta | exactamente una | radio por opción |

## Prompt de ejecución
```text
Ejecuta HU-F-310 en SIPE-SOUND-FULLSTACK. Describe la composición del editor
y de los resultados y espera confirmación. El editor usa useFieldArray de
React Hook Form para preguntas y opciones. El guardado de preguntas es
PUT /docente/evaluaciones/{id}/preguntas con el conjunto completo. Diseña el
modelo de pregunta en el frontend con un campo "tipo" fijo en "opcion_unica"
para permitir más tipos después (principio abierto/cerrado).
"Duplicar como borrador" se compone en el frontend con endpoints existentes:
GET evaluación → POST nueva (estado borrador) → PUT preguntas.
"Enviar recordatorio" usa POST .../retroalimentaciones del curso.
```

## Criterios de aceptación
```gherkin
Escenario: Validación localizada
  Dado una pregunta sin respuesta correcta marcada
  Cuando intento publicar
  Entonces la pregunta 3 se resalta con "Marca la respuesta correcta"

Escenario: Protección del historial
  Dado una evaluación con intentos
  Entonces las preguntas están en solo lectura y puedo duplicarla como borrador

Escenario: Pregunta más difícil primero
  Cuando abro los resultados
  Entonces la primera pregunta listada es la de menor % de aciertos
```

## Verificación manual
Crear, publicar, presentar con 2 estudiantes, ver resultados, duplicar; 1280/375 px; teclado.

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR.
