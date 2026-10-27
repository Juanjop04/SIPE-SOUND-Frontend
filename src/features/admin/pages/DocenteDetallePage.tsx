import { ChevronLeft, MessageSquare, UserCog } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { PaginaAtril } from "@/features/docente";
import { paths } from "@/shared/config/paths.js";
import { fechaRelativa } from "@/shared/lib/formato";
import { claseBoton, EstadoVacio, MensajeError, Skeleton, Tabs } from "@/shared/ui";
import ActividadDelDocente from "../docentes/components/ActividadDelDocente";
import { CifrasDelDocente } from "../docentes/components/CifrasDelDocente";
import { CursosAsignados } from "../docentes/components/CursosAsignados";
import { EstadoDeActividad } from "../docentes/components/EstadoDeActividad";
import { EstudiantesDelDocente } from "../docentes/components/EstudiantesDelDocente";
import { useDetalleUsuario } from "../docentes/externos";
import { useDocentesParaAsignar, useResumenActividad } from "../docentes/hooks";

const PESTANAS = ["cursos", "actividad", "estudiantes"] as const;
const ESTADO_CUENTA = {
  activa: "Cuenta activa",
  pendiente_verificacion: "Cuenta pendiente de verificar",
  suspendida: "Cuenta suspendida",
} as const;

function VolverADocentes() {
  return (
    <Link
      to={paths.admin.docentes}
      className="mb-4 inline-flex min-h-8 items-center gap-1.5 text-sm text-accent hover:text-paper"
    >
      <ChevronLeft size={16} aria-hidden="true" />
      Docentes
    </Link>
  );
}

/** /admin/docentes/:id: cursos asignados, actividad y estudiantes de un docente (HU-F-519). */
export default function DocenteDetallePage() {
  const { id = "" } = useParams();
  const [parametros, setParametros] = useSearchParams();
  const cuenta = useDetalleUsuario(id);
  const resumen = useResumenActividad(id, 28);
  const lista = useDocentesParaAsignar();
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
        <VolverADocentes />
        {cuenta.error ? (
          <MensajeError mensaje={cuenta.error.message} onReintentar={() => cuenta.refetch()} />
        ) : (
          <EstadoVacio titulo="Esta cuenta no es de un docente." />
        )}
      </PaginaAtril>
    );
  }

  const nombre = [cuenta.data.nombre, cuenta.data.apellido].filter(Boolean).join(" ");
  const ultima = resumen.data?.ultima_actividad;
  const cursos = resumen.data?.cursos;
  const estudiantes = lista.data?.data.find((d) => d.docente_id === id)?.estudiantes;
  const acciones = resumen.data?.por_dia.reduce((suma, d) => suma + d.acciones, 0);
  const mensaje = `${paths.docente.mensajes}?para=${id}&nombre=${encodeURIComponent(nombre)}`;

  return (
    <PaginaAtril
      titulo={nombre}
      descripcion={<span className="font-mono text-xs">{cuenta.data.email}</span>}
    >
      <VolverADocentes />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <span
            className={
              cuenta.data.estado === "activa"
                ? "font-semibold text-success"
                : "font-semibold text-aviso"
            }
          >
            {ESTADO_CUENTA[cuenta.data.estado]}
          </span>
          {resumen.data && (
            <>
              <span>
                <EstadoDeActividad estado={resumen.data.estado_actividad} />
              </span>
              <span>Última actividad: {ultima ? fechaRelativa(ultima) : "nunca"}</span>
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link to={mensaje} className={claseBoton({ variante: "secundario" })}>
            <MessageSquare size={16} aria-hidden="true" />
            Enviar mensaje
          </Link>
          <Link
            to={`${paths.admin.usuarios}?usuario=${id}`}
            className={claseBoton({ variante: "secundario" })}
          >
            <UserCog size={16} aria-hidden="true" />
            Ver en Usuarios
          </Link>
        </div>
      </div>
      <div className="mb-6">
        <CifrasDelDocente cursos={cursos} estudiantes={estudiantes} />
      </div>
      <Tabs
        etiqueta="Secciones del docente"
        activa={pestana}
        onCambiar={(tab) => setParametros({ tab }, { replace: true })}
        pestanas={[
          {
            id: "cursos",
            etiqueta: "Cursos asignados",
            contador: cursos?.length,
            contenido:
              pestana === "cursos" ? (
                <CursosAsignados docenteId={id} nombre={nombre} resumen={cursos} />
              ) : null,
          },
          {
            id: "actividad",
            etiqueta: "Actividad",
            contador: acciones,
            contenido:
              pestana === "actividad" ? (
                <ActividadDelDocente docenteId={id} nombre={nombre} mensaje={mensaje} />
              ) : null,
          },
          {
            id: "estudiantes",
            etiqueta: "Estudiantes",
            contador: estudiantes,
            contenido:
              pestana === "estudiantes" ? <EstudiantesDelDocente cursos={cursos ?? []} /> : null,
          },
        ]}
      />
    </PaginaAtril>
  );
}
