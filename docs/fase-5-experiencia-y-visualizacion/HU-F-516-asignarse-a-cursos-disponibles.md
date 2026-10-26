# HU-F-516 · Asignarse y retirarse de cursos disponibles

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-B-413 |
| Rama | `hu/HU-F-516-asignarse-a-cursos-disponibles` |

## Historia
**Como** docente
**quiero** tomar un curso disponible o retirarme de uno mío
**para** repartir los cursos sin pedirle cambios manuales al administrador.

## Alcance
**Incluye**
1. En **Cursos** del atril, la sección **Cursos disponibles** (solo docentes): cursos activos sin
   docente con nombre, descripción, nivel, estudiantes y bloques, y **Asignarme**. Si otro docente
   se adelantó (409) se avisa y la lista se actualiza.
2. En cada curso propio activo, **Retirarme** con confirmación: el curso queda disponible; sus
   estudiantes y su ruta se conservan.
3. **Administrador**: **Nuevo curso** en Todos los cursos, con docente opcional ("Sin docente
   (disponible)"). La tabla y el detalle muestran "Sin docente" cuando corresponde.

**No incluye**
- Reasignar a otro docente desde la tarjeta (sigue en Todos los cursos).

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Asignarme
  Dado un curso sin docente
  Cuando pulso "Asignarme"
  Entonces el curso pasa a mis cursos y deja de estar disponible

Escenario: Retirarme
  Cuando me retiro de un curso con estudiantes
  Entonces el curso queda disponible y los estudiantes siguen inscritos

Escenario: Crear sin docente
  Cuando el admin crea un curso sin elegir docente
  Entonces aparece como "Sin docente" y en Cursos disponibles de los docentes
```
