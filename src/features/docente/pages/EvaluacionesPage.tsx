import { PaginaAtril } from "../components/PaginaAtril";
import { ListaEvaluaciones } from "../evaluaciones/components/ListaEvaluaciones";

/** Evaluaciones de todos mis cursos (HU-F-310). */
export default function EvaluacionesPage() {
  return (
    <PaginaAtril
      titulo="Evaluaciones"
      descripcion="Preguntas para comprobar lo aprendido y los resultados de tu grupo."
    >
      <ListaEvaluaciones />
    </PaginaAtril>
  );
}
