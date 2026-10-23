// Cuenta y sesión contra el backend (/auth/*, HU-B-322). Único lugar del registro.
import { http } from "@/shared/api/httpClient.js";
import { cerrarSesion, iniciarSesion } from "@/shared/api/sesion.js";

export interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
  acepta_terminos: true;
}

/**
 * POST /auth/registro. Solo estos cuatro campos: nunca `rol` (lo asigna la base; el backend
 * responde 400 a cualquier campo de más). Devuelve el `message` para mostrarlo tal cual.
 */
export function registrar(datos: DatosRegistro): Promise<{ data: unknown; message: string }> {
  const { nombre, email, password, acepta_terminos } = datos;
  return http.conMensaje("POST", "/auth/registro", { nombre, email, password, acepta_terminos });
}

export { iniciarSesion, cerrarSesion };
