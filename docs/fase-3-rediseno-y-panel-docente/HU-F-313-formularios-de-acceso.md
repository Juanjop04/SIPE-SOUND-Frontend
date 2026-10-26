# HU-F-313 · Formularios de acceso validados y preautorización de docentes

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño y panel docente |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-302, HU-F-303, **HU-B-320** (límites), **HU-B-321** (docentes preautorizados) |
| Rama | `hu/HU-F-313-formularios-acceso` |

## Historia
**Como** estudiante que se registra desde el celular del colegio
**quiero** que el formulario me diga qué corregir antes de enviarlo
**para** crear mi cuenta al primer intento.

**Como** administrador
**quiero** autorizar el correo de un docente antes de que se registre
**para** que entre con su rol sin pasos manuales.

## Contexto
- `RegistroPage` llama a `POST /auth/registro` (HU-F-207 / HU-B-322) y valida a mano. Esta HU
  agrega la validación completa del formulario; el backend aplica los mismos límites.
- El rol nunca se elige en el registro: lo asigna la base (`estudiante`, o `docente` si el
  correo está preautorizado y la persona confirma su correo).
- No hay módulo común de validación: esta HU crea `shared/validacion` (contrato 08)
  e instala React Hook Form + Zod para todo el proyecto.

## Diseño
- Una columna, ancho máximo 28 rem, con el `AuthLayout` actual.
- Requisitos de contraseña como lista que se marca al cumplirse (texto + ícono, no solo color).
- Tras registrarse: "Te enviamos un correo para confirmar tu cuenta." y el correo usado,
  con enlace a "Iniciar sesión". Mismo mensaje aunque el correo ya exista (no se revela).
- Errores con el `message` y los `errors` de la respuesta estándar del backend (ya en español);
  `traducirErrorAuth` solo cubre la falta de conexión.

## Alcance
**Incluye**
- `npm install --save-exact react-hook-form zod @hookform/resolvers`.
- `src/shared/validacion/limites.ts` y `campos.ts` según [contrato 08](../fase-1-contrato/08-validacion-de-formularios.md).
- `Field` en `shared/ui` (label + control + ayuda + error con `aria-describedby`) y contador para `textarea`.
- **Iniciar sesión**: esquema y atributos de §2; `POST /auth/sesion` como hoy.
- **Registro**: `POST /auth/registro` con `{ nombre, email, password, acepta_terminos }`. Requiere
  agregar `acepta_terminos: Literal[True]` a `RegistroIn` en el backend (PR enlazado). El enlace
  del correo usa la *Site URL* de Supabase (`<origen>/login`).
- **Preautorizar docentes** (solo `admin`, en `/admin/docentes`): formulario de correo
  (`POST /admin/docentes/preautorizaciones`), tabla con estado `pendiente` / `aplicada`
  y acción "Retirar" en las pendientes (`DELETE`, con confirmación).

**No incluye**: recuperar contraseña; edición del perfil.

## Validación de campos
Constructores de `shared/validacion` ([contrato 08](../fase-1-contrato/08-validacion-de-formularios.md)); los mismos límites aplican la API y la base (contrato del backend §7).

| Formulario | Campo | Regla | Control |
|---|---|---|---|
| Iniciar sesión | correo | `trim`, minúsculas, ≤ 254, formato | `type="email"` `maxLength=254` `autoComplete="email"` |
| Iniciar sesión | contraseña | 1–72, sin `trim` | `type="password"` `maxLength=72` `autoComplete="current-password"` |
| Registro | nombre | 2–80, letras, espacios, `'` `.` `-`; espacios colapsados | `maxLength=80` `autoComplete="name"` |
| Registro | correo | igual que en iniciar sesión | igual |
| Registro | contraseña | 8–72, letra y número, sin `trim` | `maxLength=72` `autoComplete="new-password"` + requisitos |
| Registro | confirmar | igual a la contraseña (no se envía) | igual |
| Preautorizar docente | correo | `trim`, minúsculas, ≤ 254, formato | `type="email"` `maxLength=254` |
| Registro | términos | debe estar marcado | checkbox con enlace a `/terminos` |

Los metadatos del `signUp` son exactamente `{ nombre }`: nunca `rol` ni otros campos.

## Prompt de ejecución
```text
Ejecuta HU-F-313 en SIPE-SOUND-FULLSTACK. Lee primero los contratos 04 y 08.
Crea shared/validacion (limites.ts espejo de app/core/longitudes.py del backend,
campos.ts con los constructores) y Field en shared/ui. Reescribe Login y Registro
con React Hook Form + zodResolver (mode "onTouched"); el registro sigue con
POST /auth/registro (sin rol). Borra la validación manual.
Crea /admin/docentes (guardada por rol admin) con las preautorizaciones; los
errores 400 se asignan con setError a partir de ApiError.porCampo.
Sin cambios de paleta; respeta el sistema de diseño.
```

## Criterios de aceptación
```gherkin
Escenario: Validación antes de enviar
  Dado el formulario de registro
  Cuando escribo el nombre "ana123" y salgo del campo
  Entonces veo "Usa solo letras, espacios, apóstrofo, punto o guion." debajo del campo
  Y el campo tiene aria-invalid="true"
  Y al pulsar "Crear cuenta" no se envía ninguna petición

Escenario: Límite físico
  Cuando pego un nombre de 120 caracteres
  Entonces el campo conserva solo 80

Escenario: Registro exitoso
  Cuando completo datos válidos y envío
  Entonces se llama a POST /auth/registro con nombre, email y password, sin rol
  Y veo "Te enviamos un correo para confirmar tu cuenta."

Escenario: Docente preautorizado
  Dado que el admin preautorizó "profe@colegio.edu.co" en /admin/docentes
  Cuando esa persona se registra, confirma su correo e inicia sesión
  Entonces entra a /docente

Escenario: Error del backend en su campo
  Dado que el backend responde 400 con errors ["email: El correo no es válido."]
  Entonces el mensaje aparece debajo del campo correo de /admin/docentes

Escenario: Preautorización repetida
  Cuando preautorizo un correo que ya está en la lista
  Entonces veo "Ese correo ya está preautorizado."
```

## Verificación manual
- Pestaña *Network*: el `signUp` solo lleva `nombre` en `data`.
- Teclado y lector de pantalla: cada error se anuncia al enfocar el campo.
- 375 px: el teclado del celular es de correo en el campo de correo (`inputMode`).

## Definición de hecho específica
- [ ] `signUp` solo en `features/auth/api/authApi.ts`.
- [ ] Ningún número de límite fuera de `shared/validacion/limites.ts`.
