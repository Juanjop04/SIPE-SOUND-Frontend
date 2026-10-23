# HU-F-315 · Crear el inicio del estudiante

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-314, HU-F-316, HU-F-320, HU-F-306 · opcional **HU-B-324** (actividad y acordes por bloque) |
| Rama | `hu/HU-F-315-inicio-estudiante` |

## Historia
**Como** estudiante que acaba de iniciar sesión
**quiero** ver en una sola pantalla cuánto he avanzado, qué me falta y qué toca practicar hoy
**para** retomar la guitarra sin tener que buscar por dónde seguir.

## Contexto
Hoy el estudiante aterriza en la ruta (`/` → `RutaPage`, HU-F-304): muestra el mástil y el bloque
seleccionado, pero no responde de un vistazo "¿cuánto llevo?" ni "¿qué hago hoy?". El avance global
vive en `/progreso` (HU-F-306), dos clics más allá.

Datos **reales** disponibles (no se inventa ningún otro):

| Dato | Origen |
|---|---|
| Nombre y nivel | `GET /me` (`nombre`, `nivel`) vía `usePerfil` |
| Bloques con estado, mejor puntaje, lecciones y si cada una está completada | `GET /ruta` (`useRuta`) |
| Lecciones, ejercicios y bloques aprobados (hecho / total), último avance | `GET /progreso/resumen` |
| Actividad reciente mezclada y acordes por bloque | `GET /progreso/actividad`, `GET /ruta` → `acordes` (**HU-B-324**) |

**No existen** y no se muestran: tiempo de práctica, última lección *visitada*, rachas, logros.

## Alcance
**Incluye**
- Rutas: con sesión de estudiante, `/` muestra el **inicio**; la ruta se mueve a `/ruta`
  (`paths.ruta`). Sin sesión, `/` sigue mostrando la ruta pública. `/?bloque=N` redirige a
  `/ruta?bloque=N` (enlaces viejos). Docente y administrador siguen aterrizando en `/docente`.
- Los enlaces internos que hoy apuntan a `paths.inicio` con sentido de "ruta" pasan a `paths.ruta`
  (lección, evaluación, 404).
- `src/features/inicio/`: `InicioPage`, `EncabezadoInicio`, `SiguientePaso`, `AvanceGeneral`,
  `RutaResumida`, `UltimaActividad`, `utils/siguientePaso.ts`.
- `src/shared/music/Boca.tsx`: anillo de progreso con forma de **boca de la guitarra** (ver sistema de
  diseño §4). Un solo uso por pantalla.
- Exportaciones nuevas por `index.ts`: `bloqueInicial` (ruta), `FranjaCifras`, `cifrasDeProgreso`,
  `avanceGlobal` (progreso).

**No incluye**: gráfico de práctica por día (HU-F-317), menú y navegación móvil (HU-F-318), selector
de curso y comentarios del docente (HU-F-311 los añade a esta pantalla).

## Reglas de cálculo (una sola definición en toda la app)
- **Avance global** = `avanceGlobal(cifrasDeProgreso(resumen, totalBloques))` de `features/progreso`:
  (bloques aprobados + lecciones completadas + ejercicios completados) ÷ (total de bloques + lecciones
  + ejercicios) × 100, redondeado. Es la misma cifra de *Mi progreso*; el inicio no la recalcula de
  otra forma.
- **Avance de un bloque** = lecciones completadas del bloque ÷ lecciones del bloque × 100 (de
  `GET /ruta`). Un bloque sin lecciones muestra "sin lecciones", no 0 %.
- **Siguiente paso** (`siguientePaso(bloques)`, función pura):
  1. `bloque = bloqueInicial(bloques)`: la misma regla de HU-F-304 (primer bloque disponible no aprobado).
  2. Primera lección del bloque con `completado = false`, por `numero` → **"Comenzar lección"** (si no
     ha completado ninguna del bloque) o **"Continuar con la lección"**.
  3. Si todas están completadas y el bloque tiene `evaluacion_id` → **"Presentar evaluación"**.
  4. Si todos los bloques están aprobados → estado **ruta completa**.
  5. Sin bloques publicados → estado **sin contenido**.
  El desbloqueo lo sigue decidiendo el backend: el inicio nunca habilita un bloque `bloqueado`.

## Diseño
**Escritorio (≥ 1024 px)**: retícula de 12 columnas, máximo 1200 px, secciones separadas por
`TrasteDivider`, sin tarjetas con sombra.

1. **Encabezado** (7/12 + 5/12)
   - Izquierda: "Hola, Ana." en `font-display` 32 px (solo el primer nombre de `/me`; si no hay nombre:
     "Hola."). Debajo, una frase concreta construida con los datos: "Vas en el bloque 2 · Cambio entre
     Em y Am." o, para un estudiante nuevo, "Tu primera lección te espera: Cómo sostener la guitarra."
   - **Siguiente paso** (`SiguientePaso`), en `surface` con `rounded-caja`: título de la lección en
     `font-display` 24 px, "Bloque 2" en `muted`, `Tablatura` (`nivel principiante │ 10 min │ lección 3 de 4`),
     `ManoEnAcorde` con el primer acorde de la lección (o del bloque, con HU-B-324) y **el único botón
     primario de la pantalla**.
   - Derecha: `GuitarraAcustica` (HU-F-316), decorativa (`aria-hidden`). Sus cuerdas vibran una vez si
     el último avance es de hoy.
