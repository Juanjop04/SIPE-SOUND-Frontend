# HU-F-519 · Panel de docentes: administración, cursos asignados y monitoreo

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Should |
| Estimación | 8 puntos |
| Depende de | HU-F-405, HU-F-506, HU-F-518, **HU-B-417**, **HU-B-418** |
| Rama | `hu/HU-F-519-panel-de-docentes-y-monitoreo` |

## Historia
**Como** administrador
**quiero** un panel de docentes donde vea quién está activo, qué cursos tiene cada uno y qué hizo en la plataforma
**para** repartir los cursos con criterio y actuar antes de que un grupo se quede sin acompañamiento.

## Contexto
- `/admin/docentes` (`DocentesPage.tsx`) tiene hoy dos pestañas (HU-F-405): Docentes (tabla con
  Drawer) y Preautorizaciones. La tabla solo muestra nombre, correo, estado, cursos, estudiantes y
  último acceso: no dice si el docente hace algo ni permite administrar sus cursos sin abrir
  varios diálogos.
- El selector de docente de Reasignar es una lista simple, sin contexto para decidir a quién dárselo.
- HU-B-418 entrega el estado de actividad, el resumen y la línea de tiempo.

## Alcance
**Incluye**
1. **`/admin/docentes`** con tres pestañas (`Tabs`, `?tab=` en la URL): **Resumen**, **Docentes**
   y **Preautorizaciones** (esta última sin cambios).
   - **Resumen**: fila de cifras con datos reales (docentes activos, inactivos, sin actividad,
     cursos sin docente) y debajo "Requieren atención": docentes `inactivo` o `sin_actividad`
     con cursos asignados, con su último movimiento y el botón "Abrir".
   - **Docentes**: tabla densa con Nombre · Estado de actividad (texto + forma, no solo color) ·
     Última actividad · Acciones 30 días · Cursos · Estudiantes. Búsqueda, filtro por estado de
     actividad y orden, todo en la URL.
2. **Detalle del docente** en la ruta `paths.admin.docente(id)` (`/admin/docentes/:id`) con
   encabezado (nombre, correo, estado de cuenta y de actividad, última actividad) y pestañas:
   - **Cursos asignados**: un renglón por curso (activos y archivados) con estudiantes, avance
     promedio, estudiantes sin actividad en 7 días y bloques en ruta; acciones **Reasignar** y
     **Quitar docente** (diálogos de HU-F-518) y **Asignar curso** que lista los cursos sin docente.
   - **Actividad**: gráfica por día (Recharts, `src/shared/ui/graficos/`) con selector de 7, 28 y
     90 días, distribución por tipo y **alternativa en tabla** (05 §6); debajo, línea de tiempo
     filtrable por tipo y curso, paginada ("Publicó una evaluación en Guitarra 7A · hace 2 días").
   - **Estudiantes**: los de sus cursos, con enlace al seguimiento (HU-F-506); sin correos completos.
3. **Selector de docente** nuevo para Asignar y Reasignar: búsqueda y, por docente, sus cursos
   actuales, estudiantes y estado de actividad, para decidir con contexto. Un docente `sin_actividad`
   se muestra con la advertencia "Sin actividad hace más de 30 días" (sin impedir elegirlo).
4. Sustituye el `Drawer` de docentes de HU-F-405 (se conserva su contenido dentro de Cursos asignados).

**No incluye**
- Alertas por correo al admin.
- Comparar docentes entre sí con un ranking.
- Monitoreo de estudiantes (ya está en el panel del docente, HU-F-506).

## Diseño
- **Composición**: patrón "Atril": encabezado, filtros en una fila, tabla densa; el detalle usa
  pestañas y una sola columna de lectura. Más información por pantalla, menos decoración.
- **Gráficos**: Recharts con colores de tokens; cada serie lleva texto o forma además del color,
  y una tabla equivalente.
- **Estados**: carga (`Skeleton`), vacío ("Este docente aún no ha hecho nada en estos días." /
  "Ningún docente cumple estos filtros."), error (`MensajeError` con reintentar), éxito (aviso que nombra curso y persona).
- **Prohibido** (05 §6): degradados, tarjetas con ícono sin dato, emojis, hex.

## Prompt de ejecución
```text
Ejecuta HU-F-519 en SIPE-SOUND-FULLSTACK. Rediseña /admin/docentes con las pestañas Resumen,
Docentes y Preautorizaciones (esta sin cambios) y crea /admin/docentes/:id con Cursos asignados,
Actividad (gráfica por día con Recharts + alternativa en tabla + línea de tiempo) y Estudiantes.
Crea un selector de docente con contexto (cursos actuales, estudiantes y estado de actividad) y
úsalo en Asignar y Reasignar. Consume HU-B-417 y HU-B-418 con TanStack Query. Filtros y pestañas
en la URL. Antes de escribir JSX describe la composición y espera confirmación. Solo tokens y
src/shared/ui; sin degradados ni emojis. Sin pruebas unitarias.
```

## Pasos
1. Rutas, API y hooks de actividad (`features/admin`), con claves de consulta por filtro.
2. Pestañas Resumen y Docentes; tabla con filtros en la URL.
3. Detalle del docente: Cursos asignados, Actividad y Estudiantes.
4. Selector de docente con contexto y reemplazo en los diálogos.
5. Retirar el `Drawer` anterior sin romper Preautorizaciones.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Ver quién necesita atención
  Cuando abro Resumen
  Entonces veo los docentes inactivos o sin actividad que tienen cursos asignados

Escenario: Filtrar por actividad
  Cuando filtro la tabla por "Inactivo"
  Entonces solo veo docentes sin actividad entre 8 y 30 días
  Y el filtro queda en la URL

Escenario: Cursos asignados de un docente
  Cuando abro a un docente
  Entonces veo sus cursos con estudiantes, avance promedio y estudiantes sin actividad

Escenario: Actividad en el tiempo
  Cuando abro Actividad y elijo 28 días
  Entonces veo la gráfica por día, la misma información en tabla y la línea de tiempo

Escenario: Elegir con contexto
  Cuando asigno un curso y abro el selector
  Entonces cada docente muestra sus cursos actuales y su estado de actividad

Escenario: Preautorizaciones intactas
  Cuando abro la pestaña Preautorizaciones
  Entonces funciona igual que antes (HU-F-313)
```

## Verificación manual
- Con el backend local (HU-B-417 y HU-B-418): generar actividad como docente y verla reflejada.
- Teclado en pestañas, tabla, selector y gráfica; capturas en 1280 px y 375 px, claro y oscuro.

## Definición de hecho específica
- [ ] `npm run lint`, `npm run typecheck` y `npm run build` en verde.
- [ ] Recharts solo entra al paquete de esta ruta (carga diferida).
- [ ] Cada gráfica tiene alternativa en tabla y no depende solo del color.
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
