import { LIMITES } from "@/shared/validacion";

const TIEMPOS_POR_DEFECTO = 4;

/** Pulsos por compás: el numerador ("6/8" → 6). Compás ausente o inválido → 4. */
export function tiemposDelCompas(compas: string | null | undefined): number {
  const numerador = Number.parseInt(compas?.split("/")[0] ?? "", 10);
  return Number.isInteger(numerador) && numerador > 0 ? numerador : TIEMPOS_POR_DEFECTO;
}

/** Ajusta un BPM al rango permitido (mismo que mejor_bpm en la API y la base). */
export function ajustarBpm(valor: number): number {
  const { min, max } = LIMITES.bpm;
  if (!Number.isFinite(valor)) return min;
  return Math.min(max, Math.max(min, Math.round(valor)));
}

export interface NotaPlanificada {
  tiempo: number;
  /** Tiempo del compás (0 = acento). */
  pulso: number;
}

/**
 * Función pura del metrónomo: desde `siguiente`, todas las notas que caen antes de `hasta`
 * (segundos del reloj de audio) y la siguiente nota pendiente.
 */
export function planificarNotas(
  siguiente: NotaPlanificada,
  hasta: number,
  bpm: number,
  tiempos: number,
): { notas: NotaPlanificada[]; siguiente: NotaPlanificada } {
  const notas: NotaPlanificada[] = [];
  let actual = siguiente;
  while (actual.tiempo < hasta) {
    notas.push(actual);
    actual = { tiempo: actual.tiempo + 60 / bpm, pulso: (actual.pulso + 1) % tiempos };
  }
  return { notas, siguiente: actual };
}
