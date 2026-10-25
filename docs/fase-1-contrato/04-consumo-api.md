# 04 · Consumo de la API

> **Fuente de verdad:** `SIPE-SOUND-BACKEND/docs/fase-1-contrato/04-contrato-api.md`.
> Este documento define *cómo* el frontend consume ese contrato. Si un endpoint
> no está allí, no existe: no se inventa.

## 1. Variables de entorno

```dotenv
VITE_API_URL=http://localhost:5000/api/v1
```

`src/shared/config/env.ts` las lee **una sola vez**, valida que existan y
que `VITE_API_URL` termine en `/api/v1`, y exporta un objeto congelado.
Ningún otro archivo usa `import.meta.env`.

> La API existe **solo** bajo `/api/v1` (HU-B-319). `/api/...` sin versión
> responde 404: el frontend actual (`src/lib/api.js`) deja de funcionar hasta HU-F-203.

## 2. Respuesta estándar del backend

**Todas** las respuestas, de éxito y de error, tienen la misma forma y el mismo
orden de claves (HU-B-317):

```json
{
  "statusCode": 200,
  "status": "OK",
  "data": { "id": 3, "titulo": "Acordes mayores C y G" },
  "success": true,
  "message": "Operación exitosa.",
  "errors": [],
  "timestamp": "2026-10-22T06:00:13.562Z",
  "meta": {}
}
```

```json
{
  "statusCode": 400,
  "status": "VALIDACION",
  "data": null,
  "success": false,
  "message": "Hay campos con errores.",
  "errors": ["nombre: Debe tener al menos 2 caracteres.", "password: La contraseña debe tener letras y números."],
  "timestamp": "2026-10-22T06:00:13.562Z",
  "meta": {}
}
```

| Clave | Tipo | Uso en el frontend |
|---|---|---|
| `statusCode` | `number` | Igual al estado HTTP. |
| `status` | `string` | Éxito: `OK`, `CREATED`. Error: código de §5 (`VALIDACION`, `NO_ENCONTRADO`…). Se usa para decidir qué mostrar. |
| `data` | `T \| null` | El recurso o la lista. `null` en errores. |
| `success` | `boolean` | `true` si `statusCode < 400`. |
| `message` | `string` | Texto en español **listo para mostrar** (aviso de éxito o error general). |
| `errors` | `string[]` | Detalle. En validación cada texto es `"campo: mensaje"`; el campo puede ir anidado (`"bloques.0.orden: …"`). Vacío si no hay. |
| `timestamp` | `string` | ISO-8601 UTC. No se muestra; sirve para soporte y registros. |
| `meta` | `object` | Paginación `{ pagina, por_pagina, total }` u otros datos; `{}` si no hay. |

Tipos de referencia (`src/shared/api/tipos.ts`):

```ts
export interface RespuestaApi<T> {
  statusCode: number;
  status: string;
  data: T | null;
  success: boolean;
  message: string;
  errors: string[];
  timestamp: string;
  meta: Record<string, unknown>;
}

export interface MetaPaginacion { pagina: number; por_pagina: number; total: number }
```

## 3. Cliente HTTP único

`src/shared/api/httpClient.ts` es el **único** lugar con `fetch`.

Responsabilidades:
1. Construir la URL con `env.apiUrl`.
2. Adjuntar `Authorization: Bearer <token>` si hay sesión (`obtenerToken()` de `shared/api/sesion`, que renueva el token con `POST /auth/sesion/renovar` cuando vence).
3. Serializar JSON y fijar `Content-Type`.
4. Leer **siempre** el cuerpo como `RespuestaApi<T>`:
   - `success: true` → devuelve `data` (`get`, `post`…), o `{ data, meta, message }` con `getPaginado` / `conMensaje`.
   - `success: false` → lanza `ApiError` con `statusCode`, `status`, `message` y `errors`.
   - Cuerpo que no es JSON (proxy, caída) → `ApiError(0, "SIN_CONEXION", "No pudimos conectar…")`.
5. Ante `401`: intentar **una** renovación; si falla, cerrar sesión local y redirigir a `/login?volver=<ruta>`.
6. Timeout de 15 s con `AbortController` (conectividad baja).

```ts
// forma de referencia
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public status: string,            // VALIDACION, NO_ENCONTRADO, …
    message: string,                  // ya en español
    public errors: string[] = [],
  ) { super(message); }

  /** "nombre: Debe tener…" → { nombre: "Debe tener…" }. Los textos sin campo quedan en `general`. */
  get porCampo(): Record<string, string> {
    return Object.fromEntries(
      this.errors.map((texto) => {
        const i = texto.indexOf(": ");
        return i > 0 ? [texto.slice(0, i), texto.slice(i + 2)] : ["general", texto];
      }),
    );
  }
}

export const http = {
  get:         <T>(ruta: string, params?: Record<string, unknown>) => request<T>("GET", ruta, { params }),
  getPaginado: <T>(ruta: string, params?: Record<string, unknown>) => requestPaginado<T>(ruta, params),
  post:        <T>(ruta: string, body?: unknown) => request<T>("POST", ruta, { body }),
  put:         <T>(ruta: string, body?: unknown) => request<T>("PUT", ruta, { body }),
  patch:       <T>(ruta: string, body?: unknown) => request<T>("PATCH", ruta, { body }),
  delete:      (ruta: string) => request<void>("DELETE", ruta),
};
```

## 4. Servicios por feature

