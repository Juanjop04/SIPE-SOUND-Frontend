// Forma de /admin/usuarios (HU-B-405 y HU-B-407).
export type EstadoCuenta = "pendiente_verificacion" | "activa" | "suspendida";
export type RolCuenta = "estudiante" | "docente" | "admin";

export interface EnvioVerificacion {
  estado: "enviado" | "fallido";
  creado_en: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string | null;
  /** Completo: el administrador lo necesita para resolver problemas de acceso. */
  email: string;
  rol: RolCuenta;
  estado: EstadoCuenta;
  puede_editar_nombre: boolean;
  creado_en: string;
  ultimo_acceso: string | null;
  correo_verificado_en: string | null;
  suspendido_en: string | null;
  motivo_suspension: string | null;
  ultimo_envio_verificacion: EnvioVerificacion | null;
  /** Inscripciones activas (estudiante) o cursos a cargo activos (docente). */
  cursos: number;
}

export type TotalesPorEstado = Record<EstadoCuenta, number>;

export interface PaginaUsuarios {
  data: Usuario[];
  meta: { pagina: number; por_pagina: number; total: number; totales: TotalesPorEstado };
  message: string;
}

export interface InscripcionUsuario {
  curso_id: number;
  curso: string;
  docente: string;
  docente_apellido: string | null;
  inscrito_en: string;
}

export interface CursoACargo {
  id: number;
  nombre: string;
  archivado_en: string | null;
  estudiantes: number;
}

export interface AccionAdmin {
  accion: string;
  detalle: Record<string, unknown> | null;
  creado_en: string;
  admin: string | null;
}

export interface ProgresoUsuario {
  lecciones: { completadas: number; total: number };
  ejercicios: { completados: number; total: number };
  bloques_aprobados: number;
  ultimo_avance: string | null;
}

export interface DetalleUsuario extends Usuario {
  inscripciones: InscripcionUsuario[];
  cursos_a_cargo: CursoACargo[];
  /** Solo estudiantes. */
  progreso: ProgresoUsuario | null;
  acciones: AccionAdmin[];
}

export type FiltroPermiso = "si" | "no";
export type OrdenUsuarios = "nombre" | "-creado_en" | "-ultimo_acceso";

/** Lo que vive en la URL (contrato de HU-F-404: sobrevive a recargar). */
export interface FiltrosUsuarios {
  estado?: EstadoCuenta;
  rol?: RolCuenta;
  permiso?: FiltroPermiso;
  q?: string;
  orden: OrdenUsuarios;
  pagina: number;
}
