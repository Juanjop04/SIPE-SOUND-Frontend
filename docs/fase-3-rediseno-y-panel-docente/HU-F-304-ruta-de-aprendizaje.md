# HU-F-304 · Rediseñar la ruta de aprendizaje como un mástil

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-303, **HU-B-308** (`GET /ruta`) |
| Rama | `hu/HU-F-304-ruta-mastil` |

## Historia
**Como** estudiante principiante
**quiero** ver de un vistazo dónde estoy en mi camino con la guitarra y qué sigue
**para** practicar con un objetivo claro cada día.

## Contexto
Hoy `RutaPage` (antes `Home.jsx`) es una lista vertical de tarjetas con candado y una lista de enlaces con viñetas "•".

## Diseño
**Escritorio (≥ 1024 px)** — dos columnas, 4/12 y 8/12:
- **Columna izquierda · mástil**: línea vertical (`linea`) que representa la cuerda; cada bloque es un traste horizontal con su `MarcaEstado` (`×` bloqueado, `○` disponible, `●` ámbar aprobado), número en mono y título. Los bloques que cierran un nivel (último de principiante, intermedio…) llevan un marcador de mástil (punto). La cuerda se pinta de ámbar desde arriba hasta el último bloque aprobado: el avance se *ve* como cuerda que suena.
- **Columna derecha · bloque seleccionado** (por defecto, el primer disponible no aprobado):
  - Encabezado: "Bloque 2 · Cambio entre Em y Am" en `font-display` 32 px; debajo una `Tablatura`: `nivel principiante │ 4 lecciones │ mejor puntaje 60 %`.
  - Lecciones como lista numerada en mono (`01`, `02`…) con `Cuerda` fina de progreso por lección.
  - Acción única: "Presentar evaluación" (primario) o, si está aprobado, "Repetir evaluación" (secundario) + mejor puntaje.
- Bloque bloqueado seleccionado: muestra qué falta ("Aprueba la evaluación del bloque 1 con 80 % o más.").

**Móvil** — el mástil se vuelve una tira horizontal desplazable (trastes de izquierda a derecha) fija bajo la barra superior; el detalle ocupa el resto.

**Sin sesión** — la ruta se ve completa con todos los bloques `○` y una línea discreta: "Inicia sesión para guardar tu avance y presentar evaluaciones."

**Estados**: `Skeleton` del mástil (6 trastes) · `EstadoVacio` ("Aún no hay bloques publicados") · `MensajeError` con reintentar.

## Alcance
**Incluye**: `features/ruta/components/{Mastil,TrasteBloque,DetalleBloque}.tsx`, `useRuta()`, selección de bloque sincronizada en `?bloque=<id>`.
**No incluye**: lecciones/ejercicios (HU-F-305).

## Prompt de ejecución
```text
Ejecuta HU-F-304 en SIPE-SOUND-FULLSTACK. Antes de codificar, describe en
viñetas cómo implementarás el mástil (SVG o CSS) y cómo se verá en móvil;
espera confirmación. useRuta() consume GET /api/v1/ruta: el estado de cada
bloque lo calcula el servidor; elimina calcularEstadoBloques(). Cumple el sistema de diseño (anti-patrones prohibidos: nada de
tarjetas con borde izquierdo, nada de candados grandes, nada de degradados).
La selección del bloque se navega con flechas arriba/abajo (patrón listbox).
```

## Criterios de aceptación
```gherkin
Escenario: Estado visual coherente con la notación
  Dado que aprobé el bloque 1
  Entonces el bloque 1 muestra ● ámbar, el 2 muestra ○ y el 3 muestra ×
  Y la cuerda está pintada de ámbar hasta el bloque 1

Escenario: Enlace profundo
  Cuando abro /?bloque=2
  Entonces el bloque 2 aparece seleccionado

Escenario: Navegación con teclado
  Dado el foco en el mástil
  Cuando presiono flecha abajo
  Entonces se selecciona el siguiente bloque y el detalle se actualiza

Escenario: Lector de pantalla
  Entonces cada traste anuncia "Bloque 3, Acordes mayores, bloqueado"
```

## Verificación manual
Recorrer con usuario nuevo, con usuario que aprobó 1 bloque y sin sesión; 1280 px y 375 px; teclado; `prefers-reduced-motion`.

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR.
- [ ] Ninguna lógica de desbloqueo en el frontend (la decide el backend).
