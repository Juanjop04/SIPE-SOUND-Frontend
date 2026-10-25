// Tipos del dominio de autenticación (consumidos también desde JS vía JSDoc).
import type { ApiError } from "@/shared/api/ApiError.js";

export type Rol = "estudiante" | "docente" | "admin";

export interface UsuarioSesion {
  id: string;
  email: string | null;
  nombre: string | null;
}

export interface Sesion {
  accessToken: string;
  expiraEn: number;
  usuario: UsuarioSesion;
}

/** GET /me (HU-B-304). */
export interface Perfil {
  id: string;
  nombre: string;
  rol: Rol;
  nivel: string | null;
  email: string | null;
  /** null en las cuentas anteriores a HU-B-407. */
  apellido: string | null;
  /** Permiso por persona que da el admin (los admins siempre pueden). */
  puede_editar_nombre: boolean;
  correo_verificado_en: string | null;
  /** Versión de los términos que aceptó y la vigente; pendiente = debe aceptar (HU-B-411). */
  terminos_version: number | null;
  terminos_version_vigente: number;
  terminos_pendientes: boolean;
}

export interface ValorSesion {
  sesion: Sesion | null;
  usuario: UsuarioSesion | null;
  estaCargando: boolean;
  perfil: Perfil | null;
  rol: Rol | null;
  estaCargandoPerfil: boolean;
  errorPerfil: ApiError | Error | null;
  cerrarSesion: () => Promise<void>;
}

export interface ValorPerfil {
  perfil: Perfil | null;
  rol: Rol | null;
  estaCargando: boolean;
  error: ApiError | Error | null;
}
