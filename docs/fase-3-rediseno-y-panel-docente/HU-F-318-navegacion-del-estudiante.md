# HU-F-318 · Ordenar la navegación del estudiante y la continuidad entre contenidos

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Should |
| Estimación | 3 puntos |
| Depende de | HU-F-315, HU-F-320 |
| Rama | `hu/HU-F-318-navegacion-estudiante` |

## Historia
**Como** estudiante con poca experiencia en plataformas educativas
**quiero** saber siempre dónde estoy, cómo volver y qué sigue al terminar algo
**para** no perderme entre lecciones, ejercicios y evaluaciones.

## Contexto
`src/app/layouts/components/NavEstudiante.tsx` (HU-F-303) tiene cuatro destinos: Ruta (`/`),
Acordes, Ejercicios y Mi progreso; en móvil, barra inferior con íconos. Con HU-F-315 aparece el
**inicio** en `/` y la ruta pasa a `/ruta`. Al terminar una lección o un ejercicio el estudiante no
tiene un "siguiente" claro: debe volver a la ruta y elegir.

## Alcance
**Incluye**
- Destinos (en este orden): **Inicio** (`/`, exacto) · **Ruta** (`/ruta`) · **Ejercicios** ·
  **Acordes** · **Mi progreso**. Sin sesión: Ruta · Ejercicios · Acordes (Inicio y Mi progreso
  requieren cuenta y no se muestran).
- Barra inferior móvil con los 5 destinos: ícono **y** etiqueta (nunca solo ícono), objetivo ≥ 44 px,
  respeta `env(safe-area-inset-bottom)`; el contenido no queda tapado por la barra (padding inferior).
- **Migas** en lección, ejercicio y evaluación: `Ruta › Bloque 2 › Cambio entre Em y Am`, como
  `<nav aria-label="Migas">` con `aria-current="page"` en el último.
- **Continuidad** al final de una lección (después de "Marcar como practicada"):
  - "Siguiente lección: <título>" (primario) si el bloque tiene otra lección sin completar, según
    `GET /ruta`;
  - si era la última, "Presentar evaluación del bloque" (primario);
  - siempre "Volver al bloque" (secundario).
- Ejercicio asociado a una lección: enlace "Volver a la lección".
- Resultado de evaluación: "Ir al inicio" (secundario) además de la acción actual.
- Revisión adaptable de las pantallas del estudiante a 320, 375, 768, 1024 y 1280 px: sin
  desplazamiento horizontal, sin texto cortado, `Tablatura` que salta de línea en lugar de desbordar.

**No incluye**: "Mis cursos" en el menú de cuenta (HU-F-311), cambios al atril docente.

## Diseño
- Escritorio: los cinco destinos como texto en la barra superior; activo con subrayado `accent` de
  2 px **y** `aria-current="page"` (no solo color).
- Móvil: barra inferior fija en `ink-2` (HU-F-320) con borde superior `linea`; activo con ícono y etiqueta en
  `accent` más un punto bajo el ícono.
- Las acciones de continuidad siguen la regla de un solo primario por vista (sistema de diseño §2.2).

**Estados**: si `GET /ruta` falla, la continuidad muestra solo "Volver al bloque" (no un error que
tape la lección terminada).

## Prompt de ejecución
```text
Ejecuta HU-F-318 en SIPE-SOUND-FULLSTACK. Describe los cambios de
navegación en viñetas y espera confirmación. La lección siguiente se
calcula con una función pura sobre los datos de useRuta (misma caché, sin
peticiones nuevas). Reutiliza Button/claseBoton y los íconos de
lucide-react ya instalados. No cambies permisos ni guardas de rutas.
```

## Criterios de aceptación
```gherkin
Escenario: Saber dónde estoy
  Cuando abro una lección del bloque 2
  Entonces veo las migas "Ruta › Bloque 2 › <título>" y "Ruta" activo en el menú

Escenario: Qué sigue
  Dado que marco como practicada la lección 2 de 4
  Entonces el botón primario es "Siguiente lección: <título de la 3>"

Escenario: Última lección del bloque
  Dado que marco como practicada la última lección del bloque
  Entonces el botón primario es "Presentar evaluación del bloque"

Escenario: Móvil sin solapes
  Dado un ancho de 375 px
  Entonces la barra inferior muestra 5 destinos con etiqueta y no tapa el último botón de la página
```

## Verificación manual
Recorrido lección → siguiente lección → evaluación → inicio solo con teclado; 320/375/768/1280 px;
iPhone con barra de inicio (zona segura) o su emulación en DevTools.

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR.
- [ ] Capturas de la barra inferior y de las migas en el PR.
