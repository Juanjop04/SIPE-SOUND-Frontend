import { z } from "zod";
import { LIMITES, texto } from "@/shared/validacion";

const { asunto, cuerpoMensaje } = LIMITES;

export const esquemaRedactar = z.object({
  /** "usuario:<id>", "curso:<id>" o "grupo:<alcance>": viene del selector. */
  destino: z.string().min(1, "Elige a quién le escribes."),
  asunto: texto(asunto.min, asunto.max),
  cuerpo: texto(cuerpoMensaje.min, cuerpoMensaje.max),
});
export type DatosRedactar = z.output<typeof esquemaRedactar>;

export const esquemaRespuesta = z.object({ cuerpo: texto(cuerpoMensaje.min, cuerpoMensaje.max) });
export type DatosRespuesta = z.output<typeof esquemaRespuesta>;
