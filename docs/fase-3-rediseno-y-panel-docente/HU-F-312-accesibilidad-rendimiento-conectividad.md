# HU-F-312 · Auditoría de accesibilidad, rendimiento y baja conectividad

| Campo | Valor |
|---|---|
| Fase | 3 · Cierre |
| Prioridad | Should |
| Estimación | 5 puntos |
| Depende de | HU-F-304 … HU-F-318 |
| Rama | `hu/HU-F-312-auditoria` |

## Historia
**Como** estudiante de una zona rural con un celular de gama baja
**quiero** que SIPE-SOUND cargue rápido y se pueda usar con conexión lenta
**para** practicar guitarra en las mismas condiciones que un estudiante de ciudad.

## Alcance
**Incluye**
- **Lighthouse (móvil, throttling 4G lenta)** en Inicio, Ruta, Lección, Evaluación, Docente/Cursos: Rendimiento ≥ 85, Accesibilidad ≥ 95, Buenas prácticas ≥ 95.
- **Fuentes**: cargar solo los pesos usados; `font-display: swap`; evaluar *self-hosting* con `@fontsource` para eliminar la dependencia de Google Fonts (reporte de bytes antes/después).
- **Bundle**: JS inicial ≤ 180 kB gzip; `lucide-react` importado por ícono; revisar con `npx vite-bundle-visualizer` (sin instalarlo como dependencia).
- **Red**: TanStack Query con `networkMode: "offlineFirst"` para catálogo; aviso discreto "Sin conexión: mostrando lo último que descargaste" cuando `navigator.onLine` es falso.
- **Accesibilidad**: el contraste y los criterios de WCAG 2.2 ya se auditaron en HU-F-314; aquí se repite el
  recorrido con teclado y NVDA/Narrador sobre las pantallas del rediseño (HU-F-315…F-318) para detectar regresiones;
  `lang="es-CO"` en `index.html`.
- **Inicio**: LCP ≤ 2,5 s en 4G lenta; ilustraciones (HU-F-316) fuera del chunk inicial; sin desplazamientos de
  diseño (CLS ≤ 0,1) mientras cargan las secciones.
- **Movimiento**: toda animación detenida con `prefers-reduced-motion`.
- Informe `docs/auditorias/AUD-2026-xx.md` con métricas antes/después.

**No incluye**: Service Worker / PWA completa (se propone como HU futura en el informe con estimación).

## Prompt de ejecución
```text
Ejecuta HU-F-312 en SIPE-SOUND-FULLSTACK. Mide primero (antes), corrige,
mide después. Solo cambios de rendimiento/accesibilidad: ningún cambio de
diseño sin aprobación. Documenta cada hallazgo con su corrección en el informe.
```

## Criterios de aceptación
```gherkin
Escenario: Umbrales
  Cuando ejecuto Lighthouse móvil en las 4 páginas
  Entonces todas cumplen los umbrales de la HU

Escenario: Sin conexión
  Dado que ya visité la ruta y una lección
  Cuando pierdo la conexión y vuelvo a esas páginas
  Entonces veo el contenido en caché y el aviso de sin conexión
```

## Verificación manual
Chrome DevTools → Lighthouse (móvil) y Network → "Slow 4G" / "Offline".

## Definición de hecho específica
- [ ] Informe de auditoría en `docs/auditorias/`.
