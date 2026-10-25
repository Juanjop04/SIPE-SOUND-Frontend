# HU-F-302 · Construir la librería de componentes base y musicales

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-301 |
| Rama | `hu/HU-F-302-componentes` |

## Historia
**Como** desarrollador
**quiero** un conjunto pequeño de componentes accesibles con la identidad de SIPE-SOUND
**para** construir las pantallas del estudiante y del docente sin reinventar botones, tablas ni diálogos.

## Alcance
**Incluye** — todo en TypeScript (`.tsx`), con props tipadas y `forwardRef` en primitivas:

`src/shared/ui/`
| Componente | Requisitos |
|---|---|
| `Button` | Variantes `primario` · `secundario` (borde `linea-fuerte`) · `fantasma` · `peligro`; tamaños `sm` · `md`; estado `cargando` (deshabilita y anuncia con `aria-busy`). Reemplaza al actual. |
| `Input`, `Textarea`, `Select` | Borde `linea-fuerte`, `aria-invalid`. |
| `Field` | Une `label` + control + ayuda + error; genera `id` con `useId` y conecta `aria-describedby`. |
| `Table` | Cabecera fija, celdas numéricas `font-mono tabular-nums text-right`, orden por columna con `aria-sort`, fila clicable opcional accesible por teclado. |
| `Dialog` | Sobre `<dialog>` nativo; foco atrapado, `Esc` cierra, devuelve el foco. Única pieza con `shadow-dialogo`. |
| `Drawer` | Panel lateral para edición (mismo comportamiento de foco que `Dialog`). |
| `Tabs` | Patrón WAI-ARIA con flechas. |
| `Skeleton`, `EstadoVacio`, `MensajeError` | Estados obligatorios de cada vista. `MensajeError` con botón "Reintentar". |
| `Aviso` (toast) | Región `aria-live="polite"`; máximo 1 visible. |

`src/shared/music/`
| Componente | Requisitos |
|---|---|
| `Cuerda` | Progreso como línea; `sonando` → `success`; `role="progressbar"`. |
| `TrasteDivider` | Separador de 1 px, número de traste opcional en mono. |
| `MarcaEstado` | `×` / `○` / `●` + texto accesible oculto. |
| `Tablatura` | Fila de datos en mono separados por `│`. |
| `ChordDiagram`, `Fretboard` | Convertir a `.tsx` y tipar. |

- Eliminar `Card` (su uso de `border-l-4` es un anti-patrón); las vistas actuales usan `TrasteDivider` o superficie `surface` sin borde lateral.
- Página interna `/_componentes` (solo en `import.meta.env.DEV`) que muestra cada componente en todos sus estados — sirve de catálogo visual sin instalar Storybook.

**No incluye**: rediseño de páginas.

## Prompt de ejecución
```text
Ejecuta HU-F-302 en SIPE-SOUND-FULLSTACK. Antes de escribir código, lista la
API de props de cada componente y espera mi aprobación. Sin librerías nuevas
de UI (usa <dialog> nativo). Cada componente ≤ 150 líneas, con complejidad
cognitiva ≤ 15. Cumple el sistema de diseño: una sombra, dos radios, sin
degradados, foco accent. La ruta /_componentes solo existe en desarrollo.
```

## Criterios de aceptación
```gherkin
Escenario: Diálogo accesible
  Dado un Dialog abierto
  Cuando presiono Tab repetidamente
  Entonces el foco no sale del diálogo
  Y al presionar Esc se cierra y el foco vuelve al botón que lo abrió

Escenario: Tabla ordenable
  Cuando activo con Enter la cabecera "Avance"
  Entonces las filas se ordenan y la cabecera expone aria-sort

Escenario: Catálogo solo en desarrollo
  Cuando ejecuto npm run build y abro /_componentes en el preview
  Entonces veo la página 404
```

## Verificación manual
`npm run dev` → `/_componentes`: recorrer con teclado y lector de pantalla (NVDA o Narrador).

## Definición de hecho específica
- [ ] `Card` eliminado y sin referencias.
- [ ] Todos los componentes con tipos exportados.
