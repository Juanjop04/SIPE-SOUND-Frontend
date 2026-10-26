import type { BloqueRuta, LeccionRuta } from "@/features/ruta";
import type { MetaPaginacion } from "@/shared/ui";

export type OrdenEstudiantes = "nombre" | "-avance_pct" | "-ultimo_avance";

export interface FiltrosEstudiantes {
  q?: string;
  orden: OrdenEstudiantes;
  pagina: number;
  por_pagina: number;
}

/** Fila de GET /docente/cursos/{id}/estudiantes (HU-B-310). El correo llega enmascarado. */
export interface EstudianteCurso {
  estudiante_id: string;
  nombre: string;
  email: string | null;
  inscrito_en: string;
  completadas: number;
  bloques_aprobados: number;
  ultimo_avance: string | null;
  avance_pct: number;
}

export interface PaginaEstudiantes {
  data: EstudianteCurso[];
  meta: MetaPaginacion;
}

export interface EjercicioSeguido {
  id: number;
  leccion_id: number;
  nombre: string;
  bpm_recomendado: number | null;
  completado: boolean;
  mejor_bpm: number | null;
}

export interface IntentoSeguido {
  id: string;
  evaluacion_id: number;
  evaluacion: string;
  bloque_id: number | null;
  puntaje: number;
  aprobado: boolean;
  creado_en: string;
}

export interface Retroalimentacion {
  id: string;
  mensaje: string;
  leida_en: string | null;
  creado_en: string;
  docente: string | null;
}

export type BloqueSeguido = Omit<BloqueRuta, "lecciones"> & {
  lecciones: (LeccionRuta & { ejercicios: EjercicioSeguido[] })[];
  intentos: IntentoSeguido[];
};

/** GET /docente/cursos/{id}/estudiantes/{eid}: lo mismo que el estudiante ve en su ruta. */
export interface DetalleEstudiante {
  estudiante_id: string;
  nombre: string;
  email: string | null;
  inscrito_en: string;
  curso_id: number;
  bloques: BloqueSeguido[];
  intentos_del_curso: IntentoSeguido[];
  retroalimentaciones: Retroalimentacion[];
}
