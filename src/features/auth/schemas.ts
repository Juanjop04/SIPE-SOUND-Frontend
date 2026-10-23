import { z } from "zod";
import {
  LIMITES,
  aceptaTerminos,
  email,
  nombrePersona,
  password,
  passwordActual,
} from "@/shared/validacion";

export const esquemaLogin = z.object({
  email: email(),
  password: passwordActual(),
});
export type DatosLogin = z.infer<typeof esquemaLogin>;

export const esquemaRegistro = z
  .object({
    nombre: nombrePersona(),
    email: email(),
    password: password(),
    // Solo en el frontend: no se envía al backend.
    confirmar: z.string(),
    acepta_terminos: aceptaTerminos(),
  })
  .refine((datos) => datos.confirmar === datos.password, {
    path: ["confirmar"],
    message: "Las contraseñas no coinciden.",
  });
export type EntradaRegistro = z.input<typeof esquemaRegistro>;
export type DatosRegistroFormulario = z.output<typeof esquemaRegistro>;

const { min: PASSWORD_MIN, max: PASSWORD_MAX } = LIMITES.password;

/** Requisitos visibles de la contraseña nueva (se marcan al cumplirse). */
export const REQUISITOS_PASSWORD = [
  {
    id: "largo",
    texto: `${PASSWORD_MIN} a ${PASSWORD_MAX} caracteres`,
    cumple: (p: string) => p.length >= PASSWORD_MIN && p.length <= PASSWORD_MAX,
  },
  { id: "letra", texto: "Una letra", cumple: (p: string) => /[A-Za-z]/.test(p) },
  { id: "numero", texto: "Un número", cumple: (p: string) => /\d/.test(p) },
] as const;
