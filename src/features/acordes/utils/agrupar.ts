import type { Acorde } from "../types";

// Orden y nombre de los grupos más comunes; cualquier otro tipo va después, con su nombre.
const GRUPOS: Record<string, string> = {
  mayor: "Mayores",
  menor: "Menores",
  septima: "Séptima",
  séptima: "Séptima",
};
const ORDEN = ["mayor", "menor", "septima", "séptima"];

export interface GrupoAcordes {
  tipo: string;
  titulo: string;
  acordes: Acorde[];
}

/** Función pura: agrupa por tipo (mayores, menores, séptima…) respetando el orden musical. */
export function agruparPorTipo(acordes: Acorde[]): GrupoAcordes[] {
  const porTipo = new Map<string, Acorde[]>();
  for (const acorde of acordes) {
    porTipo.set(acorde.tipo, [...(porTipo.get(acorde.tipo) ?? []), acorde]);
  }
  const posicion = (tipo: string) => {
    const i = ORDEN.indexOf(tipo);
    return i < 0 ? ORDEN.length : i;
  };
  return [...porTipo.entries()]
    .sort(([a], [b]) => posicion(a) - posicion(b) || a.localeCompare(b, "es"))
    .map(([tipo, lista]) => ({
      tipo,
      titulo: GRUPOS[tipo] ?? tipo.charAt(0).toUpperCase() + tipo.slice(1),
      acordes: lista,
    }));
}
