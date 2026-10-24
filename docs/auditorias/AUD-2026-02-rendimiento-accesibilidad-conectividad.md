# AUD-2026-02 · Rendimiento, accesibilidad y baja conectividad

| Campo | Valor |
|---|---|
| HU | [HU-F-312](../fase-3-rediseno-y-panel-docente/HU-F-312-accesibilidad-rendimiento-conectividad.md) |
| Fecha | 2026-10-23 |
| Base | rama `hu/HU-F-312-auditoria` sobre `ab64e81` (incluye HU-F-301 … HU-F-311 y HU-F-313 … HU-F-323) |
| Umbrales | Lighthouse móvil: Rendimiento ≥ 85 · Accesibilidad ≥ 95 · Buenas prácticas ≥ 95 · LCP inicio ≤ 2,5 s · CLS ≤ 0,1 · JS inicial ≤ 180 kB gzip |

## 1. Cómo se midió

- **Build de producción** servido con `vite preview` y un proxy `/api` → backend local (`:8000`), así
  la app y el API comparten origen y no se toca la configuración CORS. `VITE_API_URL` debe ser
  absoluta (`http://localhost:4180/api/v1`): `httpClient` arma las URL con `new URL(...)`.
- **Lighthouse 12.6.1** (Node, `puppeteer-core` 24.10 contra el Chrome instalado), perfil móvil por
  defecto: Moto G Power emulado, **4G lenta simulada** (150 ms RTT, 1,6 Mbps) y CPU ×4.
- **En frío con sesión**: se inicia sesión una vez por cuenta y, antes de cada página, se vacía la
  caché HTTP (`Network.clearBrowserCache`) sin borrar la cookie de sesión (`disableStorageReset`).
- Cuentas de prueba: estudiante (Inicio, Ruta, Lección 1, Evaluación 1) y docente (`/docente/cursos`).
- Inicio se midió **3 veces** tras los cambios; se informa la mediana.
- Las herramientas se instalaron en una carpeta temporal, no en `package.json`.

> Primeras mediciones descartadas: Git Bash convirtió `VITE_API_URL=/api/v1` en
> `C:/Program Files/Git/api/v1` y todas las llamadas al API fallaban; luego una URL relativa rompía
> `new URL(...)`. Las cifras de abajo son las de un build que sí habla con el API (comprobado en la
> cascada de cada informe).

## 2. Resultados antes y después

| Página | Rend. antes → después | Acces. | B. prácticas | FCP | LCP | TBT | CLS | Transferido |
|---|---|---|---|---|---|---|---|---|
| Inicio | **79 → 90** (mediana 89/90/90) | 100 → 100 | 100 → 100 | 2,0 → 2,1 s | **3,9 → 2,8 s** | 110 → 80 ms | 0,06 → 0,06 | 294 → 251 KiB |
| Ruta | 89 → 94 | 100 → 100 | 100 → 100 | 2,2 → 2,2 s | 3,2 → 2,5 s | 150 → 140 ms | 0,028 → 0,028 | 238 → 214 KiB |
| Lección | 87 → 93 | **96 → 100** | 100 → 100 | 2,3 → 2,2 s | 3,2 → 2,6 s | 170 → 110 ms | 0,023 → 0,023 | 252 → 228 KiB |
| Evaluación | 88 → 93 | 100 → 100 | 100 → 100 | 2,2 → 2,2 s | 3,2 → 2,7 s | 140 → 60 ms | 0,023 → 0,023 | 242 → 219 KiB |
| Docente · Cursos | 92 → 91 | 100 → 100 | 100 → 100 | 2,4 → 2,5 s | 2,9 → 3,0 s | 60 → 50 ms | 0 → 0,001 | 257 → 260 KiB |

**Cumplen los umbrales las 5 páginas** en Rendimiento, Accesibilidad y Buenas prácticas, y CLS ≤ 0,1.
**LCP del inicio: 2,8 s, no cumple ≤ 2,5 s** (ver §5, H-12): el resto es latencia del backend.

