# HU-F-308 · Panel docente: gestionar lecciones y ejercicios

| Campo | Valor |
|---|---|
| Fase | 3 · Panel docente |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-307, **HU-B-309** |
| Rama | `hu/HU-F-308-docente-contenido` |

## Historia
**Como** docente
**quiero** crear lecciones y ejercicios, dejarlos en borrador y publicarlos cuando estén listos
**para** adaptar el contenido a mi grupo sin depender de un administrador.

## Diseño

### Contenido (`/docente/contenido`)
- `Tabs`: **Lecciones** · **Ejercicios**.
- Tabla: N.º (mono) · Título · Bloque · Estado (texto + punto de color: borrador `muted`, publicado `success`, archivado `linea`) · Actualizado (mono) · Acciones.
- Filtros en la URL: estado, bloque, búsqueda.

### Editor (`/docente/contenido/lecciones/:id` y `/nueva`)
- Página de dos columnas: **formulario** a la izquierda (7/12) y **vista previa en vivo** a la derecha (5/12) usando los mismos componentes que ve el estudiante (HU-F-305). En móvil, `Tabs` "Editar / Vista previa".
- Campos lección: bloque, número, título, descripción, nivel, duración (min), acordes (selector múltiple que muestra el `ChordDiagram` en miniatura), temas (lista editable).
- Campos ejercicio: lección (opcional), nombre, descripción, nivel, BPM recomendado, compás (`2/4 3/4 4/4 6/8`), acordes, pasos (lista ordenable con Subir/Bajar).
- Barra de acciones fija abajo: estado actual + "Guardar borrador" (secundario) + "Publicar" (primario).
- Eliminar: si el backend responde 409, `Dialog`: "Esta lección tiene avance de estudiantes. Puedes archivarla para ocultarla sin perder ese historial." con acción "Archivar".
- Cambios sin guardar → confirmación al salir.

## Alcance
**Incluye**: `features/docente/contenido` completo, esquemas Zod alineados con HU-B-309.
**No incluye**: subir imágenes/audio, editor de texto enriquecido.

## Validación de campos
Constructores de `shared/validacion` ([contrato 08](../fase-1-contrato/08-validacion-de-formularios.md)); los mismos límites aplican la API y la base (contrato del backend §7).

| Campo | Regla | Control |
|---|---|---|
| Título (lección) / nombre (ejercicio) | 3–120, `trim` | `maxLength=120` |
| Número de lección | entero ≥ 1 | `type="number"` `min=1` `step=1` |
| Descripción | ≤ 2000, opcional | `textarea` `maxLength=2000` + contador |
| Contenido de la lección | ≤ 20000 | `textarea` `maxLength=20000` + contador |
| Duración (min) | entero 1–600, opcional | `type="number"` `min=1` `max=600` |
| BPM recomendado | entero 20–300 | `type="number"` `min=20` `max=300` |
| Compás | `2/4 3/4 4/4 6/8 12/8` | `Select`, sin texto libre |
| Nivel / bloque / lección | valor de la lista | `Select` |
| Acordes | ≤ 24 elegidos del catálogo | selector múltiple; deshabilitado al llegar a 24 |
| Temas | ≤ 20 elementos de 1–60 caracteres | lista editable con `maxLength=60` |
| Pasos | ≤ 30 elementos de 1–300 caracteres | lista editable con `maxLength=300` |

## Prompt de ejecución
```text
Ejecuta HU-F-308 en SIPE-SOUND-FULLSTACK. Reutiliza los componentes de
presentación de lecciones/ejercicios del estudiante para la vista previa
(impórtalos desde el index.ts de esas features). Lecciones y ejercicios
comparten la mayor parte del código (tabla, barra de acciones, manejo de
409): extrae lo común para no superar 3 % de duplicación. La lista
editable de pasos/temas es un componente reutilizable en shared/ui.
```

## Criterios de aceptación
```gherkin
Escenario: Borrador invisible para estudiantes
  Cuando guardo una lección como borrador
  Entonces aparece en mi tabla con estado borrador
  Y no aparece en la ruta del estudiante

Escenario: Vista previa fiel
  Mientras escribo el título y agrego el acorde G
  Entonces la vista previa muestra el título y el diagrama de G como lo verá el estudiante

Escenario: Eliminar con avance
  Dado una lección con progreso de estudiantes
  Cuando intento eliminarla
  Entonces el diálogo me ofrece archivarla
```

## Verificación manual
Crear, publicar, editar, archivar y eliminar una lección y un ejercicio; verificar con una cuenta de estudiante; 1280/375 px; teclado.

## Definición de hecho específica
- [ ] Duplicación ≤ 3 % según SonarLint.
- [ ] Revisión de anti-patrones declarada en el PR.
