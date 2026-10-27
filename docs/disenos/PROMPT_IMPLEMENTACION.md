# Prompt de implementación — Rediseño del panel de administración de SIPE-SOUND

> Copia este documento completo como instrucción para el agente o desarrollador que va a implementar. Los archivos de la carpeta `disenos/` son la referencia visual y de comportamiento.

---

## 0. Instrucción principal

Implementa en el proyecto SIPE-SOUND el rediseño de tres pantallas del panel de administración: **Usuarios**, **Mi cuenta** y **Docentes**. Hazlo:

1. **Sobre el stack que ya existe en el repositorio.** Antes de escribir código, revisa el repo e identifica el framework del frontend (corre con Vite en `localhost:5173`), la librería de estilos, el router, el cliente HTTP, el backend, el ORM y la autenticación. No agregues frameworks nuevos. Reutiliza los componentes, hooks, servicios y convenciones que ya existen.
2. **Respetando la ruta actual de cada pantalla:** `/admin/usuarios`, `/cuenta` y `/admin/docentes`. El detalle de un docente sigue en `/admin/docentes/:id?tab=cursos|actividad|estudiantes`.
3. **Con datos reales de la API.** Los datos dentro de los diseños son de prueba (ver §9). Reemplázalos por llamadas al backend.
4. **Con las reglas de negocio aplicadas también en el servidor** (ver §6). El frontend solo refleja las reglas; el backend las hace cumplir.
5. **Por fases** (ver §11). Al terminar cada fase, verifica sus criterios de aceptación (ver §10) antes de seguir.

Si algo de este documento choca con lo que ya existe en el código (nombres de campos, endpoints, estados), adapta el diseño al modelo existente y anota la diferencia en el PR. No renombres entidades existentes sin necesidad.

---

## 1. Cómo leer los archivos de diseño

| Archivo | Pantalla |
|---|---|
| `disenos/usuarios.dc.html` | Administración › Usuarios (lista, edición, confirmaciones) |
| `disenos/mi-cuenta.dc.html` | Mi cuenta (perfil del usuario conectado) |
| `disenos/docentes.dc.html` | Administración › Docentes (resumen, lista, preautorizaciones y detalle de un docente) |

Son prototipos interactivos en un formato de componente (`.dc.html`). **No se copian tal cual**: se usan como especificación.

- **Marcado:** está dentro de `<x-dc>…</x-dc>`. Los estilos de cada elemento están en atributos `style`.
- **Estilos globales y responsive:** están en `<helmet><style>`. Ahí están las clases (`.tr`, `.stat`, `.tg`, `.modal`…) y las *container queries* de cada punto de quiebre.
- **Lógica:** está en `<script type="text/x-dc">` (`class Component extends DCLogic`). `renderVals()` calcula todo lo que pinta la vista. Los *handlers* que hay ahí describen exactamente qué pasa en cada clic, validación y confirmación.
- **Sintaxis de plantilla:** `{{valor}}` inserta un dato. `<sc-for list="{{items}}" as="x">` repite un bloque. `<sc-if value="{{cond}}">` lo muestra u oculta.
- **Enlaces entre pantallas:** los enlaces `Main.dc.html`, `MiCuenta.dc.html` y `Docentes.dc.html` corresponden a las rutas de Usuarios, Mi cuenta y Docentes.
- **Tweak `vista`:** el `data-props` de algunos archivos define `vista`, que solo sirve para mostrar un estado en el prototipo. No forma parte del producto.

---

## 2. Sistema visual

### 2.1 Colores (crear como variables/tokens)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0B1020` | Fondo general y navegación |
| `--surface` | `#11162B` | Tablas, panel lateral de edición |
| `--surface-2` | `#171D33` | Popups, menús, ítem activo del menú |
| `--surface-input` | `#0F1428` | Campos de formulario, encabezado de tabla (`#0E1326`) |
| `--line` | `#232A47` | Bordes de contenedores |
| `--line-soft` | `#1F2643` | Separadores de filas |
| `--line-strong` | `#2A3152` | Bordes de campos y botones secundarios |
| `--accent` | `#6257F5` | Botones primarios, selección, interruptores encendidos, pestaña activa |
| `--accent-hover` | `#5348E6` | Hover del primario |
| `--lavender` | `#B9C8FF` | Iconos, enlaces, títulos de sección secundarios |
| `--text` | `#F5F6FF` | Texto principal |
| `--text-2` | `#AEB6D9` | Texto secundario |
| `--muted` | `#9AA3C7` | Metadatos, etiquetas, ayudas |
| `--success` | `#34D399` | Activa, verificado, completado |
| `--warning` | `#FBBF24` | Pendiente, inactivo, avisos |
| `--danger-text` | `#FCA5A5` | Suspendida, errores |
| `--danger` | `#DC2626` | Botón de confirmación destructiva (hover `#B91C1C`) |
| `--focus` | `#8B83FF` | Contorno de foco (`outline: 2px`) |

