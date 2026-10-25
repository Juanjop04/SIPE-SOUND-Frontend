# HU-F-403 · Mi cuenta: nombre, correo y contraseña

| Campo | Valor |
|---|---|
| Fase | 4 · Cuentas y comunicación |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-402, **HU-B-404**, **HU-B-407** |
| Rama | `hu/HU-F-403-mi-cuenta` |

## Historia
**Como** estudiante o docente
**quiero** una página con mis datos donde cambiar mi correo y mi contraseña confirmando que soy yo, y mi nombre si el administrador lo permite
**para** mantener mi cuenta al día sin pedirle nada a nadie.

## Contexto
- No hay página de perfil; `MenuCuenta.tsx` (estudiante) y `PanelAtril.tsx` (docente/admin) solo
  muestran el nombre y "Cerrar sesión".
- El contrato 05 §6 prohíbe enlazar "Perfil" hasta que exista su HU: esta es esa HU.
- `GET /me` trae `email`, `correo_verificado_en`, `apellido` y `puede_editar_nombre` (B-404, B-407).

## Alcance
**Incluye**
1. Página `/cuenta` (`paths.cuenta`), dentro de `RequireAuth`, con el layout del rol (estudiante:
   `EstudianteLayout`; docente/admin: `DocenteLayout`). Enlace "Mi cuenta" en `MenuCuenta` y `PanelAtril`.
2. Sección **Datos personales**: nombre y apellido.
   - Con `puede_editar_nombre`: campos editables (reglas de nombre de persona, 08 §2) y botón "Guardar".
   - Sin permiso: texto de solo lectura + "Para cambiar tu nombre, pídele al administrador que lo habilite."
   - Al guardar se invalida la consulta de `/me` (el nombre cambia en el menú sin recargar).
3. Sección **Correo**: correo actual en mono y botón "Cambiar correo".
4. Sección **Contraseña**: botón "Cambiar contraseña".
5. **Confirmar identidad** (compartido por 3 y 4), en un `Dialog` de pasos:
   1. "Escribe tu contraseña actual" → `POST /me/reautenticacion`.
   2. "Escribe el código que enviamos a a***@colegio.edu.co" → `POST /me/reautenticacion/confirmar`
      (mismo campo de código de HU-F-401, extraído a `src/features/auth/components/CampoCodigo.tsx`).
   3. Según el caso:
      - Contraseña: `CamposPassword` → `PATCH /me/contrasena` → "Tu contraseña cambió. Cerramos tus otras sesiones."
      - Correo: nuevo correo → `POST /me/correo` → código enviado al nuevo → `POST /me/correo/confirmar`
        → "Tu correo ahora es nuevo@correo.co."
   - El `token_reautenticacion` vive solo en el estado del diálogo; se descarta al cerrarlo.
   - Si vence (5 min) o el backend responde 422, el diálogo vuelve al paso 1 con
     "Vuelve a confirmar tu identidad."
6. API en `src/features/cuenta/` (feature nueva con `index.ts`); constructores de validación reutilizados.
7. Contrato 04-consumo-api, 08-validación (`apellido`) y enmienda de 05 §6 (Perfil ya existe).

**No incluye**
- Foto de perfil, nivel, preferencias.
- Panel del admin para dar el permiso (HU-F-404).

## Diseño
- **Composición**: una columna de lectura (≤ 68 caracteres), tres secciones separadas por
  `TrasteDivider`, cada una con título `font-display` 20 px a la izquierda y la acción a la derecha
  en escritorio (debajo en móvil). Un único botón primario por vista: "Guardar" solo aparece si hay
  cambios en datos personales; los demás botones son secundarios.
- **Metáfora**: ninguna decorativa. Datos (correo, fecha de verificación) en mono como `Tablatura`.
- **Estados**: carga (`Skeleton` de tres secciones), error de `/me` (`MensajeError` con reintentar),
  vacío (no aplica), éxito (aviso `role="status"` arriba de la sección afectada).

## Prompt de ejecución
```text
Ejecuta HU-F-403 en SIPE-SOUND-FULLSTACK. Crea la feature cuenta con la página /cuenta: datos
personales (editables solo si /me.puede_editar_nombre), cambiar correo y cambiar contraseña con
un Dialog de confirmación de identidad (contraseña actual → código al correo → cambio). El
token_reautenticacion solo vive en el estado del diálogo. Reutiliza CamposPassword y extrae el
campo de código de HU-F-401 a CampoCodigo. Antes de escribir JSX describe la composición y espera
confirmación (contrato 01 §7). Solo tokens y src/shared/ui. Sin pruebas unitarias.
```

## Pasos
1. Feature `cuenta` (api, hooks, esquemas, página) y `paths.cuenta`.
2. `CampoCodigo` extraído.
3. Diálogo de confirmación de identidad (máquina de pasos en un hook puro).
4. Enlaces en `MenuCuenta` y `PanelAtril`.
5. Documentos.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Nombre bloqueado
  Dado que el admin no habilitó mi cambio de nombre
  Cuando abro Mi cuenta
  Entonces veo mi nombre sin campo editable y el texto "pídele al administrador que lo habilite"

Escenario: Nombre habilitado
  Dado que tengo el permiso
  Cuando cambio mi apellido y pulso Guardar
  Entonces el menú muestra el nombre nuevo sin recargar

Escenario: Cambiar contraseña
  Cuando confirmo mi contraseña actual, escribo el código del correo y elijo una contraseña nueva
  Entonces veo "Tu contraseña cambió. Cerramos tus otras sesiones." y sigo con sesión

Escenario: Contraseña actual equivocada
  Cuando escribo mal mi contraseña actual
  Entonces veo "La contraseña actual no coincide." y no avanzo al código

Escenario: Cambiar correo
  Cuando completo la confirmación de identidad, escribo nuevo@correo.co y el código que llegó allí
  Entonces la sección Correo muestra nuevo@correo.co
```

## Verificación manual
- Los dos flujos completos con `CORREO_MODO=archivo`; luego cerrar sesión y entrar con los datos nuevos.
- Dialog: foco atrapado, Esc cierra, el foco vuelve al botón que lo abrió.
- Capturas en 1280 px y 375 px, tema oscuro y claro.

## Definición de hecho específica
- [ ] Ningún token ni contraseña en `localStorage`, `sessionStorage`, URL o consola.
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
