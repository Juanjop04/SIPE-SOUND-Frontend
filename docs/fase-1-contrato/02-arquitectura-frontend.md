# 02 · Arquitectura y estructura de carpetas (Frontend)

## 1. Stack

| Pieza | Tecnología | Estado |
|---|---|---|
| Build | Vite 5 | Actual |
| UI | React 18 | Actual |
| Estilos | Tailwind 3 + tokens CSS | Actual (tokens desde HU-F-301) |
| Enrutamiento | React Router 6 (`createBrowserRouter`) | Actual (migra a data router en HU-F-205) |
| Estado de servidor | TanStack Query 5 | Nuevo en HU-F-203 |
| Formularios | React Hook Form + Zod | Nuevo en HU-F-313 (límites en `shared/validacion`) |
| Íconos | lucide-react | Actual (uso restringido, ver sistema de diseño) |
| Autenticación | Backend (`/auth/*`): access token en memoria, refresh token en cookie httpOnly | Desde HU-F-207 (sin `@supabase/supabase-js`) |
| Lenguaje | JavaScript → **TypeScript gradual** | `allowJs` desde HU-F-201; todo archivo **nuevo** de la Fase 3 en `.ts/.tsx` |

> **Por qué TypeScript gradual:** SonarQube exige validar las props de los
> componentes (regla S6774). `PropTypes` queda obsoleto en React 19; los tipos
> de TypeScript cumplen la regla sin coste en tiempo de ejecución. La Fase 2 no
> convierte archivos para no mezclar refactor con cambio de lenguaje.

## 2. Estructura objetivo (por *features*)

```
SIPE-SOUND-FULLSTACK/
├── AGENTS.md · CLAUDE.md
├── index.html
├── vite.config.ts            # alias @ → src
├── tsconfig.json             # allowJs, strict, paths @/*
├── eslint.config.js
├── .prettierrc
├── sonar-project.properties
├── tailwind.config.js        # colores leídos de variables CSS
├── docs/
└── src/
    ├── main.tsx
    ├── app/                          # ensamblado de la aplicación
    │   ├── App.tsx
    │   ├── providers/AppProviders.tsx  # QueryClient + AuthProvider
    │   ├── router/
    │   │   ├── router.tsx            # createBrowserRouter, lazy por ruta
    │   │   ├── RequireAuth.tsx
    │   │   └── RequireRole.tsx
    │   └── layouts/
    │       ├── PublicLayout.tsx
    │       ├── EstudianteLayout.tsx
    │       ├── DocenteLayout.tsx
    │       └── AuthLayout.tsx
    ├── features/                     # una carpeta por capacidad del negocio
    │   ├── auth/
    │   │   ├── api/authService.ts
    │   │   ├── context/AuthProvider.tsx
    │   │   ├── hooks/useSession.ts
    │   │   ├── components/
    │   │   ├── pages/LoginPage.tsx · RegistroPage.tsx
    │   │   ├── utils/traducirErrorAuth.ts
    │   │   └── index.ts              # API pública de la feature
    │   ├── ruta/                     # bloques y desbloqueo
    │   ├── lecciones/
    │   ├── ejercicios/
    │   ├── acordes/
    │   ├── evaluaciones/
    │   ├── progreso/
    │   ├── cursos/                   # lado estudiante: unirse, retroalimentación
    │   └── docente/
    │       ├── resumen/
    │       ├── cursos/
    │       ├── estudiantes/
    │       ├── contenido/
    │       └── evaluaciones/
    ├── shared/                       # reutilizable, sin conocimiento del negocio
    │   ├── api/
    │   │   ├── httpClient.ts         # fetch + token + respuesta estándar + errores
    │   │   ├── sesion.ts             # /auth/*: token en memoria, renovación con cookie
    │   │   ├── ApiError.ts
    │   │   └── queryClient.ts
    │   ├── config/env.ts             # lectura y validación de import.meta.env
    │   ├── config/paths.ts           # constantes de rutas (aquí y no en app: las usan las páginas, HU-F-205)
    │   ├── lib/
    │   │   ├── cn.ts
    │   │   └── formato.ts            # fechas, porcentajes
    │   ├── hooks/
    │   ├── ui/                       # primitivas: Button, Input, Field, Table, Dialog…
    │   └── music/                    # piezas con identidad: ChordDiagram, Fretboard, Cuerda, TrasteDivider
    ├── assets/brand/logo.png
    └── styles/
        ├── tokens.css
        └── index.css
```