Todas las combinaciones de texto cumplen un contraste de al menos 4.5:1 sobre sus fondos. No uses colores fuera de esta tabla.

### 2.2 Tipografía

- **IBM Plex Sans** (400/500/600/700) para toda la interfaz.
- **IBM Plex Mono** (400/500) para correos, fechas, contadores y números de tablas (`font-variant-numeric: tabular-nums`).
- **Tamaños:** título de página 30px/700 (26px en móvil), título de sección 17px/700, cuerpo 14–15px, metadatos 12–13px.

### 2.3 Forma y estilo

- **Radios:** 6px en botones, campos y tarjetas; 8px en contenedores de tabla; 10px en popups.
- **Superficies:** sin degradados, sin sombras decorativas y sin bordes laterales de color. Solo llevan sombra los popups, los menús y el *toast*.
- **Estados:** se muestran con texto en color (Activa / Pendiente / Suspendida), no con píldoras ni puntos.
- **Acciones de fila:** son botones de icono de 36×36 con `aria-label` y `title`. Editar usa el icono de lápiz (borde `--line-strong`, que pasa a `--accent` en hover). Eliminar usa la papelera (hover rojo).
- **Objetivos táctiles:** de al menos 44px de alto en móvil.

### 2.4 Componentes compartidos (crear una vez y reutilizar)

- **`StatCard` compacta:** una línea con el número (mono, 20px, en color según estado) y la etiqueta. Mide 44px de alto y 150–220px de ancho. Cuando filtra, es un `<button>` con `aria-pressed`.
- **`Tabs` subrayadas:** la pestaña activa lleva una línea inferior de 2px en `--accent` y un contador mono.
- **`DataTable` responsive:**
  - **Escritorio:** filas con CSS grid y columnas fijas. Entre 821 y 1100px se desplaza horizontalmente.
  - **≤820px:** cada fila es una tarjeta apilada. Cada celda muestra su etiqueta, tomada de `data-label`.
- **`Toggle`:** un `<button aria-pressed>` de 36×20. Encendido usa `--accent`. Deshabilitado tiene opacidad 0.4 y `cursor: not-allowed`.
- **`ConfirmDialog` (popup):**
  - Se centra con fondo oscuro (`rgba(5,8,18,.66)`) y se cierra al hacer clic fuera o con Cancelar.
  - Usa `role="dialog"` o `alertdialog` y `aria-modal="true"`, con foco atrapado. Escape cierra.
  - Muestra el título, una caja con el sujeto (nombre y correo en mono), la explicación de qué cambia y una casilla opcional de aviso por correo.
  - Botones: Cancelar (secundario) y la acción (primaria o roja si es destructiva).
- **`Drawer` lateral:** 520px a la derecha, a pantalla completa en móvil. Tiene pie fijo con «Hay cambios sin guardar», Cancelar y Guardar.
- **`Toast`:** abajo al centro, fondo claro `--text` con texto `--bg`, check verde. Se oculta a los 2.8 s.
- **`AppShell`:**
  - Menú lateral de 232px. En ≤960px se oculta y se abre con un botón de hamburguesa como panel superpuesto con fondo.
  - Barra superior con migas de pan (se ocultan en móvil), selector de tema, mensajes y botón de perfil.
  - El botón de perfil abre un menú con: Mi cuenta, Ver como estudiante y Cerrar sesión.

### 2.5 Puntos de quiebre

| Ancho | Cambio |
|---|---|
| ≤1100px | Los filtros pasan a 2 columnas (la búsqueda ocupa toda la fila) |
| ≤960px | El menú lateral se oculta (hamburguesa), se ocultan las migas y el selector de tema, y el padding baja a 16px |
| ≤820px | Las tablas pasan a tarjetas y las **StatCards de Usuarios se reemplazan por pestañas subrayadas** |
| ≤560px | Los filtros y los formularios de 2 columnas pasan a 1 columna, y se oculta el nombre junto al avatar |

