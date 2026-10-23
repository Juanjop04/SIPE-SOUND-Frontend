// Único lugar que lee import.meta.env (contrato 04 §1). Si falta una variable o es
// inválida, la app no arranca y la consola dice cuál (nunca su valor).
const SUFIJO_API = "/api/v1";

function quitarBarraFinal(texto) {
  let fin = texto.length;
  while (fin > 0 && texto[fin - 1] === "/") fin -= 1;
  return texto.slice(0, fin);
}

function leerApiUrl() {
  const valor = quitarBarraFinal(import.meta.env.VITE_API_URL?.trim() ?? "");
  if (!valor) {
    throw new Error("Falta la variable de entorno VITE_API_URL (ver .env.example).");
  }
  if (!valor.endsWith(SUFIJO_API)) {
    throw new Error(`VITE_API_URL debe terminar en ${SUFIJO_API} (ver .env.example).`);
  }
  return valor;
}

export const env = Object.freeze({
  apiUrl: leerApiUrl(),
});
