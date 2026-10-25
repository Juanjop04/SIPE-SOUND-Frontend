# HU-F-401 · Verificar el correo con el código de 6 dígitos

| Campo | Valor |
|---|---|
| Fase | 4 · Cuentas y comunicación |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-313, HU-F-207, **HU-B-402** |
| Rama | `hu/HU-F-401-verificacion-de-correo` |
| Referencia | `SIPE-SOUND-BACKEND/docs/fase-4-cuentas-y-comunicacion/00-decisiones-fase-4.md` |

## Historia
**Como** persona que acaba de registrarse
**quiero** escribir el código que me llegó al correo en la misma página
**para** empezar a practicar sin buscar un enlace ni cambiar de dispositivo.

## Contexto
- Tras registrarse, `src/features/auth/components/ExitoRegistro.tsx` dice "Abre el enlace del mensaje".
- `src/features/auth/pages/LoginPage.tsx` muestra el 422 "Aún no confirmas tu correo…" sin salida.
- Desde HU-B-402 el backend envía un código de 6 dígitos (15 min, un solo uso) y expone
  `POST /auth/verificacion` y `POST /auth/verificacion/reenviar`.

## Alcance
**Incluye**
1. Página `/verificar` (`paths.verificar`) en `AuthLayout`: correo (precargado desde el registro o el
   inicio de sesión vía `state` de navegación, editable) + código.
2. `ExitoRegistro` lleva a `/verificar` con el correo; el texto cambia a "Te enviamos un código de
   6 dígitos a **correo**. Vence en 15 minutos."
3. En `LoginPage`, un 422 con `meta.requiere_verificacion` muestra el mensaje y el enlace
   "Escribir el código" → `/verificar` con el correo.
4. "Enviar otro código": deshabilitado 60 s con cuenta regresiva en mono ("Puedes pedir otro en 0:42");
   la respuesta siempre es la misma (no revela si la cuenta existe).
5. Éxito: "Listo, tu correo quedó confirmado." y botón primario "Iniciar sesión" (con el correo precargado).
6. `authApi.ts`: `verificarCorreo`, `reenviarCodigo`. `LIMITES.CODIGO_VERIFICACION = 6` en
   `src/shared/validacion/limites.ts` y constructor `codigoVerificacion` en `campos.ts`.
7. Contrato 04-consumo-api y 08-validación (tipo "Código de verificación").

**No incluye**
- Recuperar contraseña (HU-F-402).

## Diseño
- **Composición**: la misma tarjeta de `AuthLayout` que el registro (una columna, ancho de lectura).
  Título "Confirma tu correo", línea con el correo en mono, campo del código y botón primario
  "Confirmar". Debajo, en texto secundario, el reenvío y "¿Correo equivocado? Regístrate de nuevo".
- **Campo del código**: **un solo** `<input>` (no seis cajas: rompe pegar, lectores de pantalla y
  autocompletar), `inputMode="numeric"`, `autoComplete="one-time-code"`, `maxLength={6}`,
  fuente mono 24 px con `tracking-widest` (utilidad de Tailwind, sin valores arbitrarios).
  Acepta pegar "482 913" o "482913" (se quitan espacios).
- **Metáfora**: ninguna decorativa; la página es una herramienta. Sin ilustraciones nuevas.
- **Estados**: carga (botón "Confirmando…" deshabilitado), error (mensaje del backend bajo el campo,
  `aria-invalid`, foco al campo), vacío (no aplica), éxito (`role="status"`).

## Prompt de ejecución
```text
Ejecuta HU-F-401 en SIPE-SOUND-FULLSTACK. Agrega /verificar para escribir el código de 6 dígitos
(POST /auth/verificacion) y reenviarlo (POST /auth/verificacion/reenviar, botón bloqueado 60 s).
Conecta el éxito del registro y el 422 con meta.requiere_verificacion del inicio de sesión a esa
página. Un solo input con autoComplete="one-time-code" e inputMode="numeric". Solo tokens, solo
componentes de src/shared/ui, Zod + React Hook Form según 08-validacion-de-formularios.md. fetch
solo en httpClient; mutaciones con TanStack Query. Sin pruebas unitarias.
```

## Pasos
1. `paths.verificar`, ruta en `src/app/router/router.jsx` (lazy).
2. API, esquema y hook `useVerificarCorreo`.
3. Página y cambios en `ExitoRegistro` y `LoginPage`.
4. Documentos de contrato.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Del registro al código
  Dado que me registro
  Entonces veo "Te enviamos un código de 6 dígitos a ana@colegio.edu.co"
  Cuando escribo el código y pulso Confirmar
  Entonces veo "Listo, tu correo quedó confirmado." y el botón Iniciar sesión

Escenario: Pegar el código
  Cuando pego "482 913" en el campo
  Entonces el campo queda con "482913"

Escenario: Código vencido
  Cuando envío un código vencido
  Entonces veo bajo el campo "El código no es válido o ya venció. Pide uno nuevo."

Escenario: Reenvío
  Cuando pulso "Enviar otro código"
  Entonces el botón queda deshabilitado 60 segundos con la cuenta regresiva

Escenario: Desde el inicio de sesión
  Dado una cuenta sin verificar
  Cuando intento iniciar sesión
  Entonces veo el enlace "Escribir el código" que abre /verificar con mi correo
```

## Verificación manual
- Flujo completo con el backend en `CORREO_MODO=archivo` (código leído del `.eml`).
- Celular real o emulador: el teclado numérico aparece y iOS ofrece el código desde Mail.
- Teclado: Tab llega a todo, Enter envía; lector de pantalla anuncia el error.
- Capturas en 1280 px y 375 px.

## Definición de hecho específica
- [ ] Desplegada después de HU-B-402.
- [ ] Sin `tracking-[…]` ni ninguna clase arbitraria.
