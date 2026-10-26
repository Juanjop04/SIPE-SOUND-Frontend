import { Button } from "@/shared/ui";
import type { EstadoContenido } from "../tipos";
import { EstadoPunto } from "./EstadoPunto";

interface BarraAccionesProps {
  /** null = todavía no se ha guardado (nuevo). */
  estado: EstadoContenido | null;
  ocupado: boolean;
  /** Hay algo distinto de lo guardado: sin cambios no se puede guardar (ni se llama al backend). */
  hayCambios: boolean;
  /** Botón submit: guarda sin cambiar el estado. */
  onPublicar: () => void;
  onCambiarEstado: (estado: EstadoContenido) => void;
}

/** Barra fija abajo: estado actual + acciones según el estado (contrato 05 §5, "Atril"). */
export function BarraAcciones({
  estado,
  ocupado,
  hayCambios,
  onPublicar,
  onCambiarEstado,
}: BarraAccionesProps) {
  // Contenido nuevo (estado nulo): guardar crea; ya guardado: solo si algo cambió.
  const sinCambios = estado !== null && !hayCambios;
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
            <Button type="submit" variante="secundario" cargando={ocupado} disabled={sinCambios}>
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
            <Button type="submit" cargando={ocupado} disabled={sinCambios}>
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
            <Button type="submit" cargando={ocupado} disabled={sinCambios}>
              Guardar cambios
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