### Estructura interna de una feature

```
features/<nombre>/
├── api/            # funciones que llaman a httpClient (sin React)
├── hooks/          # useXxxQuery / useXxxMutation (TanStack Query)
├── components/     # presentacionales de la feature
├── pages/          # una por ruta; orquestan hooks + componentes
├── utils/          # funciones puras de la feature
├── types.ts        # tipos del dominio (desde Fase 3)
└── index.ts        # exporta SOLO lo que otras capas pueden usar; las páginas, como
                    # cargadores perezosos: export const cargarXPage = () => import("./pages/XPage")
```

## 3. Reglas de dependencia

```
app  →  features  →  shared
            ↘ (solo vía index.ts de otra feature)
```

| Regla | Detalle | Cómo se verifica |
|---|---|---|
| `shared` no conoce `features` ni `app` | `shared/ui/Button` no importa nada de `features/` | ESLint `no-restricted-imports` |
| Sin imports profundos entre features | `@/features/progreso` ✅ · `@/features/progreso/hooks/useResumen` ❌ (desde otra feature) | ESLint patrón `@/features/*/*` |
| Las páginas no llaman `fetch` | Todo pasa por `features/*/api` + hooks | Revisión + grep `fetch(` fuera de `shared/api` |
| Los componentes de `components/` no hacen peticiones | Reciben datos por props | Revisión |
| Rutas solo desde `shared/config/paths.ts` | Nada de `"/leccion/" + id` suelto | Revisión |
| Imports con alias `@/` | Nada de `../../../` | ESLint |

## 4. SOLID aplicado a React

| Principio | Aplicación | Ejemplo en SIPE-SOUND |
|---|---|---|
| **S** | Página orquesta, hook obtiene datos, componente pinta. | Hoy `Home.jsx` obtiene sesión, pide 3 APIs, calcula desbloqueo y pinta. Se separa en `useRuta()`, `calcularEstadoBloques()` y `<RutaMastil />`. |
| **O** | Variantes por configuración, no por `if` dentro del componente. | `Button` con mapa `variants`; un nuevo estilo es una entrada, no un `if`. |
| **L** | Componentes que envuelven elementos nativos aceptan y reenvían sus props. | `<Input {...props} />` funciona donde funciona `<input>`; `forwardRef` en primitivas. |
| **I** | Props mínimas y específicas. | `<TarjetaLeccion leccion={...} />` en vez de pasar el objeto de página completo. |
| **D** | Componentes dependen de hooks/abstracciones, no de `fetch`. | `Header` usa `useSession()`, no `fetch("/auth/...")`. |

## 5. Estado

| Tipo | Dónde |
|---|---|
| Datos del servidor | TanStack Query (caché, reintentos, invalidación). Claves en `features/*/api/keys.ts`. |
| Sesión | `AuthProvider` (contexto único) + `useSession()`. |
| Estado de UI local | `useState` en el componente. |
| Estado de UI compartido | Contexto pequeño de la feature (solo si dos ramas lejanas lo necesitan). |
| URL | Filtros, paginación y pestañas del panel docente viven en `searchParams`. |

## 6. Rendimiento y poca conectividad (visión 2031)

- Cada página se carga con `lazy()` (división de código por ruta).
- `staleTime` de TanStack Query ≥ 5 min para catálogo (bloques, lecciones, acordes).
- Imágenes con `loading="lazy"` y tamaño explícito.
- Sin librerías de UI completas (MUI, Chakra, etc.).
- Presupuesto: JS inicial ≤ 180 kB gzip (verificado con `vite build`).
