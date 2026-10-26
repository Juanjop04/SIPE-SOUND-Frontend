# HU-F-311 · Estudiante: unirse a un curso y leer la retroalimentación

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 3 puntos |
| Depende de | HU-F-304, HU-F-315, HU-F-318, **HU-B-307**, **HU-B-312** (retroalimentaciones) |
| Rama | `hu/HU-F-311-mis-cursos` |

## Historia
**Como** estudiante de un colegio
**quiero** unirme al curso de mi docente con un código y leer sus comentarios
**para** seguir la ruta que él definió y saber qué mejorar.

## Diseño
- Menú de cuenta → "Mis cursos" (`/cursos`).
- Campo de código grande en mono, 8 casillas visuales (un solo `input` accesible por debajo), acepta pegar, convierte a mayúsculas. Botón "Unirme".
- Lista de cursos: nombre, docente, ruta del curso como mini-mástil horizontal (estados), comentarios sin leer (número en mono).
- Selector de ruta en `/ruta` (HU-F-304) y en el inicio (HU-F-315): "Ruta general" / "Guitarra 7°A" — cambia `?curso_id`.
  El siguiente paso y "Tu ruta" del inicio usan la ruta del curso elegido; la elección se recuerda en `localStorage` por estudiante.
- **Inicio (rediseño)**: entre "Tu avance" y "Tu ruta", la sección "Tu docente te escribió" con los 2 comentarios sin leer
  más recientes y el enlace "Ver todos" a `/cursos`. Sin comentarios nuevos, la sección no aparece.
- Comentarios: lista cronológica tipo nota de cuaderno (fecha en mono, texto), los nuevos marcados con un punto `accent`.
- Registro: si la URL trae `?codigo=XXXX` (enlace compartido por el docente), tras registrarse o iniciar sesión se une automáticamente y lo confirma.

## Alcance
**Incluye**: `features/cursos` (api, hooks, `MisCursosPage`, `CampoCodigo`), selector de ruta, flujo `?codigo=`.
**No incluye**: salir de un curso por cuenta propia (decisión pendiente con docentes).

> El enlace "Mis cursos" va en el menú de cuenta (la barra principal de HU-F-318 se queda en cinco destinos).

## Validación de campos
Constructores de `shared/validacion` ([contrato 08](../fase-1-contrato/08-validacion-de-formularios.md)); los mismos límites aplican la API y la base (contrato del backend §7).

| Campo | Regla | Control |
|---|---|---|
| Código del curso | exactamente 8 de `A–Z 2–9` sin `0 O 1 I L`; se limpian espacios y guiones al pegar → "El código solo tiene letras y números (sin 0, O, 1, I ni L)." | un `input` `maxLength=8` mono |
| `?codigo=` de la URL | se valida con la misma regla antes de guardarlo en `sessionStorage`; si no es válido se descarta | — |

## Prompt de ejecución
```text
Ejecuta HU-F-311 en SIPE-SOUND-FULLSTACK. CampoCodigo es un único <input>
con autocomplete="off", autocapitalize="characters", spellcheck=false, maxLength 8
y presentación visual en casillas mediante CSS (no 8 inputs). Mensajes de
error con la voz del sistema de diseño. El código pendiente de ?codigo= se
guarda en sessionStorage solo hasta completar el login.
```

## Criterios de aceptación
```gherkin
Escenario: Unirse con código
  Cuando escribo "k7m2q9xa" y pulso Unirme
  Entonces veo "Te uniste a Guitarra 7°A" y el curso aparece en la lista

Escenario: Código inválido
  Cuando escribo un código inexistente
  Entonces veo "El código no existe o el curso ya cerró. Pídele a tu docente un código nuevo."

Escenario: Enlace compartido
  Dado que abro /registro?codigo=K7M2Q9XA sin cuenta
  Cuando completo el registro e inicio sesión
  Entonces quedo inscrito en el curso automáticamente
```

## Verificación manual
Flujo completo con un curso real del panel docente; 375 px; teclado; pegar código.

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR.
