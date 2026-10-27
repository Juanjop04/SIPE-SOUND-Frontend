import { useCallback, useState } from "react";
import type { Usuario } from "./tipos";

/**
 * Cuentas elegidas con la casilla (sobreviven al cambiar de página). Se guarda la cuenta entera:
 * los diálogos de las acciones en lote nombran a quienes cambian aunque estén en otra página.
 */
export function useSeleccion() {
  const [seleccion, setSeleccion] = useState<ReadonlyMap<string, Usuario>>(new Map());

  const alternar = useCallback(
    (usuario: Usuario) =>
      setSeleccion((antes) => {
        const despues = new Map(antes);
        if (!despues.delete(usuario.id)) despues.set(usuario.id, usuario);
        return despues;
      }),
    [],
  );
  const elegirPagina = useCallback(
    (usuarios: Usuario[], marcar: boolean) =>
      setSeleccion((antes) => {
        const despues = new Map(antes);
        usuarios.forEach((u) => (marcar ? despues.set(u.id, u) : despues.delete(u.id)));
        return despues;
      }),
    [],
  );
  const limpiar = useCallback(() => setSeleccion(new Map()), []);

  return { seleccion, alternar, elegirPagina, limpiar };
}
