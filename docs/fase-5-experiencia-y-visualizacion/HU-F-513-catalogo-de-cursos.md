# HU-F-513 · Cursos disponibles y ruta solo con curso aceptado

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-B-413, HU-B-414 |
| Rama | `hu/HU-F-513-catalogo-de-cursos` |

## Historia
**Como** estudiante
**quiero** ver todos los cursos y pedir entrar al que me interesa
**para** acceder a su ruta cuando mi docente o un administrador me acepte.

## Alcance
**Incluye**
1. Página **Cursos disponibles** (`/cursos/disponibles`, entrada en el menú): tarjetas con nombre,
   docente (o "Sin docente asignado"), nivel, estudiantes y bloques, y la acción según mi estado:
   **Inscribirme**, **Cancelar solicitud** (pendiente), **Volver a solicitar** (rechazada) o
   **Ir a Mis cursos** (inscrito). Búsqueda por nombre, descripción o docente.
2. **Ruta solo con curso**: Ruta, Inicio, lecciones y ejercicios muestran "Aún no tienes un curso"
   con el camino al catálogo (o al código) si el estudiante no tiene una inscripción aceptada. Sin
   sesión llevan al inicio de sesión. Docentes y administradores no cambian.
3. "Mis cursos" enlaza al catálogo; el código de invitación sigue entrando directo.
4. Un curso sin docente se muestra sin romper la tarjeta de "Mis cursos".

**No incluye**
- El panel que acepta o rechaza (HU-F-514).
- Cerrar las lecturas públicas de contenido en el backend.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Pedir entrar
  Cuando pulso "Inscribirme" en un curso
  Entonces la tarjeta dice "Solicitud enviada" y ofrece "Cancelar solicitud"

Escenario: Sin curso
  Dado un estudiante sin inscripción aceptada
  Cuando abre la ruta
  Entonces ve "Aún no tienes un curso" y un botón a los cursos disponibles

Escenario: Aceptado
  Cuando el docente lo acepta
  Entonces la ruta y Mis cursos muestran ese curso
```

## Definición de hecho específica
- [ ] Probado con HU-B-413 y HU-B-414 aplicadas (`uv run alembic upgrade head`).
