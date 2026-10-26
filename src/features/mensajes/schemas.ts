import { z } from "zod";
import { LIMITES, texto } from "@/shared/validacion";

const { cuerpoMensaje } = LIMITES;

export const esquemaRespuesta = z.object({ cuerpo: texto(cuerpoMensaje.min, cuerpoMensaje.max) });
export type DatosRespuesta = z.output<typeof esquemaRespuesta>;
