# AGENTS.md · SIPE-SOUND Frontend

Instrucciones para cualquier agente de IA que trabaje en este repositorio.

## Qué es esto
Frontend (React + Vite + Tailwind) de SIPE-SOUND, plataforma para aprender
guitarra de forma autoguiada, con seguimiento de progreso y panel docente.
API en el repositorio hermano `SIPE-SOUND-BACKEND`.

## Antes de escribir código
1. Lee `docs/fase-1-contrato/` completo (contrato vinculante).
2. Si la tarea toca algo visible, `docs/fase-1-contrato/05-sistema-de-diseno.md` es obligatorio.
3. Lee la HU asignada en `docs/fase-2-reestructuracion/` o `docs/fase-3-rediseno-y-panel-docente/`.

## Reglas que no se negocian
- Una HU por rama y por PR. No salgas del alcance.
- `app → features → shared`. Entre features, solo vía `index.ts`. `shared` no importa features.
- `fetch` solo en `src/shared/api/httpClient`. Datos del servidor con TanStack Query.
- Supabase solo para autenticación; nunca `supabase.from(...)`.
- Colores solo con tokens; nada de hex ni `bg-[#…]`.
- Nada de UI genérica de IA: sin degradados, blobs, glassmorphism, grillas de tarjetas con ícono, emojis.
- Código nuevo en TypeScript. Sin pruebas unitarias en esta etapa (decisión del equipo).
- Español en interfaz, docs, comentarios y commits.

## Comandos
```bash
npm install
npm run dev        # http://localhost:5173
npm run lint
npm run typecheck  # desde HU-F-201
npm run build
```
