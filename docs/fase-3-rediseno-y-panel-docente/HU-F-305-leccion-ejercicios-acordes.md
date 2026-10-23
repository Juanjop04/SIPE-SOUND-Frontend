# HU-F-305 · Rediseñar lección, ejercicios y acordes

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-304, **HU-B-305** (`PUT /progreso/...`), **HU-B-306** (`duracion_min`) |
| Rama | `hu/HU-F-305-practica` |

## Historia
**Como** estudiante
**quiero** leer una lección sin distracciones, ver los acordes que necesito y practicar el ejercicio a su tempo
**para** aprender a tocar, no solo a leer.

## Diseño

### Lección (`/leccion/:id`)
- Migas: "Bloque 2 › Lección 03" en mono.
- Título `font-display` 40 px; debajo `Tablatura`: `principiante │ 25 min │ Em · Am`.
- Cuerpo en una columna de lectura (≤ 68 caracteres). Temas como lista sin viñetas, separados por `TrasteDivider`.
- **Acordes de la lección**: fila de `ChordDiagram` con el nombre en mono debajo; en móvil, desplazamiento horizontal con *scroll snap*.
- **Ejercicios asociados**: filas con nombre + `Tablatura` (`♩ 60 BPM │ 4/4`) + enlace "Practicar".
- Cierre: botón "Marcar como practicada" → `PUT /progreso/lecciones/{id}` con `completado: true`; al confirmar, una `Cuerda` de 6 px recorre el ancho y vibra (respeta `prefers-reduced-motion`). Navegación "Lección anterior / siguiente".

### Ejercicios (`/ejercicios` y `/ejercicios/:id`)
- Listado como tabla: Nombre · Nivel · BPM · Compás · Estado (`MarcaEstado`). Filtros por nivel (en la URL).
- Detalle: pasos numerados (01, 02…) en columna; a la derecha (o abajo en móvil) un **metrónomo** simple:
  - BPM editable (20–300, mismo rango que `mejor_bpm` en la API y la base) con botones −/+ y campo numérico; pulso visual (un traste que se ilumina en `accent`) y sonoro (Web Audio API, `OscillatorNode` de 30 ms; acento en el tiempo 1 del compás).
  - Inicia en el BPM recomendado. Barra espaciadora = iniciar/pausar.
  - "Lo logré a ___ BPM" → `PUT /progreso/ejercicios/{id}` con `mejor_bpm`.

### Acordes (`/acordes`)
- Retícula de diagramas agrupados por tipo (mayores, menores, séptima) con encabezado mono; filtro por dificultad. Al seleccionar un acorde, panel con su descripción y las lecciones donde aparece.

**Estados** en las tres vistas: `Skeleton`, `EstadoVacio`, `MensajeError`.

## Alcance
**Incluye**: las tres vistas, `features/ejercicios/components/Metronomo.tsx` (sin librerías externas; la lógica de tiempo en un hook `useMetronomo` con `AudioContext.currentTime` para precisión), mutaciones con invalidación de `progresoKeys` y `rutaKeys`.
**No incluye**: grabación ni reconocimiento de audio (visión 2031, fuera de alcance).

## Validación de campos
Constructores de `shared/validacion` ([contrato 08](../fase-1-contrato/08-validacion-de-formularios.md)); los mismos límites aplican la API y la base (contrato del backend §7).

| Campo | Regla | Control |
|---|---|---|
| BPM del metrónomo | entero 20–300; fuera de rango se ajusta al límite al salir del campo | `type="number"` `min=20` `max=300` `step=1` `inputMode="numeric"` + −/+ |
| "Lo logré a ___ BPM" (`mejor_bpm`) | entero 20–300 → "Debe estar entre 20 y 300."; no se envía si es inválido | igual que el anterior |

## Prompt de ejecución
```text
Ejecuta HU-F-305 en SIPE-SOUND-FULLSTACK. Describe primero la composición de
cada vista y espera confirmación. El metrónomo programa los clics con
AudioContext.currentTime (planificación anticipada), no con setInterval
como reloj. Crea el AudioContext solo tras una interacción del usuario.
Libera recursos al desmontar. Sin dependencias nuevas.
```

## Criterios de aceptación
```gherkin
Escenario: Marcar lección
  Cuando marco una lección como practicada
  Entonces el backend registra completado y la ruta refleja el avance sin recargar

Escenario: Metrónomo estable
  Dado el metrónomo a 60 BPM en 4/4
  Cuando lo dejo correr un minuto
  Entonces suenan 60 pulsos con acento cada 4

Escenario: Metrónomo accesible
  Dado el foco en la página del ejercicio
  Cuando presiono la barra espaciadora
  Entonces el metrónomo inicia y un texto aria-live anuncia "Metrónomo en marcha, 60 BPM"
```

## Verificación manual
Probar el metrónomo con un metrónomo de referencia (app móvil) durante 1 minuto; 1280/375 px; teclado.

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR.
