// Máquina de pasos de "confirmar identidad" (HU-F-403). Pura: sin React, sin red.
//
//   contraseña:  actual → codigo → nueva → listo
//   correo:      actual → codigo → nueva (correo nuevo) → codigoNuevo → listo
//
// El token de reautenticación vive solo en este estado: se descarta al terminar, al vencer
// y al cerrar el diálogo (el estado se destruye con él).

export type Motivo = "contrasena" | "correo";
export type Paso = "actual" | "codigo" | "nueva" | "codigoNuevo" | "listo";

export const MENSAJE_VOLVER_A_CONFIRMAR = "Vuelve a confirmar tu identidad.";

/** Vigencia del token de reautenticación (HU-B-404): se mide desde que llega, sin leer el reloj del servidor. */
export const VIGENCIA_TOKEN_MS = 5 * 60_000;

export interface EstadoIdentidad {
  motivo: Motivo;
  paso: Paso;
  /** Correo actual enmascarado (a***@colegio.edu.co), donde llegó el primer código. */
  enviadoA: string | null;
  token: string | null;
  /** Instante (ms) en que vence el token. */
  venceEn: number | null;
  correoNuevo: string | null;
  aviso: string | null;
  resultado: string | null;
}

export type AccionIdentidad =
  | { tipo: "codigoEnviado"; enviadoA: string }
  | { tipo: "identidadConfirmada"; token: string; venceEn: number }
  | { tipo: "correoNuevoPedido"; correo: string }
  | { tipo: "terminado"; resultado: string }
  | { tipo: "vencio" };

export function estadoInicial(motivo: Motivo): EstadoIdentidad {
  return {
    motivo,
    paso: "actual",
    enviadoA: null,
    token: null,
    venceEn: null,
    correoNuevo: null,
    aviso: null,
    resultado: null,
  };
}

export function reducirIdentidad(
  estado: EstadoIdentidad,
  accion: AccionIdentidad,
): EstadoIdentidad {
  switch (accion.tipo) {
    case "codigoEnviado":
      return { ...estado, paso: "codigo", enviadoA: accion.enviadoA, aviso: null };
    case "identidadConfirmada":
      return {
        ...estado,
        paso: "nueva",
        token: accion.token,
        venceEn: accion.venceEn,
        aviso: null,
      };
    // El token ya se gastó al pedir el cambio: no queda nada que conservar.
    case "correoNuevoPedido":
      return {
        ...estado,
        paso: "codigoNuevo",
        token: null,
        venceEn: null,
        correoNuevo: accion.correo,
      };
    case "terminado":
      return { ...estado, paso: "listo", token: null, venceEn: null, resultado: accion.resultado };
    case "vencio":
      return {
        ...estadoInicial(estado.motivo),
        aviso: MENSAJE_VOLVER_A_CONFIRMAR,
      };
  }
}
