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
