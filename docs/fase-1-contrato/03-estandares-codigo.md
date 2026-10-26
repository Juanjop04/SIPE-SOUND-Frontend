# 03 · Estándares de código (Frontend)

## 1. Nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes y su archivo | `PascalCase` | `TablaEstudiantes.tsx` |
| Páginas | `PascalCase` + sufijo `Page` | `LeccionDetallePage.tsx` |
| Hooks | `camelCase` con prefijo `use` | `useEstudiantesCurso.ts` |
| Servicios de API | `camelCase` + sufijo `Service` / `Api` | `evaluacionesApi.ts` |
| Funciones utilitarias | verbo en infinitivo | `calcularEstadoBloques()` |
| Constantes | `UPPER_SNAKE_CASE` | `PORCENTAJE_APROBACION_POR_DEFECTO` |
| Tipos | `PascalCase` | `Leccion`, `IntentoEvaluacion` |
| Booleanos | `es`, `tiene`, `puede`, `esta` | `estaCargando`, `puedeEditar` |
| Manejadores | `handle` + evento / `on` + evento en props | `handleSubmit`, `onGuardar` |

- **Dominio en español** (coherente con el código actual: `obtenerLecciones`, `bloque`), **sin tildes ni ñ en identificadores**.
- Archivos de `shared/ui` en `PascalCase` (`Button.tsx`), no `button.jsx`.

## 2. Herramientas

```js
// eslint.config.js (referencia)
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  jsxA11y.flatConfigs.recommended,
  sonarjs.configs.recommended,
  {
    plugins: { "react-hooks": reactHooks },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off",          // TS valida props
      "no-console": ["error", { allow: ["error"] }],
      "sonarjs/cognitive-complexity": ["error", 15],
      "max-lines-per-function": ["warn", { max: 80, skipComments: true }],
      "no-restricted-imports": ["error", {
        patterns: [
          { group: ["../../*"], message: "Usa el alias @/" },
          { group: ["@/features/*/*"], message: "Importa desde el index.ts de la feature" },
        ],
      }],
    },
  },
  {
    files: ["src/shared/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: ["@/features/*", "@/app/*"] }],
    },
  },
];
```

> Dentro de una misma feature se usan imports relativos cortos (`./`, `../hooks`).
> El patrón `@/features/*/*` aplica a imports **entre** features.

- **Prettier**: `printWidth: 100`, comillas dobles, `trailingComma: "all"`, plugin `prettier-plugin-tailwindcss` para ordenar clases.
- Scripts: `lint`, `lint:fix`, `format`, `typecheck` (`tsc --noEmit`).

## 3. Reglas alineadas con SonarQube

| Regla Sonar | Qué exige | Aplicación |
|---|---|---|
| S3776 Complejidad cognitiva | ≤ 15 | Extraer subcomponentes y funciones puras. |
| S6774 Props validadas | Tipos de props | TypeScript en código nuevo. |
| S6479 Índice como `key` | Prohibido | Usar `id` del dato. |
| S6481 Valor de contexto inestable | `value` de Provider memoizado | `useMemo` en `AuthProvider`. |
| S1854 / S1481 Asignaciones o variables sin uso | Prohibido | ESLint `no-unused-vars`. |
| S125 Código comentado | Prohibido | Borrar; Git conserva historia. |
| S1192 Literales duplicados | Constantes | Rutas en `paths.ts`, mensajes en `constants.ts` de la feature. |
| S2068 Credenciales | Nada en código | `shared/config/env.ts`. |
| S6853 / jsx-a11y | Etiquetas asociadas, `alt`, roles | `Field` asocia `label` e `id` automáticamente. |
| S6844 / anchor-is-valid | Sin `<a href="#">` como botón | Hoy `Header.jsx` lo hace en "Cerrar sesión" → `<button>`. |
| S2004 Funciones anidadas profundas | ≤ 4 niveles | Extraer manejadores. |

**Quality Gate (fases 1–3):** 0 bugs, 0 vulnerabilidades, *hotspots* revisados,
duplicación ≤ 3 % en código nuevo, *maintainability* A. **Sin condición de
cobertura** hasta habilitar pruebas.

## 4. Componentes

- Función con nombre (`export function TablaEstudiantes()`); `export default` solo en páginas (requerido por `lazy`).
- Máximo ~150 líneas por archivo de componente; si crece, dividir.
- Props: objeto tipado, desestructurado en la firma; `children` explícito.
- Sin lógica de negocio en JSX: `estado === "aprobado"` se resuelve en una función o mapa.
- Estados de carga/vacío/error **siempre** representados (con `Skeleton`, `EstadoVacio`, `MensajeError` de `shared/ui`).
- `useEffect` solo para sincronizar con sistemas externos (animaciones, suscripciones). Nunca para pedir datos (eso es TanStack Query).

## 5. Estilos

- Solo clases de Tailwind que mapean a **tokens** (`bg-ink`, `text-paper`, `border-linea`).
- Prohibido: hex, `bg-[...]`, `style={{ color }}` salvo valores calculados (animación de cuerdas).
- Composición de clases con `cn()`.
- Variantes con un mapa (`const variantes = { primario: "...", ... }`) o `class-variance-authority` (ya instalado).

## 6. Accesibilidad mínima

- Todo control interactivo alcanzable y operable con teclado; foco visible con el token `anillo`.
- Contraste según la tabla de [`05-sistema-de-diseno.md`](05-sistema-de-diseno.md#3-contraste-verificado).
- `prefers-reduced-motion` respetado en toda animación.
- Formularios: `label` visible, errores con `aria-describedby`, `aria-invalid`; límites y tipos de [08-validacion-de-formularios.md](08-validacion-de-formularios.md).

## 7. Lo que NO se hace

- Importar `@supabase/supabase-js` o llamar a Supabase (la sesión es del backend, HU-F-207).
- Guardar tokens en `localStorage`/`sessionStorage`: el access token vive en memoria y el
  refresh token en una cookie httpOnly que JavaScript no puede leer.
- `console.log` en código entregado.
- Librerías de componentes completas o de animación pesadas.
- Pruebas unitarias (decisión temporal, contrato de IA R10).
