# HU-F-510 · Términos y condiciones editables y aceptación obligatoria

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 8 puntos |
| Depende de | HU-B-411, HU-F-313 |
| Rama | `hu/HU-F-510-terminos-editables` |

## Historia
**Como** administrador
**quiero** editar los términos y condiciones con un lector Markdown y exigir que todos acepten una versión nueva
**para** mantener el consentimiento vigente sin publicar código.

## Alcance
**Incluye**
1. **Editor del administrador** (`/admin/terminos`, entrada "Términos" del atril): texto Markdown a
   la izquierda y vista previa a la derecha; "Versión N · Modificado por X el …".
2. Casilla "Es una versión nueva: todas las cuentas deberán leerla y aceptarla". Con ella, "Publicar
   versión nueva" pide confirmación; sin ella, "Guardar corrección" no pide nada.
3. **Página pública** `/terminos`: lee `GET /terminos` y muestra el Markdown, con su versión y fecha.
   Se retira el texto fijo del código.
4. **Aceptación obligatoria** (`/aceptar-terminos`): con `terminos_pendientes` en `GET /me`, toda
   ruta redirige ahí; se lee el texto completo, se marca "Leí… y los acepto" y se pulsa "Aceptar y
   continuar" (o "Cerrar sesión"). Tras aceptar vuelve a donde iba (`?volver=`, solo rutas internas).
5. **Lector Markdown seguro** (`shared/ui/Markdown`): construye elementos de React, nunca HTML;
   admite títulos, listas, citas, separador, negrita, cursiva, código y enlaces `https`, `mailto` o
   internos (un `javascript:` queda como texto).

**No incluye**
- Historial de versiones ni exportar el texto.
- Editor con barra de herramientas (solo Markdown escrito).

## Diseño
- **Composición**: editor y vista previa en dos columnas (una sola en móvil); la aceptación es una
  columna de lectura ≤ 68 caracteres, sin menú, con el texto en un recuadro con scroll.
- **Estados**: carga (esqueleto), error (`MensajeError` con reintentar), botón "Aceptar" deshabilitado
  hasta marcar la casilla, 409 si la versión cambió mientras se leía.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Versión nueva
  Dado que el administrador publica una versión nueva
  Cuando una persona inicia sesión
  Entonces ve la pantalla "Actualizamos los términos y condiciones" y no puede entrar a nada más

Escenario: Aceptar
  Cuando marca la casilla y pulsa "Aceptar y continuar"
  Entonces vuelve a la página a la que iba

Escenario: Texto malicioso
  Dado un texto con <script> o [x](javascript:alert(1))
  Entonces se muestra como texto y no se ejecuta nada

Escenario: Corrección menor
  Cuando el administrador guarda sin marcar "versión nueva"
  Entonces nadie tiene que volver a aceptar
```

## Definición de hecho específica
- [ ] Probado con HU-B-411 aplicada (`uv run alembic upgrade head`).
- [ ] Revisé 05 §6: ninguno de los anti-patrones presente.
