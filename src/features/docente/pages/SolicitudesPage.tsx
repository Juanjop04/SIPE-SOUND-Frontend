import { useSearchParams } from "react-router-dom";
import { cn } from "@/shared/lib/cn.js";
import { EstadoVacio, MensajeError, Skeleton } from "@/shared/ui";
import { PaginaAtril } from "../components/PaginaAtril";
import { FilaSolicitud } from "../solicitudes/components/FilaSolicitud";
import { useSolicitudes, type EstadoSolicitud } from "../solicitudes/api";

const PESTANAS: { valor: EstadoSolicitud; etiqueta: string; vacio: string }[] = [
  { valor: "pendiente", etiqueta: "Pendientes", vacio: "No hay solicitudes por aceptar." },
  { valor: "aceptada", etiqueta: "Aceptadas", vacio: "Aún no has aceptado solicitudes." },
  { valor: "rechazada", etiqueta: "Rechazadas", vacio: "No has rechazado solicitudes." },
];

const estadoDe = (valor: string | null): EstadoSolicitud =>
  PESTANAS.find((p) => p.valor === valor)?.valor ?? "pendiente";

/**
 * Solicitudes de inscripción a mis cursos (HU-F-514): las que faltan por aceptar y las ya
 * resueltas. El administrador ve las de todos los cursos, incluidos los que no tienen docente.
 */
export default function SolicitudesPage() {
  const [parametros, setParametros] = useSearchParams();
  const estado = estadoDe(parametros.get("estado"));
  const { data, isPending, error, refetch } = useSolicitudes(estado, null);
  const pestana = PESTANAS.find((p) => p.valor === estado) ?? PESTANAS[0];
  const totales = data?.meta.totales;

  return (
    <PaginaAtril
      titulo="Solicitudes de inscripción"
      descripcion="Estudiantes que piden entrar a un curso. Al aceptar, quedan inscritos y ven su ruta."
    >
      <div role="tablist" aria-label="Estado de la solicitud" className="flex flex-wrap gap-x-6">
        {PESTANAS.map(({ valor, etiqueta }) => (
          <button
            key={valor}
            type="button"
            role="tab"
            aria-selected={estado === valor}
            onClick={() => setParametros(valor === "pendiente" ? {} : { estado: valor })}
            className={cn(
              "flex items-baseline gap-2 border-b-2 py-2 text-sm transition-colors duration-rapida",
              estado === valor
                ? "border-accent text-paper"
                : "border-transparent text-muted hover:text-paper",
            )}
          >
            {etiqueta}
            {totales && <span className="font-mono tabular-nums">{totales[valor]}</span>}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {isPending && (
          <div aria-busy="true">
            <Skeleton lineas={4} className="h-16 w-full" />
          </div>
        )}
        {error && !data && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
        {data && data.data.length === 0 && <EstadoVacio titulo={pestana.vacio} />}
        {data && data.data.length > 0 && (
          <ul className="divide-y divide-linea">
            {data.data.map((solicitud) => (
              <FilaSolicitud key={solicitud.id} solicitud={solicitud} />
            ))}
          </ul>
        )}
      </div>
    </PaginaAtril>
  );
}
