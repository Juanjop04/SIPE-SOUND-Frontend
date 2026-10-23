# HU-F-316 · Dibujar las ilustraciones del instrumento

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Should |
| Estimación | 3 puntos |
| Depende de | HU-F-314 (tokens revisados) |
| Rama | `hu/HU-F-316-ilustraciones` |

## Historia
**Como** estudiante que empieza
**quiero** que la plataforma se vea cálida y relacionada con la guitarra que tengo en las manos
**para** sentir que estoy en un lugar hecho para aprender música.

## Contexto
El repositorio solo tiene `src/assets/brand/logo.png`; no hay fotografías ni ilustraciones. El
inicio del estudiante (HU-F-315) y los estados vacíos necesitan un recurso visual que no sea
decorativo genérico.

**Decisión**: ilustraciones **SVG propias**, en trazo de línea y con tokens (`currentColor` y clases
de Tailwind), en lugar de fotografías:
- Coherentes con el sistema "Diapasón" (§6 prohíbe ilustraciones 3D o de *stock*).
- Livianas y sin peticiones extra: importantes para baja conectividad (visión 2031).
- Sin licencias de terceros que rastrear y sin URLs externas.
- Cambian solas con los tokens (si HU-F-314 ajusta un color, la ilustración lo sigue).

Las fotografías quedan fuera de esta fase; si el equipo las quiere, se propone una HU con política de
licencias, formato AVIF/WebP y presupuesto de peso.

## Alcance
**Incluye** `src/shared/music/ilustraciones/`:

| Componente | Qué dibuja | Dónde se usa |
|---|---|---|
| `GuitarraAcustica` | Guitarra acústica en tres cuartos: clavijero, mástil con trastes, boca, puente; las cuerdas pueden "sonar" (prop `sonando`). | Encabezado del inicio (HU-F-315). |
| `ManoEnAcorde` | Mano izquierda formando un acorde sobre un fragmento del mástil; el acorde se pasa como prop (`diagram` de `ChordDiagram`), así el dibujo coincide con el acorde real de la siguiente lección. | Tarjeta "Siguiente lección" (HU-F-315). |
| `Atril` | Atril con una partitura en blanco. | Estados vacíos del atril docente. |
| `EstucheAbierto` | Estuche con la guitarra dentro. | Estado vacío "Aún no empiezas" y 404. |

Reglas de dibujo:
- `viewBox` fijo y `width`/`height` declarados (sin saltos de diseño); trazo de 1,5–2 px; rellenos
  planos con `surface` / `ink-2`; detalles en `linea-fuerte`; **ámbar (`success`) solo en cuerdas
  que suenan**, como en `Cuerda`.
- Decorativa → `aria-hidden="true"`; informativa (p. ej. `ManoEnAcorde`) → `role="img"` + `<title>`
  que nombre el acorde ("Mano formando el acorde Em").
- Animación solo en `GuitarraAcustica` (vibración de cuerdas, reutiliza `animacionCuerdas.ts`) y
  detenida con `prefers-reduced-motion`.
- Cada archivo ≤ 4 kB; se importan por página (code-splitting), nunca en el *bundle* inicial.
- Entrada en el catálogo `/_componentes`.

**No incluye**: fotografías, imágenes por bloque subidas por el docente (requiere un campo en la base;
se registra como hallazgo), ilustraciones de otros instrumentos.

## Diseño
- Estilo: dibujo técnico amable, como el diagrama de un método de guitarra; sin sombras ni degradados.
- Contraste: los trazos que transmiten forma deben alcanzar 3:1 sobre su fondo (1.4.11); texto nunca
  encima de la ilustración: va al lado.

## Prompt de ejecución
```text
Ejecuta HU-F-316 en SIPE-SOUND-FULLSTACK. Antes de dibujar, describe cada
ilustración en 3 viñetas (silueta, proporción del viewBox, qué partes
usan qué token) y espera confirmación. SVG escrito a mano en TSX, sin
librerías ni archivos externos, sin hex (usa clases fill-/stroke- con
tokens o currentColor). Mide el peso de cada componente minificado.
```

## Criterios de aceptación
```gherkin
Escenario: La ilustración sigue al contenido
  Dado que la siguiente lección usa el acorde Am
  Cuando se dibuja ManoEnAcorde con el diagrama de Am
  Entonces los dedos ocupan las mismas cuerdas y trastes que el ChordDiagram de Am
  Y el lector de pantalla anuncia "Mano formando el acorde Am"

Escenario: Movimiento reducido
  Dado prefers-reduced-motion activo
  Entonces las cuerdas de GuitarraAcustica no vibran

Escenario: Sin peso en el inicio
  Cuando construyo el proyecto
  Entonces ninguna ilustración aparece en el chunk inicial
```

## Verificación manual
Catálogo `/_componentes` a 1280 px y 375 px; modo de alto contraste de Windows (las siluetas siguen
siendo visibles con `currentColor`).

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR.
- [ ] Tabla de pesos por ilustración en el PR.
