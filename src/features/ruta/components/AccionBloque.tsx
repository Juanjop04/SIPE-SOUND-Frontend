import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { claseBoton } from "@/shared/ui";
import type { BloqueRuta } from "../types";
import { PORCENTAJE_APROBACION } from "../utils/presentacion";

interface AccionBloqueProps {
  bloque: BloqueRuta;
  /** Bloque anterior en la ruta (para explicar qué falta si está bloqueado). */
  anterior?: BloqueRuta;
  conSesion: boolean;
}

/** La única acción del bloque, según el estado que decidió el backend. */
export function AccionBloque({ bloque, anterior, conSesion }: AccionBloqueProps) {
  if (!conSesion) {
    return (
      <p className="text-sm text-muted">
        <Link to={paths.login} className="text-accent hover:underline">
          Inicia sesión
        </Link>{" "}
        para guardar tu avance y presentar evaluaciones.
      </p>
    );
  }
  if (bloque.estado === "bloqueado") {
    return (
      <p className="text-sm text-muted">
        Aprueba la evaluación del bloque {anterior?.numero ?? "anterior"} con{" "}
        {PORCENTAJE_APROBACION} % o más.
      </p>
    );
  }
  if (bloque.evaluacion_id === null) {
    return <p className="text-sm text-muted">Este bloque aún no tiene evaluación.</p>;
  }
  const aprobado = bloque.estado === "aprobado";
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link
        to={paths.quiz(bloque.id)}
        className={claseBoton({ variante: aprobado ? "secundario" : "primario" })}
      >
        {aprobado ? "Repetir evaluación" : "Presentar evaluación"}
      </Link>
      {bloque.mejor_puntaje !== null && (
        <p className="font-mono text-sm text-muted">
          mejor puntaje{" "}
          <span className={aprobado ? "text-success" : "text-paper"}>{bloque.mejor_puntaje} %</span>
        </p>
      )}
    </div>
  );
}
