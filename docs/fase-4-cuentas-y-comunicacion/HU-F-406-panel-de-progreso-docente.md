# HU-F-406 · Panel de progreso del docente

| Campo | Valor |
|---|---|
| Fase | 4 · Cuentas y comunicación |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-309, **HU-B-408** |
| Rama | `hu/HU-F-406-panel-de-progreso` |

## Historia
**Como** docente
**quiero** ver de un vistazo cómo van los estudiantes de mis cursos en cada bloque de la ruta
**para** decidir qué repasar en la próxima clase y a quién escribirle hoy.

## Contexto
- HU-F-309 muestra, curso por curso, la lista de estudiantes con su avance y el detalle de cada uno
  (`src/features/docente/estudiantes/`). No hay una vista estudiantes × bloques.
- HU-B-408 expone `GET /docente/progreso`, `/docente/progreso/matriz` y `/docente/progreso/estudiantes/{id}`.

## Alcance
**Incluye**
1. Página `/docente/progreso` (`paths.docente.progreso`), enlace "Progreso" en `PanelAtril` entre
   "Cursos" y "Contenido".
2. **Selector de curso** (en la URL `?curso=`); sin curso, vista de todos los cursos activos.
3. **Franja de cifras** del curso: estudiantes · avance promedio · al día (7 días) · sin actividad (14 días).
4. **Necesitan apoyo**: lista accionable (máx. 20) con nombre, curso, motivo en texto ("Sin avances
   desde hace 15 días", "Reprobó 2 veces el bloque 3") y acciones "Ver progreso" y "Escribirle"
   (abre el redactor de HU-F-407 con el destinatario puesto; si HU-F-407 aún no está, la acción no aparece).
5. **Matriz** (solo con un curso elegido): filas = estudiantes, columnas = bloques de la ruta en
   orden (número de traste en mono en la cabecera, título en `title` y en texto accesible).
   Celda: `MarcaEstado` (`×` bloqueado, `○` disponible, `●` aprobado) + mejor puntaje en mono si
   hay intentos. Primera columna fija con nombre y `Cuerda` fina del avance. Orden y búsqueda en la URL.
6. **Por bloque** (pie de la matriz): aprobados `12/28`, intentos y pregunta más fallada (recortada,
   completa en el detalle).
7. "Ver progreso" abre un `Drawer` con el progreso del estudiante en todos mis cursos (reutiliza
   el mástil de solo lectura de HU-F-309).
8. Exportar CSV de la matriz visible (`Blob`, sin librería), igual que HU-F-309.

**No incluye**
- Gráficos (la matriz y las cifras bastan; si se agrega uno, va con su tabla, contrato 05 §6).
- Enviar mensajes (HU-F-407).

## Diseño
- **Composición** (escritorio): encabezado + selector de curso; franja de cifras; dos columnas:
  matriz (≈ 2/3) y "Necesitan apoyo" (≈ 1/3). Móvil: cifras, "Necesitan apoyo" primero (es lo
  accionable) y la matriz como lista por estudiante (nombre, `Cuerda`, fila de símbolos con
  desplazamiento horizontal **dentro** de la fila, no de la página).
- **Metáfora**: la matriz es una **tablatura**: cada fila es una cuerda (un estudiante) y cada
  columna un traste (un bloque); los símbolos son los del diagrama de acorde que el estudiante ya lee.
- **Estados**: carga (`Skeleton` de matriz), vacío ("Aún no tienes estudiantes en este curso.
  Comparte el código **K7M2Q9XA** con tu grupo."), error (`MensajeError`), éxito (no aplica: solo lectura).

## Prompt de ejecución
```text
Ejecuta HU-F-406 en SIPE-SOUND-FULLSTACK. Agrega /docente/progreso con selector de curso en la
URL, franja de cifras, lista "Necesitan apoyo" y la matriz estudiantes × bloques con MarcaEstado
(×, ○, ●) y mejor puntaje en mono, al estilo tablatura. Detalle en Drawer reutilizando el mástil
de solo lectura de HU-F-309. Consume HU-B-408 con TanStack Query. Antes de escribir JSX describe
la composición y espera confirmación. Prohibido: tarjetas KPI con ícono decorativo, gráficos de
dona, degradados. Sin pruebas unitarias.
```

## Pasos
1. `paths.docente.progreso`, ruta y enlace.
2. API, tipos y hooks.
3. Cifras y "Necesitan apoyo".
4. Matriz accesible (`<table>` con `<th scope>`), versión móvil y CSV.
5. Drawer de detalle.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Matriz del curso
  Cuando elijo el curso "Guitarra 7A"
  Entonces veo una fila por estudiante y una columna por bloque con ×, ○ o ● y su texto accesible

Escenario: Necesitan apoyo
  Dado un estudiante sin avances en 15 días
  Entonces aparece en "Necesitan apoyo" con "Sin avances desde hace 15 días"

Escenario: Lector de pantalla
  Cuando recorro una celda con el lector
  Entonces escucho "Ana Gómez, bloque 3, Aprobado, mejor puntaje 90"

Escenario: Móvil sin desplazamiento de página
  Dado un ancho de 375 px
  Entonces la página no se desplaza horizontalmente
```

## Verificación manual
- Curso con 30 estudiantes × 8 bloques: desplazamiento fluido y cabecera fija.
- Teclado y lector de pantalla en la matriz; capturas en 1280 px y 375 px.

## Definición de hecho específica
- [ ] Ningún correo de estudiante en la página.
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
