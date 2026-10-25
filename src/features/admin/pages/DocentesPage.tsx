import { useSearchParams } from "react-router-dom";
import { PaginaAtril } from "@/features/docente";
import { EstadoVacio, MensajeError, Skeleton, Tabs } from "@/shared/ui";
import { TrasteDivider } from "@/shared/music";
import { FormularioPreautorizar } from "../components/FormularioPreautorizar";
import { TablaPreautorizaciones } from "../components/TablaPreautorizaciones";
import { PestanaDocentes } from "../cursos/components/PestanaDocentes";
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
    <>
      <FormularioPreautorizar />
      <TrasteDivider className="my-8" />
      <Lista />
    </>
  );
}

const PESTANAS = [
  { id: "docentes", etiqueta: "Docentes", contenido: <PestanaDocentes /> },
  { id: "preautorizaciones", etiqueta: "Preautorizaciones", contenido: <Preautorizaciones /> },
];

/** Docentes con sus cursos y preautorizaciones (solo admin, HU-F-313 / HU-F-405). */
export default function DocentesPage() {
  const [parametros, setParametros] = useSearchParams();
  const tab = parametros.get("tab");
  const activa = PESTANAS.some((p) => p.id === tab) ? (tab ?? "docentes") : "docentes";

  return (
    <PaginaAtril
      titulo="Docentes"
      descripcion="Sus cursos y estudiantes, y la autorización del correo de cada profesor antes de que se registre."
    >
      <Tabs
        etiqueta="Secciones de docentes"
        activa={activa}
        onCambiar={(id) => setParametros({ tab: id }, { replace: true })}
        pestanas={PESTANAS}
      />
    </PaginaAtril>
  );
}
