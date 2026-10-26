// Tema claro u oscuro (HU-F-323). El script de index.html aplica lo mismo antes de pintar la
// página (sin destello); este módulo lo usa el selector al cambiar de tema.
export type PreferenciaTema = "sistema" | "claro" | "oscuro";
export type Tema = "claro" | "oscuro";

const CLAVE = "sipe-tema";
export const CONSULTA_CLARO = "(prefers-color-scheme: light)";

/** Preferencia guardada; "sistema" si no hay o el almacenamiento no está disponible. */
export function leerPreferencia(): PreferenciaTema {
  try {
    const valor = localStorage.getItem(CLAVE);
    return valor === "claro" || valor === "oscuro" ? valor : "sistema";
  } catch {
    return enMemoria ?? "sistema";
  }
}

// Preferencia de esta visita cuando no hay almacenamiento (modo privado).
let enMemoria: PreferenciaTema | null = null;
const oyentes = new Set<() => void>();

/** Para useSyncExternalStore: todos los selectores comparten UNA preferencia, también entre pestañas. */
export function suscribirPreferencia(avisar: () => void): () => void {
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

export function guardarPreferencia(preferencia: PreferenciaTema): void {
  enMemoria = preferencia;
  try {
    if (preferencia === "sistema") localStorage.removeItem(CLAVE);
    else localStorage.setItem(CLAVE, preferencia);
  } catch {
    // Sin almacenamiento (modo privado): el tema vale solo para esta visita.
  }
  oyentes.forEach((avisar) => avisar());
}

export function temaEfectivo(preferencia: PreferenciaTema): Tema {
  if (preferencia !== "sistema") return preferencia;
  return window.matchMedia(CONSULTA_CLARO).matches ? "claro" : "oscuro";
}

export function aplicarTema(preferencia: PreferenciaTema): void {
  document.documentElement.dataset.tema = temaEfectivo(preferencia);
}
