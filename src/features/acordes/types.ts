import type { ChordDiagramProps } from "@/shared/music";

/** GET /acordes. */
export interface Acorde {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string | null;
  dificultad: string;
  diagram: ChordDiagramProps | null;
}
