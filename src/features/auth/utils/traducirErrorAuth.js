const MENSAJE_SIN_CONEXION = "No hay conexión. Revisa tu internet e inténtalo otra vez.";

function esErrorDeRed(m) {
  return m.includes("failed to fetch") || m.includes("network");
}

function traducir(mensaje, porDefecto) {
  if (esErrorDeRed(mensaje.toLowerCase())) return MENSAJE_SIN_CONEXION;
  return mensaje || porDefecto;
}

export function traducirErrorLogin(mensaje = "") {
  return traducir(mensaje, "No pudimos iniciar sesión. Inténtalo de nuevo.");
}

export function traducirErrorRegistro(mensaje = "") {
  return traducir(mensaje, "No pudimos crear tu cuenta. Inténtalo de nuevo.");
}
