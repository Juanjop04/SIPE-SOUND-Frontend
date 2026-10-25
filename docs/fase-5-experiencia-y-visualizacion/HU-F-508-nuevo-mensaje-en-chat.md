# HU-F-508 · Nuevo mensaje dentro del chat

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Should |
| Estimación | 5 puntos |
| Depende de | HU-F-501, HU-F-506 |
| Rama | `hu/HU-F-508-nuevo-mensaje-en-chat` |

## Historia
**Como** estudiante, docente o administrador
**quiero** empezar una conversación nueva dentro del mismo chat, sin ventanas encima
**para** escribir como en una aplicación de mensajería y no perder de vista mis conversaciones.

## Contexto
- HU-F-501 dejó "Nuevo mensaje" en un `Drawer` (alcance 7). Se siente como un formulario aparte.
- Decisión del equipo (2026-10-25): el asunto es **el nombre de quien envía**, y las conversaciones
  muestran **solo el nombre de la persona**, sin rol ni curso.

## Alcance
**Incluye**
1. "Nuevo mensaje" abre, en el panel derecho de la bandeja, una **conversación en borrador**
   (`/mensajes/nuevo` y `/docente/mensajes/nuevo`). La bandeja sigue visible; no hay cajón ni diálogo.
2. **Encabezado "Para:"**: buscador en línea (persona, curso o grupo; el docente y el admin buscan
   por nombre; el estudiante elige entre sus docentes). Lo elegido queda como ficha con "×".
3. **Asunto automático** = nombre completo de quien envía (3–120 caracteres). No hay campo de asunto.
4. **Solo el nombre**: la bandeja, el encabezado del chat y cada burbuja muestran el nombre de la
   persona, sin "Docente", "Estudiante" ni el curso. El selector del estudiante tampoco muestra cursos.
5. **Campo de mensaje** compartido con la respuesta (Enter envía, Mayús+Enter salta de línea).
6. **Aviso a grupos** sin diálogo: un recuadro sobre el campo dice a quiénes llegará y el botón
   pasa a "Enviar aviso".
7. Al enviar, el borrador pasa a la conversación real (`/mensajes/:hiloId`).
8. **"Escribirle"** del panel de progreso va a `/docente/mensajes/nuevo?para=<id>&nombre=<nombre>`
   con la persona ya elegida. Se retira el `Drawer` de redacción.
9. Móvil: pantalla completa con "← Volver a mensajes".

**No incluye**
- Cambios en el backend (el asunto sigue siendo obligatorio allí).
- "Escribiendo…", adjuntos, reacciones.

## Diseño
- **Composición**: mismo marco que la conversación (borde `linea`, sin sombras): encabezado "Para",
  zona de mensajes con una frase guía y el campo abajo.
- **Estados**: sin destinatario ("Elige a quién le escribes."), sin resultados ("No hay nadie con esa
  búsqueda."), error del backend (`MensajeError` sobre el campo), enviando (botón con carga).

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Nuevo mensaje sin ventana
  Cuando pulso "Nuevo mensaje"
  Entonces el panel de la conversación muestra "Para:" y el campo de mensaje, sin cajón ni diálogo

Escenario: Asunto automático
  Dado que soy "Ana Gómez"
  Cuando envío un mensaje
  Entonces el asunto del hilo es "Ana Gómez" y no se me pide uno

Escenario: Solo el nombre
  Cuando un estudiante escribe a su docente
  Entonces el docente ve el nombre del estudiante, sin rol ni curso

Escenario: Escribirle
  Cuando pulso "Escribirle" en "Necesitan apoyo"
  Entonces se abre el chat nuevo con esa persona en "Para:"
```

## Definición de hecho específica
- [ ] Ningún diálogo ni cajón en el flujo de redactar.
- [ ] Revisé 05 §6: ninguno de los anti-patrones presente.
