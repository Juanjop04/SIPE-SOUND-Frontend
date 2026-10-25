# HU-F-501 · Mensajes con diseño de chat

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Should |
| Estimación | 8 puntos |
| Depende de | HU-F-407, HU-F-507 |
| Rama | `hu/HU-F-501-mensajes-tipo-chat` |

## Historia
**Como** estudiante, docente o administrador
**quiero** que mis mensajes se vean y se sientan como una aplicación de mensajería profesional
**para** seguir una conversación sin leer una lista de bloques.

## Contexto
- HU-F-407 entregó bandeja e hilos funcionales, pero cada mensaje es un bloque con borde y la
  respuesta está al pie de una página larga. No parece un chat.
- Esta HU **enmienda 05 §6**: la prohibición de burbujas de colores de HU-F-407 se cambia por
  "burbujas con tokens, sin degradados, sin avatares decorativos".
- Corrección ya aplicada fuera de HU (2026-10-25): el 429 al enviar la solicitud de cambio de nombre.

## Alcance
**Incluye**
1. **Lista de conversaciones** (izquierda, ≈ 360 px): fila con iniciales en un círculo `surface`
   (no foto), nombre, hora, último mensaje en una línea y contador de no leídos en mono; la
   conversación abierta resaltada con la marca de 2 px `accent`. Búsqueda y filtros de HU-F-407.
2. **Conversación** (derecha): encabezado con la persona o el grupo y el curso; mensajes como
   **burbujas**: los recibidos a la izquierda en `surface`, los propios a la derecha en
   `primary` con `sobre-primary` (contraste ≥ 4.5:1). Máximo 68 caracteres por línea, esquinas
   `rounded-caja` con la esquina del remitente recta.
3. **Agrupación**: mensajes seguidos del mismo remitente se juntan (nombre y hora solo en el
   primero), y **separadores de día** ("Hoy", "Ayer", "12 oct") entre días. La hora en mono.
4. **Redactor fijo abajo** (`Textarea` que crece hasta 5 líneas): Enter envía, Mayús+Enter salta
   de línea, contador desde el 80 % de 4000, botón "Enviar" deshabilitado vacío. Al enviar, el
   mensaje aparece al instante (optimista) con "Enviando…" y, si falla, "No se envió. Reintentar".
5. **Scroll**: al abrir va al último mensaje; si llega uno nuevo y la persona está arriba, aparece
   "Mensajes nuevos ↓" en vez de saltar. `aria-live="polite"` para los entrantes.
6. **Casi tiempo real**: el hilo abierto se consulta cada **15 s** con la pestaña visible
   (`refetchInterval`, pausado sin conexión); la lista y el contador siguen como en HU-F-407.
7. **Nuevo mensaje** sigue en `Drawer` con el selector de HU-F-407. Los avisos a grupos se
   muestran como una "tarjeta de aviso" centrada (sin burbuja) con el alcance ("Aviso a Guitarra 7A").
8. Si no se puede responder (aviso del administrador): el redactor se reemplaza por
   "Este aviso no admite respuestas."
9. Móvil: lista y conversación en pantallas separadas (como HU-F-407), con encabezado fijo y
   redactor sobre la zona segura del teléfono.
10. Enmienda de 05 §4 y §6, y 04-consumo-api (intervalo del hilo).

**No incluye**
- "Escribiendo…", confirmaciones de lectura, adjuntos, reacciones, emojis o voz.
- Sonidos o notificaciones del navegador.

## Diseño
- **Composición**: dos paneles a pantalla casi completa (altura `100dvh` menos la barra superior);
  la lista y la conversación desplazan por separado, el redactor no se mueve.
- **Metáfora**: ninguna decorativa. Sobrio: bordes `linea`, sin sombras, sin animaciones de entrada.
- **Estados**: carga (esqueleto de burbujas alternadas), vacío ("Elige una conversación."),
  error (`MensajeError` dentro del panel con reintentar), envío fallido (en la burbuja, con texto).

## Prompt de ejecución
```text
Ejecuta HU-F-501 en SIPE-SOUND-FULLSTACK. Rediseña features/mensajes como un chat: lista de
conversaciones con iniciales y no leídos, conversación con burbujas (recibidos a la izquierda en
surface, propios a la derecha en primary), agrupación por remitente, separadores de día, redactor
fijo abajo (Enter envía, envío optimista con reintento), scroll al último y "Mensajes nuevos ↓",
y consulta del hilo cada 15 s con la pestaña visible. Los avisos a grupos van como tarjeta de
aviso. Texto plano siempre (nunca dangerouslySetInnerHTML). Antes de escribir JSX describe la
composición y espera confirmación. Solo tokens, sin degradados ni emojis. Sin pruebas unitarias.
```

## Pasos
1. Enmienda de 05 §6; utilidades puras de agrupación y separadores de día.
2. Lista de conversaciones y encabezado.
3. Burbujas, agrupación y scroll.
4. Redactor fijo con envío optimista y reintento.
5. Consulta cada 15 s y accesibilidad.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Parece un chat
  Cuando abro una conversación
  Entonces mis mensajes están a la derecha en color primary y los de la otra persona a la izquierda
  Y veo el redactor fijo abajo

Escenario: Agrupación
  Dado tres mensajes seguidos de la misma persona
  Entonces el nombre y la hora aparecen una sola vez

Escenario: Enviar con Enter
  Cuando escribo "Gracias, profe" y pulso Enter
  Entonces el mensaje aparece de inmediato y luego se confirma

Escenario: Envío fallido
  Dado que el envío responde con error
  Entonces la burbuja dice "No se envió" y ofrece "Reintentar"

Escenario: Llega un mensaje
  Dado que estoy leyendo mensajes antiguos
  Cuando llega uno nuevo
  Entonces veo "Mensajes nuevos ↓" y la lectura no salta

Escenario: Texto plano
  Dado un mensaje con "<b>hola</b>"
  Entonces se ve literal, sin negrita

Escenario: Aviso sin respuesta
  Cuando abro un aviso del administrador
  Entonces el redactor dice "Este aviso no admite respuestas."
```

## Verificación manual
- Tres sesiones (admin, docente, estudiante) en navegadores distintos: la respuesta aparece en ≤ 15 s.
- Teclado (Tab, Enter, Mayús+Enter), lector de pantalla y 375 px; capturas en claro y oscuro.

## Definición de hecho específica
- [ ] `grep -rn "dangerouslySetInnerHTML" src/features/mensajes` sin resultados.
- [ ] Contraste de las burbujas propias ≥ 4.5:1 en ambos temas.
- [ ] Revisé los anti-patrones de 05 §6 (con la enmienda): ninguno presente.
