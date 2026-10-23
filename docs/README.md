# Documentación · SIPE-SOUND Frontend

Guía de reestructuración y rediseño del frontend en tres fases. Cada HU es un
**prompt ejecutable** por un agente de IA y una historia de usuario revisable.

## Cómo usar esta carpeta

1. Lee [`00-vision/proyecto.md`](00-vision/proyecto.md) una vez.
2. La **Fase 1** (contrato) es obligatoria antes de tocar código.
3. Ejecuta las HU en el orden de las tablas, respetando *Depende de* (incluye HU del backend).
4. Para lanzar una HU con un agente: *prompt base* de
   [`01-contrato-ia.md` §6](fase-1-contrato/01-contrato-ia.md#6-prompt-base-para-iniciar-una-hu)
   (+ §7 si es visual) y luego el *Prompt de ejecución* de la HU.

## Fase 1 · Contrato para IA generativa

| Documento | Contenido |
|---|---|
| [01-contrato-ia.md](fase-1-contrato/01-contrato-ia.md) | Reglas para agentes, flujo, plantilla de PR, prompts base. |
| [02-arquitectura-frontend.md](fase-1-contrato/02-arquitectura-frontend.md) | Estructura por features, reglas de dependencia, SOLID en React, estado. |
| [03-estandares-codigo.md](fase-1-contrato/03-estandares-codigo.md) | Nombres, ESLint + SonarJS, reglas Sonar, componentes, estilos, a11y. |
| [04-consumo-api.md](fase-1-contrato/04-consumo-api.md) | Respuesta estándar del backend, cliente HTTP único, servicios, TanStack Query, manejo de errores. |
| [05-sistema-de-diseno.md](fase-1-contrato/05-sistema-de-diseno.md) | Sistema "Diapasón": tokens de la paleta actual, contraste verificado, componentes musicales, anti-patrones de IA. |
| [06-plantilla-hu.md](fase-1-contrato/06-plantilla-hu.md) | Plantilla de nuevas HU. |
| [07-definicion-de-hecho.md](fase-1-contrato/07-definicion-de-hecho.md) | DoD, ramas, orden de merge con backend, CI sin pruebas. |
| [08-validacion-de-formularios.md](fase-1-contrato/08-validacion-de-formularios.md) | Validación por tipo de dato y límites de caracteres, iguales a la API y la base. |

## Fase 2 · Reestructuración (sin cambios visuales ni funcionales)

| Orden | HU | Pts | Depende de |
|---|---|---|---|
| 1 | [HU-F-201 Tooling y calidad](fase-2-reestructuracion/HU-F-201-tooling-y-calidad.md) | 3 | — |
| 2 | [HU-F-202 Estructura y reubicación](fase-2-reestructuracion/HU-F-202-estructura-y-reubicacion.md) | 5 | F-201 |
| 3 | [HU-F-203 Cliente HTTP y TanStack Query](fase-2-reestructuracion/HU-F-203-cliente-http-y-tanstack-query.md) ⚠ urgente | 5 | F-202, **B-317**, **B-319** |
| 4 | [HU-F-204 Sesión centralizada](fase-2-reestructuracion/HU-F-204-sesion-centralizada.md) | 3 | F-203 |
| 5 | [HU-F-205 Router, layouts y guardas](fase-2-reestructuracion/HU-F-205-router-layouts-y-guardas.md) | 3 | F-204 |
| 6 | [HU-F-206 Limpieza del repositorio](fase-2-reestructuracion/HU-F-206-limpieza-repositorio.md) | 2 | F-205, **B-206** |

## Fase 3 · Rediseño y panel docente

| Orden | HU | Pts | Depende de |
|---|---|---|---|
| 1 | [HU-F-301 Tokens de diseño](fase-3-rediseno-y-panel-docente/HU-F-301-tokens-de-diseno.md) | 3 | F-206 |
| 2 | [HU-F-302 Componentes base y musicales](fase-3-rediseno-y-panel-docente/HU-F-302-componentes-base.md) | 8 | F-301 |
| 3 | [HU-F-303 Navegación por rol](fase-3-rediseno-y-panel-docente/HU-F-303-navegacion-por-rol.md) | 5 | F-302, **B-304** |
| 3.1 | [HU-F-313 Formularios de acceso y preautorización de docentes](fase-3-rediseno-y-panel-docente/HU-F-313-formularios-de-acceso.md) | 5 | F-303, **B-320**, **B-321** |
| 4 | [HU-F-304 Ruta de aprendizaje (mástil)](fase-3-rediseno-y-panel-docente/HU-F-304-ruta-de-aprendizaje.md) | 8 | F-303, **B-308** |
| 5 | [HU-F-305 Lección, ejercicios (metrónomo) y acordes](fase-3-rediseno-y-panel-docente/HU-F-305-leccion-ejercicios-acordes.md) | 8 | F-304, **B-305**, **B-306** |
| 6 | [HU-F-306 Evaluación y progreso](fase-3-rediseno-y-panel-docente/HU-F-306-evaluacion-y-progreso.md) | 8 | F-304, **B-305**, **B-308** |
| 7 | [HU-F-307 Docente: resumen y cursos](fase-3-rediseno-y-panel-docente/HU-F-307-docente-resumen-y-cursos.md) | 8 | F-303, **B-310** |
| 8 | [HU-F-308 Docente: lecciones y ejercicios](fase-3-rediseno-y-panel-docente/HU-F-308-docente-contenido.md) | 8 | F-307, **B-309** |
| 9 | [HU-F-309 Docente: estudiantes](fase-3-rediseno-y-panel-docente/HU-F-309-docente-estudiantes.md) | 5 | F-307, **B-310** |
| 10 | [HU-F-310 Docente: evaluaciones y resultados](fase-3-rediseno-y-panel-docente/HU-F-310-docente-evaluaciones.md) | 8 | F-308, **B-311** |
| 11 | [HU-F-311 Estudiante: mis cursos](fase-3-rediseno-y-panel-docente/HU-F-311-estudiante-cursos.md) | 3 | F-304, **B-307**, **B-312** |
| 12 | [HU-F-312 Accesibilidad, rendimiento y conectividad](fase-3-rediseno-y-panel-docente/HU-F-312-accesibilidad-rendimiento-conectividad.md) | 5 | F-304 … F-311 |

## Línea de tiempo sugerida entre repositorios

```
Backend : B201 B206 B202 B203 B204 B205 │ B301 … B307 B317 B319 B320 B321 │ B308 B309 B310 B311 B312
Frontend:            F201 F202 ─────────────────────────── F203 F204 F205 F206 │ F301 F302 F303 F313 ─ F304 F305 F306 F307 F308 F309 F310 ─ F311 F312
```

> HU-B-319 ya retiró `/api` sin versión: **HU-F-203 es la siguiente HU del frontend**.
