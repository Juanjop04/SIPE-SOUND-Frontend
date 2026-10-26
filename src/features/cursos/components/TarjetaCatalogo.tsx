import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/cn.js";
import { paths } from "@/shared/config/paths.js";
import { Button, MensajeError, claseBoton } from "@/shared/ui";
import type { CursoDelCatalogo, EstadoDeSolicitud } from "../api";
import { useSolicitudDeInscripcion } from "../api";

// Borde izquierdo según mi relación con el curso; además va el texto (nunca solo color).
const MARCA: Record<"libre" | "inscrito" | "pendiente" | "rechazada", string> = {
  libre: "border-l-linea-fuerte",
  inscrito: "border-l-success",
  pendiente: "border-l-accent",
  rechazada: "border-l-danger",
};

const TEXTO_ESTADO: Record<NonNullable<EstadoDeSolicitud>, string> = {
  inscrito: "● Ya estás inscrito",
  pendiente: "◐ Solicitud enviada: esperando respuesta",
  rechazada: "○ Tu solicitud fue rechazada",
};

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/** Un curso del catálogo con la acción que corresponde a mi relación con él. */
export function TarjetaCatalogo({ curso }: { curso: CursoDelCatalogo }) {
  const { solicitar, cancelar } = useSolicitudDeInscripcion();
  const docente = [curso.docente_nombre, curso.docente_apellido].filter(Boolean).join(" ");
  const ocupado = solicitar.isPending || cancelar.isPending;
  const error = solicitar.error ?? cancelar.error;
  const estado = curso.mi_estado;

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-caja border border-l-2 border-linea bg-surface p-5",
        MARCA[estado ?? "libre"],
      )}
    >
      <div>
        <h2 className="font-display text-xl font-semibold text-paper">{curso.nombre}</h2>
        <p className="text-sm text-muted">
          {docente || "Sin docente asignado"} · {curso.nivel}
        </p>
      </div>
      {curso.descripcion && <p className="line-clamp-3 text-sm text-muted">{curso.descripcion}</p>}
      <p className="font-mono text-xs text-muted">
        {plural(curso.estudiantes, "estudiante", "estudiantes")} ·{" "}
        {plural(curso.bloques_en_ruta, "bloque", "bloques")}
      </p>
      {estado && <p className="text-sm text-paper">{TEXTO_ESTADO[estado]}</p>}
      {error && <MensajeError mensaje={error.message} />}
      <div className="mt-auto flex flex-wrap gap-2">
        {estado === "inscrito" && (
          <Link to={paths.cursos} className={claseBoton({ variante: "secundario" })}>
            Ir a Mis cursos
          </Link>
        )}
        {estado === "pendiente" && (
          <Button
            variante="secundario"
            cargando={cancelar.isPending}
            disabled={ocupado}
            onClick={() => cancelar.mutate(curso.id)}
          >
            Cancelar solicitud
          </Button>
        )}
        {(estado === null || estado === "rechazada") && (
          <Button
            cargando={solicitar.isPending}
            disabled={ocupado}
            onClick={() => solicitar.mutate(curso.id)}
          >
            {estado === "rechazada" ? "Volver a solicitar" : "Inscribirme"}
          </Button>
        )}
      </div>
    </li>
  );
}
