// Forma de /admin/docentes y /admin/cursos (HU-B-406).
import type { MetaPaginacion } from "@/shared/ui";

export interface DocenteAdmin {
  id: string;
  nombre: string;
  apellido: string | null;
  email: string;
  estado: "pendiente_verificacion" | "activa" | "suspendida";
  ultimo_acceso: string | null;
  cursos_activos: number;
  cursos_archivados: number;
  /** Distintos, en sus cursos activos. */
  estudiantes: number;
}

export interface CursoDeDocente {
  id: number;
  nombre: string;
  descripcion: string | null;
  nivel: string | null;
  codigo_invitacion: string;
  creado_en: string;
  archivado_en: string | null;
  estudiantes: number;
  bloques_en_ruta: number;
}

export interface CursoAdmin {
  id: number;
  nombre: string;
  nivel: string | null;
  codigo_invitacion: string;
  creado_en: string;
  archivado_en: string | null;
  docente_id: string;
  docente: string;
  docente_apellido: string | null;
  estado: "activo" | "archivado";
  estudiantes: number;
  bloques_en_ruta: number;
}

export interface EstudianteDeCurso {
  estudiante_id: string;
  nombre: string;
  apellido?: string | null;
  /** Completo: el administrador lo necesita. */
  email: string | null;
  inscrito_en: string;
  avance_pct: number;
  ultimo_avance: string | null;
}

export interface Pagina<T> {
  data: T[];
  meta: MetaPaginacion;
}

export interface FiltrosCursos {
  docente?: string;
  estado?: "activo" | "archivado";
  q?: string;
  pagina: number;
}