Si el proyecto no usa *container queries*, puedes implementarlo con *media queries*.

---

## 3. Pantalla: Usuarios (`disenos/usuarios.dc.html`)

### 3.1 Estructura

1. **Encabezado:** título «Usuarios» con el total en mono, una descripción y el botón «Exportar CSV» (ver §9).
2. **Filtro por estado:**
   - **PC:** 4 StatCards compactas: Todas, Activas, Pendientes y Suspendidas. Al hacer clic se filtra; un segundo clic vuelve a «Todas».
   - **≤820px:** las tarjetas se ocultan y se muestran pestañas subrayadas con los mismos 4 valores.
3. **Filtros:** búsqueda (nombre, apellido o correo), Rol (con conteos), Cambio de nombre (Cualquiera, Permitido o Bloqueado) y Ordenar por (Nombre, Apellido, Último acceso o Rol).
4. **Tabla.** Las columnas son:
   - casilla de selección;
   - Nombre y correo, con el nombre como botón que abre la edición. Si falta el apellido, aparece la etiqueta «Sin apellido» en `--warning`;
   - Rol, con un selector en línea;
   - Estado;
   - Actividad, con el último acceso y una línea según el estado: «Código hace X», «Correo verificado», «Sin código enviado» o «Suspendida el …»;
   - Permisos, con los interruptores «Cuenta activa» y cambio de nombre;
   - Acciones, que muestra reenviar código y verificar solo si la cuenta está pendiente, además de editar (lápiz) y eliminar.
5. **Barra de acciones masivas** (cuando hay selección): «N seleccionadas», Cambiar rol a…, Activar, Suspender, Reenviar código y Quitar selección.
6. **Pie:** «N de M cuentas» y la paginación.

### 3.2 Panel de edición (drawer)

- **Encabezado:** nombre completo, estado, rol actual y último acceso.
- **Datos personales:** **Nombre** y **Apellido** (campos separados, ambos obligatorios) y Correo.
  - Si cambias el correo aparece el aviso «se enviará un código para verificar el correo nuevo».
- **Rol:** tres opciones con radio y descripción:
  - Estudiante: «Toma cursos, presenta evaluaciones y ve su progreso.»
  - Docente: «Crea contenido y califica en los cursos que tiene a cargo.»
  - Administrador: «Gestiona usuarios, roles, cursos y configuración.»
  - Si cambias el rol aparece «Te pediremos confirmar el cambio de rol al guardar».
- **Acceso:**
  - Cuenta activa.
  - Permitir cambio de nombre. Se bloquea, encendido, cuando el rol es Administrador, con el texto «Los administradores siempre pueden cambiar su nombre».
- **Correo sin verificar** (solo si la cuenta está pendiente): Reenviar código y Verificar manualmente.
- **Eliminar cuenta:** abre el popup de confirmación.
- **Pie:** el botón Guardar está deshabilitado si no hay cambios o hay errores.
- **Tu propia cuenta:** si abres la del administrador conectado, se ve la nota «Es tu cuenta…» y quedan deshabilitados el rol, Cuenta activa y Eliminar.

### 3.3 Confirmaciones (todas en popup)

| Acción | Cuándo aparece | Contenido | Botón |
|---|---|---|---|
| **Cambiar rol** | Al cambiar el selector de la fila, al cambiar el rol en bloque o al guardar el panel con el rol cambiado | Sujeto, cambio de rol (por ejemplo «Docente → Administrador») o lista de cuentas en bloque, «Qué cambia» según el rol de destino y la casilla «Avisar por correo del cambio» | «Sí, hacer administrador» o «Confirmar cambio» |
| **Suspender** | Al apagar «Cuenta activa» en la fila, al suspender en bloque o al guardar el panel con la cuenta desactivada | «No podrá iniciar sesión ni ver sus cursos hasta que la reactives. Su progreso se conserva.» y la casilla de aviso por correo | «Sí, suspender» (rojo) |
| **Eliminar** | Con la papelera o desde el panel | Nombre, correo, rol y «Se borrará la cuenta con su progreso, evaluaciones y mensajes. Esta acción no se puede deshacer.» | «Sí, eliminar cuenta» (rojo) |

- Reactivar una cuenta **no** pide confirmación.
- Si cancelas, el valor original se mantiene, porque el selector está controlado por el estado.

