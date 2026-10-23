import { z } from "zod";
import { LIMITES, texto, textoOpcional } from "@/shared/validacion";

export const NIVELES = ["principiante", "intermedio", "avanzado"] as const;

/** Curso nuevo o ajustes (contrato 08): nombre 3–120, descripción ≤ 2000, nivel de la lista. */
export const esquemaCurso = z.object({
  nombre: texto(LIMITES.titulo.min, LIMITES.titulo.max),
  descripcion: textoOpcional(LIMITES.descripcion.max),
  nivel: z.enum(NIVELES, { error: "Elige un nivel de la lista." }),
});

export type EntradaCurso = z.input<typeof esquemaCurso>;
export type DatosCursoFormulario = z.output<typeof esquemaCurso>;
