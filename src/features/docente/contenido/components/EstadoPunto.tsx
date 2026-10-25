import type { EstadoContenido } from "../tipos";

// Texto + punto (no solo color): borrador muted · publicado success · archivado linea.
const PUNTOS: Record<EstadoContenido, string> = {
  borrador: "bg-muted",
  publicado: "bg-success",
  archivado: "bg-linea-fuerte",
};

export function EstadoPunto({ estado }: { estado: EstadoContenido }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${PUNTOS[estado]}`} />
      {estado}
    </span>
  );
}
