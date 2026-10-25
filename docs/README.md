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

Estado al 2026-10-23: todas integradas en `develop` ✅.

| Orden | HU | Pts | Depende de |
|---|---|---|---|
| 1 | [HU-F-201 Tooling y calidad](fase-2-reestructuracion/HU-F-201-tooling-y-calidad.md) | 3 | — |
| 2 | [HU-F-202 Estructura y reubicación](fase-2-reestructuracion/HU-F-202-estructura-y-reubicacion.md) | 5 | F-201 |
| 3 | [HU-F-203 Cliente HTTP y TanStack Query](fase-2-reestructuracion/HU-F-203-cliente-http-y-tanstack-query.md) ⚠ urgente | 5 | F-202, **B-317**, **B-319** |
| 4 | [HU-F-204 Sesión centralizada](fase-2-reestructuracion/HU-F-204-sesion-centralizada.md) | 3 | F-203 |
| 5 | [HU-F-205 Router, layouts y guardas](fase-2-reestructuracion/HU-F-205-router-layouts-y-guardas.md) | 3 | F-204 |
| 6 | [HU-F-206 Limpieza del repositorio](fase-2-reestructuracion/HU-F-206-limpieza-repositorio.md) | 2 | F-205, **B-206** |
| 2.1 | [HU-F-207 Autenticación a través del backend](fase-2-reestructuracion/HU-F-207-autenticacion-por-backend.md) | 3 | F-202, **B-322** |

## Fase 3 · Rediseño y panel docente

Estado al 2026-10-23: ✅ integrada en `develop` · 🔍 en PR · ⬜ pendiente.

| Orden | HU | Pts | Depende de | Estado |
|---|---|---|---|---|
| 1 | [HU-F-301 Tokens de diseño](fase-3-rediseno-y-panel-docente/HU-F-301-tokens-de-diseno.md) | 3 | F-206 | ✅ |
| 2 | [HU-F-302 Componentes base y musicales](fase-3-rediseno-y-panel-docente/HU-F-302-componentes-base.md) | 8 | F-301 | ✅ |
| 3 | [HU-F-303 Navegación por rol](fase-3-rediseno-y-panel-docente/HU-F-303-navegacion-por-rol.md) | 5 | F-302, **B-304** | ✅ |
| 3.1 | [HU-F-313 Formularios de acceso y preautorización de docentes](fase-3-rediseno-y-panel-docente/HU-F-313-formularios-de-acceso.md) | 5 | F-303, **B-320**, **B-321** | ✅ |
| 4 | [HU-F-304 Ruta de aprendizaje (mástil)](fase-3-rediseno-y-panel-docente/HU-F-304-ruta-de-aprendizaje.md) | 8 | F-303, **B-308** | ✅ |
| 5 | [HU-F-305 Lección, ejercicios (metrónomo) y acordes](fase-3-rediseno-y-panel-docente/HU-F-305-leccion-ejercicios-acordes.md) | 8 | F-304, **B-305**, **B-306** | ✅ |
| 6 | [HU-F-306 Evaluación y progreso](fase-3-rediseno-y-panel-docente/HU-F-306-evaluacion-y-progreso.md) | 8 | F-304, **B-305**, **B-308** | 🔍 |
| 7 | [HU-F-307 Docente: resumen y cursos](fase-3-rediseno-y-panel-docente/HU-F-307-docente-resumen-y-cursos.md) | 8 | F-303, **B-310** | 🔍 |
| 8 | [HU-F-308 Docente: lecciones y ejercicios](fase-3-rediseno-y-panel-docente/HU-F-308-docente-contenido.md) | 8 | F-307, **B-309** | 🔍 |
| 9 | [HU-F-314 Auditoría de interfaz y contraste (WCAG 2.2)](fase-3-rediseno-y-panel-docente/HU-F-314-auditoria-de-interfaz-y-contraste.md) | 5 | F-306, F-307, F-308 | ⬜ |
| 10 | [HU-F-316 Ilustraciones del instrumento](fase-3-rediseno-y-panel-docente/HU-F-316-ilustraciones-del-instrumento.md) | 3 | F-314 | ⬜ |
| 10.1 | [HU-F-320 Paleta del rediseño con capas](fase-3-rediseno-y-panel-docente/HU-F-320-capas-y-calidez-de-la-paleta.md) | 5 | F-314 | ⬜ |
| 10.2 | [HU-F-321 Fotografías de guitarra con licencia](fase-3-rediseno-y-panel-docente/HU-F-321-fotografias-de-guitarra.md) | 3 | F-320 | ⬜ |
| 11 | [HU-F-315 Inicio del estudiante](fase-3-rediseno-y-panel-docente/HU-F-315-inicio-del-estudiante.md) | 8 | F-314, F-316, F-320, F-321, F-306, (**B-324**) | ⬜ |
| 12 | [HU-F-318 Navegación del estudiante y continuidad](fase-3-rediseno-y-panel-docente/HU-F-318-navegacion-del-estudiante.md) | 3 | F-315, F-320 | ⬜ |
| 13 | [HU-F-317 Gráfico de evolución de la práctica](fase-3-rediseno-y-panel-docente/HU-F-317-grafico-de-practica.md) | 3 | F-315, **B-324** | ⬜ |
| 13.1 | [HU-F-322 Acabados de progreso, gráfico y encabezado](fase-3-rediseno-y-panel-docente/HU-F-322-acabados-de-progreso-y-graficos.md) | 2 | F-315, F-317 | ⬜ |
| 13.2 | [HU-F-323 Tema claro opcional](fase-3-rediseno-y-panel-docente/HU-F-323-tema-claro.md) | 5 | F-320, F-322 | ⬜ |
| 14 | [HU-F-309 Docente: estudiantes](fase-3-rediseno-y-panel-docente/HU-F-309-docente-estudiantes.md) | 5 | F-307, F-314, F-320, **B-310** | ⬜ |
| 15 | [HU-F-310 Docente: evaluaciones y resultados](fase-3-rediseno-y-panel-docente/HU-F-310-docente-evaluaciones.md) | 8 | F-308, F-314, F-320, **B-311** | ⬜ |
| 16 | [HU-F-311 Estudiante: mis cursos](fase-3-rediseno-y-panel-docente/HU-F-311-estudiante-cursos.md) | 3 | F-304, F-315, F-318, **B-307**, **B-312** | ⬜ |
| 17 | [HU-F-312 Accesibilidad, rendimiento y conectividad](fase-3-rediseno-y-panel-docente/HU-F-312-accesibilidad-rendimiento-conectividad.md) | 5 | F-304 … F-318 | ⬜ |

