// Evita redirecciones abiertas con ?volver=: solo rutas internas ("/progreso"), nunca
// "//sitio.test" ni "/\sitio.test" (el navegador los trata como otro dominio).
export function destinoSeguro(volver, porDefecto) {
  const esInterna =
    typeof volver === "string" &&
    volver.startsWith("/") &&
    !volver.startsWith("//") &&
    !volver.startsWith("/\\");
  return esInterna ? volver : porDefecto;
}
