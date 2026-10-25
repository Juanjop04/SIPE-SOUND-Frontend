import type { VideoGuiaDatos } from "@/shared/lib/youtube";
import type { NivelCurso } from "../types";

export type TipoContenido = "lecciones" | "ejercicios";
export type EstadoContenido = "borrador" | "publicado" | "archivado";

interface Base {
  id: number;
  descripcion: string | null;
  nivel: NivelCurso;
  duracion_min: number | null;
  acordes: string[];
  estado: EstadoContenido;
  autor_id: string | null;
  /** Nombres de quien lo creó y de quien lo modificó por última vez (HU-B-412). */
  autor?: string | null;
  modificado_por?: string | null;
  actualizado_en: string;
  /** Video guía de YouTube (HU-B-410); null o ausente si no tiene. */
  video?: VideoGuiaDatos | null;
}

/** GET /docente/lecciones y /docente/lecciones/{id} (HU-B-309). */
export interface LeccionDocente extends Base {
  bloque_id: number;
  numero: number;
  titulo: string;
  contenido: string | null;
  temas: string[];
}

/** GET /docente/ejercicios y /docente/ejercicios/{id}. */
export interface EjercicioDocente extends Base {
  leccion_id: number | null;
  nombre: string;
  bpm_recomendado: number;
  compas: string;
  pasos: string[];
}

export type ContenidoDocente = LeccionDocente | EjercicioDocente;

export interface FiltrosListado {
  estado?: EstadoContenido;
  bloque_id?: number;
  q?: string;
  pagina: number;
}

export interface PaginaListado<T> {
  data: T[];
  meta: { pagina: number; por_pagina: number; total: number };
}
