import { useSyncExternalStore } from "react";

function suscribir(avisar: () => void) {
  window.addEventListener("online", avisar);
  window.addEventListener("offline", avisar);
  return () => {
    window.removeEventListener("online", avisar);
    window.removeEventListener("offline", avisar);
  };
}

/** false cuando el navegador sabe que no hay red (navigator.onLine, HU-F-312). Sin efectos. */
export function useEnLinea(): boolean {
  return useSyncExternalStore(suscribir, () => navigator.onLine);
}
