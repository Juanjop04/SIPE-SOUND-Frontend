# HU-F-520 · Confirmar el correo desde el enlace del correo y solo con datos completos

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 2 puntos |
| Depende de | HU-F-401, **HU-B-419** |
| Rama | `hu/HU-F-520-confirmar-correo-con-enlace-del-correo` |

## Historia
**Como** persona que recibió el código de confirmación (por registrarme o porque el administrador me lo envió)
**quiero** abrir la pantalla de confirmación desde el correo con mi correo ya escrito, y que **Confirmar** se active solo cuando tenga todo
**para** no equivocarme ni enviar el formulario vacío.

## Contexto
- `src/features/auth/pages/VerificarPage.tsx`: el botón **Confirmar** está siempre activo y el
  formulario recién valida al enviar. Además el texto dice "Vence en 15 minutos" cuando el código
  vence en 1 minuto (HU-B-416).
- HU-B-419 agrega al correo el botón "Confirmar mi correo" con el enlace `/verificar?email=…`.
- El caso que originó esto: una persona confirmada por el administrador veía "aún no has
  confirmado tu correo" al iniciar sesión (causa en el backend, HU-B-419).

## Alcance
**Incluye**
1. **`/verificar?email=`**: el campo de correo se llena con el parámetro (normalizado en minúsculas
   y recortado) si es un correo válido; si no lo es, se ignora sin mostrar error. El `state` de
   navegación (registro e inicio de sesión) sigue teniendo prioridad.
2. **Confirmar solo habilitado** cuando el correo es válido **y** el código tiene 6 dígitos. Mientras
   no, el botón está desactivado y, con `aria-describedby`, una línea de ayuda dice qué falta
   ("Escribe tu correo y el código de 6 dígitos."). El botón se desactiva también mientras envía.
3. **Texto de vigencia correcto**: "Vence en 1 minuto y solo sirve una vez" (misma fuente que la
   cuenta regresiva de HU-F-401/HU-B-416; sin número mágico repetido).
4. **Foco**: con el correo ya escrito, el foco inicial va al campo del código.
5. **Iniciar sesión**: el aviso "Aún no confirmaste tu correo" con enlace a `/verificar` lleva el
   correo en el `state` (ya lo hacía) y no aparece cuando la cuenta ya está verificada (lo decide
   el backend, HU-B-419).

**No incluye**
- Pegar el código desde el portapapeles ni autoenvío al completar los 6 dígitos.
- Cambios en el correo (HU-B-419).

## Diseño
- Mismo patrón de las pantallas de autenticación; no se agregan componentes.
- Estados: botón desactivado con ayuda, enviando, error del servidor (`MensajeError`), confirmado (`CorreoConfirmado`).

## Prompt de ejecución
```text
Ejecuta HU-F-520 en SIPE-SOUND-FULLSTACK. En VerificarPage lee ?email= (válido y normalizado) para
llenar el correo, deja Confirmar desactivado hasta que haya correo válido y código de 6 dígitos
con una línea de ayuda enlazada por aria-describedby, corrige el texto de vigencia a 1 minuto
usando la constante existente y enfoca el código cuando el correo ya viene escrito. El state de
navegación tiene prioridad sobre el parámetro. Reutiliza useVerificacion
y el esquema zod existente. Solo tokens y src/shared/ui. Sin pruebas unitarias.
```

## Pasos
1. Leer `?email=` en `VerificarPage` / `useVerificacion`.
2. Habilitar el botón con `formState.isValid` del esquema zod (modo `onChange`).
3. Texto de vigencia y foco inicial.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Llegar desde el correo
  Cuando abro /verificar?email=ana@ejemplo.co
  Entonces el correo aparece escrito y el foco queda en el código

Escenario: Botón desactivado
  Dado el formulario con el correo escrito y el código vacío
  Entonces Confirmar está desactivado y la ayuda dice qué falta

Escenario: Botón activado
  Cuando escribo un correo válido y los 6 dígitos
  Entonces Confirmar se activa

Escenario: Parámetro inválido
  Cuando abro /verificar?email=no-es-un-correo
  Entonces el campo queda vacío y no veo ningún error

Escenario: Texto correcto
  Cuando abro la pantalla
  Entonces dice que el código vence en 1 minuto
```

## Verificación manual
- Abrir el enlace del correo que envía el administrador y confirmar con el código.
- Teclado: Tab llega al botón solo cuando está activo; capturas en 375 px.

## Definición de hecho específica
- [ ] `npm run lint`, `npm run typecheck` y `npm run build` en verde.
- [ ] La vigencia del texto sale de la misma constante que usa la cuenta regresiva.
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
