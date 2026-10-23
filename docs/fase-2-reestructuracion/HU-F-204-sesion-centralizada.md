# HU-F-204 · Centralizar la sesión en un AuthProvider

| Campo | Valor |
|---|---|
| Fase | 2 · Reestructuración |
| Prioridad | Must |
| Estimación | 3 puntos |
| Depende de | HU-F-203 |
| Rama | `hu/HU-F-204-sesion` |

## Historia
**Como** estudiante
**quiero** que la aplicación sepa siempre si inicié sesión, en todas las pantallas a la vez
**para** no ver el menú desactualizado tras entrar o salir.

## Contexto
Desde HU-F-207 `Header`, `RutaPage`, `ProgresoPage`, `EjerciciosPage` y `LeccionDetallePage` llaman cada uno a `obtenerSesion()` (`shared/api/sesion`) por su cuenta y nadie se entera cuando la sesión cambia. Tras cerrar sesión, `Header` usa `navigate(0)` (recarga completa) y un `<a href="#">` como botón (Sonar / a11y).

## Alcance
**Incluye**
- `features/auth/context/AuthProvider.jsx`: estado `{ session, usuario, estaCargando }`, suscripción a `onAuthStateChange`, limpieza en `unmount`, `value` memoizado (Sonar S6481).
- `features/auth/hooks/useSession.js`.
- `app/providers/AppProviders.jsx` que envuelve `QueryClientProvider` + `AuthProvider`.
- `shared/api/sesion` emite un evento al iniciar, renovar o cerrar sesión; `AuthProvider` se suscribe (equivalente al antiguo `onAuthStateChange`).
- Reemplazar todas las llamadas directas a `obtenerSesion()` fuera de `shared/api` y `features/auth`.
- Al cerrar sesión: `queryClient.clear()` y navegar a `/` sin recargar. "Cerrar sesión" como `<button>`.

**No incluye**: roles (HU-F-303), guardas de ruta (HU-F-205).

## Prompt de ejecución
```text
Ejecuta HU-F-204 en SIPE-SOUND-FULLSTACK. Crea AuthProvider y useSession,
reemplaza todos los usos directos de obtenerSesion() fuera de
shared/api y features/auth. Al cerrar sesión limpia la caché de TanStack Query.
Sin cambios visuales, salvo que "Cerrar sesión" pasa a ser <button> con el
mismo aspecto.
```

## Criterios de aceptación
```gherkin
Escenario: Menú sincronizado
  Dado que estoy en Acordes sin sesión
  Cuando inicio sesión en otra pestaña
  Entonces el menú de esta pestaña muestra "Mi progreso" sin recargar

Escenario: Cierre limpio
  Cuando cierro sesión
  Entonces vuelvo al inicio sin recarga completa
  Y no quedan datos de progreso del usuario en caché
```

## Verificación manual
```bash
grep -rn "auth.getSession" src | grep -v "features/auth\|shared/api" || echo "OK"
```

## Definición de hecho específica
- [ ] Ningún `<a href="#">` en el proyecto.
