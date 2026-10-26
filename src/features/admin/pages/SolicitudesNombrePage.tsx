import { useSearchParams } from "react-router-dom";
import { PaginaAtril } from "@/features/docente";
import { cn } from "@/shared/lib/cn.js";
import { formatearFecha } from "@/shared/lib/formato";
import { Button, EstadoVacio, MensajeError, Skeleton } from "@/shared/ui";
import {
  useResolverSolicitudDeNombre,
  useSolicitudesDeNombre,
  type EstadoSolicitudNombre,
  type RolSolicitante,
  type SolicitudDeNombre,
} from "../solicitudes-nombre/api";

const ROLES: { valor: RolSolicitante; etiqueta: string }[] = [
  { valor: "estudiante", etiqueta: "Estudiantes" },
  { valor: "docente", etiqueta: "Docentes" },
];

const ESTADOS: { valor: EstadoSolicitudNombre; etiqueta: string; vacio: string }[] = [
  { valor: "pendiente", etiqueta: "Pendientes", vacio: "No hay solicitudes por resolver." },
  { valor: "aceptada", etiqueta: "Habilitadas", vacio: "Aún no has habilitado ninguna." },
  { valor: "rechazada", etiqueta: "Rechazadas", vacio: "No has rechazado solicitudes." },
];

const nombreCompleto = (p: { nombre: string; apellido: string | null }) =>
  [p.nombre, p.apellido].filter(Boolean).join(" ");

function Pestanas<T extends string>({
  etiqueta,
  opciones,
  activa,
  totales,
  onCambiar,
}: {
  etiqueta: string;
  opciones: { valor: T; etiqueta: string }[];
  activa: T;
  totales?: Partial<Record<T, number>>;
  onCambiar: (valor: T) => void;
}) {
  return (
    <div role="tablist" aria-label={etiqueta} className="flex flex-wrap gap-x-6">
      {opciones.map(({ valor, etiqueta: texto }) => (
        <button
          key={valor}
          type="button"
          role="tab"
          aria-selected={activa === valor}
          onClick={() => onCambiar(valor)}
          className={cn(
            "flex items-baseline gap-2 border-b-2 py-2 text-sm transition-colors duration-rapida",
            activa === valor
              ? "border-accent text-paper"
              : "border-transparent text-muted hover:text-paper",
          )}
        >
          {texto}
          {totales?.[valor] !== undefined && (
            <span className="font-mono tabular-nums">{totales[valor]}</span>
          )}
        </button>
      ))}
    </div>
  );
}

/** Cuándo pidió, o cuándo y quién la resolvió; avisa si la cuenta ya puede editar su nombre. */
function detalleDe(s: SolicitudDeNombre): string {
  let texto = `Pidió el ${formatearFecha(s.creado_en)}`;
  if (s.estado !== "pendiente") {
    const quien = s.resuelta_por_nombre
      ? nombreCompleto({ nombre: s.resuelta_por_nombre, apellido: s.resuelta_por_apellido })
      : null;
    const por = quien ? ` · ${quien}` : "";
    texto = `Resuelta el ${formatearFecha(s.resuelta_en)}${por}`;
  }
  return s.puede_editar_nombre ? `${texto} · ya puede editar su nombre` : texto;
}

function Fila({ solicitud: s }: { solicitud: SolicitudDeNombre }) {
  const resolver = useResolverSolicitudDeNombre();
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-paper">{nombreCompleto(s)}</p>
        <p className="mt-1 max-w-prose whitespace-pre-wrap break-words text-sm text-muted">
          «{s.mensaje}»
        </p>
        <p className="mt-1 font-mono text-xs text-muted">{detalleDe(s)}</p>
      </div>
      {s.estado === "pendiente" && (
        <div className="flex shrink-0 gap-2">
          <Button
            cargando={resolver.isPending && resolver.variables?.estado === "aceptada"}
            disabled={resolver.isPending}
            onClick={() => resolver.mutate({ id: s.id, estado: "aceptada" })}
          >
            Habilitar cambio
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

/**
 * Solicitudes de cambio de nombre (HU-F-515): estudiantes y docentes por separado, con las
 * pendientes primero. Habilitar activa el permiso de editar el nombre de esa cuenta.
 */
export default function SolicitudesNombrePage() {
  const [parametros, setParametros] = useSearchParams();
  const rol = ROLES.find((r) => r.valor === parametros.get("rol"))?.valor ?? "estudiante";
  const estado = ESTADOS.find((e) => e.valor === parametros.get("estado"))?.valor ?? "pendiente";
  const { data, isPending, error, refetch } = useSolicitudesDeNombre(rol, estado);
  const vacio = ESTADOS.find((e) => e.valor === estado)?.vacio;

  const cambiar = (cambios: Record<string, string | null>) =>
    setParametros((previos) => {
      const nuevos = new URLSearchParams(previos);
      Object.entries(cambios).forEach(([k, v]) => (v ? nuevos.set(k, v) : nuevos.delete(k)));
      return nuevos;
    });

  return (
    <PaginaAtril
      titulo="Cambios de nombre"
      descripcion="Estudiantes y docentes que piden poder cambiar su nombre. Al habilitar, esa cuenta puede editarlo en Mi cuenta."
    >
      <Pestanas
        etiqueta="Tipo de cuenta"
        opciones={ROLES}
        activa={rol}
        totales={{
          estudiante: data?.meta.totales.estudiante.pendiente,
          docente: data?.meta.totales.docente.pendiente,
        }}
        onCambiar={(valor) => cambiar({ rol: valor === "estudiante" ? null : valor })}
      />
      <div className="mt-2">
        <Pestanas
          etiqueta="Estado de la solicitud"
          opciones={ESTADOS}
          activa={estado}
          totales={data?.meta.totales[rol]}
          onCambiar={(valor) => cambiar({ estado: valor === "pendiente" ? null : valor })}
        />
      </div>
      <div className="mt-4">
        {isPending && (
          <div aria-busy="true">
            <Skeleton lineas={3} className="h-16 w-full" />
          </div>
        )}
        {error && !data && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
        {data && data.data.length === 0 && <EstadoVacio titulo={vacio ?? ""} />}
        {data && data.data.length > 0 && (
          <ul className="divide-y divide-linea">
            {data.data.map((solicitud) => (
              <Fila key={solicitud.id} solicitud={solicitud} />
            ))}
          </ul>
        )}
      </div>
    </PaginaAtril>
  );
}
