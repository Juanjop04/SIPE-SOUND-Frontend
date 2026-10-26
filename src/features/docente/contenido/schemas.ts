import { z } from "zod";
import {
  LIMITES,
  entero,
  enteroOpcional,
  listaDeTextos,
  textoOpcional,
  inicioDeVideo,
  tituloContenido,
  videoYoutube,
} from "@/shared/validacion";
import { leerInicio } from "@/shared/lib/youtube";

export const NIVELES = ["principiante", "intermedio", "avanzado"] as const;
// Solo estos compases (contrato 08 §2): Select, sin texto libre.
export const COMPASES = ["2/4", "3/4", "4/4", "6/8", "12/8"] as const;

const nivel = z.enum(NIVELES, { error: "Elige un nivel de la lista." });
const acordes = z
  .array(z.string())
  .max(LIMITES.maximoAcordes, `Puedes elegir como máximo ${LIMITES.maximoAcordes}.`);
const descripcion = textoOpcional(LIMITES.descripcion.max);
const duracion = enteroOpcional(LIMITES.duracionMin.min, LIMITES.duracionMin.max);

// El formulario edita `video_url` y `video_inicio` (m:ss); la API recibe `video_url` (null quita el
// video) y `video_inicio_seg`. No hay inicio sin video.
const camposDeVideo = { video_url: videoYoutube(), video_inicio: inicioDeVideo() };

function paraLaApi<T extends { video_url: string; video_inicio: string }>(datos: T) {
  const { video_url: url, video_inicio: inicio, ...resto } = datos;
  return {
    ...resto,
    video_url: url === "" ? null : url,
    video_inicio_seg: url === "" ? null : leerInicio(inicio),
  };
}

/** Esquema de lección alineado con LeccionCrear del backend. */
export const esquemaLeccion = z
  .object({
    bloque_id: z.coerce.number({ error: "Elige un bloque." }).int().positive("Elige un bloque."),
    numero: entero(LIMITES.numeroLeccion.min, LIMITES.numeroLeccion.max),
    titulo: tituloContenido(),
    descripcion,
    contenido: textoOpcional(LIMITES.contenidoLeccion.max),
    nivel,
    duracion_min: duracion,
    acordes,
    temas: listaDeTextos(LIMITES.tema.max, LIMITES.maximoTemas),
    ...camposDeVideo,
  })
  .transform(paraLaApi);

/** Esquema de ejercicio alineado con EjercicioCrear del backend. */
export const esquemaEjercicio = z
  .object({
    leccion_id: z
      .union([z.literal(""), z.coerce.number().int().positive()])
      .transform((valor) => (valor === "" ? null : valor)),
    nombre: tituloContenido(),
    descripcion,
    nivel,
    bpm_recomendado: entero(LIMITES.bpm.min, LIMITES.bpm.max),
    compas: z.enum(COMPASES, { error: "Elige un compás de la lista." }),
    duracion_min: duracion,
    acordes,
    pasos: listaDeTextos(LIMITES.paso.max, LIMITES.maximoPasos),
    ...camposDeVideo,
  })
  .transform(paraLaApi);

export type EntradaLeccion = z.input<typeof esquemaLeccion>;
export type DatosLeccion = z.output<typeof esquemaLeccion>;
export type EntradaEjercicio = z.input<typeof esquemaEjercicio>;
export type DatosEjercicio = z.output<typeof esquemaEjercicio>;
