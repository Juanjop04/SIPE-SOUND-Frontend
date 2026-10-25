# HU-F-404 · Administración: usuarios

| Campo | Valor |
|---|---|
| Fase | 4 · Cuentas y comunicación |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-313, HU-F-403, **HU-B-405**, **HU-B-407** |
| Rama | `hu/HU-F-404-admin-usuarios` |

## Historia
**Como** administrador
**quiero** una tabla con todas las cuentas y su estado, y acciones para reenviar el código, verificar, suspender, eliminar y permitir el cambio de nombre
**para** resolver en minutos los problemas de acceso de un grupo entero.

## Contexto
- La sección de administración solo tiene `/admin/docentes` (`src/features/admin/pages/DocentesPage.tsx`,
  preautorizaciones) y se enlaza desde `PanelAtril.tsx` cuando el rol es admin.
- HU-B-405 y HU-B-407 exponen `GET /admin/usuarios`, el detalle y las acciones.

## Alcance
**Incluye**
1. Página `/admin/usuarios` (`paths.admin.usuarios`), enlace "Usuarios" en `PanelAtril` (antes de "Docentes").
2. **Franja de cifras** (no tarjetas KPI): `Pendientes 12 · Activas 230 · Suspendidas 3`, cada cifra es
   un botón que aplica el filtro de estado.
3. **Filtros en la URL**: estado, rol, permiso de nombre y búsqueda (`?q=`, máx. 80).
4. **Tabla densa** (patrón "Atril", filas de 44 px, `Table` existente): casilla de selección ·
   Nombre y apellido · Correo (mono, completo) · Rol · Estado (píldora con texto: "Pendiente",
   "Activa", "Suspendida") · Último envío del código (solo pendientes: "Enviado hace 3 min" o
   "No se pudo enviar" en `danger` con texto) · Último acceso · Acciones (menú).
5. **Acciones por fila** (menú): Ver detalle · Reenviar código (pendientes) · Verificar manualmente
   (pendientes; pide motivo 10–300) · Suspender / Reactivar (motivo 10–300) · Permitir / Bloquear
   cambio de nombre · Eliminar.
6. **Acciones en lote** (barra fija abajo al seleccionar, `data-fijo="abajo"`): permitir o bloquear
   cambio de nombre (máx. 100, `POST /admin/usuarios/permisos`).
7. **Detalle** en `Drawer` ancho: datos, inscripciones y cursos a cargo, resumen de progreso y la
   historia de acciones del admin (lista con fecha en mono).
8. **Eliminar**: `Dialog` con consecuencias concretas ("Se borran su progreso, intentos e
   inscripciones. No se puede deshacer.") y campo para escribir el correo; el botón `danger` se
   habilita solo si coincide. Un 409 de docente con cursos muestra el mensaje y un enlace a
   "Reasignar cursos" (HU-F-405).
9. Tras "Reenviar código", la fila muestra "Enviando…" y consulta el detalle a los 5 s para mostrar
   "Enviado" o "No se pudo enviar".
10. Feature `admin`: `api/usuariosApi.ts`, hooks con TanStack Query (invalidación por fila y por totales).

**No incluye**
- Docentes con sus cursos, reasignar y revocar inscripciones (HU-F-405).
- Exportar.

## Diseño
- **Composición**: encabezado (`EncabezadoPagina`) "Usuarios" + franja de cifras; debajo, filtros en
  una fila; tabla a todo el ancho. Menos de 768 px: filas apiladas (nombre y estado; correo; menú de
  acciones), sin desplazamiento horizontal.
- **Metáfora**: "Atril" (tabla densa y ordenada). Estado de la cuenta con texto, nunca solo color.
- **Estados**: carga (`Skeleton` de 8 filas), vacío ("No hay cuentas con estos filtros." + "Quitar
  filtros"), error (`MensajeError` con reintentar), éxito de una acción (aviso `role="status"` que
  nombra a la persona: "Reenviamos el código a ana@colegio.edu.co.").

## Prompt de ejecución
```text
Ejecuta HU-F-404 en SIPE-SOUND-FULLSTACK. Agrega /admin/usuarios: franja de cifras por estado,
filtros en la URL, tabla densa con selección, acciones por fila (reenviar código, verificar
manualmente con motivo, suspender/reactivar con motivo, permiso de nombre, eliminar con
confirmación escribiendo el correo) y permiso de nombre en lote. Detalle en Drawer. Consume
HU-B-405 y HU-B-407 con TanStack Query. Antes de escribir JSX describe la composición y espera
confirmación. Solo tokens y src/shared/ui; sin tarjetas KPI ni gráficos. Sin pruebas unitarias.
```

## Pasos
1. `paths.admin.usuarios`, ruta y enlace.
2. API, tipos y hooks.
3. Tabla, filtros, franja de cifras.
4. Menú de acciones, diálogos (motivo, eliminar) y barra de lote.
5. Drawer de detalle.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Quién no ha verificado
  Cuando pulso la cifra "Pendientes"
  Entonces la tabla muestra solo cuentas pendientes con el estado de su último envío

Escenario: Reenviar
  Dado una cuenta con "No se pudo enviar"
  Cuando elijo "Reenviar código"
  Entonces veo "Enviando…" y luego "Enviado hace un momento"

Escenario: Suspender
  Cuando suspendo una cuenta con el motivo "Retirado del colegio en octubre"
  Entonces la fila muestra "Suspendida"

Escenario: Eliminar con confirmación
  Cuando abro Eliminar
  Entonces el botón está deshabilitado hasta que escribo el correo exacto de la cuenta

Escenario: Permiso en lote
  Cuando selecciono 30 estudiantes y elijo "Permitir cambio de nombre"
  Entonces veo "Listo: 30 cuentas pueden cambiar su nombre."
```

## Verificación manual
- Cada acción contra el backend local; teclado en tabla, menú, diálogos y Drawer.
- Capturas en 1280 px y 375 px.

## Definición de hecho específica
- [ ] Filtros y orden sobreviven a recargar la página (URL).
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
