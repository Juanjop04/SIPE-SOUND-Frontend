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
    return "sistema";
  }
}

export function guardarPreferencia(preferencia: PreferenciaTema): void {
  try {
    if (preferencia === "sistema") localStorage.removeItem(CLAVE);
    else localStorage.setItem(CLAVE, preferencia);
  } catch {
    // Sin almacenamiento (modo privado): el tema vale solo para esta visita.
  }
}

export function temaEfectivo(preferencia: PreferenciaTema): Tema {
  if (preferencia !== "sistema") return preferencia;
  return window.matchMedia(CONSULTA_CLARO).matches ? "claro" : "oscuro";
}

export function aplicarTema(preferencia: PreferenciaTema): void {
  document.documentElement.dataset.tema = temaEfectivo(preferencia);
}
