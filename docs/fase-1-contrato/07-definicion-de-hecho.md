# 07 · Definición de hecho (DoD) y flujo Git

## DoD general — aplica a TODA HU del frontend

- [ ] Criterios de aceptación verificados uno por uno y evidenciados en el PR.
- [ ] `npm run lint` sin errores; `npm run typecheck` sin errores (desde HU-F-201).
- [ ] `npm run build` sin advertencias nuevas; JS inicial ≤ 180 kB gzip.
- [ ] Sin `console.log`, sin código comentado, sin `fetch` fuera de `shared/api`.
- [ ] Sin hex ni clases de color arbitrarias en componentes.
- [ ] Imports respetan las reglas de dependencia (alias `@/`, sin imports profundos entre features).
- [ ] Probado en 1280 px y 375 px, con teclado (Tab / Shift+Tab / Enter / Esc).
- [ ] Estados de carga, vacío y error presentes en cada vista con datos.
- [ ] HU visual: revisión explícita de anti-patrones del sistema de diseño.
- [ ] SonarLint / SonarQube sin *issues* nuevos *Blocker* o *Critical*.
- [ ] Si cambió el consumo de un endpoint: el contrato de API del backend lo respalda.
- [ ] Las respuestas se leen con la estructura estándar (`success`, `data`, `message`, `errors`) solo a través de `httpClient`.
- [ ] Todo campo que escribe una persona tiene esquema Zod y `maxLength` con los límites de [08-validacion-de-formularios.md](08-validacion-de-formularios.md), iguales a los del backend y la base.

## Ramas

| Rama | Uso |
|---|---|
| `main` | Producción. Protegida. |
| `develop` | Integración de la fase en curso. |
| `hu/HU-F-XXX-slug` | Trabajo de una HU. |
| `hotfix/descripcion` | Urgencias desde `main`. |

## Orden de merge con el backend

1. Backend primero, compatible hacia atrás cuando sea posible.
2. Frontend después.
3. Limpieza al final.

> Excepción registrada: HU-B-319 retiró `/api` sin versión **antes** de HU-F-203 por
> decisión del equipo. Mientras HU-F-203 no esté en `develop`, el frontend no carga datos.

## Pipeline mínimo (CI) — sin pruebas en esta etapa

```yaml
steps:
  - npm ci
  - npm run lint
  - npm run typecheck
  - npm run build
  - sonar-scanner   # Quality Gate sin condición de cobertura
```
