import { EstadoVacio } from "@/shared/ui";
import { PaginaAtril } from "../components/PaginaAtril";

// El contenido de esta sección llega en las HU-F-307 a F-310.
export default function ContenidoPage() {
  return (
    <PaginaAtril
      titulo="Contenido"
      descripcion="Lecciones y ejercicios que escribes para tus cursos."
    >
      <EstadoVacio
        titulo="Aún no has escrito contenido."
        descripcion="Aquí vas a escribir lecciones y ejercicios con su BPM, compás y pasos."
      />
    </PaginaAtril>
  );
}
