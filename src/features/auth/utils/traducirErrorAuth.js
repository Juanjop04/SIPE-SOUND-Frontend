const MENSAJE_SIN_CONEXION = "No hay conexión. Revisa tu internet e inténtalo otra vez.";

function esErrorDeRed(m) {
  return m.includes("failed to fetch") || m.includes("network");
}

export function traducirErrorLogin(mensaje = "") {
  const m = mensaje.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "El correo o la contraseña no coinciden. Revísalos e inténtalo de nuevo.";
  if (m.includes("email not confirmed"))
    return "Aún no confirmas tu correo. Abre el mensaje que te enviamos y confirma tu cuenta.";
  if (esErrorDeRed(m)) return MENSAJE_SIN_CONEXION;
  return mensaje || "No pudimos iniciar sesión. Inténtalo de nuevo.";
}

export function traducirErrorRegistro(mensaje = "") {
  const m = mensaje.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Ya existe una cuenta con ese correo. Prueba iniciando sesión.";
  if (m.includes("password") && m.includes("6"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("invalid") && m.includes("email"))
    return "Ese correo no parece válido. Revísalo e inténtalo de nuevo.";
  if (m.includes("rate limit"))
    return "Hiciste demasiados intentos. Espera unos minutos y vuelve a probar.";
  if (esErrorDeRed(m)) return MENSAJE_SIN_CONEXION;
  return mensaje || "No pudimos crear tu cuenta. Inténtalo de nuevo.";
}
