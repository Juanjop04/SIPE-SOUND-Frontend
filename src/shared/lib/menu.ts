// Menú lateral contraído o expandido (HU-F-507). Una sola preferencia compartida por el atril y el
// layout del estudiante, y entre pestañas, igual que el tema. Se lee de forma síncrona en el primer
// render (la app se pinta en el cliente), así que el menú nace ya como se dejó, sin parpadeo.
export type EstadoMenu = "expandido" | "contraido";

const CLAVE = "sipe-menu";
let enMemoria: EstadoMenu | null = null;
const oyentes = new Set<() => void>();

/** Estado guardado; "expandido" si no hay o el almacenamiento no está disponible. */
export function leerMenu(): EstadoMenu {
  try {
    return localStorage.getItem(CLAVE) === "contraido" ? "contraido" : "expandido";
  } catch {
    return enMemoria ?? "expandido";
  }
}

/** Para useSyncExternalStore. */
export function suscribirMenu(avisar: () => void): () => void {
  oyentes.add(avisar);
  const alCambiarOtraPestana = (evento: StorageEvent) => {
    if (evento.key === CLAVE || evento.key === null) avisar();
  };
  window.addEventListener("storage", alCambiarOtraPestana);
  return () => {
    oyentes.delete(avisar);
    window.removeEventListener("storage", alCambiarOtraPestana);
  };
}

export function guardarMenu(estado: EstadoMenu): void {
  enMemoria = estado;
  try {
    if (estado === "contraido") localStorage.setItem(CLAVE, estado);
    else localStorage.removeItem(CLAVE);
  } catch {
    // Sin almacenamiento (modo privado): vale solo para esta visita.
  }
  oyentes.forEach((avisar) => avisar());
}

export function alternarMenu(): void {
  guardarMenu(leerMenu() === "contraido" ? "expandido" : "contraido");
}
