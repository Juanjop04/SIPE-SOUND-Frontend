# GuitarApp — Frontend (React + Vite + Tailwind + shadcn/ui)

## Instalacion

```bash
npm install
cp .env.example .env
```

Edita `.env` y pega tu `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` reales
(Supabase → Settings → API).

## Correr en desarrollo

Con el backend Flask corriendo en otra terminal (`python app.py`):

```bash
npm run dev
```

Abre `http://localhost:5173`

## Que cambio respecto a la version anterior

- Se reemplazo el CSS a mano por Tailwind (clases utilitarias directo en el JSX)
- Se agregaron componentes reutilizables estilo shadcn/ui en `src/components/ui/`
  (Button, Input, Card) — se editan igual que cualquier componente propio
- Se agrego el logo real del proyecto en `src/assets/logo.png`
- El backend y la logica de Supabase/API no cambiaron en nada

## Estructura

```
src/
├── main.jsx
├── App.jsx                 → rutas (/, /login, /registro)
├── index.css                → directivas de Tailwind
├── assets/
│   └── logo.png              → logo de GuitarApp
├── components/
│   ├── Header.jsx
│   └── ui/
│       ├── button.jsx
│       ├── input.jsx
│       └── card.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Registro.jsx
└── lib/
    ├── utils.js               → helper cn() para combinar clases
    ├── supabaseClient.js
    └── api.js
```

## Paleta de colores (definida en tailwind.config.js)

Inspirada en el logo (fantasma con audifonos, degradado indigo-violeta-rosa).

| Clase Tailwind                  | Hex       | Uso                                     |
| ------------------------------- | --------- | --------------------------------------- |
| `bg-ink`                        | `#1B1030` | Fondo principal                         |
| `bg-surface`                    | `#2A1B4D` | Tarjetas, header                        |
| `border-primary` / `bg-primary` | `#7C3AED` | Acento principal, botones               |
| `text-accent`                   | `#E29DE0` | Acento secundario (usar con moderacion) |
| `bg-success` / `text-success`   | `#F5B942` | Exito / progreso completado             |
| `text-danger`                   | `#F2545B` | Errores                                 |
| `text-muted`                    | `#C9BEE0` | Texto secundario                        |
| `text-paper`                    | `#F3EEFB` | Texto principal sobre fondo oscuro      |

Tipografia: `Baloo 2` (titulos, redondeada y amigable, a tono con el
fantasma) + `Inter` (texto) + `IBM Plex Mono` (datos/acordes).

## Como agregar mas componentes shadcn/ui

Si necesitan mas adelante un componente que no esta (Select, Dialog, etc.),
la logica es la misma: crear el archivo en `src/components/ui/`, usar
Tailwind + el helper `cn()` de `src/lib/utils.js`. No es una libreria que
se instale con npm, se copian los componentes al proyecto.
