# HU-F-517 · Unirse con código dentro de Cursos disponibles

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Should |
| Estimación | 2 puntos |
| Depende de | HU-F-513 |
| Rama | `hu/HU-F-517-unirse-con-codigo-en-disponibles` |

## Historia
**Como** estudiante
**quiero** encontrar en un solo apartado los cursos para inscribirme y la opción de unirme con el código de mi docente
**para** no buscar por dónde empezar.

## Alcance
**Incluye**
1. **Cursos disponibles** reúne las dos vías: la lista de cursos con **Inscribirme** (el docente a
   cargo o un administrador acepta la solicitud) y **Unirme con un código** (entra directo).
2. **Mis cursos** deja de tener el formulario del código y enlaza a Cursos disponibles.
3. El aviso "Aún no tienes un curso" y el del enlace con código llevan a Cursos disponibles.
4. Unirse con código actualiza la tarjeta del curso a "Ya estás inscrito".

**No incluye**
- Cambios en el backend.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Dos vías en un apartado
  Cuando abro Cursos disponibles
  Entonces veo "Unirme con un código" y la lista de cursos con "Inscribirme"

Escenario: Unirse con código
  Cuando escribo un código válido
  Entonces quedo inscrito sin esperar y el curso aparece en Mis cursos
```
