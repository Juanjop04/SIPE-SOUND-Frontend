// Colores de los gráficos: siempre tokens de src/styles/tokens.css (contrato 05 §2), nunca hex.
// Los tokens son canales RGB, así que se usan con rgb(var(--color-x)); cambian solos con el tema.
export type TokenColor =
  | "ink-2"
  | "surface"
  | "linea"
  | "linea-fuerte"
  | "primary"
  | "primary-claro"
  | "accent"
  | "success"
  | "suena"
  | "danger"
  | "muted"
  | "paper";

export function colorToken(token: TokenColor, alfa?: number): string {
  const base = `rgb(var(--color-${token})`;
  return alfa === undefined ? `${base})` : `${base} / ${alfa})`;
}

/** Estados de avance de un bloque, curso o ejercicio. Nunca se indican solo por color. */
export type EstadoGrafico = "sin_iniciar" | "en_curso" | "finalizado" | "aprobado" | "bloqueado";

export const ESTADO_GRAFICO: Record<EstadoGrafico, { texto: string; color: TokenColor }> = {
  sin_iniciar: { texto: "Sin iniciar", color: "muted" },
  en_curso: { texto: "En curso", color: "primary-claro" },
  finalizado: { texto: "Finalizado", color: "success" },
  aprobado: { texto: "Aprobado", color: "success" },
  bloqueado: { texto: "Bloqueado", color: "muted" },
};
