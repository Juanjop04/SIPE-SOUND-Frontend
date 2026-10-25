// Cuenta y sesión contra el backend (/auth/*, HU-B-322). Único lugar del registro.
import { http } from "@/shared/api/httpClient.js";
import { cerrarSesion, iniciarSesion } from "@/shared/api/sesion.js";

export interface DatosRegistro {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  acepta_terminos: true;
}

/**
 * POST /auth/registro. Solo estos cinco campos: nunca `rol` (lo asigna la base; el backend
 * responde 400 a cualquier campo de más). Devuelve el `message` para mostrarlo tal cual.
 */
export function registrar(datos: DatosRegistro): Promise<{ data: unknown; message: string }> {
  const { nombre, apellido, email, password, acepta_terminos } = datos;
  return http.conMensaje("POST", "/auth/registro", {
    nombre,
    apellido,
    email,
    password,
    acepta_terminos,
  });
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

/**
 * POST /auth/contrasena/olvido (HU-B-403): siempre 200 con el mismo texto, exista o no la cuenta.
 * Solo se envía a cuentas con el correo verificado; un enlace cada 2 minutos por cuenta.
 */
export function pedirRecuperacion(email: string): Promise<{ data: unknown; message: string }> {
  return http.conMensaje("POST", "/auth/contrasena/olvido", { email });
}

/**
 * POST /auth/contrasena/restablecer: fija la contraseña con el token del enlace (15 min, un solo
 * uso) y cierra todas las sesiones. Token vencido, usado o inexistente → 422 con el mismo texto.
 */
export function restablecerContrasena(datos: {
  token: string;
  password: string;
}): Promise<{ data: unknown; message: string }> {
  return http.conMensaje("POST", "/auth/contrasena/restablecer", {
    token: datos.token,
    password: datos.password,
  });
}

export { iniciarSesion, cerrarSesion };
