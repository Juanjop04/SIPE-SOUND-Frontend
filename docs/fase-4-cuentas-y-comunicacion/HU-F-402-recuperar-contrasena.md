# HU-F-402 · Recuperar la contraseña

| Campo | Valor |
|---|---|
| Fase | 4 · Cuentas y comunicación |
| Prioridad | Must |
| Estimación | 3 puntos |
| Depende de | HU-F-401, **HU-B-403** |
| Rama | `hu/HU-F-402-recuperar-contrasena` |

## Historia
**Como** estudiante o docente que olvidó su contraseña
**quiero** pedir un enlace desde el inicio de sesión y elegir una contraseña nueva
**para** volver a practicar sin depender del docente ni del administrador.

## Contexto
- `LoginPage.tsx` no tiene "¿Olvidaste tu contraseña?".
- HU-B-403 expone `POST /auth/contrasena/olvido` y `POST /auth/contrasena/restablecer`.
  El enlace del correo es `/restablecer#token=…` y vence en 15 minutos; sirve una sola vez.

## Alcance
**Incluye**
1. Enlace "¿Olvidaste tu contraseña?" en `LoginPage`, junto al campo de contraseña.
2. `/recuperar` (`paths.recuperar`): campo de correo → siempre el mismo mensaje
   "Si el correo tiene una cuenta, te enviamos un enlace. Vence en 15 minutos." Botón bloqueado 120 s.
3. `/restablecer` (`paths.restablecer`):
   - Lee `token` del **fragmento** (`location.hash`), lo guarda en memoria y lo **borra** de la barra de
     direcciones con `history.replaceState` antes del primer render del formulario.
   - `<meta name="referrer" content="no-referrer">` mientras la página está montada.
   - `CamposPassword` (componente existente) con requisitos visibles y confirmación.
   - Éxito: "Listo. Ya puedes iniciar sesión con tu contraseña nueva." + botón "Iniciar sesión".
   - Token usado o vencido: estado de error con "El enlace ya se usó o venció." y botón "Pedir otro enlace".
   - Sin token: mismo estado de error.
4. `authApi.ts`: `pedirRecuperacion`, `restablecerContrasena`.
5. Contrato 04-consumo-api.

**No incluye**
- Cambiar la contraseña con sesión iniciada (HU-F-403).

## Diseño
- Las dos páginas usan la tarjeta de `AuthLayout`, título alineado a la izquierda, un único botón primario.
- Voz concreta: "Escribe el correo con el que te registraste." / "Elige una contraseña nueva."
- Estados: carga ("Enviando…"), error (mensaje + acción), vacío (sin token = error), éxito (`role="status"`).

## Prompt de ejecución
```text
Ejecuta HU-F-402 en SIPE-SOUND-FULLSTACK. Agrega /recuperar (pedir enlace, respuesta siempre
igual) y /restablecer (token leído de location.hash, borrado de la URL con history.replaceState,
referrer no-referrer, CamposPassword existente). Mensajes del backend tal cual. Solo tokens y
src/shared/ui; Zod + React Hook Form; TanStack Query para las mutaciones. Nunca guardes el token
en localStorage, sessionStorage, la URL ni los logs.
```

## Pasos
1. Rutas y `paths`.
2. API, esquemas y hooks.
3. Páginas y enlace en `LoginPage`.
4. Contrato.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Pedir el enlace
  Cuando escribo mi correo en /recuperar y pulso Enviar
  Entonces veo "Si el correo tiene una cuenta, te enviamos un enlace. Vence en 15 minutos."

Escenario: Restablecer
  Dado que abro el enlace del correo
  Entonces la barra de direcciones muestra /restablecer sin el token
  Cuando escribo y confirmo una contraseña válida
  Entonces veo "Listo. Ya puedes iniciar sesión con tu contraseña nueva."

Escenario: Enlace reutilizado
  Cuando abro el mismo enlace por segunda vez y envío una contraseña
  Entonces veo "El enlace ya se usó o venció." y el botón "Pedir otro enlace"
```

## Verificación manual
- Flujo completo con `CORREO_MODO=archivo`; comprobar en DevTools → Network que ninguna petición
  lleva el token en la URL ni en `Referer`.
- Teclado y lector de pantalla; capturas en 1280 px y 375 px.

## Definición de hecho específica
- [ ] `grep -rn "localStorage\|sessionStorage" src/features/auth` no incluye el token.
- [ ] Desplegada después de HU-B-403.
