# HU-F-512 · Guardar solo cuando hay cambios

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Should |
| Estimación | 2 puntos |
| Depende de | HU-F-511 |
| Rama | `hu/HU-F-512-guardar-solo-con-cambios` |

## Historia
**Como** docente que edita una lección, un ejercicio o una evaluación
**quiero** que "Guardar" solo funcione cuando cambié algo
**para** no mandar llamadas inútiles al servidor ni registrar ediciones que no ocurrieron.

## Alcance
**Incluye**
1. En lecciones, ejercicios y evaluaciones **ya guardados**, "Guardar borrador" y "Guardar cambios"
   quedan deshabilitados mientras el formulario no difiera de lo guardado (`isDirty`). Un contenido
   nuevo sí se puede guardar.
2. Aunque se fuerce el envío, **no se llama al backend** sin cambios. "Publicar" sin cambios solo
   cambia el estado (una llamada de estado, no de datos).
3. Evaluaciones: se envía **solo lo que cambió**: los datos generales (PATCH) y/o las preguntas
   (PUT), cada uno únicamente si se tocó.
4. Tras guardar, el botón vuelve a quedar deshabilitado.

**No incluye**
- Enviar solo los campos modificados dentro de la lección o del ejercicio (el PATCH lleva el formulario completo).

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Sin cambios
  Dado una lección guardada
  Cuando abro su editor sin tocar nada
  Entonces "Guardar cambios" está deshabilitado y no se envía ninguna petición

Escenario: Con cambios
  Cuando edito el título
  Entonces "Guardar cambios" se habilita y al pulsarlo se envía una sola petición

Escenario: Publicar sin cambios
  Dado un borrador sin cambios
  Cuando pulso "Publicar"
  Entonces solo se cambia el estado, sin reenviar los datos
```