Lo que dice «Qué cambia» según el rol de destino:

- **Administrador:**
  - Podrá gestionar usuarios, cambiar roles y suspender cuentas.
  - Tendrá acceso a todos los cursos, contenidos y a la configuración.
  - Podrá cambiar su nombre sin pedir permiso.
- **Docente:**
  - Podrá crear contenido y calificar evaluaciones en sus cursos.
  - No podrá gestionar usuarios ni la configuración.
- **Estudiante:**
  - Solo verá los cursos en los que esté inscrito.
  - Pierde la creación de contenido y las calificaciones.

Si la cuenta era Administrador, se agregan:

- «Dejará de ver el panel de administración.»
- «El cambio de nombre quedará bloqueado; puedes permitirlo de nuevo después.»

### 3.4 Feedback

Cada acción exitosa muestra un *toast*. Ejemplos:

- «Juanjo Pajón ahora es Administrador · se envió un aviso por correo»
- «2 cuentas suspendidas»
- «Código reenviado a …»

Si la API falla, muestra el error y deja la interfaz como estaba (no apliques cambios optimistas sin revertirlos).

---

## 4. Pantalla: Mi cuenta (`disenos/mi-cuenta.dc.html`)

- **Encabezado de identidad:** iniciales en un bloque lavanda de 76px, nombre completo, rol, correo (mono), «Verificado el …» y el botón «Ver como estudiante».
- **Índice de secciones:** columna izquierda de 184px. En ≤1100px pasa a una fila horizontal desplazable.
- **Cada sección:** título y descripción a la izquierda, controles a la derecha. En ≤960px se apila.

Secciones:

1. **Datos personales:** Nombre y Apellido. Al editar aparece una barra con Guardar, Descartar y la vista previa «Se mostrará como …».
2. **Correo:** muestra el correo actual y cuándo se verificó. «Cambiar correo» abre dos pasos:
   1. Correo nuevo y contraseña actual, luego «Enviar código».
   2. Código de 6 dígitos (solo números, mono, espaciado), con Confirmar y Reenviar código.
3. **Contraseña:** «Cambiar contraseña» abre la contraseña actual, la nueva y su repetición, y la casilla «Mostrar contraseñas». Los requisitos se marcan en vivo:
   - al menos 8 caracteres;
   - una mayúscula;
   - un número;
   - las dos coinciden.

   Al guardar se cierran las sesiones en otros dispositivos.
4. **Apariencia:** tema Sistema, Claro u Oscuro (radios en grupo segmentado). Se guarda en la cuenta.
5. **Avisos por correo:** solicitudes de registro, mensajes nuevos y evaluaciones entregadas (ver §9).
6. **Sesión:** Cerrar sesión.

---

## 5. Pantalla: Docentes (`disenos/docentes.dc.html`)

### 5.1 Lista (`/admin/docentes`)

Pestañas: **Resumen**, **Docentes (N)** y **Preautorizaciones (N)**.

- **Resumen:**
  - StatCards: Activos, Inactivos, Sin actividad y Cursos sin docente (en `--danger-text` si es mayor que 0). Las tres primeras abren la pestaña Docentes ya filtrada.
  - Leyenda de estados (ver §6.4).
  - Tabla «Requieren atención»: docentes **inactivos o sin actividad que tienen cursos**. Columnas: Docente (nombre y correo), Estado, Último movimiento, Cursos y una flecha para ver el detalle.
- **Docentes:**
  - Búsqueda (nombre, apellido o correo), Actividad (Todos, Activos, Inactivos o Sin actividad) y Ordenar (Nombre, Más cursos o Más estudiantes).
  - Columnas: Nombre y correo, Actividad, Última actividad, Acciones 30 d, Cursos, Estudiantes (únicos) y la flecha.
- **Preautorizaciones:**
  - Campo de correo y el botón «Autorizar». Valida el formato y no permite duplicados. Debajo, la ayuda «Recibirá el rol docente cuando se registre y confirme este correo.»
  - Tabla con Correo, Estado (**Pendiente** en `--warning` o **Aplicada** en `--success`), Autorizado (fecha) y Acciones.
  - Solo las pendientes se pueden revocar (papelera y popup). Las aplicadas muestran «Ya registrado».

### 5.2 Detalle (`/admin/docentes/:id`)

