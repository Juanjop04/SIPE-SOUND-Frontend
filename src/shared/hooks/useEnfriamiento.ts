import { useCallback, useEffect, useState } from "react";

/** Espera tras un 429 (contrato 04 §5): sin reintento automático y botón deshabilitado 60 s. */
export const ESPERA_DEMASIADAS_SOLICITUDES_MS = 60_000;

export function useEnfriamiento(duracionMs = ESPERA_DEMASIADAS_SOLICITUDES_MS) {
  const [activo, setActivo] = useState(false);

  // Temporizador: sincroniza con el reloj (sistema externo), no pide datos.
  useEffect(() => {
    if (!activo) return undefined;
    const temporizador = setTimeout(() => setActivo(false), duracionMs);
    return () => clearTimeout(temporizador);
  }, [activo, duracionMs]);

  const iniciar = useCallback(() => setActivo(true), []);
  return { enfriando: activo, iniciar };
}
