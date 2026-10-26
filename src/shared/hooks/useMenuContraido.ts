import { useEffect, useSyncExternalStore } from "react";
import { alternarMenu, leerMenu, suscribirMenu, type EstadoMenu } from "@/shared/lib/menu";

const TECLA = "[";
const CAMPOS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

function enCampoDeTexto(destino: EventTarget | null): boolean {
  const el = destino as HTMLElement | null;
  return Boolean(el && (CAMPOS.has(el.tagName) || el.isContentEditable));
}

/** true con el menú lateral contraído (preferencia compartida y recordada). */
export function useMenuContraido(): boolean {
  const estado = useSyncExternalStore<EstadoMenu>(suscribirMenu, leerMenu, () => "expandido");
  return estado === "contraido";
}

/** Atajo "[" para contraer o expandir el menú, salvo que se esté escribiendo en un campo. */
export function useAtajoDelMenu(): void {
  useEffect(() => {
    function alTeclear(evento: KeyboardEvent) {
      if (evento.key !== TECLA || evento.ctrlKey || evento.metaKey || evento.altKey) return;
      if (enCampoDeTexto(evento.target)) return;
      alternarMenu();
    }
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, []);
}
