# HU-F-505 · Docente: cursos como tarjetas y estudiantes en pocos clics

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-309, HU-F-406, HU-F-507 |
| Rama | `hu/HU-F-505-docente-cursos-estudiantes` |

## Historia
**Como** docente
**quiero** ver mis cursos como tarjetas y llegar a mis estudiantes y su progreso en uno o dos clics
**para** no recorrer varias pantallas cada vez que quiero saber cómo va mi grupo.

## Contexto
- Hoy: Cursos (tabla) → un curso → pestaña Estudiantes → un estudiante → su detalle: **4 pasos**.
- `/docente/cursos` es una lista; el progreso está aparte en `/docente/progreso` (HU-F-406).
- `GET /docente/progreso` ya entrega por curso estudiantes, avance promedio, al día y sin actividad.

## Alcance
**Incluye**
1. `/docente/cursos` como **tarjetas** (1/2/3 columnas): nombre, nivel, código en mono con
   "Copiar", estudiantes `28`, **Cuerda** de avance promedio con el porcentaje, "Al día 20 ·
   Sin actividad 3" y las alertas ("2 necesitan apoyo"). Archivados en una sección plegada.
2. **Dos clics a un estudiante**: la tarjeta muestra los 3 estudiantes que más necesitan atención
   (nombre y motivo en texto); "Ver estudiantes" abre **directamente la pestaña Estudiantes** del
   curso (`/docente/cursos/:id?pestana=estudiantes`) y la fila de un estudiante abre su progreso
   en un `Drawer` sin salir de la lista.
3. **Estudiantes del curso** (pestaña existente, mejorada): tabla con nombre, **Cuerda de avance**,
   bloques aprobados `3/6`, último avance en texto y marca "Necesita apoyo"; filtros rápidos
   (Todos · Al día · Sin actividad · Necesitan apoyo) y búsqueda, en la URL.
4. **Acciones en la tarjeta**: "Estudiantes", "Progreso" (→ `/docente/progreso?curso=<id>`),
   "Ruta y evaluaciones" (la pestaña de contenido) y menú "…" (editar, archivar). Una sola
   acción primaria: "Estudiantes".
5. **Crear curso** en un `Dialog` desde el encabezado; el código nuevo queda a la vista y copiado.
6. Sin cursos: "Aún no tienes cursos" con el botón "Crear mi primer curso".

**No incluye**
- Cambiar el detalle del curso (ruta, evaluaciones, ajustes), solo cómo se llega a él.

## Diseño
- **Composición**: encabezado + "Crear curso"; rejilla de tarjetas; en cada una, arriba nombre y
  código, al centro la cuerda de avance, abajo los estudiantes que necesitan atención y los botones.
- **Estados**: carga (`Skeleton` de tarjetas), vacío (arriba), error (`MensajeError`).

## Prompt de ejecución
```text
Ejecuta HU-F-505 en SIPE-SOUND-FULLSTACK. Convierte /docente/cursos en tarjetas con código
copiable, estudiantes, Cuerda de avance promedio, al día/sin actividad y los estudiantes que
necesitan apoyo (de GET /docente/progreso). "Estudiantes" lleva directo a la pestaña Estudiantes,
cuya fila abre el progreso en un Drawer sin salir de la lista. Filtros rápidos y búsqueda en la
URL. Crear curso en Dialog. Antes de escribir JSX describe la composición y espera confirmación.
Solo tokens. Sin pruebas unitarias.
```

## Pasos
1. Tarjeta de curso y rejilla con datos de `/docente/progreso`.
2. Enlace directo a la pestaña Estudiantes y `Drawer` de progreso.
3. Filtros rápidos de estudiantes y marca "Necesita apoyo".
4. Crear curso en `Dialog`; documentos.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Cursos como tarjetas
  Cuando abro Cursos
  Entonces veo una tarjeta por curso con su código, estudiantes y avance promedio

Escenario: Dos clics
  Cuando pulso "Estudiantes" en la tarjeta de "Guitarra 7A" y luego la fila de Ana
  Entonces veo el progreso de Ana sin haber pasado por más pantallas

Escenario: A quién escribirle
  Dado un estudiante sin avances en 15 días
  Entonces aparece en la tarjeta con "Sin avances desde hace 15 días"

Escenario: Copiar el código
  Cuando pulso "Copiar" en el código del curso
  Entonces el código queda en el portapapeles y veo "Código copiado"
```

## Verificación manual
- Docente con 0, 1 y 6 cursos (uno archivado); teclado y 375 px; claro y oscuro.

## Definición de hecho específica
- [ ] De la lista de cursos al progreso de un estudiante: máximo 2 clics, medido.
- [ ] Ningún correo de estudiante en la lista (enmascarado, como hoy).
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