Los bytes transferidos ahora incluyen Baloo 2 (19,5 kB), que antes nunca se descargaba (H-05).

### Bundle

| Recurso | Antes | Después |
|---|---|---|
| JS inicial (`index-*.js`) | 401,2 kB · **127,3 kB gzip** | 311,4 kB · **101,4 kB gzip** (−20 %) |
| CSS (`index-*.css`) | 7,1 kB gzip | 7,5 kB gzip (reglas `@font-face`) |
| zod en el chunk inicial | sí (~16 kB gzip) | no: solo en las páginas con formularios |
| Logo | PNG 674×539 · 29,6 kB | WebP 120 px · 7,8 kB |

Composición del chunk inicial después (sin minificar): `@remix-run/router` 161 kB, `react-dom` 131 kB,
`@tanstack/query-core` 130 kB, `tailwind-merge` 70 kB, `react-router(-dom)` 40 kB; código propio < 60 kB.
`lucide-react` entra por ícono (6 kB).

### Fuentes

| | Antes (Google Fonts) | Después (`@fontsource`, mismo origen) |
|---|---|---|
| Hoja de estilos | 1,2–1,5 kB de `fonts.googleapis.com`, **bloquea el render 843–1065 ms** | dentro de `index.css` (sin petición extra) |
| Conexiones de terceros | 2 (`fonts.googleapis.com`, `fonts.gstatic.com`) | 0 |
| Inter | 48,5 kB (variable) | 48,3 kB (variable, subconjunto latino) |
| Baloo 2 600 | no se descargaba (H-05) | 19,5 kB |
| IBM Plex Mono 400 / 500 | 10,1 kB cada una | 14,7 / 14,9 kB |
| Total en una página típica | 59,7–70,2 kB | 82,5–97,4 kB |

Las fuentes pesan ~20 kB más (Baloo 2 por fin se usa; el subconjunto de Plex de Google es más
agresivo), a cambio de quitar ~1 s de bloqueo y dos conexiones de terceros en 4G lenta. Los datos de
navegación de los estudiantes ya no pasan por Google. Los subconjuntos cirílico, griego y vietnamita
de Inter se publican en `dist/`, pero el navegador no los descarga (`unicode-range`).

## 3. Sin conexión

| Comprobación | Resultado |
|---|---|
| Visitar Ruta y Lección 1, cortar la red (`setOfflineMode`) y volver a ellas navegando dentro de la app | ✅ Se ve el contenido en caché, sin mensajes de error |
| Aviso «Sin conexión: mostrando lo último que descargaste.» | ✅ Aparece bajo el encabezado (estudiante, docente y acceso), en tema oscuro y claro |
| Al volver la conexión | ✅ El aviso desaparece y TanStack Query refresca lo visible (`refetchOnReconnect`) |
| Recargar la pestaña sin conexión | ❌ No funciona: no hay Service Worker (fuera de alcance; propuesta en §6) |

## 4. Accesibilidad

| Comprobación | Estado | Resultado |
|---|---|---|
| Lighthouse Accesibilidad (axe) en las 5 páginas con sesión | ✅ ejecutada | 100 en las 5 después de H-07 … H-09 |
| Recorrido con teclado automatizado (Tab, 20–30 pasos por página, 390 px) en Inicio, Ruta, Lección y Evaluación | ✅ ejecutado | Ningún control sin foco visible; ninguno tapado por la barra inferior. El único «tapado» detectado es un radio `sr-only` cuyo `label` muestra el foco (falso positivo). Sin trampas de foco. |
| `lang="es-CO"` | ✅ | `index.html` |
| `prefers-reduced-motion` | ✅ | `Skeleton` (`motion-safe:animate-pulse`), `CierreLeccion` (`motion-safe:animate-vibrar`), cuerdas del Fretboard (`matchMedia`) y, ahora, el relleno de `Cuerda` (`motion-reduce:transition-none`). Las transiciones de color no son movimiento. |
| NVDA / Narrador sobre el rediseño | ⬜ **no ejecutado por el agente** | Requiere un lector de pantalla real: verificación manual del PR. Lo automatizado (nombres accesibles, roles, estados) pasa. |

