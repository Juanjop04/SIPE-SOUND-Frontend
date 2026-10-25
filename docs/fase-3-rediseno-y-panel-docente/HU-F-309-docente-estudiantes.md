# HU-F-309 · Panel docente: estudiantes del curso y su progreso

| Campo | Valor |
|---|---|
| Fase | 3 · Panel docente |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-307, HU-F-314, HU-F-320, **HU-B-310** |
| Rama | `hu/HU-F-309-docente-estudiantes` |

## Historia
**Como** docente
**quiero** ver la lista de estudiantes de cada curso con su avance y entrar al detalle de cada uno
**para** detectar a tiempo quién se está quedando atrás y apoyarlo.

## Diseño

### Pestaña Estudiantes (`/docente/cursos/:id?tab=estudiantes`)
- Buscador + orden (Avance, Nombre, Último avance) en la URL.
- Tabla: Nombre · Correo (enmascarado, mono) · Avance (`Cuerda` + % mono) · Bloques aprobados (`2/6` mono) · Último avance (fecha relativa: "hace 3 días") · Acciones (Ver, Comentar, Retirar).
- Filas con más de 14 días sin actividad: fecha en `danger` + texto "sin actividad" (no solo color).
- Exportar CSV de la vista actual (generado en el navegador con `Blob`; sin librería).
- **Menos de 768 px** (rediseño, HU-F-314): la tabla pasa a filas apiladas (nombre; `Cuerda` + % en mono;
  último avance; acciones en un menú) sin desplazamiento horizontal. El orden y el buscador se mantienen arriba.
- Sin estudiantes: `EstadoVacio` con la ilustración `Atril` (HU-F-316): "Aún no tienes estudiantes. Comparte el código **K7M2Q9XA** con tu grupo."

### Detalle del estudiante (`Drawer` ancho o `/docente/cursos/:id/estudiantes/:eid`)
- Encabezado: nombre, curso, fecha de inscripción.
- **Mástil personal**: la misma visualización de la ruta del estudiante (componente de HU-F-304 en modo solo lectura) — el docente ve exactamente lo que ve el alumno.
- Por bloque: lecciones con `MarcaEstado`, ejercicios con mejor BPM, intentos de evaluación (fecha, puntaje).
- **Comentarios**: historial y formulario (1–1000 caracteres, contador visible).
- "Retirar del curso" → `Dialog`: "Se quitará del curso. Su progreso personal se conserva."

## Alcance
**Incluye**: `features/docente/estudiantes`, reutilización del mástil en modo lectura (exportado desde `features/ruta/index.ts`).
**No incluye**: mensajería en tiempo real.

## Validación de campos
Constructores de `shared/validacion` ([contrato 08](../fase-1-contrato/08-validacion-de-formularios.md)); los mismos límites aplican la API y la base (contrato del backend §7).

| Campo | Regla | Control |
|---|---|---|
| Comentario al estudiante | 1–1000, `trim` (solo espacios no cuenta) | `textarea` `maxLength=1000` + contador |
| Buscador | ≤ 80, `trim` | `type="search"` `maxLength=80` |

## Prompt de ejecución
```text
Ejecuta HU-F-309 en SIPE-SOUND-FULLSTACK. Describe la composición y espera
confirmación. La tabla pagina desde el backend (no cargues todo). El CSV
escapa comillas y usa ; como separador (Excel en es-CO) con BOM UTF-8.
Fechas relativas con Intl.RelativeTimeFormat("es-CO"). Nunca muestres el
correo completo aunque llegue en otra respuesta.
```

## Criterios de aceptación
```gherkin
Escenario: Detectar rezagados
  Dado un estudiante sin actividad en 20 días
  Entonces su fila muestra "sin actividad" junto a la fecha

Escenario: Lo mismo que ve el estudiante
  Cuando abro el detalle de un estudiante
  Entonces el mástil muestra los mismos estados que él ve en su ruta

Escenario: Comentario
  Cuando envío un comentario de 20 caracteres
  Entonces aparece en el historial y el estudiante lo ve en su curso (HU-F-311)

Escenario: Exportar
  Cuando exporto la tabla filtrada
  Entonces el CSV abre correctamente en Excel con tildes
```

## Accesibilidad (WCAG 2.2 AA)
- "Sin actividad" se comunica con texto además del color `danger` (1.4.1).
- El avance usa la misma definición que ve el estudiante en su inicio (HU-F-315): el % lo calcula el backend (`avance_pct`).
- Acciones de fila con objetivo ≥ 24 px (2.5.8); el foco de la fila no queda tapado por la cabecera fija (2.4.11).

## Verificación manual
Curso con ≥ 25 estudiantes de prueba (semilla del backend): paginar, ordenar, buscar, exportar, comentar, retirar; 1280/375 px; teclado.

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR.
