export const SIN_CONEXION = "SIN_CONEXION";
export const MENSAJE_SIN_CONEXION = "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.";

// Error de la API con la respuesta estándar (contrato 04 §2). `message` ya viene en español.
export class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} status   VALIDACION, NO_ENCONTRADO…
   * @param {string} message  ya en español
   * @param {string[]} [errors]
   * @param {Record<string, unknown>} [meta]  datos extra de la respuesta (p. ej. requiere_verificacion)
   */
  constructor(statusCode, status, message, errors = [], meta = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.status = status;
    this.errors = errors;
    this.meta = meta;
  }

  /**
   * "nombre: Debe tener…" → { nombre: "Debe tener…" }. Los textos sin campo quedan en `general`.
   * @returns {Record<string, string>}
   */
  get porCampo() {
    return Object.fromEntries(
      this.errors.map((texto) => {
        const i = texto.indexOf(": ");
        return i > 0 ? [texto.slice(0, i), texto.slice(i + 2)] : ["general", texto];
      }),
    );
  }

  get esErrorDelCliente() {
    return this.statusCode >= 400 && this.statusCode < 500;
  }
}
