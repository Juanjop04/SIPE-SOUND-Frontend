import { Link, useParams, useSearchParams } from "react-router-dom";
import { PaginaAtril } from "@/features/docente";
import { paths } from "@/shared/config/paths.js";
import { fechaRelativa } from "@/shared/lib/formato";
import { EstadoVacio, MensajeError, Skeleton, Tabs } from "@/shared/ui";
import ActividadDelDocente from "../docentes/components/ActividadDelDocente";
import { CursosAsignados } from "../docentes/components/CursosAsignados";
import { EstadoDeActividad } from "../docentes/components/EstadoDeActividad";
import { EstudiantesDelDocente } from "../docentes/components/EstudiantesDelDocente";
import { useDetalleUsuario } from "../docentes/externos";
import { useResumenActividad } from "../docentes/hooks";

const PESTANAS = ["cursos", "actividad", "estudiantes"] as const;
const ESTADO_CUENTA = {
  activa: "Cuenta activa",
  pendiente_verificacion: "Cuenta pendiente de verificar",
  suspendida: "Cuenta suspendida",
} as const;

/** /admin/docentes/:id: cursos asignados, actividad y estudiantes de un docente (HU-F-519). */
export default function DocenteDetallePage() {
  const { id = "" } = useParams();
  const [parametros, setParametros] = useSearchParams();
  const cuenta = useDetalleUsuario(id);
  const resumen = useResumenActividad(id, 28);
  const pestana = PESTANAS.find((p) => p === parametros.get("tab")) ?? "cursos";

  if (cuenta.isPending) {
    return (
      <PaginaAtril titulo="Docente" descripcion="Cursos, actividad y estudiantes de un docente.">
        <div aria-busy="true">
          <Skeleton lineas={4} className="h-11 w-full" />
        </div>
      </PaginaAtril>
    );
  }
  if (cuenta.error || cuenta.data.rol !== "docente") {
    return (
      <PaginaAtril titulo="Docente" descripcion="Cursos, actividad y estudiantes de un docente.">
        {cuenta.error ? (
          <MensajeError mensaje={cuenta.error.message} onReintentar={() => cuenta.refetch()} />
        ) : (
          <EstadoVacio titulo="Esta cuenta no es de un docente." />
        )}
        <Link to={paths.admin.docentes} className="mt-4 inline-block text-accent underline">
          Volver a Docentes
        </Link>
      </PaginaAtril>
    );
  }

  const nombre = [cuenta.data.nombre, cuenta.data.apellido].filter(Boolean).join(" ");
  const ultima = resumen.data?.ultima_actividad;
  return (
    <PaginaAtril titulo={nombre} descripcion={cuenta.data.email}>
      <p className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
        <span>{ESTADO_CUENTA[cuenta.data.estado]}</span>
        {resumen.data && (
          <>
            <span className="text-paper">
              <EstadoDeActividad estado={resumen.data.estado_actividad} />
            </span>
            <span>Última actividad: {ultima ? fechaRelativa(ultima) : "nunca"}</span>
          </>
        )}
        <Link to={paths.admin.docentes} className="text-accent underline underline-offset-2">
          Volver a Docentes
        </Link>
      </p>
      <Tabs
        etiqueta="Secciones del docente"
        activa={pestana}
        onCambiar={(tab) => setParametros({ tab }, { replace: true })}
        pestanas={[
          {
            id: "cursos",
            etiqueta: "Cursos asignados",
            contenido:
              pestana === "cursos" ? (
                <CursosAsignados docenteId={id} nombre={nombre} resumen={resumen.data?.cursos} />
              ) : null,
          },
          {
            id: "actividad",
            etiqueta: "Actividad",
            contenido: pestana === "actividad" ? <ActividadDelDocente docenteId={id} /> : null,
          },
          {
            id: "estudiantes",
            etiqueta: "Estudiantes",
            contenido:
              pestana === "estudiantes" ? (
                <EstudiantesDelDocente cursos={resumen.data?.cursos ?? []} />
              ) : null,
          },
        ]}
      />
    </PaginaAtril>
  );
}
