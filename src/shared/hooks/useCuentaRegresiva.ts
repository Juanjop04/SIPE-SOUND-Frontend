import { useCallback, useEffect, useState } from "react";

/** Espera entre dos códigos para la misma cuenta (el backend permite uno por minuto). */
export const ESPERA_REENVIO_SEGUNDOS = 60;

/** 42 → "0:42"; 75 → "1:15". */
export function formatearEspera(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  return `${minutos}:${String(segundos % 60).padStart(2, "0")}`;
}

/**
 * Cuenta regresiva en segundos (para "Puedes pedir otro en 0:42"). `iniciar` la arranca o la
 * reinicia; mientras `restante` > 0 la acción asociada debe seguir deshabilitada.
 * Con `iniciada` la cuenta ya corre al montar: `true` desde `segundos`, o un número con los
 * segundos que faltan (p. ej. el backend dice que al código le quedan 37).
 */
export function useCuentaRegresiva(
  segundos = ESPERA_REENVIO_SEGUNDOS,
  iniciada: boolean | number = false,
) {
  const [restante, setRestante] = useState(() => {
    if (typeof iniciada === "number") return Math.max(0, iniciada);
    return iniciada ? segundos : 0;
  });

  // Temporizador: sincroniza con el reloj (sistema externo), no pide datos.
  useEffect(() => {
    if (restante <= 0) return undefined;
    const temporizador = setTimeout(() => setRestante((valor) => valor - 1), 1000);
    return () => clearTimeout(temporizador);
  }, [restante]);

  // `desde` solo cuenta si es un número: así `iniciar` también sirve como manejador de clic.
  const iniciar = useCallback(
    (desde?: unknown) => setRestante(typeof desde === "number" ? desde : segundos),
    [segundos],
  );
  return { restante, activa: restante > 0, iniciar };
}
