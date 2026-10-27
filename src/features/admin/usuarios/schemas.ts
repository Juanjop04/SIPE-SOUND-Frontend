import { z } from "zod";
import { email, nombrePersona } from "@/shared/validacion";

// Panel de edición de una cuenta: los tres campos son obligatorios (HU-B-521).
export const esquemaEdicionCuenta = z.object({
  nombre: nombrePersona(),
  apellido: nombrePersona(),
  email: email(),
});
export type DatosEdicionCuenta = z.output<typeof esquemaEdicionCuenta>;
