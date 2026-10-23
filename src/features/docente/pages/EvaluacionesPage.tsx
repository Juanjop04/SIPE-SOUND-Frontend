import { EstadoVacio } from "@/shared/ui";
import { PaginaAtril } from "../components/PaginaAtril";

// El contenido de esta sección llega en las HU-F-307 a F-310.
export default function EvaluacionesPage() {
  return (
    <PaginaAtril
      titulo="Evaluaciones"
      descripcion="Preguntas para comprobar lo aprendido y los resultados de tu grupo."
    >
      <EstadoVacio
        titulo="Aún no tienes evaluaciones."
        descripcion="Aquí vas a armar evaluaciones y ver qué pregunta le cuesta más a tu grupo."
      />
    </PaginaAtril>
  );
}
