import { useCallback, useState } from "react";

/** Cuentas elegidas con la casilla (sobreviven al cambiar de página). */
export function useSeleccion() {
  const [seleccion, setSeleccion] = useState<ReadonlySet<string>>(new Set());

  const alternar = useCallback(
    (id: string) =>
      setSeleccion((antes) => {
        const despues = new Set(antes);
        if (!despues.delete(id)) despues.add(id);
        return despues;
      }),
    [],
  );
  const elegirPagina = useCallback(
    (ids: string[], marcar: boolean) =>
      setSeleccion((antes) => {
        const despues = new Set(antes);
        ids.forEach((id) => (marcar ? despues.add(id) : despues.delete(id)));
        return despues;
      }),
    [],
  );
  const limpiar = useCallback(() => setSeleccion(new Set()), []);

  return { seleccion, alternar, elegirPagina, limpiar };
}
