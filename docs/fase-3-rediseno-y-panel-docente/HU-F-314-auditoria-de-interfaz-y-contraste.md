# HU-F-314 · Auditar la interfaz, el contraste y la legibilidad (WCAG 2.2 AA)

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-306, HU-F-307, HU-F-308 (integradas en `develop`) |
| Rama | `hu/HU-F-314-auditoria-interfaz` |

## Historia
**Como** estudiante principiante
**quiero** leer sin esfuerzo cada texto, botón y cifra de la plataforma, en cualquier estado
**para** concentrarme en tocar y no en descifrar la pantalla.

## Contexto
El contraste de [`05-sistema-de-diseno.md` §3](../fase-1-contrato/05-sistema-de-diseno.md#3-contraste-verificado)
se calculó sobre los **colores puros** con WCAG 2.1. Las pantallas reales combinan además:

- Opacidades: la `Cuerda` sin sonar usa `paper` al 55 %; `disabled:opacity-40` en botones y en el
  selector de acordes (HU-F-308); `bg-primary/…` en filas seleccionadas.
- Estados: hover, foco (`anillo`), activo, deshabilitado, error, seleccionado (`aria-pressed`, `aria-selected`).
- Texto sobre `ink-2` (barra lateral, filas alternas) y sobre la animación de `Fretboard` en `AuthLayout`.
- `placeholder` de `Input` y `Textarea`, contadores de caracteres, `Tablatura` en `muted` a 13 px.

Además, el rediseño (HU-F-315 a HU-F-318) necesita un **diagnóstico de experiencia** documentado
antes de cambiar pantallas: qué impide usar algo, qué cuesta leer y qué es inconsistente.

## Alcance
**Incluye**
1. **Informe** `docs/auditorias/AUD-2026-01-interfaz-y-contraste.md` con:
   - Inventario de pantallas: ruta, lección, ejercicio, acordes, evaluación, mi progreso, acceso
     (login, registro, términos), atril (resumen, cursos, curso, contenido, editores), errores 404/500.
   - **Hallazgos de experiencia** clasificados *Crítico* (impide usar una función) · *Alto* (afecta
     mucho la lectura o la tarea) · *Medio* (inconsistencia visual o de navegación) · *Bajo*
     (refinamiento), cada uno con pantalla, componente (`ruta/archivo`), captura, mejora propuesta y
     HU que lo resuelve (esta u otra del rediseño).
   - **Matriz de contraste** de combinaciones reales: texto/fondo con opacidad aplicada (color
     compuesto), por estado, en `ink`, `ink-2` y `surface`. Umbrales WCAG 2.2 AA: 4.5:1 texto
     normal, 3:1 texto grande (≥ 24 px, o ≥ 18,66 px en negrita) y 3:1 componentes y gráficos (1.4.11).
   - Foco visible (2.4.7) y **foco no tapado** (2.4.11, nuevo en 2.2): el anillo no queda oculto bajo
     la barra superior fija ni bajo el `Drawer`.
   - **Tamaño del objetivo** (2.5.8, nuevo en 2.2): controles ≥ 24 × 24 px o con separación suficiente
     (botones Subir/Bajar de `ListaEditable`, casillas de acordes, flechas del mástil en móvil).
   - Información que depende solo del color (1.4.1): estados del mástil, cuerdas, filas "sin actividad".
2. **Correcciones de contraste** de los hallazgos *Crítico* y *Alto*:
   - Ajustar **luminosidad** de los tokens (no el tono) en `src/styles/tokens.css`; registrar el nuevo
     valor y su relación en la tabla de §3 del sistema de diseño.
   - Sustituir opacidades que bajen de 3:1 por tokens sólidos (p. ej. un token `cuerda-muda` en lugar de
     `paper/55` si no alcanza 3:1 sobre `ink`).
   - Deshabilitado: mantener 3:1 en el borde del control aunque el texto no lo exija (WCAG exime los
     inactivos, pero el estudiante debe ver que el control existe).
3. Los hallazgos *Medio* y *Bajo* quedan asignados a HU-F-315…HU-F-318 o a una HU nueva propuesta en
   el informe (con estimación).

**No incluye**: cambiar el tono de la paleta, rediseñar pantallas (HU-F-315…F-318), métricas de
rendimiento (HU-F-312).

## Herramientas
Sin dependencias nuevas en `package.json`:
- axe DevTools (extensión) o `npx @axe-core/cli@4 http://localhost:5173/<ruta>` en cada pantalla.
- Lighthouse de Chrome (categoría Accesibilidad).
- Cálculo de contraste: script temporal en Node (fórmula de luminancia relativa WCAG con
  composición alfa) que se borra al terminar; las cifras quedan en el informe.
- Recorrido con teclado y Narrador/NVDA en las pantallas críticas (ruta, evaluación, editor).

## Prompt de ejecución
```text
Ejecuta HU-F-314 en SIPE-SOUND-FULLSTACK. Primero mide y documenta (no
cambies código hasta tener la matriz). Calcula el contraste del color
COMPUESTO cuando haya opacidad (canal = a·frente + (1−a)·fondo). Para cada
combinación que falle propone el ajuste mínimo de luminosidad que conserve
el tono del token y muéstrame la tabla antes/después; espera confirmación.
No marques ninguna comprobación como aprobada si no la ejecutaste: escribe
"no ejecutada" y el motivo. Solo cambios de tokens y de clases de color;
nada de rediseño en esta HU.
```

## Criterios de aceptación
```gherkin
Escenario: Matriz con estados reales
  Cuando abro el informe de auditoría
  Entonces cada combinación de texto y fondo aparece con su relación calculada por estado
  Y las que usan opacidad muestran el color compuesto

Escenario: Corrección sin cambiar la identidad
  Dado que la cuerda sin sonar no alcanzaba 3:1 sobre ink
  Cuando se aplica la corrección
  Entonces alcanza 3:1 y el token conserva su tono lila

Escenario: Hallazgos trazables
  Entonces cada hallazgo Crítico y Alto está corregido en esta HU o enlazado a la HU que lo corrige

Escenario: Sin aprobaciones simuladas
  Entonces el informe lista las herramientas ejecutadas con su resultado real
```

## Verificación manual
Recorrido completo con teclado a 1280 px y 375 px; zoom del navegador al 200 % sin pérdida de
contenido (1.4.4) y ancho de 320 px sin desplazamiento horizontal (1.4.10).

## Definición de hecho específica
- [ ] Informe en `docs/auditorias/` con capturas antes/después.
- [ ] Tabla §3 de `05-sistema-de-diseno.md` actualizada con los valores nuevos.
- [ ] Sin hex fuera de `tokens.css`.
