# HU-F-307 · Panel docente: resumen y gestión de cursos

| Campo | Valor |
|---|---|
| Fase | 3 · Panel docente |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-303, **HU-B-310** |
| Rama | `hu/HU-F-307-docente-cursos` |

## Historia
**Como** docente de un colegio
**quiero** crear mis cursos, compartir el código de ingreso y ver de un vistazo qué pasa con mis grupos
**para** organizar mi clase de música sin hojas de cálculo.

## Diseño

### Resumen (`/docente`)
- Saludo funcional, no de marketing: "Martes 21 de octubre · 3 cursos activos".
- Franja de cifras en mono separadas por trastes: `estudiantes 74 │ intentos esta semana 112 │ evaluaciones publicadas 5`.
- **"Necesitan un empujón"**: lista de estudiantes sin actividad en 14 días (nombre, curso, último avance en mono, acción "Enviar comentario").
- **Actividad reciente**: últimos intentos (estudiante · evaluación · puntaje).
- Sin gráficos de dona ni tarjetas KPI con íconos.

### Cursos (`/docente/cursos`)
- Tabla: Nombre · Nivel · Estudiantes · Avance medio (`Cuerda` fina + % en mono) · Código (mono, con botón copiar) · Acciones.
- "Nuevo curso" abre `Drawer` con: nombre, descripción, nivel.
- Filtro "Activos / Archivados" en la URL.

### Detalle de curso (`/docente/cursos/:id`)
- Encabezado con nombre, código grande en mono con "Copiar" y "Regenerar" (confirmación con `Dialog`: "Los estudiantes que aún no se unen necesitarán el código nuevo").
- `Tabs`: **Estudiantes** (HU-F-309) · **Ruta** · **Evaluaciones** (HU-F-310) · **Ajustes**.
- **Ruta**: dos listas — bloques disponibles y bloques del curso — con reordenamiento por botones "Subir/Bajar" (accesible por teclado; *drag and drop* opcional encima, no en lugar). Guardar → `PUT /docente/cursos/{id}/bloques`.
- **Ajustes**: editar datos y "Archivar curso" (zona de peligro al final, con confirmación escribiendo el nombre del curso).

## Alcance
**Incluye**: `features/docente/resumen` y `features/docente/cursos` (api, hooks, componentes, páginas), formularios con React Hook Form + Zod (instalados en HU-F-313), copiar al portapapeles con `navigator.clipboard.writeText` y aviso.
**No incluye**: pestañas Estudiantes y Evaluaciones (otras HU).

## Prompt de ejecución
```text
Ejecuta HU-F-307 en SIPE-SOUND-FULLSTACK. Describe primero la composición de
las tres vistas y espera confirmación. Esquemas Zod en
features/docente/cursos/schemas.ts con los constructores de shared/validacion
(contrato 08): nombre 3–120, descripción ≤ 2000 con contador, nivel con Select.
Errores 400 del backend se mapean a los campos con ApiError.porCampo.
Mutaciones invalidan las claves de cursos y resumen. Cumple el sistema de
diseño "Atril": tablas densas, sin tarjetas KPI, sin gráficos decorativos.
```

## Criterios de aceptación
```gherkin
Escenario: Crear y compartir
  Cuando creo el curso "Guitarra 7°A"
  Entonces aparece en la tabla con su código
  Y al pulsar Copiar el código queda en el portapapeles y veo "Código copiado"

Escenario: Límites del curso
  Cuando escribo un nombre de 2 caracteres o pego una descripción de 2500
  Entonces veo "Debe tener al menos 3 caracteres." y el campo no admite más de 2000
  Y no se envía ninguna petición

Escenario: Archivar con confirmación
  Cuando archivo un curso
  Entonces debo escribir su nombre para confirmar
  Y el curso pasa al filtro Archivados

Escenario: Ruta del curso por teclado
  Dado el foco en un bloque de la ruta del curso
  Cuando activo "Subir"
  Entonces el bloque cambia de posición y el cambio se anuncia por aria-live
```

## Verificación manual
Crear 2 cursos, unir un estudiante con el código (HU-F-311 o curl), revisar cifras del resumen; 1280/375 px; teclado.

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR.
