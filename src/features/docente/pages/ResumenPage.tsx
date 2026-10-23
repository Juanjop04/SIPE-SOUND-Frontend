import { EstadoVacio } from "@/shared/ui";
import { PaginaAtril } from "../components/PaginaAtril";

// El contenido de esta sección llega en las HU-F-307 a F-310.
export default function ResumenPage() {
  return (
    <PaginaAtril
      titulo="Resumen"
      descripcion="Tus cursos, estudiantes y evaluaciones de un vistazo."
    >
      <EstadoVacio
        titulo="Tu atril está listo."
        descripcion="Cuando crees tu primer curso, aquí verás quién practicó esta semana y a quién escribirle."
      />
    </PaginaAtril>
  );
}
