# HU-F-207 · Autenticarse a través del backend y retirar Supabase del frontend

| Campo | Valor |
|---|---|
| Fase | 2 · Reestructuración |
| Prioridad | Must |
| Estimación | 3 puntos |
| Depende de | HU-F-202, **HU-B-322** (`/auth/*`) |
| Rama | `hu/HU-F-207-autenticacion-por-backend` |
| Origen | Decisión del equipo (2026-10-22): el backend es el único que habla con Supabase |

## Historia
**Como** estudiante
**quiero** registrarme e iniciar sesión sin que mi navegador guarde credenciales de larga duración
**para** que mi cuenta esté protegida aunque use un computador compartido del colegio.

## Contexto
- `src/shared/lib/supabase.js` creaba el cliente de `@supabase/supabase-js` con
  `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`; `authService` llamaba a `signUp`,
  `signInWithPassword` y `signOut`, y cinco archivos llamaban a `supabase.auth.getSession()`.
- `supabase-js` guardaba access y refresh token en `localStorage`.
- `supabase-js` pesaba ~55 kB gzip en el bundle inicial.

## Alcance
**Incluye**
- `src/shared/api/sesion.js`: `registrarCuenta`, `iniciarSesion`, `cerrarSesion`,
  `obtenerSesion` (nunca lanza; renueva con la cookie si hace falta, una sola vez aunque la
  pidan varias páginas) y `obtenerToken`. Access token **solo en memoria**.
- `features/auth/api/authService.js` delega en `sesion` (mismas firmas que antes).
- Reemplazar `supabase.auth.getSession()` por `obtenerSesion()` en `Header`, `RutaPage`,
  `ProgresoPage`, `EjerciciosPage` y `LeccionDetallePage`.
- `traducirErrorAuth`: el backend ya responde en español; solo se traduce la falta de conexión.
- `minLength` de la contraseña en Registro: 6 → 8 (igual que la API, contrato 08).
- Eliminar `src/shared/lib/supabase.js`, `src/shared/api/obtenerToken.js` y la dependencia
  `@supabase/supabase-js`.
- `.env.example` solo con `VITE_API_URL=http://localhost:5000/api/v1`.
- Contrato (01 R8/R9, 02, 03, 04 §4.1, 08), `AGENTS.md`, README y HU-F-203/204/313.

**No incluye**: `AuthProvider` y sincronización entre pestañas (HU-F-204), cliente HTTP único
con reintento ante 401 (HU-F-203), casilla de términos (HU-F-313), cambios visuales.

## Configuración
| Dónde | Qué |
|---|---|
| `.env` del frontend | Borrar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. `VITE_API_URL` debe terminar en `/api/v1`. |
| `.env` del backend | `SUPABASE_ANON_KEY` (la misma clave que antes tenía el frontend) y `CORS_ORIGINS` con el origen exacto del frontend. Ver HU-B-322. |
| Navegador (local) | Abrir frontend y backend con el mismo host: `http://localhost:5173` y `http://localhost:5000`. |
| Despliegue | Si frontend y API quedan en dominios distintos: `AUTH_COOKIE_SAMESITE=None` en el backend y HTTPS en ambos. |

## Prompt de ejecución
```text
Ejecuta HU-F-207 en SIPE-SOUND-FULLSTACK después de HU-B-322. Retira
@supabase/supabase-js y toda variable VITE_SUPABASE_*. Crea shared/api/sesion
con las llamadas a /auth/* (credentials: "include", Content-Type JSON). El access
token vive solo en memoria; nunca localStorage. Sustituye cada getSession() por
obtenerSesion(). Sin cambios visuales.
```

## Criterios de aceptación
```gherkin
Escenario: Sin Supabase en el frontend
  Cuando busco "supabase" en src/ y package.json
  Entonces no hay imports ni dependencias de Supabase

Escenario: Inicio de sesión
  Dado una cuenta confirmada
  Cuando inicio sesión en /login
  Entonces el menú muestra "Mi progreso" y mi correo
  Y localStorage no contiene ningún token

Escenario: Recargar la página
  Dado que inicié sesión
  Cuando recargo /progreso
  Entonces sigo con sesión (se renovó con la cookie sipe_refresh)

Escenario: Cerrar sesión
  Cuando pulso "Cerrar sesion"
  Entonces al recargar ya no tengo sesión

Escenario: Error en español
  Cuando inicio sesión con una contraseña equivocada
  Entonces veo "El correo o la contraseña no coinciden. Revísalos e inténtalo de nuevo."
```

## Verificación manual
```bash
grep -rni "supabase" src package.json .env.example   # solo comentarios
npm run lint && npm run typecheck && npm run build
```
En el navegador: pestaña *Application* → *Local Storage* sin tokens; *Cookies* de
`localhost:5000` con `sipe_refresh` marcada como `HttpOnly`.

## Definición de hecho específica
- [ ] Merge después de HU-B-322 (backend primero).
- [ ] JS inicial más liviano (sin `supabase-js`).
