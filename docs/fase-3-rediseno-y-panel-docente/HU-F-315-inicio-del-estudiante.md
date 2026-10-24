# HU-F-315 · Crear el inicio del estudiante

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-314, HU-F-316, HU-F-320, HU-F-321, HU-F-306 · opcional **HU-B-324** (actividad, días con avance y acordes por bloque) |
| Rama | `hu/HU-F-315-inicio-estudiante` |

## Historia
**Como** estudiante que acaba de iniciar sesión
**quiero** ver en una sola pantalla cuánto he avanzado, qué me falta y qué toca practicar hoy
**para** retomar la guitarra sin tener que buscar por dónde seguir.

## Contexto
Hoy el estudiante aterriza en la ruta (`/` → `RutaPage`, HU-F-304): no responde de un vistazo
"¿cuánto llevo?" ni "¿qué hago hoy?". El avance global vive en `/progreso` (HU-F-306).

El equipo aprobó una **maqueta de inicio** (2026-10-23). Esta HU la implementa **con datos reales**:

| Elemento de la maqueta | Dato real | Decisión |
|---|---|---|
| Saludo y nivel | `GET /me` (`nombre`, `nivel`) | Igual |
| Anillo "Progreso general" | `GET /progreso/resumen` + `GET /ruta` | `Boca` con `avanceGlobal` |
| Clases completadas 17/25 | `lecciones.completadas / total` | `TarjetaCifra` "Lecciones" |
| Módulos completados 3/5 | `bloques_aprobados / bloques` | `TarjetaCifra` "Bloques aprobados" |
| Tiempo de práctica 12 h 30 min | **No existe** | Se cambia por "Días con avance" (`dias_con_practica`, HU-B-324); sin HU-B-324, "Ejercicios" (`ejercicios.completados / total`) |
| Tu próximo objetivo / Continuar aprendiendo | Siguiente paso de `GET /ruta` | Una sola tarjeta "Continuar aprendiendo" con el único botón primario |
| Tu progreso por módulos | Bloques de `GET /ruta` | Barras por bloque |
| Tu evolución | `por_dia` (HU-B-324) | HU-F-317 |
| Módulos del curso con foto | Bloques con estado; **no hay foto por bloque** | Miniatura = diagrama del primer acorde del bloque (HU-B-324) y píldora de estado |
| Actividad reciente | `recientes` (HU-B-324) | Igual, sin "Obtuviste un logro" (no existen logros) |
| Cita "La práctica constante…" | Texto de relleno | Se omite |
| Logros · Perfil · Notificaciones | **No existen** | Se omiten |

## Alcance
**Incluye**
- Rutas: con sesión de estudiante, `/` muestra el **inicio**; la ruta se mueve a `/ruta`
  (`paths.ruta`). Sin sesión, `/` sigue mostrando la ruta pública. `/?bloque=N` redirige a
  `/ruta?bloque=N`. Docente y administrador siguen aterrizando en `/docente`.
- Los enlaces internos que hoy apuntan a `paths.inicio` con sentido de "ruta" pasan a `paths.ruta`.
- `src/features/inicio/`: `InicioPage`, `EncabezadoInicio`, `CifrasInicio`, `ContinuarAprendiendo`,
  `ProgresoPorBloque`, `BloquesRuta`, `UltimaActividad`, `utils/siguientePaso.ts`.
- `src/shared/music/Boca.tsx` y `src/shared/ui/TarjetaCifra.tsx` (sistema de diseño §4).
- Exportaciones por `index.ts`: `bloqueInicial` (ruta), `cifrasDeProgreso`, `avanceGlobal` (progreso).

**No incluye**: gráfico de evolución (HU-F-317), barra lateral (HU-F-318), selector de curso y
comentarios del docente (HU-F-311).

## Reglas de cálculo (una sola definición en toda la app)
- **Avance global** = `avanceGlobal(cifrasDeProgreso(resumen, totalBloques))` de `features/progreso`:
  (bloques aprobados + lecciones completadas + ejercicios completados) ÷ (total de bloques + lecciones
  + ejercicios) × 100, redondeado. Es la misma cifra de *Mi progreso*.
- **Avance de un bloque** = lecciones completadas del bloque ÷ lecciones del bloque × 100. Sin
  lecciones: "sin lecciones", no 0 %.
- **Estado de un bloque** (píldora): `aprobado` → "Completado" (verde) · `disponible` con alguna
  lección completada → "En curso" (violeta) · `disponible` sin avance → "Disponible" · `bloqueado` →
  "Bloqueado". Siempre con texto, no solo color.
- **Siguiente paso** (`siguientePaso(bloques)`, función pura):
  1. `bloque = bloqueInicial(bloques)` (regla de HU-F-304).
  2. Primera lección del bloque con `completado = false` → "Comenzar lección" o "Continuar".
  3. Todas completadas y `evaluacion_id` → "Presentar evaluación".
  4. Todos los bloques aprobados → ruta completa. 5. Sin bloques → sin contenido.
  El desbloqueo lo decide el backend.