```ts
// src/features/lecciones/api/leccionesApi.ts
import { http } from "@/shared/api/httpClient";
import type { Leccion } from "../types";

export const leccionesApi = {
  listar: (filtros?: { bloque_id?: number }) => http.get<Leccion[]>("/lecciones", filtros),
  obtener: (id: number) => http.get<Leccion>(`/lecciones/${id}`),
};
```

```ts
// src/features/lecciones/api/keys.ts
export const leccionesKeys = {
  todas: ["lecciones"] as const,
  lista: (f?: object) => [...leccionesKeys.todas, "lista", f] as const,
  detalle: (id: number) => [...leccionesKeys.todas, "detalle", id] as const,
};
```

```ts
// src/features/lecciones/hooks/useLeccion.ts
export function useLeccion(id: number) {
  return useQuery({ queryKey: leccionesKeys.detalle(id), queryFn: () => leccionesApi.obtener(id) });
}
```

Campos que cambiaron con HU-B-319: `duracion` (texto) ya no existe → usar
`duracion_min` (entero, minutos). `GET/POST /progreso` no existen → `PUT
/progreso/lecciones/{id}`, `PUT /progreso/ejercicios/{id}` y `GET /progreso/resumen`.

## 4.1 Sesión (HU-F-207, contrato del backend §4.1.1)

| Acción | Endpoint | Detalle |
|---|---|---|
| Registrarse | `POST /auth/registro` | `{nombre, email, password}`; misma respuesta exista o no el correo. |
| Iniciar sesión | `POST /auth/sesion` | Devuelve `access_token`, `expira_en` y `usuario`; el backend pone la cookie `sipe_refresh`. |
| Recuperar sesión al cargar / token vencido | `POST /auth/sesion/renovar` | Cuerpo `{}`; usa y rota la cookie. 401 = no hay sesión. |
| Cerrar sesión | `DELETE /auth/sesion` | Cuerpo `{}` y `Bearer`; borra la cookie. |
| Confirmar el correo | `POST /auth/verificacion` | `{email, codigo}` (HU-F-401). El código (6 dígitos, 15 min, un solo uso) lo envía el backend al registrarse. Código errado, vencido o usado → 422 con el mismo texto. |
| Pedir el enlace para otra contraseña | `POST /auth/contrasena/olvido` | `{email}` (HU-F-402); siempre 200 con el mismo texto. Un enlace cada 2 min por cuenta: el botón queda deshabilitado 120 s. |
| Crear la contraseña nueva | `POST /auth/contrasena/restablecer` | `{token, password}`. El token (15 min, un solo uso) llega en el **fragmento** `/restablecer#token=…`: se lee una vez, se guarda solo en memoria y se borra de la URL; la página usa `referrer: no-referrer`. Token vencido o usado → 422 y "Pedir otro enlace". |
| Pedir otro código | `POST /auth/verificacion/reenviar` | `{email}`; siempre 200 con el mismo texto. El botón queda deshabilitado 60 s con cuenta regresiva. |

Una cuenta sin verificar no inicia sesión: `POST /auth/sesion` responde 422 con `meta.requiere_verificacion: true`
(`ApiError.meta`) y el formulario ofrece "Escribir el código" (`/verificar`, con el correo precargado).

- Todas con `credentials: "include"` y `Content-Type: application/json` (el backend exige JSON como defensa CSRF).
- El access token vive **solo en memoria** (`shared/api/sesion`); nunca en `localStorage`.
- El rol se pide con `GET /me`; no se deduce del token.
- En local, frontend y backend con el mismo host (`localhost`): con `127.0.0.1` la cookie no viaja.

## 5. Manejo de errores en la interfaz

| `ApiError.status` | HTTP | Qué ve el usuario |
|---|---|---|
| `VALIDACION` | 400 | Cada texto de `errors` junto a su campo (`porCampo`); los que no corresponden a un campo visible, en el resumen del formulario. |
| `NO_AUTENTICADO` | 401 | Redirección a login (automática). |
| `SIN_PERMISO` | 403 | Pantalla "No tienes acceso a esta sección" con enlace al inicio. |
| `NO_ENCONTRADO` | 404 | Pantalla 404 propia, con enlace de regreso. |
| `CONFLICTO` | 409 | El `message` en línea (p. ej. "Ese correo ya tiene una cuenta.") o diálogo si sugiere archivar. |
| `REGLA_NEGOCIO` | 422 | Mensaje en línea con el `message`. |
| `DEMASIADAS_SOLICITUDES` | 429 | El `message` y el botón de enviar deshabilitado 60 s. Sin reintento automático. |
| `ERROR_INTERNO` | 500 | "Ocurrió un error inesperado…" (`message`) + botón Reintentar. |
| `SERVICIO_NO_DISPONIBLE` | 503 | El `message` + botón Reintentar. |
| `SIN_CONEXION` | — | "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo." + Reintentar. |

Los mensajes del backend ya están en español; el frontend **no** muestra
`status`, `statusCode` ni `timestamp` al usuario. Tras una mutación exitosa, el
aviso (toast) usa el `message` del backend (p. ej. "Te enviamos un correo para
confirmar tu cuenta.").

## 6. Validación de formularios

Todo dato que escribe una persona se valida **antes** de enviarse con los mismos
límites que la API y la base: ver [08-validacion-de-formularios.md](08-validacion-de-formularios.md).
La validación del frontend es comodidad para la persona; la del backend es la que protege.

## 7. Versiones

| Desde | `VITE_API_URL` | Respuesta |
|---|---|---|
| HU-B-319 (ya en el backend) | `.../api/v1` (única) | Estructura estándar de §2 |
| `/api` sin versión | — | 404 |
