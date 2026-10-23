# 08 · Validación de formularios

> **Fuente de verdad de los límites:** `SIPE-SOUND-BACKEND/docs/fase-1-contrato/04-contrato-api.md` §7.
> Cada límite existe tres veces: en el formulario (este documento), en la API
> (`app/core/longitudes.py`) y en la base (CHECK, revisión `0013`). Si cambia uno,
> cambian los tres en PRs enlazados.

## 1. Reglas

1. **Un solo módulo de límites**: `src/shared/validacion/limites.ts` copia los valores de
   `app/core/longitudes.py` con los mismos nombres. Ningún formulario escribe números sueltos.
2. **Esquemas con Zod + React Hook Form** (`zodResolver`, `mode: "onTouched"`):
   los constructores comunes viven en `src/shared/validacion/campos.ts`
   (`texto`, `textoOpcional`, `nombrePersona`, `email`, `password`, `codigoCurso`,
   `entero`, `lista`); cada feature arma su esquema en `features/<f>/schemas.ts`.
3. **El navegador también limita**: todo `<input>`/`<textarea>` lleva `maxLength`
   (no deja escribir de más) y los atributos de la tabla §2. `required`, `minLength`
   y `pattern` **no** se usan para mostrar mensajes: los mensajes los da Zod, en español.
4. **Se limpia antes de medir**: `trim()` en todo texto excepto contraseñas; los
   nombres de persona además colapsan espacios repetidos. "   " cuenta como vacío.
5. **Mensajes**: debajo del campo, enlazados con `aria-describedby` y `aria-invalid="true"`;
   iguales a los del backend cuando existen ("Debe tener al menos 2 caracteres.").
   Nunca solo color: texto siempre.
6. **Contador** en textos largos (`maxLength ≥ 500`): "1 840 / 2000" en `texto-suave`,
   visible desde el 80 % y anunciado con `aria-live="polite"` al llegar al límite.
7. **Errores del servidor**: en un `ApiError` con `status === "VALIDACION"`, cada entrada de
   `porCampo` va al campo con `setError(campo, { type: "server", message })`; las que no
   tienen campo visible van al resumen del formulario (`role="alert"`).
8. **Sin doble envío**: el botón se deshabilita y muestra "Enviando…" mientras la mutación
   está pendiente. Con `429` queda deshabilitado 60 s.
9. **Campos extra prohibidos**: el formulario envía solo los campos del esquema
   (el backend responde 400 a cualquier campo de más, p. ej. `rol`).
10. **Registro**: va al backend (`POST /auth/registro`, HU-B-322), que valida con los mismos
    límites y llama a Supabase Auth. La base normaliza el nombre y Supabase aplica su política
    de contraseñas.

## 2. Por tipo de dato

| Tipo de dato | Regla Zod | Atributos HTML |
|---|---|---|
| Nombre de persona | `trim`, colapsar espacios, 2–80, `/^[\p{L}]+(?:[ '.\-]+[\p{L}]+)*\.?$/u` → "Usa solo letras, espacios, apóstrofo, punto o guion." | `type="text"` `maxLength={80}` `autoComplete="name"` `autoCapitalize="words"` |
| Correo | `trim`, minúsculas, máx. 254, formato `usuario@dominio.tld` → "El correo no es válido." | `type="email"` `maxLength={254}` `autoComplete="email"` `inputMode="email"` `spellCheck={false}` `autoCapitalize="none"` |
| Contraseña nueva | **sin** `trim`, 8–72, al menos una letra y un número → "La contraseña debe tener letras y números." | `type="password"` (con mostrar/ocultar) `maxLength={72}` `autoComplete="new-password"`; lista de requisitos visible que se marca al cumplirse |
| Confirmar contraseña | igual a la anterior → "Las contraseñas no coinciden." (solo frontend) | igual que la anterior; no se envía al backend |
| Contraseña al iniciar sesión | 1–72 (no se exige el mínimo: cuentas antiguas) | `autoComplete="current-password"` `maxLength={72}` |
| Código de curso | `trim`, mayúsculas, exactamente 8 de `ABCDEFGHJKMNPQRSTUVWXYZ23456789` → "El código solo tiene letras y números (sin 0, O, 1, I ni L)." | `maxLength={8}` `autoComplete="off"` `autoCapitalize="characters"` `spellCheck={false}` fuente mono; se muestra en mayúsculas mientras se escribe |
| Título / nombre de curso, bloque, lección, ejercicio | `trim`, 3–120 | `maxLength={120}` |
| Descripción | `trim`, máx. 2000, opcional (vacío → `null`) | `<textarea maxLength={2000}>` + contador |
| Contenido de lección | máx. 20000 | `<textarea maxLength={20000}>` + contador |
| Mensaje de retroalimentación | `trim`, 1–1000 | `<textarea maxLength={1000}>` + contador |
| Nombre de acorde | `trim`, 1–20 | `maxLength={20}` |
| Descripción de acorde | máx. 500 | `<textarea maxLength={500}>` + contador |
| BPM | entero 20–300 → "Debe estar entre 20 y 300." | `type="number"` `min={20}` `max={300}` `step={1}` `inputMode="numeric"` + botones −/+ |
| Duración (min) | entero 1–600, opcional | `type="number"` `min={1}` `max={600}` `step={1}` `inputMode="numeric"` |
| Compás | `/^(2|3|4|5|6|7|9|12)\/(2|4|8)$/` | `<Select>` con `2/4 3/4 4/4 6/8 12/8` (no texto libre) |
| Nivel | `z.enum(["principiante","intermedio","avanzado"])` | `<Select>` |
| Listas (acordes, temas, pasos) | máx. 24 / 20 / 30 elementos; cada texto con su límite | botón "Agregar" deshabilitado al llegar al máximo, con el motivo visible |
| Aceptar términos | `z.literal(true)` → "Debes aceptar los términos y condiciones." | `type="checkbox"` con enlace a los términos |
| Búsqueda (`?q=`) | `trim`, máx. 80 | `type="search"` `maxLength={80}` |

