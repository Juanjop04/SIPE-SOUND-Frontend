import type { Control } from "react-hook-form";
import { z } from "zod";
import { entero, enteroOpcional, LIMITES, texto, textoOpcional } from "@/shared/validacion";
import type { DatosEvaluacion, DetalleEvaluacionDocente, PreguntaEnvio } from "./tipos";

// Contrato 08 y HU-F-310: los mismos límites que la API (app/schemas/evaluacion.py).
const { enunciado, opcion, opciones, preguntas, aprobacion, intentosMax, titulo, descripcion } =
  LIMITES;

/** Tipo de pregunta: hoy solo opción única; el campo deja abierta la puerta a otros (O de SOLID). */
export const TIPOS_PREGUNTA = ["opcion_unica"] as const;

/** "AAAA-MM-DD" de mañana en la zona del navegador: mínimo de la fecha límite. */
export function manana(hoy: Date = new Date()): string {
  const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const esquemaPregunta = z
  .object({
    tipo: z.enum(TIPOS_PREGUNTA),
    enunciado: texto(enunciado.min, enunciado.max),
    opciones: z
      .array(z.object({ texto: texto(opcion.min, opcion.max) }))
      .min(opciones.min, `Agrega al menos ${opciones.min} opciones.`)
      .max(opciones.max, `Como máximo ${opciones.max} opciones.`),
    correcta: z.number().int(),
  })
  .superRefine((p, ctx) => {
    const textos = p.opciones.map((o) => o.texto.trim().toLowerCase());
    if (new Set(textos).size !== textos.length) {
      ctx.addIssue({ code: "custom", path: ["opciones"], message: "Hay opciones repetidas." });
    }
    if (p.correcta < 0 || p.correcta >= p.opciones.length) {
      ctx.addIssue({ code: "custom", path: ["correcta"], message: "Marca la respuesta correcta." });
    }
  });

export const esquemaEvaluacion = z.object({
  titulo: texto(titulo.min, titulo.max),
  descripcion: textoOpcional(descripcion.max),
  curso_id: z.string(),
  porcentaje_aprobacion: entero(aprobacion.min, aprobacion.max),
  intentos_max: enteroOpcional(intentosMax.min, intentosMax.max),
  fecha_limite: z
    .string()
    .refine((f) => f === "" || f >= manana(), "La fecha límite debe ser posterior a hoy."),
  preguntas: z.array(esquemaPregunta).max(preguntas.max, `Como máximo ${preguntas.max} preguntas.`),
});

export type EntradaEvaluacion = z.input<typeof esquemaEvaluacion>;
export type DatosFormulario = z.output<typeof esquemaEvaluacion>;
export type EntradaPregunta = EntradaEvaluacion["preguntas"][number];
/** Control del formulario con su tipo de salida (lo que reciben los componentes hijos). */
export type ControlEvaluacion = Control<EntradaEvaluacion, unknown, DatosFormulario>;

export const preguntaVacia = (): EntradaPregunta => ({
  tipo: "opcion_unica",
  enunciado: "",
  opciones: [{ texto: "" }, { texto: "" }],
  correcta: -1,
});

/** Valores iniciales del formulario (nueva evaluación o la que llega del backend). */
export function valoresDe(
  e: DetalleEvaluacionDocente | null,
  cursoId: number | null,
): EntradaEvaluacion {
  return {
    titulo: e?.titulo ?? "",
    descripcion: e?.descripcion ?? "",
    curso_id: String(e?.curso_id ?? cursoId ?? ""),
    porcentaje_aprobacion: String(e?.porcentaje_aprobacion ?? 80),
    intentos_max: e?.intentos_max ? String(e.intentos_max) : "",
    fecha_limite: e?.fecha_limite ? e.fecha_limite.slice(0, 10) : "",
    preguntas: (e?.preguntas ?? []).map((p) => ({
      tipo: "opcion_unica",
      enunciado: p.enunciado,
      opciones: p.opciones.map((texto) => ({ texto })),
      correcta: p.respuesta_correcta,
    })),
  };
}

/** Fin del día elegido en Colombia (UTC−5): la API exige fecha con zona horaria. */
const finDelDia = (fecha: string) => `${fecha}T23:59:59-05:00`;

export function aEnvio(datos: DatosFormulario, creando: boolean): DatosEvaluacion {
  return {
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    porcentaje_aprobacion: datos.porcentaje_aprobacion,
    intentos_max: datos.intentos_max,
    fecha_limite: datos.fecha_limite ? finDelDia(datos.fecha_limite) : null,
    ...(creando ? { curso_id: Number(datos.curso_id) } : {}),
  };
}

export function preguntasAEnvio(datos: DatosFormulario): PreguntaEnvio[] {
  return datos.preguntas.map((p) => ({
    enunciado: p.enunciado,
    opciones: p.opciones.map((o) => o.texto),
    respuesta_correcta: p.correcta,
  }));
}
