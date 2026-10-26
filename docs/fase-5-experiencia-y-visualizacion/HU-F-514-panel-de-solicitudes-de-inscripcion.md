# HU-F-514 · Panel de solicitudes de inscripción

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-B-414, HU-F-513 |
| Rama | `hu/HU-F-514-panel-de-solicitudes-de-inscripcion` |

## Historia
**Como** docente o administrador
**quiero** ver las solicitudes de inscripción que faltan por aceptar y las ya resueltas
**para** decidir quién entra a mis cursos.

## Alcance
**Incluye**
1. Sección **Solicitudes** en el atril (`/docente/solicitudes`) para docentes y administradores.
2. Pestañas **Pendientes · Aceptadas · Rechazadas** con su total (en la URL: `?estado=`).
3. Cada fila: nombre del estudiante (sin correo), curso, fecha y, si ya se resolvió, quién y cuándo.
   En pendientes: **Aceptar** (inscribe) y **Rechazar**.
4. El docente ve las de **sus** cursos; el administrador, las de todos, con la marca "Curso sin
   docente" (solo él puede resolverlas).

**No incluye**
- Notificación por mensaje al estudiante (lo ve en su catálogo).
- Filtro por curso en la interfaz (el backend ya lo admite con `?curso_id=`).

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Aceptar
  Cuando pulso "Aceptar" en una solicitud pendiente
  Entonces el estudiante queda inscrito y la solicitud pasa a Aceptadas

Escenario: Separación por estado
  Cuando abro la pestaña Aceptadas
  Entonces veo quién la aceptó y cuándo

Escenario: Curso sin docente
  Dado un curso sin docente
  Entonces solo el administrador puede aceptar sus solicitudes
```
