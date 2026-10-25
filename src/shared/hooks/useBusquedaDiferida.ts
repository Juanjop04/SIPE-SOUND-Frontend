import { useEffect, useState } from "react";

const ESPERA_BUSQUEDA_MS = 300;

/**
 * Texto de un buscador que espera a que se deje de escribir antes de tocar la URL (y pedir datos).
 * Arranca con el valor de la URL; para reiniciarlo desde fuera se vuelve a montar con otra `key`.
 */
export function useBusquedaDiferida(
  actual: string | undefined,
  alCambiar: (q: string | null) => void,
) {
  const [texto, setTexto] = useState(actual ?? "");

  useEffect(() => {
    if (texto.trim() === (actual ?? "")) return undefined;
    const temporizador = setTimeout(() => alCambiar(texto.trim() || null), ESPERA_BUSQUEDA_MS);
    return () => clearTimeout(temporizador);
  }, [texto, actual, alCambiar]);

  return [texto, setTexto] as const;
}
