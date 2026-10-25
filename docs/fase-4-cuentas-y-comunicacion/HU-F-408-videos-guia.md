# HU-F-408 · Video guía de YouTube embebido

| Campo | Valor |
|---|---|
| Fase | 4 · Cuentas y comunicación |
| Prioridad | Should |
| Estimación | 5 puntos |
| Depende de | HU-F-305, HU-F-308, HU-F-312, **HU-B-410** |
| Rama | `hu/HU-F-408-videos-guia` |

## Historia
**Como** estudiante
**quiero** ver dentro de la lección, el ejercicio, el bloque o el acorde el video que preparó mi docente, y ponerlo en pantalla completa
**para** mirar de cerca la mano mientras practico.
**Como** docente o administrador **quiero** pegar el enlace de YouTube en el editor **para** agregarlo sin pasos técnicos.

## Contexto
- La lección (`src/features/lecciones/pages/LeccionDetallePage.tsx`), el ejercicio
  (`src/features/ejercicios/pages/EjercicioDetallePage.tsx`), el bloque (`src/features/ruta/components/DetalleBloque.tsx`)
  y los acordes (`src/features/acordes/pages/AcordesPage.tsx`) no muestran videos.
- Los editores del docente están en `src/features/docente/contenido/components/` (`FormularioLeccion.tsx`,
  `FormularioEjercicio.tsx`, `CamposComunes.tsx`).
- HU-B-410: las lecturas traen `video: {youtube_id, inicio_seg} | null`; la escritura recibe `video_url`
  y `video_inicio_seg`; acordes con `PUT/DELETE /admin/acordes/{id}/video` (solo admin).

## Alcance
**Incluye**
1. Componente `VideoGuia` en `src/shared/ui/VideoGuia.tsx` (presentacional, sin datos del servidor):
   - **Fachada**: hasta que el estudiante pulsa "Reproducir video", no se carga nada de YouTube
     (ni iframe, ni miniatura, ni scripts): privacidad de menores (Ley 1581) y poca conectividad.
   - Al pulsar: `<iframe src="https://www.youtube-nocookie.com/embed/{id}?rel=0&playsinline=1&start={inicio}&autoplay=1">`
     con `title="Video guía: {título del contenido}"`, `allow="autoplay; encrypted-media; picture-in-picture; fullscreen"`,
     `allowFullScreen`, `referrerPolicy="strict-origin-when-cross-origin"`, `loading="lazy"`.
   - Botón propio **"Pantalla completa"** (lucide `Maximize`) que llama a `requestFullscreen()` sobre el
     contenedor (con `webkitRequestFullscreen` en Safari iOS como respaldo; si no existe, se oculta y
     queda el botón del reproductor). `Esc` sale; el foco vuelve al botón.
   - Proporción 16:9 con `aspect-video`; ocupa el ancho de la columna de lectura.
   - Sin conexión (HU-F-312): la fachada muestra "Necesitas conexión para ver el video." y el botón
     queda deshabilitado.
2. **Dónde aparece** (solo si `video` no es `null`):
   - Lección: después de la introducción y antes de los acordes ("Mira cómo se toca").
   - Ejercicio: arriba de los pasos, junto a la `Tablatura` de BPM y compás.
   - Bloque (ruta): en `DetalleBloque`, bajo la descripción.
   - Acordes: en el detalle del acorde, debajo del `ChordDiagram`.
3. **Editor** (docente en sus lecciones y ejercicios; admin también en bloques y acordes):
   - Campo "Video guía (opcional)" con `type="url"`, `maxLength={300}`, ayuda "Pega el enlace de un
     video de YouTube, por ejemplo https://youtu.be/…".
   - Validación en el formulario con la misma regla del backend (función pura
     `src/shared/lib/youtube.ts` con los mismos formatos de `app/core/youtube.py`) y campo opcional
     "Empieza en" (`m:ss`).
   - **Vista previa** con el mismo `VideoGuia` (fachada) y botón "Quitar video".
   - Admin en acordes: acción "Video guía" en la lista de acordes del catálogo, que abre un `Drawer`
     con el mismo campo (no existe otro editor de acordes).
