# SIPE-SOUND · Frontend

Plataforma web para que personas principiantes aprendan guitarra a su ritmo: lecciones
guiadas por niveles, ejercicios con metrónomo, catálogo de acordes, evaluaciones por bloque y
seguimiento del progreso, con panel para docentes. Más contexto en
[docs/00-vision/proyecto.md](docs/00-vision/proyecto.md).

Este repositorio es solo la interfaz (React + Vite + Tailwind). La API, la base de datos y la
autenticación viven en **[SIPE-SOUND-BACKEND](https://github.com/isaac18-maker/SIPE-SOUND-BACKEND)**.

## Requisitos

- Node.js 18 o superior (el equipo usa 24) y npm.
- El backend corriendo en local: sigue su README (`uv run python run.py`, puerto 5000).

## Instalación

```bash
npm install
cp .env.example .env
```

## Variables de entorno

| Variable       | Valor en local                 | Para qué                                                                                                                |
| -------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | `http://localhost:5000/api/v1` | URL base de la API. Debe terminar en `/api/v1`; si falta o no termina así, la app no arranca y la consola dice por qué. |

El frontend **no usa Supabase** ni guarda claves: el registro y el inicio de sesión pasan por
el backend (`/auth/*`). Abre el frontend y el backend con el mismo host (`localhost` en ambos;
no mezcles con `127.0.0.1`) para que viaje la cookie de sesión.

## Correr en desarrollo

```bash
npm run dev        # http://localhost:5173
```

Si ves "No pudimos conectar. Revisa tu conexión…", el backend no está corriendo en el puerto 5000.

## Scripts

| Comando                             | Qué hace                                                    |
| ----------------------------------- | ----------------------------------------------------------- |
| `npm run dev`                       | Servidor de desarrollo con recarga en caliente.             |
| `npm run build`                     | Compila para producción en `dist/` (un archivo por página). |
| `npm run preview`                   | Sirve `dist/` para revisarlo localmente.                    |
| `npm run lint` · `npm run lint:fix` | ESLint (React, accesibilidad, SonarJS).                     |
| `npm run format`                    | Prettier (incluye el orden de clases de Tailwind).          |
| `npm run typecheck`                 | Verificación de TypeScript (`tsc --noEmit`).                |

## Estructura

```
src/
├── app/        # ensamblado: router, layouts, guardas, proveedores
├── features/   # una carpeta por capacidad: ruta, lecciones, ejercicios, acordes,
│               #   evaluaciones, progreso, auth (api/ · hooks/ · pages/ · index.js)
├── shared/     # reutilizable: api (httpClient, sesión), config, ui, music
├── assets/
└── styles/
```

Reglas: `app → features → shared`; entre features solo vía su `index.js`; `fetch` solo en
`shared/api/httpClient`. Detalle en
[docs/fase-1-contrato/02-arquitectura-frontend.md](docs/fase-1-contrato/02-arquitectura-frontend.md).

## Cómo se trabaja

El trabajo se organiza en historias de usuario (HU) en [docs/](docs/README.md): una HU por rama
(`hu/HU-F-XXX-…`) y por PR. Antes de escribir código lee [AGENTS.md](AGENTS.md) y el contrato en
[docs/fase-1-contrato/](docs/fase-1-contrato/). Textos, comentarios y commits en español.