## Diseño
**Escritorio (≥ 1024 px)**, retícula de 12 columnas dentro del área de contenido (la barra lateral
es de HU-F-318; mientras no exista, se usa el encabezado actual):

1. **Encabezado** (12 col, `surface` con borde, `rounded-caja`):
   - Izquierda (7 col): "Hola, Ana." en `font-display` 32 px; frase concreta ("Vas en el bloque 2 ·
     Cambio entre Em y Am."); píldora de nivel ("Nivel principiante", de `/me`).
   - Centro: foto `guitarra-acustica` (HU-F-321) recortada a la derecha del texto, **sin texto encima**.
   - Derecha (3 col): `Boca` con el avance global y "Progreso general de la ruta".
2. **Cifras** (fila de 3 `TarjetaCifra`): Lecciones `9 / 24` · Bloques aprobados `2 / 6` · Días con
   avance `9 / 28` (o Ejercicios `5 / 18` sin HU-B-324), cada una con su `Cuerda`.
3. **Dos columnas** (7 + 5):
   - **Continuar aprendiendo**: foto por tipo (`manos-acorde` si es lección, `practica-ritmo` si es
     ejercicio), "Bloque 2 · Lección 3", título, descripción corta, `Tablatura` (duración, estado) y
     el **único botón primario**: "Continuar" / "Comenzar lección" / "Presentar evaluación".
   - **Tu progreso por bloques**: una fila por bloque con `MarcaEstado`, nombre, barra `Cuerda` y % en
     mono.
4. **Dos columnas** (7 + 5):
   - **Tu evolución** (HU-F-317) o, hasta entonces, nada.
   - **Actividad reciente**: 5 eventos con ícono lucide por tipo (lección, ejercicio, evaluación),
     título y fecha relativa; "Ver todo" → `/progreso`.
5. **Bloques de la ruta** (fila desplazable de teselas): miniatura `ChordDiagram` del primer acorde
   (HU-B-324; sin él, el número del bloque en grande), nombre, `3 de 4 lecciones` y píldora de
   estado. Enlaza a `/ruta?bloque=<id>`. "Ver todos" → `/ruta`.

**Móvil (< 640 px)**, una columna: saludo + `Boca` pequeña → Continuar aprendiendo → cifras (2 por
fila) → progreso por bloques → actividad → bloques. La foto del encabezado se oculta.
**Tableta**: cifras en 3, columnas apiladas.

**Estados** (cada sección por separado)
- Carga: `Skeleton` con la forma de cada sección.
- Estudiante nuevo: `Boca` en 0 % y "Completa tu primera lección para empezar a sumar."; actividad:
  "Aquí verás lo que vayas practicando."
- Ruta completa: `Boca` en verde, `Fretboard` vibra una vez: "Terminaste la ruta. Repasa tus bloques
  o pídele a tu docente un curso nuevo."
- Sin contenido: `EstadoVacio` con `EstucheAbierto`.
- Error: `MensajeError` con reintentar dentro de la sección.

## Prompt de ejecución
```text
Ejecuta HU-F-315 en SIPE-SOUND-FULLSTACK. Describe la composición en 5–8
viñetas (toma la maqueta aprobada como referencia) y espera confirmación.
siguientePaso() es una función pura en features/inicio/utils. No dupliques
cálculos: importa avanceGlobal y cifrasDeProgreso. Si GET /progreso/actividad
responde 404 (HU-B-324 sin desplegar), usa los respaldos descritos sin
mostrar error. Ningún dato de ejemplo ni enlaces a funciones inexistentes.
```

## Criterios de aceptación
```gherkin
Escenario: Aterrizar en el inicio
  Dado que soy estudiante y inicio sesión sin ?volver=
  Entonces llego a / y veo "Hola, <mi nombre>.", mi nivel y el botón para continuar

Escenario: Siguiente paso coherente con la ruta
  Dado que aprobé el bloque 1 y completé 2 de 4 lecciones del bloque 2
  Entonces "Continuar aprendiendo" muestra la lección 3 del bloque 2

Escenario: Una sola cifra de avance
  Entonces el porcentaje de la Boca es igual al de Mi progreso

Escenario: Sin datos inventados
  Entonces no aparece "tiempo de práctica", logros, perfil ni notificaciones
  Y un estudiante sin avance ve todas las cifras en 0

Escenario: Estado de los bloques con texto
  Entonces cada bloque muestra "Completado", "En curso", "Disponible" o "Bloqueado"

Escenario: Visitante
  Dado que no tengo sesión
  Cuando abro /
  Entonces veo la ruta pública como antes
```

## Verificación manual
Tres cuentas (nueva, con un bloque aprobado, con la ruta completa); 1280, 768 y 375 px; teclado;
lector de pantalla en `Boca`, cifras y píldoras; `prefers-reduced-motion`; comparación con la maqueta
en el PR.

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR.
- [ ] Tabla del PR con cada cifra de la pantalla y el campo de la API del que sale.
