# HU-F-503 · Ejercicios en tarjetas con filtro por estado de avance

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Should |
| Estimación | 5 puntos |
| Depende de | HU-F-321, **HU-B-501** |
| Rama | `hu/HU-F-503-ejercicios-tarjetas` |

## Historia
**Como** estudiante
**quiero** ver los ejercicios como tarjetas atractivas y filtrarlos por si ya los hice, los empecé o no
**para** elegir con qué practicar hoy.

## Contexto
- `/ejercicios` (`EjerciciosPage`) es una tabla con filtros por nivel y acorde: no destaca nada.
- HU-B-501 agrega `mi_progreso` (`sin_iniciar`, `en_curso`, `finalizado`, `mejor_bpm`) a cada ejercicio.

## Alcance
**Incluye**
1. Rejilla de **tarjetas** (1 columna en móvil, 2 en tableta, 3 en escritorio) en lugar de la tabla.
2. **Contenido de la tarjeta**: nombre, nivel, duración, **BPM recomendado** en mono grande como
   dato principal, compás, acordes como fichas (`TeselaAcorde` reducida o texto), y el estado de
   avance con símbolo y texto (`○ Sin iniciar`, `◐ En curso`, `● Finalizado`) más "Tu mejor: 84 BPM"
   si existe. Una `Cuerda` fina del tempo logrado frente al recomendado.
3. **Resaltar**: el borde izquierdo de 2 px cambia según el estado (`muted`, `accent`, `success`);
   los finalizados quedan visualmente atenuados y los "en curso" suben al principio con la etiqueta
   "Continúa aquí".
4. **Filtros** (en la URL): estado de avance como pestañas con conteo (`Todos 18 · Sin iniciar 9 ·
   En curso 4 · Finalizados 5`), nivel, lección y acorde; búsqueda por nombre; orden (recomendado,
   BPM, duración, último registro). "Quitar filtros" visible cuando hay alguno.
5. Sin sesión: tarjetas sin estado ni pestañas de avance, con "Inicia sesión para guardar tu avance".
6. Clic en toda la tarjeta (un solo enlace) abre el ejercicio; foco visible.

**No incluye**
- Cambiar la página del ejercicio (metrónomo) ni sus datos.

## Diseño
- **Composición**: encabezado (`EncabezadoPagina`) con las pestañas de estado; filtros en una fila;
  rejilla de tarjetas. La tarjeta destacada ("Continúa aquí") ocupa el primer lugar.
- **Metáfora**: tarjeta = ficha de práctica, marco como `TeselaAcorde` (sin sombra).
- **Estados**: carga (`Skeleton` de tarjetas), vacío por filtro ("No hay ejercicios en curso.
  Prueba con «Todos»."), error (`MensajeError`).

## Prompt de ejecución
```text
Ejecuta HU-F-503 en SIPE-SOUND-FULLSTACK. Reemplaza la tabla de /ejercicios por una rejilla de
tarjetas con el BPM recomendado como dato principal, acordes, estado de avance (símbolo + texto)
y el mejor BPM del estudiante, usando mi_progreso de HU-B-501. Pestañas por estado con conteo y
filtros de nivel, lección y acorde, todos en la URL. Los "en curso" primero con "Continúa aquí".
Sin sesión no hay estados. Antes de escribir JSX describe la composición y espera confirmación.
Solo tokens, sin degradados ni emojis. Sin pruebas unitarias.
```

## Pasos
1. Tipos (`mi_progreso`) y utilidades de conteo, orden y filtro.
2. `TarjetaEjercicio` y rejilla.
3. Pestañas de estado y filtros en la URL.
4. Estados vacíos y documentos.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Tarjetas
  Cuando abro Ejercicios
  Entonces veo una tarjeta por ejercicio con su BPM, acordes y estado de avance

Escenario: Filtrar por estado
  Cuando elijo "En curso"
  Entonces solo veo los ejercicios que empecé, y el conteo de la pestaña coincide

Escenario: Continuar
  Dado que tengo ejercicios en curso
  Entonces aparecen primero con "Continúa aquí"

Escenario: Filtros en la URL
  Cuando recargo la página con ?estado=finalizado
  Entonces sigo viendo solo los finalizados

Escenario: Sin sesión
  Dado un visitante
  Entonces no ve estados de avance y sí un aviso para iniciar sesión
```

## Verificación manual
- Con ejercicios en los tres estados; teclado y 375 px; claro y oscuro.

## Definición de hecho específica
- [ ] El estado nunca se indica solo con color.
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
