# HU-F-206 · Cerrar la separación del monorepo y documentar el repositorio

| Campo | Valor |
|---|---|
| Fase | 2 · Reestructuración |
| Prioridad | Should |
| Estimación | 2 puntos |
| Depende de | HU-F-205, HU-B-206 |
| Rama | `hu/HU-F-206-limpieza` |

## Historia
**Como** nuevo integrante del equipo
**quiero** un README que explique cómo correr este frontend y dónde está el backend
**para** empezar a aportar el mismo día.

## Contexto
- El repositorio fue un monorepo (`backend/`, `frontend-react/`, `database/`). El frontend ya está en la raíz, pero `database/schema.sql` sigue aquí y el README describe la estructura antigua (`python app.py`, "GuitarApp").
- `.vscode/launch.json` apunta al puerto 8080 (Vite usa 5173).

## Alcance
**Incluye**
- Eliminar `database/` (el backend ya lo conserva en `db/legacy/` por HU-B-206).
- README nuevo: propósito (de `docs/00-vision`), requisitos, instalación, variables, scripts, estructura resumida (enlace a `docs/fase-1-contrato/02-arquitectura-frontend.md`), enlace al repo de backend.
- `.gitignore`: añadir `.scannerwork/`, `.env.*` con `!.env.example`, `.vscode/*` con `!.vscode/extensions.json`.
- `.vscode/extensions.json` recomendando ESLint, Prettier, Tailwind CSS IntelliSense y SonarLint. Corregir o eliminar `launch.json` (puerto 5173).
- Reemplazar "GuitarApp" por "SIPE-SOUND" en textos visibles y metadatos.

**No incluye**: cambios de diseño.

## Prompt de ejecución
```text
Ejecuta HU-F-206 en SIPE-SOUND-FULLSTACK. Antes de borrar database/, confirma
que existe db/legacy/schema_supabase_v0.sql en SIPE-SOUND-BACKEND. Reescribe
el README en español, breve y práctico. No cambies código de src/ salvo el
reemplazo del nombre "GuitarApp".
```

## Criterios de aceptación
```gherkin
Escenario: Arranque desde cero
  Dado un clon nuevo del repositorio
  Cuando sigo solo los pasos del README
  Entonces la app corre en http://localhost:5173 conectada al backend local
```

## Verificación manual
```bash
grep -rni "guitarapp" . --exclude-dir=node_modules --exclude-dir=.git || echo "OK"
test ! -d database && echo "database/ eliminado"
```

## Definición de hecho específica
- [ ] README revisado por alguien que no participó en la HU.
