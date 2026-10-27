# HU-F-521 · Rediseño de Usuarios, Mi cuenta y Docentes

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Should |
| Estimación | 13 puntos |
| Depende de | HU-F-404, HU-F-403, HU-F-519, **HU-B-521** |
| Rama | `hu/HU-F-521-rediseno-admin-usuarios-cuenta-docentes` |

## Historia
**Como** administrador
**quiero** gestionar cuentas, mi propia cuenta y el seguimiento de docentes en pantallas más claras y densas
**para** cambiar roles, suspender o corregir datos sin salir de la tabla y con confirmaciones que dicen qué cambia.

## Contexto
Las tres pantallas existen (HU-F-404, HU-F-403, HU-F-519). El equipo entregó prototipos en
`docs/disenos/` (`usuarios`, `mi-cuenta`, `docentes`) y un prompt de implementación
(`docs/disenos/PROMPT_IMPLEMENTACION.md`). Los prototipos son especificación, no código: se
reimplementan con los componentes y tokens del repositorio.

## Alcance
**Incluye**
1. **Usuarios** (`/admin/usuarios`)
   - Cifras por estado compactas (Todas, Activas, Pendientes, Suspendidas) que filtran; desde 820 px
     hacia abajo, las mismas como pestañas subrayadas.
   - Filtros: búsqueda, Rol (con conteos), Cambio de nombre (Permitido/Bloqueado) y Orden
     (Nombre, Apellido, Último acceso, Rol).
   - Tabla en rejilla (tarjetas por debajo de 820 px): selector de rol en la fila, estado en texto de
     color, actividad (último acceso y línea según estado), interruptores «Cuenta activa» y de cambio
     de nombre, y acciones de icono (reenviar código y verificar si está pendiente, editar, eliminar).
   - Cambiar rol (fila, lote o panel), suspender (fila, lote o panel) y eliminar piden confirmación en
     diálogo; reactivar y los permisos no. Cancelar deja el valor original.
   - Barra de acciones en lote: cambiar rol, activar, suspender, reenviar código.
   - Panel de edición (Drawer de 520 px): nombre, apellido y correo, rol con descripción, acceso,
     correo sin verificar, eliminar y pie fijo con «Hay cambios sin guardar». Conserva cursos,
     progreso e historia de acciones debajo.
   - La cuenta propia no cambia de rol, no se suspende ni se elimina; su correo se cambia en Mi cuenta.
2. **Mi cuenta** (`/cuenta`): encabezado de identidad, índice de secciones, secciones en dos columnas
   (Datos personales con «Descartar» y vista previa, Correo, Contraseña, Apariencia, Sesión). Correo
   y contraseña usan paneles dentro de la página (ya no un diálogo) con los mismos pasos seguros.
3. **Docentes** (`/admin/docentes`): cifras compactas que abren la pestaña Docentes ya filtrada,
   leyenda de estados, flecha al detalle, orden «Más cursos» y «Más estudiantes»; preautorizaciones
   con estado Pendiente/Aplicada en texto y revocar con ícono; detalle con botones «Enviar mensaje» y
   «Ver en Usuarios», cifras (cursos, estudiantes, avance promedio, sin avance 7 días), pestañas con
   contador y **un solo** estado vacío en Actividad.
4. **Panel de perfil** de la barra superior: iniciales, nombre y rol; menú con nombre y correo en
   mono, Mi cuenta, Ver como estudiante y Cerrar sesión con íconos.
5. **Docentes, a detalle:** nombre y correo en las listas, contadores en la cabecera y en las
   pestañas, «Asignar curso» en popup con cursos sin docente, acciones de curso con íconos,
   avance con barra, línea de tiempo con ícono por tipo y filtro Contenido/Evaluaciones/Mensajes/
   Inicios de sesión, y filtros de búsqueda, curso y orden en Estudiantes.
6. Token nuevo `aviso` (pendiente o por completar) y componentes compartidos `CifraCompacta` y `Tabs`
   con contador; `Drawer` de 520 px.

**No incluye (se confirma con el equipo; §9 del prompt)**
- «Exportar CSV» de Usuarios y «Avisos por correo» de Mi cuenta.
- Guardar el tema en la cuenta: sigue en el dispositivo, como el selector de la barra superior.
- Nuevo AppShell: se conserva el de HU-F-507.

## Diferencias con el diseño (decididas al adaptarlo al modelo existente)
- El cambio de correo en Mi cuenta mantiene la reautenticación por código del contrato (HU-B-404):
  contraseña actual → código al correo → correo nuevo → código al correo nuevo.
- Un administrador no suspende ni elimina a **otro** administrador (regla vigente de HU-B-405).
- Verificar manualmente ya no pide motivo; queda registrado el texto por defecto.

## Diseños de referencia
Se versionan en `docs/disenos/` (`usuarios.dc.html`, `mi-cuenta.dc.html`, `docentes.dc.html` y
`PROMPT_IMPLEMENTACION.md`).

## Prompt de ejecución
```text
Ejecuta HU-F-521 en SIPE-SOUND-FULLSTACK. Reimplementa Usuarios, Mi cuenta y Docentes según
docs/disenos/ con los tokens y componentes existentes. Consume HU-B-521. Solo tokens; sin
degradados, emojis ni hex. Sin pruebas unitarias.
```
