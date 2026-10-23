// Constructores de Zod por tipo de dato (contrato 08 §2). Los mensajes son los mismos que
// devuelve la API cuando existen. Cada feature arma su esquema en features/<f>/schemas.ts.
import { z } from "zod";
import { LIMITES } from "./limites";

const minimo = (n: number) => `Debe tener al menos ${n} caracteres.`;
const maximo = (n: number) => `Debe tener como máximo ${n} caracteres.`;

// Nombre de persona (igual que la API): grupos de letras (con tildes y ñ) separados por espacio,
// apóstrofo, punto o guion, y un punto final opcional: "Ana María", "O'Neil", "José-Luis.".
// Se valida por pasos sin cuantificadores anidados (evita backtracking exponencial).
const SOLO_LETRAS_Y_SEPARADORES = /^[\p{L} '.-]+$/u;
const ES_LETRA = /^\p{L}$/u;

function esNombreValido(nombre: string): boolean {
  if (!SOLO_LETRAS_Y_SEPARADORES.test(nombre) || !ES_LETRA.test(nombre[0] ?? "")) return false;
  const ultimo = nombre.at(-1) ?? "";
  if (ES_LETRA.test(ultimo)) return true;
  return ultimo === "." && ES_LETRA.test(nombre.at(-2) ?? "");
}
// Igual que la API (^[^@\s]+@[^@\s]+\.[^@\s]+$): algo@algo.algo, sin espacios.
// Sin regex con grupos que se solapan: evita backtracking cuadrático.
const ESPACIO = /\s/;

function esEmailValido(correo: string): boolean {
  const partes = correo.split("@");
  if (partes.length !== 2 || ESPACIO.test(correo)) return false;
  const [usuario, dominio] = partes;
  const punto = dominio.indexOf(".", 1);
  return usuario.length > 0 && punto > 0 && punto < dominio.length - 1;
}
const PATRON_CODIGO = new RegExp(
  `^[${LIMITES.codigoCurso.alfabeto}]{${LIMITES.codigoCurso.largo}}$`,
);

/** Texto obligatorio, recortado antes de medir ("   " cuenta como vacío). */
export const texto = (min: number, max: number) =>
  z.string().trim().min(min, minimo(min)).max(max, maximo(max));

/** Texto opcional: vacío → null. */
export const textoOpcional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, maximo(max))
    .transform((valor) => (valor === "" ? null : valor));

/** Nombre de persona: recorta, colapsa espacios repetidos, 2–80, solo letras y separadores. */
export const nombrePersona = () =>
  z
    .string()
    .transform((valor) => valor.trim().replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(LIMITES.nombrePersona.min, minimo(LIMITES.nombrePersona.min))
        .max(LIMITES.nombrePersona.max, maximo(LIMITES.nombrePersona.max))
        .refine(esNombreValido, "Usa solo letras, espacios, apóstrofo, punto o guion."),
    );

/** Correo: recorta, minúsculas, ≤ 254 y con forma usuario@dominio.tld. */
export const email = () =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Escribe tu correo.")
    .max(LIMITES.email.max, maximo(LIMITES.email.max))
    .refine(esEmailValido, "El correo no es válido.");

/** Contraseña nueva: SIN recortar, 8–72, al menos una letra y un número. */
export const password = () =>
  z
    .string()
    .min(LIMITES.password.min, minimo(LIMITES.password.min))
    .max(LIMITES.password.max, maximo(LIMITES.password.max))
    .regex(/[A-Za-z]/, "La contraseña debe tener letras y números.")
    .regex(/\d/, "La contraseña debe tener letras y números.");

/** Contraseña al iniciar sesión: 1–72 (sin mínimo: cuentas antiguas). */
export const passwordActual = () =>
  z
    .string()
    .min(1, "Escribe tu contraseña.")
    .max(LIMITES.password.max, maximo(LIMITES.password.max));

/** Código de curso: recorta, mayúsculas, 8 caracteres del alfabeto sin 0, O, 1, I ni L. */
export const codigoCurso = () =>
  z
    .string()
    .trim()
    .toUpperCase()
    .regex(PATRON_CODIGO, "El código solo tiene letras y números (sin 0, O, 1, I ni L).");

/** Entero en un rango (BPM, duración…). Acepta el texto del input y lo convierte. */
export const entero = (min: number, max: number) =>
  z.coerce
    .number({ error: "Debe ser un número entero." })
    .int("Debe ser un número entero.")
    .min(min, `Debe estar entre ${min} y ${max}.`)
    .max(max, `Debe estar entre ${min} y ${max}.`);

/** Lista con máximo de elementos (acordes, temas, pasos), cada uno con su propio esquema. */
export const lista = <T extends z.ZodType>(elemento: T, maximoElementos: number) =>
  z.array(elemento).max(maximoElementos, `Puedes agregar como máximo ${maximoElementos}.`);

/** Casilla obligatoria de términos (contrato 08 §2). Boolean que debe ser true: la casilla
 *  empieza desmarcada (false) y React Hook Form necesita ese tipo en los valores iniciales. */
export const aceptaTerminos = () =>
  z
    .boolean()
    .refine((marcada) => marcada, { message: "Debes aceptar los términos y condiciones." });

/** Entero opcional: el input vacío ("") se envía como null. */
export const enteroOpcional = (min: number, max: number) =>
  z.union([z.literal(""), entero(min, max)]).transform((valor) => (valor === "" ? null : valor));

/** Título o nombre de contenido (3–120) sin < ni >, igual que la API (HU-B-309). */
export const tituloContenido = () =>
  texto(LIMITES.titulo.min, LIMITES.titulo.max).refine(
    (valor) => !valor.includes("<") && !valor.includes(">"),
    "No se permiten los caracteres < ni >.",
  );

/** Lista de textos de 1–`largo` caracteres, máximo `maximo`, sin repetidos (sin importar mayúsculas). */
export const listaDeTextos = (largo: number, maximo: number) =>
  lista(texto(1, largo), maximo).refine(
    (valores) => new Set(valores.map((v) => v.toLowerCase())).size === valores.length,
    "Hay elementos repetidos.",
  );
