import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Button, claseBoton } from "@/shared/ui";
import type { EstadoEvaluacion } from "../tipos";

interface AccionesEvaluacionProps {
  id: number | null;
  estado: EstadoEvaluacion | null;
  ocupado: boolean;
  tieneIntentos: boolean;
  onPublicar: () => void;
  onCerrar: () => void;
  onDuplicar: () => void;
  onVistaEstudiante: () => void;
}

/** Un solo primario según el estado: Publicar (borrador) o Guardar cambios (publicada o cerrada). */
export function AccionesEvaluacion(props: AccionesEvaluacionProps) {
  const {
    id,
    estado,
    ocupado,
    tieneIntentos,
    onPublicar,
    onCerrar,
    onDuplicar,
    onVistaEstudiante,
  } = props;
  const enBorrador = estado === null || estado === "borrador";

  return (
    <div
      data-fijo="abajo"
      className="sticky bottom-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-linea bg-ink-2 px-4 py-3 sm:-mx-8 sm:px-8"
    >
      <div className="flex flex-wrap gap-2">
        <Button variante="fantasma" tamano="sm" onClick={onVistaEstudiante}>
          Vista de estudiante
        </Button>
        {id !== null && estado !== "borrador" && (
          <Link
            to={paths.docente.resultados(id)}
            className={claseBoton({ variante: "fantasma", tamano: "sm" })}
          >
            Ver resultados
          </Link>
        )}
        {tieneIntentos && (
          <Button variante="fantasma" tamano="sm" cargando={ocupado} onClick={onDuplicar}>
            Duplicar como borrador
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {enBorrador ? (
          <>
            <Button type="submit" variante="secundario" cargando={ocupado}>
              Guardar borrador
            </Button>
            <Button cargando={ocupado} onClick={onPublicar}>
              Publicar
            </Button>
          </>
        ) : (
          <>
            {estado === "publicada" && (
              <Button variante="secundario" cargando={ocupado} onClick={onCerrar}>
                Cerrar evaluación
              </Button>
            )}
            <Button type="submit" cargando={ocupado}>
              Guardar cambios
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
