import { PaginaAtril } from "@/features/docente";
import { EstadoVacio, MensajeError, Skeleton } from "@/shared/ui";
import { TrasteDivider } from "@/shared/music";
import { FormularioPreautorizar } from "../components/FormularioPreautorizar";
import { TablaPreautorizaciones } from "../components/TablaPreautorizaciones";
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

/** Preautorización de docentes (solo admin, HU-F-313 / HU-B-321). */
export default function DocentesPage() {
  return (
    <PaginaAtril
      titulo="Docentes"
      descripcion="Autoriza el correo de cada profesor antes de que se registre: entra directo a su atril."
    >
      <FormularioPreautorizar />
      <TrasteDivider className="my-8" />
      <Lista />
    </PaginaAtril>
  );
}