## 5. Hallazgos y correcciones

Severidad: **Alto** incumple un umbral o un criterio WCAG · **Medio** costo medible · **Bajo** refinamiento.

| ID | Sev. | Hallazgo | Corrección | Archivos |
|---|---|---|---|---|
| H-01 | Alto | zod (~16 kB gzip) en el chunk inicial: `features/cursos/codigo.ts` (HU-F-311) creaba un esquema zod al cargarse, y `AuthLayout` / `EstudianteLayout` lo importan al arrancar | `codigo.ts` valida el `?codigo=` pendiente con una expresión regular de `LIMITES`; el mensaje con zod pasa a `validarCodigo.ts`, que solo usa el formulario de Mis cursos (carga bajo demanda) | `features/cursos/codigo.ts`, `validarCodigo.ts`, `FormularioUnirse.tsx` |
| H-02 | Alto | Inicio en cascada: `index.js` → `renovar` → `/me` → recién entonces el chunk de `InicioPage` → datos | `PaginaRaiz` descarga los chunks de Inicio y Ruta mientras se resuelven la sesión y el perfil | `app/router/PaginaRaiz.tsx` |
| H-03 | Alto | `/ruta`, de la que depende la frase del inicio (elemento LCP), esperaba a `/me` | `precargarRuta()` la pide en cuanto hay sesión, en paralelo con `/me`; `useRuta` con `staleTime` de 30 s para no repetirla al montar (cada avance la invalida) | `features/ruta/hooks/useRuta.ts`, `index.ts`, `PaginaRaiz.tsx` |
| H-04 | Alto | Google Fonts bloquea el primer render 0,85–1,07 s y abre 2 conexiones de terceros | Fuentes alojadas con `@fontsource` (aprobado): Inter variable, Baloo 2 600, Plex Mono 400/500, `font-display: swap`; sin `preconnect` ni `<link>` a Google | `main.jsx`, `index.html`, `tailwind.config.js`, `styles/index.css`, `package.json` |
| H-05 | Alto | **Los títulos nunca usaron Baloo 2**: Tailwind escribía `font-family:Baloo 2,sans-serif`; sin comillas, el «2» invalida la regla y los títulos heredaban Inter (contrato 05 §2.3) | Nombre entre comillas en `tailwind.config.js` (aprobado) | `tailwind.config.js` |
| H-06 | Medio | Logo PNG de 674×539 (29,6 kB) mostrado a 32–40 px, con un margen transparente enorme (el dibujo ocupa ~28 %): se veía como una mancha | `scripts/optimizar-logo.sh`: recorte del margen + WebP de 120 px (7,8 kB); `width`/`height` en el acceso (aprobado) | `assets/brand/logo-120.webp`, `Marca.tsx`, `AuthLayout.jsx` |
| H-07 | Alto | WCAG 2.5.3 (nombre visible en la etiqueta): los trastes de la ruta usaban `aria-label="Bloque 1, …"` mientras se veía «01» | El nombre sale del contenido: «Bloque» y el estado como `sr-only`, la marca × ○ ● oculta | `features/ruta/components/TrasteBloque.tsx`, `utils/presentacion.ts` |
| H-08 | Alto | WCAG 2.5.3 en el índice de preguntas de la evaluación (`aria-label="Pregunta 1, …"` y se veía «○ 01») | Igual que H-07: «Pregunta» y el estado en `sr-only` | `features/evaluaciones/components/IndicePreguntas.tsx` |
| H-09 | Alto | WCAG 1.3.1 en Lección: `<ul>` de temas con separadores `<div>` como hijos directos (accesibilidad 96) | El separador va dentro de cada `<li>` | `features/lecciones/components/ContenidoLeccion.tsx` |
| H-10 | Medio | Las teselas de «Bloques de la ruta» incluían en su nombre los números del diagrama («○○○○23Fundamentos…») | Miniatura decorativa con `aria-hidden` dentro del enlace | `features/inicio/components/BloquesRuta.tsx` |
| H-11 | Medio | Móvil (390 px): «SIPE-SOUND» se partía en dos líneas y se montaba sobre el selector de tema | Debajo de 640 px el selector es un solo botón que alterna los temas (aprobado); la marca no se parte y el nombre de la cuenta se recorta a 8 rem | `shared/ui/SelectorTema.tsx`, `EstudianteLayout.tsx`, `Marca.tsx`, `MenuCuenta.tsx` |
| H-12 | Alto | **LCP del inicio 2,8 s (meta 2,5 s)** | Pendiente en el backend. En la cascada real del entorno local, `renovar` tarda 3,8 s, `/me` 2,4 s y `/progreso/actividad?dias=28` 6,5 s; Lighthouse proyecta esa latencia. Del lado del frontend ya no hay esperas evitables (H-02, H-03) | Propuesta HU-B (§6) |
| H-13 | Medio | Respuestas del API sin compresión (Lighthouse: 3–12 KiB por página) | Pendiente en el backend | Propuesta HU-B (§6) |
| H-14 | Bajo | Inicio pide `/progreso/actividad` dos veces (`dias=7` y `dias=28`) | Pendiente: pedir 28 y recortar 7 en el cliente | Propuesta (§6) |
| H-15 | Bajo | `/docente/cursos` carga ~22 kB de JS que no usa al abrir (el chunk de zod de los formularios) | Pendiente: cargar el diálogo de curso bajo demanda | Propuesta (§6) |
| H-16 | Bajo | La barra de avance `Cuerda` animaba su ancho aunque el sistema pida menos movimiento | `motion-reduce:transition-none` | `shared/music/Cuerda.tsx` |