2. **Tu avance** (fila completa): `Boca` con el avance global (cifra en mono al centro + texto
   "de la ruta") y, a su derecha, `FranjaCifras` (`bloques 2/6 │ lecciones 9/24 │ ejercicios 5/18`).
   Enlace secundario "Ver mi progreso".
3. **Dos columnas** (7/12 + 5/12)
   - **Tu ruta** (`RutaResumida`): una fila por bloque, como trastes: `MarcaEstado`, número en mono,
     título, miniatura `ChordDiagram` del primer acorde (con HU-B-324), `Cuerda` fina del avance del
     bloque + `3/4 lecciones` en mono, y una acción de texto: "Continuar" (disponible), "Repasar"
     (aprobado) o el requisito en `muted` (bloqueado: "Aprueba el bloque 1 con 80 %"). Enlaza a
     `/ruta?bloque=<id>`.
   - **Lo último que hiciste** (`UltimaActividad`): 5 eventos con fecha relativa en mono ("hace 2 días")
     y su resultado ("completada", "60 % · no aprobada"). Sin HU-B-324: los intentos de evaluación
     (`actividadReciente` de `features/progreso`) y la línea "Último avance: hace 3 días".

**Móvil (< 640 px)**, una columna en este orden: saludo → siguiente paso (botón a todo el ancho) →
tu avance (`Boca` pequeña + cifras en dos líneas) → tu ruta → lo último que hiciste. La guitarra se
oculta; `ManoEnAcorde` se mantiene. **Tableta (640–1023 px)**: encabezado a una columna y las dos
columnas finales apiladas.

**Estados** (cada sección por separado: si falla una, las demás se ven)
- Carga: `Skeleton` con la forma de cada sección (no un *spinner* global).
- Estudiante nuevo (todo en 0): `Boca` en 0 % con "Completa tu primera lección para que empiece a
  sonar."; actividad: "Aquí verás lo que vayas practicando."
- Ruta completa: `Boca` en ámbar, `Fretboard` vibra una vez y "Terminaste la ruta. Repasa tus bloques
  favoritos o pídele a tu docente un curso nuevo."
- Sin contenido: `EstadoVacio` con `EstucheAbierto`: "Aún no hay bloques publicados."
- Error: `MensajeError` con reintentar dentro de la sección afectada.

## Prompt de ejecución
```text
Ejecuta HU-F-315 en SIPE-SOUND-FULLSTACK. Describe la composición en 5–8
viñetas y espera confirmación. siguientePaso() es una función pura en
features/inicio/utils y no contiene reglas de desbloqueo. No dupliques
cálculos de progreso: importa avanceGlobal y cifrasDeProgreso desde
features/progreso. Si GET /progreso/actividad responde 404 (HU-B-324 aún no
desplegada), usa el respaldo descrito sin mostrar error. Ningún dato de
ejemplo: si un dato no llega, la sección muestra su estado vacío.
Boca: SVG con role="progressbar", aria-valuenow y etiqueta "Avance de la ruta".
```

## Criterios de aceptación
```gherkin
Escenario: Aterrizar en el inicio
  Dado que soy estudiante y inicio sesión sin ?volver=
  Entonces llego a / y veo "Hola, <mi nombre>." y la siguiente lección

Escenario: Siguiente paso coherente con la ruta
  Dado que aprobé el bloque 1 y completé 2 de 4 lecciones del bloque 2
  Entonces el siguiente paso es la lección 3 del bloque 2 con "Continuar con la lección"

Escenario: Evaluación pendiente
  Dado que completé todas las lecciones del bloque 2 y no lo he aprobado
  Entonces el siguiente paso es "Presentar evaluación" del bloque 2

Escenario: Una sola cifra de avance
  Entonces el porcentaje de la Boca es igual al de Mi progreso

Escenario: Enlace viejo
  Cuando abro /?bloque=2
  Entonces llego a /ruta?bloque=2 con el bloque 2 seleccionado

Escenario: Sin datos inventados
  Dado un estudiante sin ningún avance
  Entonces no aparece ninguna cifra distinta de 0 ni actividad

Escenario: Visitante
  Dado que no tengo sesión
  Cuando abro /
  Entonces veo la ruta pública como antes
```

## Verificación manual
Tres cuentas: nueva, con un bloque aprobado y con la ruta completa; 1280, 768 y 375 px; teclado
(el foco llega al botón del siguiente paso en ≤ 3 tabulaciones desde el menú); lector de pantalla en la
`Boca` y en `RutaResumida`; `prefers-reduced-motion`.

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR (sin tarjetas KPI, sin *hero* centrado, sin texto de marketing).
- [ ] `useDestinoTrasLogin` lleva al estudiante a `/` y los enlaces "volver a la ruta" a `/ruta`.
- [ ] Tabla del PR con cada cifra de la pantalla y el campo de la API del que sale.
