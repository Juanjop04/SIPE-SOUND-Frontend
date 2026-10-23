# HU-F-201 · Configurar herramientas de calidad, alias y TypeScript gradual

| Campo | Valor |
|---|---|
| Fase | 2 · Reestructuración |
| Prioridad | Must |
| Estimación | 3 puntos |
| Depende de | — |
| Rama | `hu/HU-F-201-tooling` |

## Historia
**Como** equipo
**quiero** linter, formateador, alias de imports y TypeScript habilitado
**para** que la calidad se mida desde el primer PR y la reubicación de archivos no rompa imports.

## Contexto
`package.json` solo tiene `dev`, `build`, `preview`. No hay ESLint, Prettier, alias ni `sonar-project.properties`. El nombre del paquete sigue siendo `guitarapp-frontend`.

## Alcance
**Incluye**
- Dependencias de desarrollo (versión exacta): `eslint`, `@eslint/js`, `typescript`, `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-sonarjs`, `prettier`, `prettier-plugin-tailwindcss`, `@types/react`, `@types/react-dom`, `@types/node`.
- `eslint.config.js` del contrato, `.prettierrc`, `.prettierignore`, `.editorconfig`.
- `tsconfig.json` con `allowJs: true`, `checkJs: false`, `strict: true`, `jsx: react-jsx`, `paths: { "@/*": ["src/*"] }`, `noEmit: true`.
- `vite.config.js` → `vite.config.ts` con alias `@`.
- Scripts: `lint`, `lint:fix`, `format`, `typecheck`.
- `sonar-project.properties`.
- `package.json`: `name: "sipe-sound-frontend"`.

**No incluye**: corregir los errores que reporte ESLint en código existente (van a *Hallazgos*, salvo los triviales autocorregibles con `lint:fix` que no cambien comportamiento).

## Prompt de ejecución
```text
Ejecuta HU-F-201 en SIPE-SOUND-FULLSTACK. Instala solo las dependencias
listadas con --save-dev --save-exact. Crea la configuración descrita.
No conviertas archivos .jsx a .tsx. No cambies ningún componente salvo
autocorrecciones de formato. Ejecuta npm run lint y reporta el conteo de
errores por regla en Hallazgos. La app debe verse y funcionar igual.
```

## Pasos
1. Instalar dependencias.
2. Crear configuración (`eslint.config.js`, `.prettierrc`, `tsconfig.json`, `vite.config.ts`).
3. `sonar-project.properties`:
   ```properties
   sonar.projectKey=sipe-sound-frontend
   sonar.projectName=SIPE-SOUND Frontend
   sonar.sources=src
   sonar.exclusions=**/node_modules/**,dist/**,src/assets/**
   sonar.sourceEncoding=UTF-8
   ```
4. `npm run format` (un commit separado solo de formato).
5. `npm run lint` → copiar estadísticas en el PR.

## Criterios de aceptación
```gherkin
Escenario: Alias disponible
  Dado el alias @ configurado
  Cuando importo "@/lib/utils.js" desde cualquier archivo
  Entonces Vite y el editor lo resuelven

Escenario: Sin cambios visibles
  Cuando ejecuto npm run dev y recorro Home, Login, Registro, Acordes, Ejercicios, Progreso y un Quiz
  Entonces todo se ve y funciona igual que antes
```

## Verificación manual
```bash
npm run lint
npm run typecheck
npm run build
```

## Definición de hecho específica
- [ ] El commit de formato está separado del de configuración.
