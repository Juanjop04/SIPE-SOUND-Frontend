import { ChordDiagram, type ChordDiagramProps } from "./ChordDiagram";

/**
 * Contenedor de un acorde (HU-F-320): lo que se toca se ve como objeto, en `surface` sin sombra.
 * Quien la usa decide el elemento (botón en el catálogo, <li> en la lección) y le aplica la clase.
 */
export const CLASE_TESELA =
  "flex w-full flex-col items-center gap-2 rounded-caja border border-linea bg-surface p-3";

export interface TeselaAcordeProps {
  nombre: string;
  diagram?: ChordDiagramProps | null;
}

/** Diagrama y nombre del acorde; el nombre en `madera`, el color de lo que se explora. */
export function TeselaAcorde({ nombre, diagram }: TeselaAcordeProps) {
  return (
    <>
      {diagram ? (
        <ChordDiagram {...diagram} />
      ) : (
        <span className="py-8 text-xs text-muted">Sin diagrama</span>
      )}
      <span className="font-mono text-sm text-madera">{nombre}</span>
    </>
  );
}