4. Enmienda de 05 §4 (componente `VideoGuia`) y §6 (los videos son contenido de YouTube embebido
   con fachada; no son fotos de *stock*), 04-consumo-api y 08-validación (`video_url`).

**No incluye**
- Subir videos.
- Lista de reproducción o varios videos.
- API de YouTube (duración, miniatura): la fachada no la necesita.

## Diseño
- **Composición de la fachada**: superficie `surface` con borde `linea` y `rounded-caja`, proporción
  16:9. Abajo a la izquierda: etiqueta "Video guía" en `muted` 14 px, título del contenido en `paper`,
  y "YouTube · se carga al reproducir" en mono 13 px. Centrado: botón circular `primary` (único
  botón primario de la sección) con ícono lucide `Play` y texto accesible "Reproducir video: {título}".
  Arriba a la derecha, al reproducir: botón secundario "Pantalla completa".
- **Metáfora**: el video es una pieza más del atril: mismo marco que `TeselaAcorde`, sin sombra.
- **Anti-patrones evitados**: sin degradado sobre la miniatura (no hay miniatura), sin `backdrop-blur`,
  sin animaciones de entrada; el reproductor aparece al pulsar, sin transición.
- **Estados**: carga (al pulsar: la fachada muestra "Cargando video…" hasta el `onLoad` del iframe),
  vacío (sin video: la sección no existe), error (sin conexión o iframe que no carga en 15 s: "No
  pudimos cargar el video. Ábrelo en YouTube." con enlace externo `rel="noopener noreferrer"`),
  éxito (reproductor visible).

## Prompt de ejecución
```text
Ejecuta HU-F-408 en SIPE-SOUND-FULLSTACK. Crea src/shared/ui/VideoGuia.tsx: fachada que no carga
nada de YouTube hasta pulsar "Reproducir video"; luego iframe de youtube-nocookie.com con
allowFullScreen y un botón propio "Pantalla completa" (Fullscreen API sobre el contenedor).
Muéstralo en lección, ejercicio, bloque y acorde cuando video no sea null. En los editores agrega
el campo "Video guía (opcional)" con validación igual a app/core/youtube.py y vista previa; el
admin edita el video de acordes desde un Drawer. Antes de escribir JSX describe la composición y
espera confirmación. Solo tokens; sin degradados, blobs ni blur. Sin dependencias npm nuevas.
Sin pruebas unitarias.
```

## Pasos
1. `src/shared/lib/youtube.ts` (función pura) y `VideoGuia`.
2. Lectura en lección, ejercicio, bloque y acorde.
3. Campo y vista previa en los editores; `Drawer` de acordes para el admin.
4. Enmiendas y documentos.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Sin carga antes de pulsar
  Dado una lección con video
  Cuando abro la lección
  Entonces DevTools → Network no muestra peticiones a youtube.com, youtube-nocookie.com ni ytimg.com

Escenario: Reproducir
  Cuando pulso "Reproducir video"
  Entonces el video empieza en el segundo configurado

Escenario: Pantalla completa
  Cuando pulso "Pantalla completa"
  Entonces el video ocupa toda la pantalla
  Y al pulsar Esc vuelve a la página con el foco en el botón

Escenario: Enlace inválido en el editor
  Cuando pego "https://vimeo.com/123"
  Entonces veo "Pega el enlace de un video de YouTube…" y no puedo guardar

Escenario: Vista previa
  Cuando pego "https://youtu.be/dQw4w9WgXcQ?t=42"
  Entonces veo la fachada con "Empieza en 0:42"

Escenario: Sin video
  Dado un ejercicio sin video
  Entonces la página no muestra ninguna sección de video
```

## Verificación manual
- Lección, ejercicio, bloque y acorde con y sin video; pantalla completa en Chrome escritorio,
  Safari iOS y Chrome Android.
- Lighthouse de la lección: el video no empeora LCP ni el peso inicial (la fachada no carga recursos externos).
- Teclado y lector de pantalla; capturas en 1280 px y 375 px.

## Definición de hecho específica
- [ ] Sin dependencias npm nuevas (`package.json` sin cambios).
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
