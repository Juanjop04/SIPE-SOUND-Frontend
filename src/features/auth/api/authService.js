// La cuenta y la sesión las gestiona el backend (/auth/*, HU-B-322); ver shared/api/sesion.
import { cerrarSesion, iniciarSesion, registrarCuenta } from "@/shared/api/sesion.js";

export async function registrarUsuario(email, password, nombre) {
  return registrarCuenta({ nombre, email, password });
}

export { iniciarSesion, cerrarSesion };
