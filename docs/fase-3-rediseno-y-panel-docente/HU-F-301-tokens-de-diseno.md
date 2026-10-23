# HU-F-301 · Implementar los tokens del sistema de diseño "Diapasón"

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 3 puntos |
| Depende de | HU-F-206 |
| Rama | `hu/HU-F-301-tokens` |

## Historia
**Como** equipo de diseño y desarrollo
**quiero** que los colores, tipografías, radios y sombras salgan de una sola fuente
**para** mantener la identidad de SIPE-SOUND coherente y cambiarla sin buscar hex por todo el código.

## Contexto
- `tailwind.config.js` define colores en hex directamente; `index.css` repite `#1B1030`; `AuthLayout` usa `bg-[#7C3AED]` y hex en el SVG.
- El token `border` choca con la utilidad `border` de Tailwind (`border-border`).
- `primary` se usa como color de texto y de foco, con contraste 3.2:1 (insuficiente para texto normal).

## Alcance
**Incluye**
- `src/styles/tokens.css` con las variables de [05-sistema-de-diseno.md §2](../fase-1-contrato/05-sistema-de-diseno.md#2-tokens) como canales RGB (`--color-ink: 27 16 48;`).
- `tailwind.config.js` consumiendo variables (`ink: "rgb(var(--color-ink) / <alpha-value>)"`), renombrando `border` → `linea`, agregando `ink-2`, `linea-fuerte`, `primary-claro`, `rounded-caja`, `shadow-dialogo`, `ringColor.DEFAULT = accent`.
- Utilidad global de foco: `:focus-visible { outline: 2px solid rgb(var(--color-accent)); outline-offset: 2px; }`.
- Reemplazo en todo `src/` de: hex sueltos, `bg-[#...]`, `border-border`, `hover:text-primary` (→ `hover:text-accent`), `focus:border-primary` (→ anillo `accent`).
- Regla ESLint que prohíbe hex en `className` (`no-restricted-syntax` con un selector de literal que contenga `#[0-9a-fA-F]{3,6}` dentro de atributos JSX `className`).

**No incluye**: rediseñar pantallas.

## Prompt de ejecución
```text
Ejecuta HU-F-301 en SIPE-SOUND-FULLSTACK. Los valores de color son EXACTAMENTE
los de la tabla del sistema de diseño (no inventes tonos). Los SVG de
Fretboard y ChordDiagram pasan a usar currentColor o clases de token
(fill-accent, stroke-linea). La animación de color de las cuerdas en
Fretboard puede seguir calculando rgb() en JS, pero leyendo los valores
de las variables CSS con getComputedStyle una sola vez al montar.
Elimina la mancha difuminada (blur-3xl) de AuthLayout: es un anti-patrón.
```

## Criterios de aceptación
```gherkin
Escenario: Sin colores sueltos
  Cuando busco hex dentro de src/ (excepto styles/tokens.css)
  Entonces no hay resultados

Escenario: Foco visible y accesible
  Cuando navego con Tab por Login
  Entonces cada control muestra un contorno accent con contraste ≥ 3:1

Escenario: Cambio centralizado
  Dado que cambio --color-primary en tokens.css
  Cuando recargo
  Entonces todos los botones primarios cambian sin tocar otros archivos
```

## Verificación manual
```bash
grep -rnE "#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b" src --include=*.{js,jsx,ts,tsx,css} | grep -v tokens.css || echo "OK"
grep -rn "border-border\|bg-\[#" src || echo "OK"
```

## Definición de hecho específica
- [ ] Capturas de Login, Ruta y Acordes antes/después (cambios mínimos esperados: foco, enlaces, sin mancha).
