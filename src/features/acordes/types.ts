import type { VideoGuiaDatos } from "@/shared/lib/youtube";
import type { ChordDiagramProps } from "@/shared/music";

/** GET /acordes. */
export interface Acorde {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string | null;
  dificultad: string;
  diagram: ChordDiagramProps | null;
  /** Video guía de YouTube (HU-B-410); null o ausente si no tiene. */
  video?: VideoGuiaDatos | null;
}