> **Rediseño del estudiante (HU-F-314…F-321)**: sigue la maqueta de inicio aprobada el 2026-10-23
> (paleta azul profunda, tarjetas de cifras, fotos de guitarra) con datos reales: auditoría,
> ilustraciones, paleta (F-320), fotos (F-321), inicio, navegación y gráfico. HU-F-315 funciona sin HU-B-324 (con un respaldo); HU-F-317 la necesita.

## Línea de tiempo sugerida entre repositorios

```
Backend : B201 B206 B202 B203 B204 B205 │ B301 … B307 B317 B319 B320 B321 │ B308 B309 B310 B311 B312 B324
Frontend:            F201 F202 ─────────────────────────── F203 F204 F205 F206 │ F301 F302 F303 F313 ─ F304 F305 F306 F307 F308 ─ F314 F316 F320 F321 F315 F318 F317 ─ F309 F310 F311 F312
```

> Siguiente HU del frontend: **HU-F-320** (después de HU-F-314 y HU-F-316).

## Fase 4 · Cuentas y comunicación

Decisiones compartidas con el backend (correo por Gmail SMTP, códigos propios, reglas de
mensajería y videos): `SIPE-SOUND-BACKEND/docs/fase-4-cuentas-y-comunicacion/00-decisiones-fase-4.md`.
Cada HU se despliega **después** de su HU de backend.

| Orden | HU | Pts | Depende de | Estado |
|---|---|---|---|---|
| 1 | [HU-F-401 Verificar el correo con código](fase-4-cuentas-y-comunicacion/HU-F-401-verificacion-de-correo.md) | 5 | F-313, F-207, **B-402** | 🔍 |
| 2 | [HU-F-402 Recuperar la contraseña](fase-4-cuentas-y-comunicacion/HU-F-402-recuperar-contrasena.md) | 3 | F-401, **B-403** | 🔍 |
| 3 | [HU-F-403 Mi cuenta: nombre, correo y contraseña](fase-4-cuentas-y-comunicacion/HU-F-403-mi-cuenta.md) | 5 | F-402, **B-404**, **B-407** | 🔍 |
| 4 | [HU-F-404 Admin: usuarios](fase-4-cuentas-y-comunicacion/HU-F-404-admin-usuarios.md) | 8 | F-313, F-403, **B-405**, **B-407** | 🔍 |
| 5 | [HU-F-405 Admin: docentes, cursos y accesos](fase-4-cuentas-y-comunicacion/HU-F-405-admin-docentes-y-cursos.md) | 5 | F-404, **B-406** | ⬜ |
| 6 | [HU-F-406 Panel de progreso del docente](fase-4-cuentas-y-comunicacion/HU-F-406-panel-de-progreso-docente.md) | 5 | F-309, **B-408** | ⬜ |
| 7 | [HU-F-407 Mensajes: bandeja, hilos y avisos](fase-4-cuentas-y-comunicacion/HU-F-407-mensajeria-interna.md) | 8 | F-318, F-403, **B-409** | ⬜ |
| 8 | [HU-F-408 Video guía de YouTube embebido](fase-4-cuentas-y-comunicacion/HU-F-408-videos-guia.md) | 5 | F-305, F-308, F-312, **B-410** | ⬜ |

```
Backend : B401 B402 B403 B404 B407 B405 B406 │ B408 B409 B410
Frontend:       F401 F402 ─── F403 ─ F404 F405 │ F406 F407 F408
```