- **Encabezado:** «‹ Docentes» para volver, nombre, correo (mono), estado de la cuenta, estado de actividad y última actividad. Botones: «Enviar mensaje» y «Ver en Usuarios» (abre `/admin/usuarios` con ese usuario).
- **StatCards:** Cursos, Estudiantes (únicos), Avance promedio y Sin avance 7 días (en `--warning` si es mayor que 0).
- **Pestañas con contador:** Cursos asignados, Actividad y Estudiantes.

**Cursos asignados**

- Columnas: Curso (enlace), Estudiantes, Avance promedio (barra de 72px y porcentaje, «—» si no hay estudiantes), Sin avance 7 d, Último movimiento del docente, Bloques en ruta y Acciones.
- Acciones de la fila (iconos):
  - **Reasignar:** popup con radios de los demás docentes (nombre, número de cursos y estado). Indica que «los estudiantes, su progreso y el contenido se mantienen». El botón está deshabilitado hasta que eliges un docente.
  - **Quitar docente:** popup rojo que avisa que el curso queda sin docente y cuántos estudiantes conservan su progreso.
- Botón **Asignar curso:** popup con los cursos sin docente. Si no hay, lo explica y sugiere usar «Reasignar».
- La línea superior dice «N cursos sin docente para asignar» o «No hay cursos sin docente para asignar.»

**Actividad**

- Filtros: Periodo (7, 28 o 90 días) y Tipo (Todos, Contenido, Evaluaciones, Mensajes o Inicios de sesión).
- StatCards: Acciones, Contenidos, Calificaciones y Mensajes del periodo.
- Línea de tiempo: fecha y hora (mono), icono según el tipo, descripción y curso.
- Estado vacío: un **solo** mensaje, «Sin actividad en los últimos N días», con la explicación y «Enviar mensaje». La versión actual repite el mensaje dos veces; corrígelo.

**Estudiantes**

- Búsqueda, Curso (solo los del docente) y Ordenar (Nombre o Menor avance).
- Columnas: Estudiante, Curso (enlace), Avance (barra y %) y Último avance. «Sin avance» se muestra en `--warning`.

### 5.3 Cálculos

- **Avance promedio del curso:** `floor(promedio(avance de sus estudiantes))`, por ejemplo Guitarra 7°A: (47 + 0) / 2 = 23 %. Sin estudiantes se muestra «—».
- **Estudiantes del docente:** se cuentan únicos entre todos sus cursos.
- **Sin avance 7 días:** inscripciones sin progreso en los últimos 7 días.

---

## 6. Reglas de negocio que **debe validar el backend**

Estas reglas se aplican en el servidor aunque el cliente envíe otros valores. Cubre cada una con pruebas.

### 6.1 Roles y cambio de nombre

1. **Un administrador siempre puede cambiar su nombre.** Si `role = admin`, entonces `nameEditable = true`. Rechaza (400) o ignora cualquier intento de ponerlo en `false` para un administrador.
2. **Al promover a administrador** se fija `nameEditable = true` automáticamente.
3. **Al pasar de administrador a docente o estudiante** se fija `nameEditable = false` automáticamente. Después, otro administrador puede volver a permitirlo.
4. Para docentes y estudiantes, `nameEditable` solo lo cambia un administrador.

### 6.2 Protección de la propia cuenta

5. Un administrador **no puede** cambiar su propio rol, suspenderse ni eliminarse. Responde 403 aunque la petición llegue directamente a la API.
6. *(Sugerido, confírmalo con el equipo)* No permitir quitar el rol, suspender ni eliminar al **último administrador activo**.

### 6.3 Datos de la cuenta

7. **Nombre y Apellido son obligatorios** y se recortan los espacios. El nombre completo se arma como `"{firstName} {lastName}"`.
8. **Cambiar el correo** (lo haga un administrador o el propio usuario):
   - valida el formato y que sea único;
   - deja la cuenta en estado **Pendiente**;
   - genera y envía un código nuevo.

   En Mi cuenta, además, exige la contraseña actual y confirma con el código de 6 dígitos antes de aplicar el cambio.
9. **Cambiar la contraseña** exige la contraseña actual y cumple los requisitos (≥8 caracteres, una mayúscula, un número). Además invalida las demás sesiones o tokens del usuario.
10. **Verificar manualmente** pasa la cuenta de Pendiente a Activa y anula los códigos vigentes. **Reenviar código** genera uno nuevo; *(sugerido)* aplica un límite de frecuencia.

### 6.4 Estados de la cuenta y de actividad

