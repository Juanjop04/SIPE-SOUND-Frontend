import { useSearchParams } from "react-router-dom";
import { PaginaAtril } from "@/features/docente";
import { EstadoVacio, MensajeError, Skeleton, Tabs } from "@/shared/ui";
import { FormularioPreautorizar } from "../components/FormularioPreautorizar";
import { TablaPreautorizaciones } from "../components/TablaPreautorizaciones";
import { PestanaDocentes } from "../docentes/components/PestanaDocentes";
import { ResumenDocentes } from "../docentes/components/ResumenDocentes";
import { useDocentesEnEstado } from "../docentes/hooks";
import { usePreautorizaciones } from "../hooks/usePreautorizaciones";

function Lista() {
  const { data, isPending, error, refetch } = usePreautorizaciones();
  if (isPending) {
    return (
      <div aria-busy="true">
        <Skeleton lineas={4} className="h-11 w-full" />
      </div>
    );
  }
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  if (data.length === 0) {
    return (
      <EstadoVacio
        titulo="Aún no has autorizado docentes."
        descripcion="Escribe arriba el correo del profesor; recibirá el rol al registrarse y confirmar su correo."
      />
    );
  }
  return <TablaPreautorizaciones filas={data} />;
}

function Preautorizaciones() {
  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-[760px]">
        <FormularioPreautorizar />
      </div>
      <Lista />
    </div>
  );
}

const IDS = ["resumen", "docentes", "preautorizaciones"];

/** Docentes con sus cursos y preautorizaciones (solo admin, HU-F-313 / HU-F-405 / HU-F-521). */
export default function DocentesPage() {
  const [parametros, setParametros] = useSearchParams();
  const tab = parametros.get("tab") ?? "";
  const activa = IDS.includes(tab) ? tab : "resumen";
  const activos = useDocentesEnEstado("activo").data?.meta.total;
  const inactivos = useDocentesEnEstado("inactivo").data?.meta.total;
  const sinActividad = useDocentesEnEstado("sin_actividad").data?.meta.total;
  const preautorizadas = usePreautorizaciones().data?.length;
  const total =
    activos === undefined || inactivos === undefined || sinActividad === undefined
      ? undefined
      : activos + inactivos + sinActividad;

  return (
    <PaginaAtril
      titulo={
        <>
          Docentes{" "}
          {total !== undefined && (
            <span className="font-mono text-lg font-normal text-muted">{total}</span>
          )}
        </>
      }
      descripcion="Quién está activo, qué cursos tiene cada docente y qué correos están autorizados para registrarse como docentes."
    >
      <Tabs
        etiqueta="Secciones de docentes"
        activa={activa}
        onCambiar={(id) => setParametros({ tab: id }, { replace: true })}
        pestanas={[
          { id: "resumen", etiqueta: "Resumen", contenido: <ResumenDocentes /> },
          { id: "docentes", etiqueta: "Docentes", contador: total, contenido: <PestanaDocentes /> },
          {
            id: "preautorizaciones",
            etiqueta: "Preautorizaciones",
            contador: preautorizadas,
            contenido: <Preautorizaciones />,
          },
        ]}
      />
    </PaginaAtril>
  );
}
