# HU-F-511 · Autoría del contenido y permisos del docente sobre lo del admin

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 3 puntos |
| Depende de | HU-B-412 |
| Rama | `hu/HU-F-511-autoria-del-contenido` |

## Historia
**Como** docente con un curso asignado
**quiero** ver quién creó y quién modificó cada lección, ejercicio y evaluación, y poder editar y publicar lo del administrador
**para** adaptar el material de mi curso sabiendo qué es mío y qué es de otra persona.

## Alcance
**Incluye**
1. Columna **Autoría** en la tabla de contenido y en la de evaluaciones: nombre del autor y, si
   alguien más lo tocó, "Modificó: …".
2. En los editores (lección, ejercicio y evaluación): "Creado por X · Modificado por Y el 25 oct 2026"
   bajo el título.
3. **Borrar solo lo propio**: en lo creado por otra persona desaparece la zona de eliminar y se
   explica que se puede editar, publicar y archivar (o cerrar) pero solo su autor lo borra. El
   administrador siempre ve el borrado.
4. Las evaluaciones globales de los bloques de sus cursos aparecen en su lista, con "Bloque N · ruta general".

**No incluye**
- Cambios de permisos en el backend (HU-B-412).

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Autoría visible
  Dado una lección creada por el admin y modificada por mí
  Cuando abro su editor
  Entonces leo "Creado por Admin · Modificado por mi nombre el …"

Escenario: Sin borrar lo ajeno
  Cuando abro una lección del admin
  Entonces puedo guardar, publicar y archivar, y no veo "Eliminar"

Escenario: Lo propio
  Cuando abro una lección que creé
  Entonces veo la zona de eliminar como antes
```

## Definición de hecho específica
- [ ] Probado con HU-B-412 aplicada (`uv run alembic upgrade head`).
