# HU-F-203 · Unificar el acceso a la API con un cliente HTTP y TanStack Query

| Campo | Valor |
|---|---|
| Fase | 2 · Reestructuración |
| Prioridad | Must · **urgente**: desde HU-B-319 el backend ya no responde en `/api` |
| Estimación | 5 puntos |
| Depende de | HU-F-202, **HU-B-317** (respuesta estándar), **HU-B-319** (solo `/api/v1`) |
| Rama | `hu/HU-F-203-http-query` |

## Historia
**Como** estudiante con conexión inestable
**quiero** que la app reintente, guarde en caché el catálogo y me muestre errores claros
**para** poder seguir practicando aunque la red falle por momentos.

## Contexto
- `src/lib/api.js` repite en cada función `fetch` + `if (!res.ok) throw new Error(...)` (duplicación, Sonar).
- Cada página hace `useEffect` + `useState` para cargar datos, sin caché: volver a Home vuelve a pedir todo.
- `import.meta.env` se lee en varios archivos.
- El backend responde **siempre** con la estructura estándar (`statusCode`, `status`, `data`, `success`, `message`, `errors`, `timestamp`, `meta`) y solo bajo `/api/v1`.
- `GET/POST /progreso` ya no existen: el progreso usa `PUT /progreso/lecciones/{id}`, `PUT /progreso/ejercicios/{id}` y `GET /progreso/resumen`; `duracion` pasó a `duracion_min`.

## Alcance
**Incluye**
- `npm install --save-exact @tanstack/react-query`.
- `src/shared/config/env.js` (validación de variables).
- `src/shared/api/httpClient.js`, `ApiError.js` (con `porCampo`), `tipos` de `RespuestaApi` y `queryClient.js` según [04-consumo-api.md](../fase-1-contrato/04-consumo-api.md) §2–§3.
- Migrar el guardado de progreso a los `PUT` nuevos y la duración a `duracion_min` ("20 min" se arma en la vista).
- Reescribir los `*Api.js` de cada feature sobre `http`.
- Hooks `useXxx` por feature con claves en `api/keys.js`.
- Páginas usan los hooks en lugar de `useEffect` para datos.
- `.env.example` con `VITE_API_URL=http://localhost:5000/api/v1` (ya hecho en HU-F-207; sin variables de Supabase).
- `httpClient` toma el token de `shared/api/sesion` (`obtenerToken`) y envía `credentials: "include"` solo a `/auth/*`.
- Eliminar `src/shared/api/obtenerToken.js`.

**No incluye**: cambios visuales (los mensajes de carga/error actuales se mantienen).

## Prompt de ejecución
```text
Ejecuta HU-F-203 en SIPE-SOUND-FULLSTACK. Verifica antes con
curl $VITE_API_URL/health que responde {"success": true, ...}.
- Implementa httpClient exactamente con las responsabilidades del contrato 04 §3:
  lee siempre RespuestaApi, devuelve data si success, lanza ApiError(statusCode,
  status, message, errors) si no. Ningún otro archivo lee success/errors.
- Los mensajes de error que ve el usuario salen de ApiError.message.
- QueryClient: retry 2 (no reintentar 4xx), staleTime 5 min para catálogo,
  refetchOnWindowFocus false.
- Sustituye en cada página el patrón useEffect+useState por el hook de la feature.
  Conserva los textos y clases actuales de carga y error.
- La lógica de desbloqueo de RutaPage (bloqueDesbloqueado) pasa a una función
  pura en features/ruta/utils/calcularEstadoBloques.js.
- Ningún archivo fuera de shared/api usa fetch ni import.meta.env (salvo env.js).
```

## Criterios de aceptación
```gherkin
Escenario: Caché del catálogo
  Dado que visité la página de Acordes
  Cuando navego a otra página y vuelvo antes de 5 minutos
  Entonces no se hace una nueva petición a /acordes

Escenario: Error legible
  Dado que el backend está apagado
  Cuando abro la ruta de inicio
  Entonces veo el mensaje de error actual y no una pantalla en blanco

Escenario: Respuesta estándar
  Cuando la página de Acordes carga
  Entonces el hook recibe solo el arreglo de data, sin statusCode ni meta

Escenario: Error del backend en español
  Dado que GET /lecciones/999 responde 404 con message "No existe leccion con id 999"
  Entonces la vista muestra ese message y no un texto técnico

Escenario: Variable faltante
  Dado que VITE_API_URL no está definida
  Cuando arranco npm run dev
  Entonces la consola muestra qué variable falta
```

## Verificación manual
```bash
grep -rn "fetch(" src | grep -v shared/api || echo "OK"
grep -rn "import.meta.env" src | grep -v shared/config/env || echo "OK"
```
Además: pestaña *Network* del navegador para comprobar la caché.

## Definición de hecho específica
- [ ] `src/lib/api.js` y sus restos ya no existen.
- [ ] `calcularEstadoBloques` es pura (sin imports de React ni de red).