Red (sin hallazgo previo, requerido por la HU): consultas de catálogo (lecciones, ejercicios,
acordes) y de la ruta con `networkMode: "offlineFirst"` y 24 h en memoria (`OPCIONES_CATALOGO`,
`OPCIONES_SIN_CONEXION` en `shared/api/queryClient.js`); aviso `AvisoSinConexion` con `useEnLinea`
(`navigator.onLine` + eventos `online`/`offline`).

## 6. Propuestas para HU futuras

| Propuesta | Alcance | Estimación |
|---|---|---|
| **HU-F · PWA y caché sin conexión** (Service Worker) | `vite-plugin-pwa` con precache del shell y de los chunks; `stale-while-revalidate` para `GET` de catálogo y ruta; persistencia de TanStack Query en IndexedDB (`persistQueryClient`); manifiesto e íconos; recargar sin red muestra lo último descargado | 5 puntos |
| **HU-B · Latencia de sesión y progreso** | Medir por qué `POST /auth/sesion/renovar` (3,8 s) y `/me` (2,4 s) tardan tanto (llamadas a Supabase Auth, pool de conexiones), y `/progreso/actividad` (6,5 s con 28 días); índice o caché si aplica | 3 puntos |
| **HU-B · Compresión de respuestas** | gzip/brotli en Flask (`flask-compress`) o en el proxy de despliegue | 1 punto |
| **HU-F · Inicio con una sola actividad** | H-14: una petición de 28 días y el rango de 7 derivado en el cliente | 1 punto |
| **HU-F · Diálogos del atril bajo demanda** | H-15: `lazy()` para los diálogos con formulario | 1 punto |
| **HU-F · `VITE_API_URL` relativa** | Aceptar `/api/v1` (mismo origen detrás de un proxy) en `httpClient` | 1 punto |

## 7. Verificación manual pendiente (PR)

1. Chrome DevTools → Lighthouse (móvil) en las 5 páginas con el backend del equipo.
2. Network → «Offline»: visitar Ruta y una lección, cortar la red y volver a ellas desde el menú.
3. NVDA o Narrador en Inicio, Ruta (mástil) y Evaluación: nombres «Bloque 01 …, aprobado» y
   «Pregunta 01, sin responder».
4. Móvil 375–390 px: encabezado en una línea, botón de tema compacto, títulos en Baloo 2.
