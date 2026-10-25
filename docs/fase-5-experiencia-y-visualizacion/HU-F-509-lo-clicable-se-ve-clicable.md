# HU-F-509 · Lo clicable se ve clicable

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Should |
| Estimación | 3 puntos |
| Depende de | HU-F-507 |
| Rama | `hu/HU-F-509-lo-clicable-se-ve-clicable` |

## Historia
**Como** persona que usa la plataforma
**quiero** reconocer a simple vista qué texto se puede pulsar
**para** no tener que adivinar dónde navegar.

## Contexto
- Varios controles se veían como texto plano: "Ver como tabla", "Anterior / Siguiente", las migas
  ("Cursos ›"), "Volver…" y los títulos enlazados de las listas.

## Alcance
**Incluye**
1. `Button` fantasma con borde `linea` y texto `paper` (antes: texto `muted` sin forma). Alcanza a
   "Ver como tabla", "Anterior / Siguiente", "Quitar filtros", "Escribirle" y similares.
2. Enlaces de texto (`Migas`, "Ver el curso", "Iniciar sesión"…): `accent` **siempre subrayado**.
3. Volver y navegar: "← Volver a mensajes", "← Volver a la evaluación", el enlace de las páginas
   de error, "Lección anterior" y "Lección siguiente" pasan a botón (`claseBoton`).
4. Migas manuales del atril: "← Cursos", "← Contenido" en `accent` subrayado.
5. Nombres y títulos pulsables (listas, matriz, tabla de usuarios): subrayado fino que se acentúa
   al pasar el cursor.

**No incluye**
- Rediseño del menú lateral ni de las pestañas (ya tienen estado activo).

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Paginación
  Cuando veo "Anterior" y "Siguiente"
  Entonces cada uno tiene borde y forma de botón, también deshabilitado

Escenario: Migas
  Cuando estoy en el detalle de un curso
  Entonces "← Cursos" aparece en el color de enlace y subrayado

Escenario: Volver
  Cuando abro una conversación en móvil
  Entonces "← Volver a mensajes" es un botón
```

## Definición de hecho específica
- [ ] Ningún enlace de texto sin subrayado ni forma de botón.
- [ ] Contraste de enlaces ≥ 4.5:1 en claro y oscuro.
