# 01 · Contrato de trabajo para IA generativa (Frontend)

> Documento **vinculante** para cualquier agente (Claude Code, Copilot, Cursor,
> ChatGPT, v0, etc.) que genere código o diseño en este repositorio.
> Punto de entrada: [`AGENTS.md`](../../AGENTS.md).

## 1. Orden de lectura obligatorio

1. [`00-vision/proyecto.md`](../00-vision/proyecto.md)
2. Este documento.
3. [`02-arquitectura-frontend.md`](02-arquitectura-frontend.md)
4. [`03-estandares-codigo.md`](03-estandares-codigo.md)
5. [`04-consumo-api.md`](04-consumo-api.md)
6. [`05-sistema-de-diseno.md`](05-sistema-de-diseno.md) — **obligatorio** si la HU toca algo visible.
7. La HU completa y sus dependencias.

Si la HU contradice el contrato, **gana el contrato** y el agente lo reporta.

## 2. Reglas de ejecución

| # | Regla |
|---|---|
| R1 | **Una HU = una rama = un PR.** Rama: `hu/HU-F-XXX-descripcion-corta`. |
| R2 | **Alcance cerrado.** Lo que se encuentre fuera de la HU va a *Hallazgos* del PR. |
| R3 | **Dependencias primero**, incluidas las HU de backend que la HU nombre. |
| R4 | **Sin dependencias npm no autorizadas.** Solo las que nombra la HU. Versiones exactas fijadas en `package.json` por `npm install --save-exact`. |
| R5 | **Fase 2 = refactor sin cambio visual ni funcional.** Capturas antes/después en el PR. |
| R6 | **Nada de UI genérica de IA.** Antes de entregar una pantalla, el agente revisa la lista de anti-patrones de [`05-sistema-de-diseno.md` §6](05-sistema-de-diseno.md#6-anti-patrones-prohibidos-matices-genéricos-de-ia) y declara en el PR que no usó ninguno. |
| R7 | **Colores solo desde tokens.** Prohibido escribir hex (`#7C3AED`) o clases arbitrarias (`bg-[#...]`) en componentes. |
| R8 | **El frontend no consulta tablas.** Supabase se usa solo para autenticación; los datos vienen del backend. |
| R9 | **Secretos.** Solo variables `VITE_*` públicas por diseño (URL y *anon key*). Nunca la *service role key*. Nunca se lee ni se muestra `.env`. |
| R10 | **Sin pruebas unitarias en esta etapa** (decisión del equipo). El código debe ser testeable: lógica en hooks/funciones puras, componentes presentacionales. |
| R11 | **Verificación manual obligatoria** en navegador (escritorio 1280 px y móvil 375 px) con captura en el PR. |
| R12 | **Idioma**: textos de interfaz, comentarios, docs y commits en español. Interfaz con tildes y ñ correctas. |
| R13 | **Ambigüedad = pregunta.** Especialmente en decisiones visuales: proponer, no imponer. |

## 3. Flujo por HU

```
leer contrato → leer HU (+ HU backend relacionada) → crear rama
  → implementar paso a paso (commits pequeños)
  → npm run lint && npm run build
  → verificación manual en 1280 px y 375 px (teclado incluido)
  → PR con la plantilla
```

## 4. Plantilla de entrega (cuerpo del PR)

```markdown
## HU-F-XXX · <título>

### Resumen
### Archivos (creados / movidos origen → destino / modificados / eliminados)
### Capturas (antes / después, escritorio y móvil)
### Verificación manual
### Checklist DoD
- [ ] npm run lint sin errores
- [ ] npm run build sin advertencias nuevas
- [ ] Sin hex ni clases arbitrarias de color
- [ ] Revisé los anti-patrones de diseño: ninguno presente
- [ ] Navegable con teclado y foco visible
- [ ] Criterios de aceptación cumplidos uno por uno
### Hallazgos fuera de alcance
```

## 5. Commits

```
feat(docente): tabla de estudiantes con avance por curso [HU-F-309]
refactor(shared): mover Button a shared/ui [HU-F-202]
style(ruta): aplicar tokens de traste y cuerda [HU-F-304]
```

## 6. Prompt base para iniciar una HU

```text
Eres un desarrollador frontend senior (React + Vite + Tailwind) en el
repositorio SIPE-SOUND-FULLSTACK, frontend de una plataforma para aprender
guitarra. Lee AGENTS.md y todos los documentos de docs/fase-1-contrato/
antes de empezar; el sistema de diseño es obligatorio. Ejecuta la historia
docs/<fase>/HU-F-XXX-*.md paso a paso respetando su alcance. No escribas
pruebas unitarias. Al terminar entrega el cuerpo del PR con la plantilla
de la sección 4 del contrato de IA.
```

## 7. Prompt adicional para HU visuales

Añadir al prompt base cuando la HU es de la Fase 3:

```text
Antes de escribir JSX, describe en 5–8 viñetas la composición de la pantalla
(retícula, jerarquía, qué metáfora musical del sistema de diseño usas y por
qué). Espera mi confirmación. Luego implementa usando solo componentes de
src/shared/ui y tokens. Prohibido: degradados, blobs difuminados,
glassmorphism, grillas de tarjetas con ícono en círculo, emojis, textos de
marketing genéricos.
```
