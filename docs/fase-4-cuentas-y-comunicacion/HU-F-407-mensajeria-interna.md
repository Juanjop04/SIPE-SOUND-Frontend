# HU-F-407 · Mensajes: bandeja, hilos y avisos

| Campo | Valor |
|---|---|
| Fase | 4 · Cuentas y comunicación |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-F-318, HU-F-403, **HU-B-409** |
| Rama | `hu/HU-F-407-mensajeria` |

## Historia
**Como** estudiante **quiero** escribirle a mi docente y leer los avisos en un solo lugar;
**como** docente o administrador **quiero** enviar avisos a una persona, a un curso o a todos
**para** comunicarnos sin salir de SIPE-SOUND.

## Contexto
- El estudiante solo lee comentarios del docente en `/cursos` (HU-F-311), sin poder responder.
- El contrato 05 §6 prohíbe enlazar "Notificaciones" hasta que exista su HU: esta es esa HU.
- HU-B-409 expone `/mensajes`, `/mensajes/hilos/{id}`, `/mensajes/no-leidos` y `/mensajes/destinatarios`
  y aplica las reglas de quién escribe a quién.

## Alcance
**Incluye**
1. Feature `mensajes` (con `index.ts`). Rutas `/mensajes` y `/mensajes/:hiloId` para estudiante
   (`EstudianteLayout`) y `/docente/mensajes` y `/docente/mensajes/:hiloId` para docente y admin
   (`DocenteLayout`). Las mismas páginas, distinto layout.
2. **Navegación**:
   - Estudiante: "Mensajes" en la barra lateral (escritorio) y, en móvil, un botón con ícono lucide
     `Mail` en el encabezado (la barra inferior ya tiene 5 destinos). Contador de no leídos con
     número en mono y texto accesible ("Mensajes, 3 sin leer").
   - Docente/admin: "Mensajes" en `PanelAtril` con el mismo contador.
   - El contador consulta `/mensajes/no-leidos` cada 60 s con TanStack Query (`refetchInterval`),
     se pausa con la pestaña oculta o sin conexión (HU-F-312).
3. **Bandeja**: filtros Recibidos · Enviados · No leídos · Archivados (en la URL) y búsqueda por asunto.
   Fila: remitente (nombre y rol) · asunto · extracto · fecha relativa · marca de no leído
   (punto **con texto** "Sin leer", no solo color). Paginación existente.
4. **Hilo**: mensajes en orden, remitente y fecha en mono, cuerpo con saltos de línea respetados
   (texto plano, nunca HTML), y "Responder" al pie solo si el backend lo permite (`puede_responder`
   del hilo o, si no viene, se muestra y se maneja el 403 con su mensaje). Acciones: archivar,
   marcar como no leído.
5. **Redactar** (`Drawer`):
   - Estudiante: selector con **solo** sus docentes ("Marta Ríos · Guitarra 7A").
   - Docente/admin: selector de destino con búsqueda (`/mensajes/destinatarios`) que agrupa
     personas, cursos y grupos ("Todos mis estudiantes", "Todos los docentes"…).
   - Asunto (3–120) y cuerpo (1–4000, contador desde el 80 %).
   - Antes de enviar a un grupo: confirmación "Este aviso llegará a 28 estudiantes de Guitarra 7A."
6. Límites en `src/shared/validacion/limites.ts` (`ASUNTO`, `CUERPO_MENSAJE`) y 08-validación.
7. Enmienda de 05 §6 (Notificaciones/Mensajes ya existe) y 04-consumo-api.

**No incluye**
- Notificaciones del navegador, sonidos o correos.
- Adjuntos y formato enriquecido.

## Diseño
- **Composición** (escritorio ≥ 1024 px): dos paneles: bandeja (≈ 360 px) y hilo abierto. Móvil:
  la bandeja y el hilo son pantallas distintas (`/mensajes/:hiloId`), con "Volver a mensajes".
- **Metáfora**: ninguna decorativa; lectura editorial del hilo (≤ 68 caracteres por línea).
  Sin burbujas de chat de colores: cada mensaje es un bloque con borde `linea`, remitente y fecha
  arriba; los propios se distinguen con el texto "Tú", no con color.
- **Estados**: carga (`Skeleton` de filas), vacío ("Aún no tienes mensajes." y, para el estudiante,
  "Escríbele a tu docente" si tiene cursos; si no, "Únete a un curso para escribirle a tu docente."
  con enlace a `/cursos`), error (`MensajeError`), éxito ("Mensaje enviado a Marta Ríos.").

## Prompt de ejecución
```text
Ejecuta HU-F-407 en SIPE-SOUND-FULLSTACK. Crea la feature mensajes: bandeja de hilos con filtros
en la URL, hilo con respuesta, redactor en Drawer con destinatarios de /mensajes/destinatarios y
confirmación al enviar a un grupo, y contador de no leídos (refetch cada 60 s, pausado sin
conexión o con la pestaña oculta) en la navegación del estudiante y del atril. El cuerpo se
muestra como texto plano (nunca dangerouslySetInnerHTML). Antes de escribir JSX describe la
composición y espera confirmación. Sin burbujas de colores, sin emojis. Solo tokens y
src/shared/ui. Sin pruebas unitarias.
```

## Pasos
1. Feature, rutas y `paths` (estudiante y atril).
2. API, tipos y hooks (bandeja, hilo, no leídos, destinatarios, enviar).
3. Bandeja e hilo (dos paneles / dos pantallas).
4. Redactor y confirmación de grupo.
5. Contador en `NavEstudiante`, encabezado móvil y `PanelAtril`.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Estudiante escribe a su docente
  Dado que estoy inscrito en "Guitarra 7A" con Marta Ríos
  Cuando redacto un mensaje
  Entonces el selector solo ofrece "Marta Ríos · Guitarra 7A"

Escenario: Aviso a un curso
  Cuando como docente envío un aviso a "Guitarra 7A"
  Entonces veo la confirmación "Este aviso llegará a 28 estudiantes de Guitarra 7A."

Escenario: Contador
  Dado que recibo un mensaje nuevo
  Entonces en menos de 60 segundos el contador muestra 1 y se anuncia "Mensajes, 1 sin leer"
  Cuando abro el hilo
  Entonces el contador vuelve a 0

Escenario: Sin respuesta a avisos del admin
  Cuando un estudiante abre un aviso del administrador
  Entonces no ve el botón Responder (o ve el mensaje del backend si responde 403)

Escenario: Texto plano
  Dado un mensaje con "<b>hola</b>"
  Entonces se muestra literalmente, sin negrita
```

## Verificación manual
- Tres sesiones (admin, docente, estudiante) en navegadores distintos: aviso de grupo, mensaje y respuesta.
- Modo sin conexión de DevTools: el contador deja de consultar y vuelve al reconectar.
- Teclado, lector de pantalla; capturas en 1280 px y 375 px.

## Definición de hecho específica
- [ ] `grep -rn "dangerouslySetInnerHTML" src/features/mensajes` sin resultados.
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
