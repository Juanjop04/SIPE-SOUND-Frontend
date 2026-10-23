import { Button } from "@/shared/ui";
import type { EstadoContenido } from "../tipos";
import { EstadoPunto } from "./EstadoPunto";

interface BarraAccionesProps {
  /** null = todavía no se ha guardado (nuevo). */
  estado: EstadoContenido | null;
  ocupado: boolean;
  /** Botón submit: guarda sin cambiar el estado. */
  onPublicar: () => void;
  onCambiarEstado: (estado: EstadoContenido) => void;
}

/** Barra fija abajo: estado actual + acciones según el estado (contrato 05 §5, "Atril"). */
export function BarraAcciones({
  estado,
  ocupado,
  onPublicar,
  onCambiarEstado,
}: BarraAccionesProps) {
  const enBorrador = estado === null || estado === "borrador";
  return (
    <div
      data-fijo="abajo"
      className="sticky bottom-0 z-20 -mx-4 mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-linea bg-ink-2 px-4 py-3 sm:-mx-8 sm:px-8"
    >
      <p className="text-sm text-muted">
        {estado ? <EstadoPunto estado={estado} /> : "Sin guardar"}
      </p>
      <div className="flex flex-wrap gap-3">
        {enBorrador && (
          <>
            <Button type="submit" variante="secundario" cargando={ocupado}>
              Guardar borrador
            </Button>
            <Button disabled={ocupado} onClick={onPublicar}>
              Publicar
            </Button>
          </>
        )}
        {estado === "publicado" && (
          <>
            <Button
              variante="secundario"
              disabled={ocupado}
              onClick={() => onCambiarEstado("archivado")}
            >
              Archivar
            </Button>
            <Button type="submit" cargando={ocupado}>
              Guardar cambios
            </Button>
          </>
        )}
        {estado === "archivado" && (
          <>
            <Button
              variante="secundario"
              disabled={ocupado}
              onClick={() => onCambiarEstado("borrador")}
            >
              Volver a borrador
            </Button>
            <Button type="submit" cargando={ocupado}>
              Guardar cambios
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
