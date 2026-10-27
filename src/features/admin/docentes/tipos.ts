// Forma de /admin/docentes/actividad y de la actividad de un docente (HU-B-418).
export type EstadoActividad = "activo" | "inactivo" | "sin_actividad";
export type TipoActividad =
  "sesion" | "leccion" | "ejercicio" | "evaluacion" | "retroalimentacion" | "mensaje" | "curso";
export type OrdenDocentes =
  "nombre" | "ultima_actividad" | "-acciones_30d" | "-cursos" | "-estudiantes";

export interface DocenteActividad {
  docente_id: string;
  nombre: string;
  email: string;
  estado_actividad: EstadoActividad;
  ultima_actividad: string | null;
  acciones_30d: number;
  cursos_asignados: number;
  estudiantes: number;
}

export interface CursoResumen {
  curso_id: number;
  nombre: string;
  estudiantes: number;
  avance_promedio_pct: number;
  estudiantes_sin_actividad_7d: number;
  ultima_actividad_docente: string | null;
}

export interface ResumenActividad {
  /** Todos los días del rango, con 0 los vacíos. */
  por_dia: { fecha: string; acciones: number }[];
  por_tipo: { tipo: TipoActividad; acciones: number }[];
  estado_actividad: EstadoActividad;
  dias_activos: number;
  ultima_actividad: string | null;
  cursos: CursoResumen[];
}

export interface EventoActividad {
  creado_en: string;
  tipo: TipoActividad;
  accion: string;
  curso_id: number | null;
  curso_nombre: string | null;
}

export interface FiltrosDocentes {
  q?: string;
  estado?: EstadoActividad;
  orden: OrdenDocentes;
  pagina: number;
}

/** Lo que filtra la línea de tiempo: un tipo o el grupo "contenido" (lecciones, ejercicios, cursos). */
export type FiltroTipo = TipoActividad | "contenido";

export interface FiltrosLinea {
  tipo?: FiltroTipo;
  /** Desde qué día (AAAA-MM-DD) se cuentan los eventos. */
  desde?: string;
  curso?: number;
  pagina: number;
}
