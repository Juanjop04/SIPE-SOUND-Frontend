# HU-F-405 · Administración: docentes, cursos asignados y accesos

| Campo | Valor |
|---|---|
| Fase | 4 · Cuentas y comunicación |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-404, **HU-B-406** |
| Rama | `hu/HU-F-405-admin-docentes-y-cursos` |

## Historia
**Como** administrador
**quiero** ver los cursos de cada docente, reasignarlos y retirar estudiantes de un curso
**para** que ningún curso quede sin docente y cada estudiante tenga solo los accesos que le corresponden.

## Contexto
- `/admin/docentes` (`DocentesPage.tsx`) solo gestiona preautorizaciones
  (`FormularioPreautorizar.tsx`, `TablaPreautorizaciones.tsx`).
- HU-B-406 expone `GET /admin/docentes`, `GET /admin/docentes/{id}/cursos`, `GET /admin/cursos`,
  `PATCH /admin/cursos/{id}/docente` y la revocación de inscripciones.

## Alcance
**Incluye**
1. `/admin/docentes` pasa a tener dos pestañas (`Tabs` existente, pestaña en la URL `?tab=`):
   - **Docentes**: tabla con Nombre · Correo · Estado · Cursos activos · Estudiantes · Último acceso.
     Al abrir una fila, `Drawer` con sus cursos (activos y archivados: nombre, estudiantes,
     bloques en ruta, código en mono) y, por curso, "Reasignar".
   - **Preautorizaciones**: lo que existe hoy, sin cambios.
2. `/admin/cursos` (`paths.admin.cursos`, enlace "Cursos" en la sección de administración de
   `PanelAtril`): todos los cursos con filtros docente, estado y búsqueda en la URL.
   Al abrir un curso: estudiantes inscritos (correo completo) con "Retirar del curso".
3. **Reasignar**: `Dialog` con selector de docente activo (búsqueda) y resumen "El curso **Guitarra 7A**
   pasa de **Luis Pérez** a **Marta Ríos**. Sus 28 estudiantes y evaluaciones se mantienen."
4. **Retirar del curso**: `Dialog` "Ana deja de ver el curso Guitarra 7A. Su progreso se conserva." y,
   tras confirmar, aviso con la sugerencia del backend de regenerar el código.
5. En el detalle de usuario de HU-F-404: "Retirar de todos los cursos" (estudiantes) y enlace a sus
   cursos a cargo (docentes). El 409 de eliminar un docente con cursos enlaza a esta vista filtrada.

**No incluye**
- Editar el curso (nombre, ruta, código): sigue siendo del docente.

## Diseño
- **Composición**: patrón "Atril": encabezado, filtros en una fila, tabla densa; edición en `Drawer`.
- **Estados**: carga (`Skeleton`), vacío ("Este docente aún no tiene cursos." / "No hay cursos con
  estos filtros."), error (`MensajeError`), éxito (aviso que nombra curso y personas).

## Prompt de ejecución
```text
Ejecuta HU-F-405 en SIPE-SOUND-FULLSTACK. Convierte /admin/docentes en pestañas (Docentes con sus
cursos en un Drawer, y Preautorizaciones sin cambios) y agrega /admin/cursos con los estudiantes
de cada curso. Reasignar curso y retirar estudiante con Dialog de confirmación que nombra a las
personas y al curso. Consume HU-B-406 con TanStack Query. Antes de escribir JSX describe la
composición y espera confirmación. Solo tokens y src/shared/ui. Sin pruebas unitarias.
```

## Pasos
1. Pestañas en `DocentesPage` sin romper preautorizaciones.
2. API, hooks y tablas de docentes y cursos.
3. Diálogos de reasignar y retirar.
4. Enlaces desde HU-F-404.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Cursos de un docente
  Cuando abro a un docente en la pestaña Docentes
  Entonces veo sus cursos activos y archivados con el número de estudiantes

Escenario: Reasignar
  Cuando reasigno "Guitarra 7A" a Marta Ríos
  Entonces el curso aparece en la fila de Marta y desaparece de la del docente anterior

Escenario: Retirar estudiante
  Cuando retiro a Ana de "Guitarra 7A"
  Entonces Ana deja de aparecer en la lista del curso
  Y veo la sugerencia de regenerar el código
```

## Verificación manual
- Con el backend local: reasignar, entrar como el docente nuevo y ver el curso.
- Teclado en pestañas, tabla, Drawer y diálogos; capturas en 1280 px y 375 px.

## Definición de hecho específica
- [ ] La pestaña Preautorizaciones funciona igual que antes (mismo flujo de HU-F-313).
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
