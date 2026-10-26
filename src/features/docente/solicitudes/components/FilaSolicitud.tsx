import { formatearFecha } from "@/shared/lib/formato";
import { Button } from "@/shared/ui";
import type { SolicitudDeInscripcion } from "../api";
import { useResolverSolicitud } from "../api";

const nombreCompleto = (p: { nombre: string; apellido: string | null }) =>
  [p.nombre, p.apellido].filter(Boolean).join(" ");

/** "Pidió el …" mientras espera; "Aceptada el … por Marta Ríos" cuando ya se resolvió. */
function fechaDe(s: SolicitudDeInscripcion): string {
  if (s.estado === "pendiente") return `Pidió el ${formatearFecha(s.creado_en)}`;
  const accion = s.estado === "aceptada" ? "Aceptada" : "Rechazada";
  const quien = s.resuelta_por_nombre
    ? nombreCompleto({ nombre: s.resuelta_por_nombre, apellido: s.resuelta_por_apellido })
    : null;
  const por = quien ? ` por ${quien}` : "";
  return `${accion} el ${formatearFecha(s.resuelta_en)}${por}`;
}

/** Una solicitud: quién, a qué curso, cuándo, y Aceptar o Rechazar si sigue pendiente. */
export function FilaSolicitud({ solicitud: s }: { solicitud: SolicitudDeInscripcion }) {
  const resolver = useResolverSolicitud();
  const pendiente = s.estado === "pendiente";

  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-paper">{nombreCompleto(s)}</p>
        <p className="text-sm text-muted">
          Quiere entrar a <span className="text-paper">{s.curso}</span>
          {s.curso_sin_docente && (
            <span className="ml-2 rounded-full border border-linea-fuerte px-2 py-0.5 text-xs">
              Curso sin docente
            </span>
          )}
        </p>
        <p className="font-mono text-xs text-muted">{fechaDe(s)}</p>
      </div>
      {pendiente && (
        <div className="flex shrink-0 gap-2">
          <Button
            cargando={resolver.isPending && resolver.variables?.estado === "aceptada"}
            disabled={resolver.isPending}
            onClick={() => resolver.mutate({ id: s.id, estado: "aceptada" })}
          >
            Aceptar
          </Button>
          <Button
            variante="secundario"
            cargando={resolver.isPending && resolver.variables?.estado === "rechazada"}
            disabled={resolver.isPending}
            onClick={() => resolver.mutate({ id: s.id, estado: "rechazada" })}
          >
            Rechazar
          </Button>
        </div>
      )}
    </li>
  );
}
