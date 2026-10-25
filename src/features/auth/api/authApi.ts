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

/**
 * POST /auth/verificacion (HU-B-402): confirma el correo con el código de 6 dígitos.
 * Un código errado, vencido o usado responde 422 con el mismo texto (no revela qué cuentas existen).
 */
export function verificarCorreo(datos: {
  email: string;
  codigo: string;
}): Promise<{ data: unknown; message: string }> {
  return http.conMensaje("POST", "/auth/verificacion", {
    email: datos.email,
    codigo: datos.codigo,
  });
}

/** POST /auth/verificacion/reenviar: siempre 200 con el mismo texto; el código anterior deja de servir. */
export function reenviarCodigo(email: string): Promise<{ data: unknown; message: string }> {
  return http.conMensaje("POST", "/auth/verificacion/reenviar", { email });
}

export { iniciarSesion, cerrarSesion };