Los de evaluaciones (título 3–120, enunciado 3–300, 2–6 opciones de 1–120 sin repetidas)
siguen la §7.2 del contrato del backend y se aplican en HU-F-310.

## 3. Formularios de la aplicación

| Formulario | Campos | Endpoint | HU |
|---|---|---|---|
| Iniciar sesión | correo, contraseña | `POST /auth/sesion` | HU-F-313 |
| Registro (estudiantes y docentes preautorizados) | nombre, correo, contraseña, confirmar, términos | `POST /auth/registro` (`acepta_terminos` pendiente en el backend, ver HU-B-322) | HU-F-313 |
| Preautorizar docente (admin) | correo | `POST /admin/docentes/preautorizaciones` | HU-F-313 |
| Metrónomo / avance de ejercicio | BPM | `PUT /progreso/ejercicios/{id}` (`mejor_bpm`) | HU-F-305 |
| Curso nuevo / ajustes | nombre, descripción, nivel | `/docente/cursos` | HU-F-307 |
| Lección / ejercicio | título, descripción, contenido, nivel, duración, BPM, compás, listas | `/docente/lecciones`, `/docente/ejercicios` | HU-F-308 |
| Comentario al estudiante | mensaje | `/docente/.../retroalimentaciones` | HU-F-309 |
| Evaluación | título, preguntas, opciones | `/docente/evaluaciones` | HU-F-310 |
| Unirse a un curso | código | `POST /cursos/unirse` | HU-F-311 |

## 4. Referencia

```ts
// src/shared/validacion/limites.ts — espejo de app/core/longitudes.py
export const LIMITES = {
  nombrePersona: { min: 2, max: 80 },
  email: { max: 254 },
  password: { min: 8, max: 72 },
  titulo: { min: 3, max: 120 },
  descripcion: { max: 2000 },
  contenidoLeccion: { max: 20000 },
  mensajeRetroalimentacion: { min: 1, max: 1000 },
  nombreAcorde: { min: 1, max: 20 },
  descripcionAcorde: { max: 500 },
  bpm: { min: 20, max: 300 },
  duracionMin: { min: 1, max: 600 },
  codigoCurso: { largo: 8, alfabeto: "ABCDEFGHJKMNPQRSTUVWXYZ23456789" },
  maximoAcordes: 24,
  maximoTemas: 20,
  maximoPasos: 30,
} as const;
```

```ts
// src/shared/validacion/campos.ts (extracto)
export const texto = (min: number, max: number) =>
  z.string().trim()
    .min(min, `Debe tener al menos ${min} caracteres.`)
    .max(max, `Debe tener como máximo ${max} caracteres.`);

export const textoOpcional = (max: number) =>
  z.string().trim().max(max, `Debe tener como máximo ${max} caracteres.`)
    .transform((v) => (v === "" ? null : v));

export const entero = (min: number, max: number) =>
  z.coerce.number({ invalid_type_error: "Debe ser un número entero." })
    .int("Debe ser un número entero.")
    .min(min, `Debe estar entre ${min} y ${max}.`)
    .max(max, `Debe estar entre ${min} y ${max}.`);
```
