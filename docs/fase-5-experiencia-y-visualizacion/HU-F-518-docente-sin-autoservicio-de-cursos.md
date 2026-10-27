# HU-F-518 · El docente deja de asignarse cursos: lo hace el administrador

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-516, **HU-B-417** |
| Rama | `hu/HU-F-518-docente-sin-autoservicio-de-cursos` |

## Historia
**Como** administrador
**quiero** asignar y quitar docentes de los cursos desde mi panel
**para** que ningún docente tome o deje cursos por su cuenta, y como **docente** saber que un curso es mío porque me llegó la asignación.

## Contexto
- HU-F-516 dio al docente **Cursos disponibles**, **Asignarme**, **Retirarme** y **Nuevo curso**.
  HU-B-417 retira esas rutas del backend (404).
- El administrador ya tiene **Nuevo curso** y **Reasignar** en Todos los cursos
  (`/admin/cursos`, HU-F-405 y HU-F-516).

## Alcance
**Incluye**
1. **Docente** (`/docente/cursos`): se elimina la sección Cursos disponibles, los botones
   **Asignarme**, **Retirarme** y **Nuevo curso**, y sus hooks y llamadas a la API. Sigue pudiendo
   editar, archivar, regenerar el código y definir la ruta de **sus** cursos.
2. **Docente sin cursos**: estado vacío con título "Aún no tienes cursos asignados" y texto "El
   administrador te asignará uno y te avisaremos por correo. Cuando llegue, podrás crear su
   contenido." Sin botón de acción.
3. **Contenido sin curso**: en Contenido y Evaluaciones los botones de crear aparecen
   desactivados (no ocultos) con la razón visible junto a ellos: "Necesitas un curso asignado."
   Si el backend responde 403 con ese mensaje, se muestra con `MensajeError`.
4. **Administrador** en Todos los cursos y en el `Drawer` del docente (HU-F-405):
   - **Asignar docente** (curso sin docente) y **Reasignar** (curso con docente), con el mismo
     `Dialog` y selector de docente activo.
   - **Quitar docente**: `Dialog` "**Guitarra 7A** queda sin docente y disponible. Sus 28
     estudiantes siguen inscritos."
   - Resumen en el diálogo de asignar: "**Marta Ríos** recibirá un correo con el curso asignado."
   - Tras confirmar, aviso con curso y persona. Si el correo falló, el aviso lo dice sin deshacer
     la asignación.
5. Se actualiza el texto de ayuda de **Nuevo curso** del admin: "Si eliges un docente, le llegará un correo."

**No incluye**
- El panel de docentes y su monitoreo (HU-F-519).
- Solicitudes del docente para pedir un curso.

## Diseño
- Composición: sin cambios de patrón (Atril). Es sobre todo **quitar** controles; el estado vacío
  y los diálogos usan `src/shared/ui` existente.
- Estados: carga (`Skeleton`), vacío (punto 2), error (`MensajeError`), éxito (aviso que nombra curso y persona).
- Sin íconos decorativos ni tarjetas sin dato real (05 §6).

## Prompt de ejecución
```text
Ejecuta HU-F-518 en SIPE-SOUND-FULLSTACK. Elimina del docente "Cursos disponibles", Asignarme,
Retirarme y Nuevo curso (componentes, hooks, llamadas en la API y rutas). Agrega el estado vacío
"Aún no tienes cursos asignados" y desactiva con razón visible los botones de crear contenido y
evaluaciones cuando no tiene cursos activos. En el admin agrega Asignar docente y Quitar docente
(Dialog con confirmación que nombra el curso, el docente y el número de estudiantes) en
Todos los cursos y en el Drawer del docente. Consume HU-B-417 con TanStack Query. Antes de escribir
JSX describe la composición y espera confirmación. Solo tokens y src/shared/ui. Sin pruebas unitarias.
```

## Pasos
1. Retirar la parte del docente de HU-F-516 (y verificar que `features/admin` no la importe).
2. Estado vacío y botones desactivados en contenido y evaluaciones.
3. Diálogos de asignar y quitar docente en el admin; invalidar las consultas de cursos y docentes.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Ya no hay autoservicio
  Dado un docente con sesión iniciada
  Cuando abre Cursos
  Entonces no ve "Cursos disponibles", "Asignarme", "Retirarme" ni "Nuevo curso"

Escenario: Docente sin cursos
  Dado un docente sin cursos asignados
  Cuando abre Cursos
  Entonces ve "Aún no tienes cursos asignados" y los botones de crear contenido están desactivados con su razón

Escenario: Asignar desde el admin
  Cuando el admin asigna "Guitarra 7A" a Marta Ríos
  Entonces el curso aparece en la fila de Marta
  Y el aviso dice que Marta recibirá un correo

Escenario: Quitar docente
  Cuando el admin quita al docente de "Guitarra 7A"
  Entonces el curso aparece como "Sin docente" y sus estudiantes siguen inscritos
```

## Verificación manual
- Con el backend local (HU-B-417): asignar un curso y revisar la bandeja del docente.
- Entrar como docente nuevo (sin cursos) y como docente con curso.
- Teclado en diálogos; capturas en 1280 px y 375 px.

## Definición de hecho específica
- [ ] `npm run lint`, `npm run typecheck` y `npm run build` en verde.
- [ ] No quedan referencias a las rutas retiradas (`asignarme`, `retirarme`, `disponibles`, `POST /docente/cursos`).
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
