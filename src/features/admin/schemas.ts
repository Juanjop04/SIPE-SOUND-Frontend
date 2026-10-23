import { z } from "zod";
import { email } from "@/shared/validacion";

export const esquemaPreautorizacion = z.object({ email: email() });
export type DatosPreautorizacion = z.infer<typeof esquemaPreautorizacion>;
