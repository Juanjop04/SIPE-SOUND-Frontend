// Lee un color de src/styles/tokens.css para los casos que se calculan en JavaScript
// (animación de las cuerdas). Devuelve los canales [r, g, b].
export function leerColorToken(nombre) {
  const valor = getComputedStyle(document.documentElement).getPropertyValue(`--color-${nombre}`);
  return valor.trim().split(/\s+/).map(Number);
}
