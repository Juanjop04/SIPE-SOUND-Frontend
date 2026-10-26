# HU-F-515 · Solicitudes de cambio de nombre pendientes de aceptación

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-B-415 |
| Rama | `hu/HU-F-515-solicitudes-de-cambio-de-nombre` |

## Historia
**Como** administrador
**quiero** ver las solicitudes de cambio de nombre como solicitudes pendientes, separadas entre estudiantes y docentes
**para** saber con precisión a quién le voy a habilitar el cambio.

## Alcance
**Incluye**
1. Sección **Cambios de nombre** en el atril del administrador (`/admin/solicitudes-nombre`).
2. Primer nivel **Estudiantes · Docentes** (con sus pendientes) y segundo **Pendientes · Habilitadas ·
   Rechazadas** (con totales); ambos en la URL.
3. Cada fila: nombre completo, el mensaje de la persona, la fecha y, si ya se resolvió, quién y
   cuándo; **Habilitar cambio** (activa el permiso de esa cuenta) y **Rechazar**.
4. En **Mi cuenta**: si la solicitud sigue pendiente se avisa y no se puede enviar otra; si fue
   rechazada se avisa y se puede volver a pedir.

**No incluye**
- Quitar el permiso tras editar (sigue manual en Usuarios).

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Separación
  Dado solicitudes de un estudiante y de un docente
  Cuando abro la pestaña Docentes
  Entonces solo veo la del docente

Escenario: Habilitar
  Cuando pulso "Habilitar cambio"
  Entonces esa cuenta puede editar su nombre y la solicitud pasa a Habilitadas

Escenario: Ya pendiente
  Dado que ya envié una solicitud
  Entonces Mi cuenta me dice que está pendiente y no deja enviar otra
```