11. **Estado de la cuenta:** `suspendida` si `active = false`; si no, `pendiente` (correo sin verificar) o `activa`. Guarda la fecha de suspensión (`suspendedAt`) para mostrar «Suspendida el …».
12. **Una cuenta suspendida** no puede iniciar sesión. Sus sesiones activas se invalidan al suspenderla. Su progreso se conserva.
13. **Estado de actividad del docente,** calculado en el servidor a partir de su último movimiento:
    - **Activo:** ≤7 días;
    - **Inactivo:** 8–30 días;
    - **Sin actividad:** >30 días o nunca.

### 6.5 Confirmaciones y avisos

14. Los endpoints de cambio de rol y de suspensión aceptan `notify: boolean`. Si es `true`, envían un correo al usuario afectado.
15. Las acciones masivas (cambio de rol, activar, suspender, reenviar código) procesan solo las cuentas válidas. Excluyen la propia cuenta y las que ya están en ese estado, y devuelven cuántas cambiaron y cuáles se omitieron.
16. *(Sugerido)* Registrar en auditoría quién cambió el rol, suspendió, eliminó o reasignó, y cuándo.

### 6.6 Docentes y cursos

17. **Reasignar un curso** cambia su docente y conserva estudiantes, progreso y contenido. El destino debe tener rol docente y cuenta activa.
18. **Quitar el docente** deja el curso con `teacherId = null`, y el curso aparece en «Cursos sin docente».
19. **Asignar un curso** solo es posible con cursos sin docente.
20. **Preautorización:**
    - el correo es único;
    - nace como `pendiente`;
    - pasa a `aplicada` cuando alguien se registra y confirma ese correo, momento en que recibe el rol docente automáticamente;
    - solo las `pendientes` se pueden revocar.

---

## 7. Contrato de API propuesto

> Es una propuesta. Si ya existen endpoints equivalentes, úsalos y ajusta solo lo necesario.

```
GET    /api/admin/users?search=&role=&status=&nameEditable=&sort=&page=&pageSize=
         → { items: UserRow[], total, counts: { total, active, pending, suspended, byRole: { estudiante, docente, admin } } }
GET    /api/admin/users/{id}
PATCH  /api/admin/users/{id}                 { firstName, lastName, email, nameEditable }
PUT    /api/admin/users/{id}/role            { role, notify }
PUT    /api/admin/users/{id}/status          { active, notify }        // suspender / reactivar
POST   /api/admin/users/{id}/resend-code
POST   /api/admin/users/{id}/verify
DELETE /api/admin/users/{id}
POST   /api/admin/users/bulk                 { ids, action: "role"|"activate"|"suspend"|"resend", role?, notify? }
         → { changed: string[], skipped: { id, reason }[] }

GET    /api/me
PATCH  /api/me                               { firstName, lastName }
POST   /api/me/email-change                  { newEmail, currentPassword }   → envía código
POST   /api/me/email-change/confirm          { code }
POST   /api/me/password                      { currentPassword, newPassword }
PATCH  /api/me/preferences                   { theme, notifications: { solicitudes, mensajes, evaluaciones } }

GET    /api/admin/teachers/summary           → { active, inactive, noActivity, unassignedCourses, attention: TeacherRow[] }
GET    /api/admin/teachers?search=&activity=&sort=
GET    /api/admin/teachers/{id}              → datos + stats (courses, students, avgProgress, idle7d)
GET    /api/admin/teachers/{id}/courses
GET    /api/admin/teachers/{id}/activity?days=7|28|90&type=
GET    /api/admin/teachers/{id}/students?search=&courseId=&sort=
PUT    /api/admin/courses/{courseId}/teacher { teacherId | null }
GET    /api/admin/courses?unassigned=true
GET    /api/admin/teacher-preauthorizations
POST   /api/admin/teacher-preauthorizations  { email }
DELETE /api/admin/teacher-preauthorizations/{id}
```

`UserRow` = `{ id, firstName, lastName, email, role, status, active, nameEditable, lastAccessAt, lastCodeSentAt, suspendedAt, isSelf }`. Calcula `nameEditable` en el servidor según §6.1.

---

## 8. Modelo de datos y migración

- **Separar el nombre** en `FirstName` y `LastName` si hoy hay un solo campo.
  - Migración: toma la primera palabra como nombre y el resto como apellido.
  - Si no hay resto, deja el apellido vacío. Esas cuentas se muestran con «Sin apellido» y no se pueden guardar hasta completarlo.
