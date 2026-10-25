// Forma de /docente/progreso (HU-B-408). Ningún correo: el backend no lo envía.
import type { EstadoBloque } from "@/shared/music";
import type { MetaPaginacion } from "@/shared/ui";
import type { BloqueSeguido, IntentoSeguido, Retroalimentacion } from "./externos";

export interface PreguntaFallada {
  enunciado: string;
  fallos: number;
}

export interface BloqueDelCurso {
  bloque_id: number;
  numero: number;
  titulo: string;
  orden: number;
  aprobados: number;
  intentos: number;
  promedio_mejor_puntaje: number | null;
  pregunta_mas_fallada: PreguntaFallada | null;
}

export interface CursoProgreso {
  id: number;
  nombre: string;
  estudiantes: number;
  /** 0 a 100. */
  avance_promedio: number;
  /** Último avance en los últimos 7 días. */
  estudiantes_al_dia: number;
  sin_actividad_14_dias: number;
  bloques: BloqueDelCurso[];
}

export type MotivoApoyo = "reprobo_bloque" | "sin_actividad";

export interface NecesitaApoyo {
  estudiante_id: string;
  nombre: string;
  apellido: string | null;
  curso_id: number;
  curso: string;
  ultimo_avance: string | null;
  motivos: MotivoApoyo[];
  bloque_reprobado: { bloque_id: number; titulo: string; intentos_reprobados: number } | null;
}

export interface ResumenProgreso {
  cursos: CursoProgreso[];
  necesitan_apoyo: NecesitaApoyo[];
}

export interface CeldaMatriz {
  bloque_id: number;
  estado: EstadoBloque;
  mejor_puntaje: number | null;
  intentos: number;
}

export interface FilaMatriz {
  estudiante_id: string;
  nombre: string;
  apellido: string | null;
  avance_pct: number;
  ultimo_avance: string | null;
  bloques: CeldaMatriz[];
}

export interface ColumnaMatriz {
  bloque_id: number;
  numero: number;
  titulo: string;
  orden: number;
}

export interface PaginaMatriz {
  data: FilaMatriz[];
  meta: MetaPaginacion & { bloques: ColumnaMatriz[] };
}

export interface CursoDeEstudiante {
  curso_id: number;
  inscrito_en: string;
  bloques: BloqueSeguido[];
  intentos_del_curso: IntentoSeguido[];
  retroalimentaciones: Retroalimentacion[];
}

export interface ProgresoDeEstudiante {
  estudiante_id: string;
  nombre: string;
  apellido: string | null;
  cursos: CursoDeEstudiante[];
}

export type OrdenMatriz = "nombre" | "-avance_pct" | "-ultimo_avance";

export interface FiltrosProgreso {
  /** Sin curso: la vista de todos los cursos activos (sin matriz). */
  curso: number | null;
  q?: string;
  orden: OrdenMatriz;
  pagina: number;
}
