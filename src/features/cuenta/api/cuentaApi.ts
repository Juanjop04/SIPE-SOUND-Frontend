// Mi cuenta contra el backend (/me/*, HU-B-404 y HU-B-407). Único lugar de estas llamadas.
import { http } from "@/shared/api/httpClient.js";
import type { PerfilCuenta } from "../types";

interface Respuesta<T> {
  data: T;
  message: string;
}

/** PATCH /me: solo los campos que cambiaron. 403 si el administrador no habilitó el cambio. */
export function editarNombre(cambios: {
  nombre?: string;
  apellido?: string;
}): Promise<Respuesta<PerfilCuenta>> {
  return http.conMensaje("PATCH", "/me", cambios);
}

/**
 * POST /me/solicitud-nombre: aviso a todos los administradores (asunto fijo) pidiendo que
 * habiliten el cambio de nombre. Los administradores no lo necesitan: reciben 422.
 */
export function solicitarCambioDeNombre(cuerpo: string): Promise<Respuesta<{ id: string }>> {
  return http.conMensaje("POST", "/me/solicitud-nombre", { cuerpo });
}

/** GET /me/solicitud-nombre (HU-B-415): tu última solicitud de cambio de nombre, o null. */
export interface MiSolicitudDeNombre {
  estado: "pendiente" | "aceptada" | "rechazada";
  creado_en: string;
  resuelta_en: string | null;
}

export const claveSolicitudDeNombre = ["cuenta", "solicitud-nombre"] as const;

export function miSolicitudDeNombre(): Promise<MiSolicitudDeNombre | null> {
  return http.get("/me/solicitud-nombre");
}

/**
 * POST /me/reautenticacion: paso 1, la contraseña actual. Si coincide, envía un código al correo
 * actual y devuelve el correo enmascarado. Contraseña errada → 401 "La contraseña actual no coincide."
 */
export function pedirCodigoDeIdentidad(
  passwordActual: string,
): Promise<Respuesta<{ enviado_a: string }>> {
  // El 401 de "contraseña errada" es de negocio: no debe cerrar la sesión (httpClient).
  return http.conMensaje(
    "POST",
    "/me/reautenticacion",
    { password_actual: passwordActual },
    { tolerarNoAutenticado: true },
  );
}

/** POST /me/reautenticacion/confirmar: paso 2, el código. Devuelve el token de UN solo cambio (5 min). */
export function confirmarIdentidad(
  codigo: string,
): Promise<Respuesta<{ token_reautenticacion: string; expira_en: string }>> {
  return http.conMensaje("POST", "/me/reautenticacion/confirmar", { codigo });
}

/** PATCH /me/contrasena: cierra las demás sesiones; esta sigue abierta. */
export function cambiarContrasena(datos: {
  token: string;
  password: string;
}): Promise<Respuesta<null>> {
  return http.conMensaje("PATCH", "/me/contrasena", {
    token_reautenticacion: datos.token,
    password_nueva: datos.password,
  });
}

/** POST /me/correo: envía un código al correo NUEVO; el correo no cambia hasta confirmarlo. */
export function pedirCambioDeCorreo(datos: {
  token: string;
  email: string;
}): Promise<Respuesta<null>> {
  return http.conMensaje("POST", "/me/correo", {
    token_reautenticacion: datos.token,
    email_nuevo: datos.email,
  });
}

/** POST /me/correo/confirmar: con el código del correo nuevo cambia el correo. */
export function confirmarCambioDeCorreo(codigo: string): Promise<Respuesta<{ email: string }>> {
  return http.conMensaje("POST", "/me/correo/confirmar", { codigo });
}