- **Campos nuevos si no existen:** `NameEditable` (bool), `SuspendedAt` (fecha, nula), `Theme` y las preferencias de avisos del usuario.
- **Al migrar:** fija `NameEditable = true` para todos los administradores existentes.
- **Para la actividad del docente:** se necesita un registro de eventos (contenido publicado o editado, evaluación calificada, mensaje enviado, inicio de sesión) con fecha, tipo y curso. Si ya existe un *log*, reutilízalo.

---

## 9. Datos de prueba y elementos a confirmar

Los diseños usan datos de ejemplo. No los lleves a producción:

- La lista de usuarios, los docentes, los cursos y los estudiantes son datos de prueba tomados de capturas.
- **«Guitarra 10°A»** y sus dos estudiantes (curso de Juanjo Pajón) son **inventados**. Usa los cursos reales.
- **La actividad de ejemplo** (tweak `actividadDeEjemplo`) es inventada. Úsala solo como referencia visual de la línea de tiempo.
- **Kike Rappi como cuenta suspendida** y su fecha (20 oct 2026) son un caso de ejemplo.
- **«Exportar CSV»** (Usuarios) y la sección **«Avisos por correo»** (Mi cuenta) no existían. Confirma con el equipo antes de implementarlos. Si se aprueban, el CSV respeta los filtros activos.
- El selector de tema de la barra superior ya existe en la app. Mantén su funcionamiento actual.

---

## 10. Criterios de aceptación

**Usuarios**

- [ ] En PC se ven 4 StatCards compactas. En ≤820px se ven pestañas en su lugar.
- [ ] La tabla pasa a tarjetas en ≤820px sin desplazamiento horizontal de la página.
- [ ] Cambiar el rol (en la fila, en bloque o desde el panel) siempre abre el popup. Cancelar no cambia nada.
- [ ] Apagar «Cuenta activa» (en la fila, en bloque o desde el panel) abre el popup de suspensión. Reactivar no lo abre.
- [ ] Eliminar abre el popup rojo.
- [ ] Un administrador tiene «Nombre editable» encendido y bloqueado. Al bajar de rol se bloquea el cambio de nombre.
- [ ] Nombre y Apellido son campos separados y obligatorios. «Sin apellido» aparece donde corresponde.
- [ ] La propia cuenta no puede cambiar su rol, suspenderse ni eliminarse, ni desde la interfaz ni desde la API.

**Mi cuenta**

- [ ] El cambio de correo funciona en 2 pasos con código. El cambio de contraseña valida los requisitos en vivo.
- [ ] El layout se apila correctamente en móvil.

**Docentes**

- [ ] Resumen, Docentes y Preautorizaciones funcionan con datos reales. Las StatCards filtran.
- [ ] El detalle muestra Cursos asignados, Actividad y Estudiantes, con contadores en las pestañas.
- [ ] Reasignar, Quitar docente, Asignar curso y Revocar preautorización usan popups y actualizan los contadores.
- [ ] El estado vacío de Actividad aparece una sola vez.

**General**

- [ ] Las reglas de §6 tienen pruebas en el backend.
- [ ] Todos los controles se pueden usar con teclado, con foco visible y `aria-label` en los botones de icono. Los popups atrapan el foco y cierran con Escape.
- [ ] Contraste de al menos 4.5:1 en el texto.
- [ ] Probado a 1440, 1024, 768 y 390px de ancho.

---

## 11. Plan de trabajo sugerido

1. **Fundaciones:** tokens de §2, fuentes, `AppShell` responsive y componentes compartidos (`StatCard`, `Tabs`, `DataTable`, `Toggle`, `ConfirmDialog`, `Drawer`, `Toast`).
2. **Backend de usuarios:** migración de nombre y apellido, campos nuevos, reglas de §6.1–6.5, endpoints y pruebas.
3. **Pantalla Usuarios:** tabla, filtros, panel de edición, popups y acciones masivas.
4. **Mi cuenta:** secciones y flujos de correo y contraseña.
5. **Backend de docentes:** resumen, cálculo de actividad, cursos, reasignación y preautorizaciones.
6. **Pantalla Docentes:** lista y detalle.
7. **Pasada final:** accesibilidad, responsive en los 4 anchos y revisión de los criterios de §10.

Entrega cada fase en un PR separado, con capturas en escritorio y en móvil.
