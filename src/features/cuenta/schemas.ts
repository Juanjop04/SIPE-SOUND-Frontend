import { z } from "zod";
import {
  codigoVerificacion,
  email,
  nombrePersona,
  nombrePersonaOpcional,
  password,
  passwordActual,
  texto,
} from "@/shared/validacion";

// El apellido es opcional en las cuentas anteriores a HU-B-407: vacío no se envía.
export const esquemaDatosPersonales = z.object({
  nombre: nombrePersona(),
  apellido: nombrePersonaOpcional(),
});
export type EntradaDatosPersonales = z.input<typeof esquemaDatosPersonales>;
export type DatosPersonales = z.output<typeof esquemaDatosPersonales>;

// El backend acepta 1 a 4000; pedimos un poco más para que el aviso sea útil al administrador.
export const esquemaSolicitudNombre = z.object({ cuerpo: texto(10, 500) });
export type DatosSolicitudNombre = z.output<typeof esquemaSolicitudNombre>;

export const esquemaContrasenaActual = z.object({ password_actual: passwordActual() });
export type DatosContrasenaActual = z.output<typeof esquemaContrasenaActual>;

export const esquemaCodigo = z.object({ codigo: codigoVerificacion() });
export type EntradaCodigo = z.input<typeof esquemaCodigo>;
export type DatosCodigo = z.output<typeof esquemaCodigo>;

export const esquemaCorreoNuevo = z.object({ email: email() });
export type DatosCorreoNuevo = z.output<typeof esquemaCorreoNuevo>;

export const esquemaContrasenaNueva = z
  .object({
    password: password(),
    // Solo en el frontend: no se envía al backend.
    confirmar: z.string(),
  })
  .refine((datos) => datos.confirmar === datos.password, {
    path: ["confirmar"],
    message: "Las contraseñas no coinciden.",
  });
export type EntradaContrasenaNueva = z.input<typeof esquemaContrasenaNueva>;
export type DatosContrasenaNueva = z.output<typeof esquemaContrasenaNueva>;
