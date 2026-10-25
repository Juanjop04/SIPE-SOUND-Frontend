# HU-F-504 · Mis cursos en el menú, con avance y estado por curso

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-311, HU-F-318, **HU-B-502** |
| Rama | `hu/HU-F-504-mis-cursos-con-avance` |

## Historia
**Como** estudiante
**quiero** un acceso visible a "Mis cursos", con una tarjeta por curso que muestre cuánto llevo y si lo empecé o lo terminé
**para** entrar a la ruta de cada curso sin buscarla.

## Contexto
- `/cursos` existe (HU-F-311: unirse con código, comentarios del docente) pero **no está en el menú**
  (la barra tiene Inicio, Ruta, Ejercicios, Acordes, Mi progreso, Mensajes).
- La ruta (`/ruta`) y el curso no están relacionados en pantalla: no se ve qué ruta pertenece a qué curso.
- HU-B-502 entrega por curso `avance.pct`, `estado`, `docente`, `ultimo_avance` y `retroalimentaciones_sin_leer`.

## Alcance
**Incluye**
1. **Menú**: "Mis cursos" (lucide `GraduationCap`) en la barra lateral, la tableta y la barra
   inferior móvil. La barra inferior pasa a 5 destinos así: Inicio · Ruta · Mis cursos · Ejercicios ·
   Mi progreso; Acordes y Mensajes pasan al encabezado móvil (con el icono de HU-F-407).
2. **Tarjeta de curso** (rediseñada): nombre, docente, nivel; **anillo no**: una `Cuerda` gruesa
   con el porcentaje en mono grande (`64 %`); `Lecciones 12/18 · Bloques 2/4`; estado con
   símbolo y texto (`○ Sin iniciar`, `◐ En curso`, `● Finalizado`); "Último avance hace 2 días";
   insignia de comentarios sin leer del docente ("2 comentarios nuevos").
3. **Acción principal por estado** (un solo botón primario por tarjeta): "Empezar" (sin iniciar),
   "Continuar" (en curso, lleva a la siguiente lección de **esa** ruta) y "Repasar" (finalizado).
   Secundario: "Ver ruta del curso" → `/ruta?curso=<id>`.
4. **Relación con la ruta**: `/ruta` acepta `?curso=` y muestra arriba "Ruta del curso Guitarra 7A"
   con un selector entre mis cursos y "Ruta general"; el avance de cada bloque es el de ese curso.
5. **Filtros y orden** en la URL: pestañas con conteo (`Todos · Sin iniciar · En curso · Finalizados`)
   y orden (último avance, nombre, avance).
6. **Unirse a un curso**: tarjeta final "Unirme con un código" (flujo de HU-F-311, sin cambios).
7. Sin cursos: "Aún no estás en ningún curso" + campo del código a la vista.

**No incluye**
- Salir de un curso (lo hace el docente o el admin) ni calificaciones.

## Diseño
- **Composición**: encabezado + pestañas de estado; rejilla de tarjetas (1/2/3 columnas); la
  tarjeta "Unirme con un código" es la última, más discreta (borde punteado de `linea`).
- **Metáfora**: cada tarjeta es un curso-cuerda; su relleno es el avance real, no decorativo.
- **Estados**: carga (`Skeleton` de tarjetas), vacío (arriba), error (`MensajeError`).

## Prompt de ejecución
```text
Ejecuta HU-F-504 en SIPE-SOUND-FULLSTACK. Agrega "Mis cursos" al menú del estudiante (lateral,
tableta y barra inferior, ajustando los 5 destinos) y rediseña /cursos como tarjetas con Cuerda
de avance, porcentaje, estado (sin iniciar/en curso/finalizado, símbolo + texto), último avance,
comentarios sin leer y una acción principal por estado. /ruta acepta ?curso= con un selector de
cursos. Filtros por estado con conteo y orden en la URL. Consume HU-B-502. Antes de escribir JSX
describe la composición y espera confirmación. Solo tokens. Sin pruebas unitarias.
```

## Pasos
1. Menú y barra inferior; mover Acordes y Mensajes al encabezado móvil.
2. Tipos y hooks de `/cursos` ampliado.
3. `TarjetaCurso` rediseñada, filtros y orden.
4. `?curso=` en la ruta y selector.
5. Documentos.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Acceso visible
  Dado que inicié sesión como estudiante
  Entonces veo "Mis cursos" en el menú lateral y en la barra inferior del móvil

Escenario: Avance por curso
  Dado que estoy en "Guitarra 7A" y completé 12 de 18 lecciones
  Entonces su tarjeta muestra el porcentaje, "Lecciones 12/18" y el estado "En curso"

Escenario: Estados
  Entonces un curso sin registros dice "Sin iniciar" con botón "Empezar" y uno completo dice "Finalizado" con "Repasar"

Escenario: Relación con la ruta
  Cuando pulso "Ver ruta del curso" en "Guitarra 7A"
  Entonces /ruta muestra "Ruta del curso Guitarra 7A" y el avance de sus bloques

Escenario: Filtrar
  Cuando elijo "En curso"
  Entonces solo veo los cursos en curso y el conteo de la pestaña coincide
```

## Verificación manual
- Estudiante con tres cursos (uno por estado) y otro sin cursos; teclado y 375 px; claro y oscuro.

## Definición de hecho específica
- [ ] El porcentaje coincide con el que ve el docente del mismo estudiante.
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
