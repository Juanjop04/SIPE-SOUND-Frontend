import { EstadoVacio } from "@/shared/ui";
import { PaginaAtril } from "../components/PaginaAtril";

// El contenido de esta sección llega en las HU-F-307 a F-310.
export default function CursosPage() {
  return (
    <PaginaAtril
      titulo="Cursos"
      descripcion="Grupos de estudiantes a tu cargo, cada uno con su código de invitación."
    >
      <EstadoVacio
        titulo="Aún no tienes cursos."
        descripcion="Aquí vas a crear tus cursos y compartir el código con tu grupo."
      />
    </PaginaAtril>
  );
}
