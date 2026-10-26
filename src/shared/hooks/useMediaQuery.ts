import { useCallback, useSyncExternalStore } from "react";

/** true mientras se cumpla la media query (p. ej. "(min-width: 1024px)"). Sin efectos. */
export function useMediaQuery(consulta: string): boolean {
  const suscribir = useCallback(
    (avisar: () => void) => {
      const lista = window.matchMedia(consulta);
      lista.addEventListener("change", avisar);
      return () => lista.removeEventListener("change", avisar);
    },
    [consulta],
  );
  return useSyncExternalStore(suscribir, () => window.matchMedia(consulta).matches);
}

/** Mismo punto de corte que `lg` de Tailwind. */
export const ESCRITORIO = "(min-width: 1024px)";

/** Mismo punto de corte que `md` de Tailwind (768 px): tablas densas frente a listas apiladas. */
export const ESCRITORIO_MEDIO = "(min-width: 768px)";
