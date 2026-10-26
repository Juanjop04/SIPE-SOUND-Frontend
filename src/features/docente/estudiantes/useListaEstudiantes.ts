import { useMemo } from "react";
import { useResumenProgreso } from "./datos";
import { useEstudiantesCurso } from "./hooks";
import { useFiltrosEstudiantes } from "./useFiltrosEstudiantes";
import { cumpleFiltro } from "./utils";

/**
 * Estudiantes del curso con los filtros de la URL. Con un filtro rápido llega todo el curso y se
 * filtra aquí; "necesita apoyo" sale del resumen del backend (no se recalcula).
 */
export function useListaEstudiantes(cursoId: number) {
  const url = useFiltrosEstudiantes();
  const resumen = useResumenProgreso(cursoId);
  const consulta = useEstudiantesCurso(cursoId, url.filtros);
  const apoyo = useMemo(
    () => new Set((resumen.data?.necesitan_apoyo ?? []).map((a) => a.estudiante_id)),
    [resumen.data],
  );
  const filas = useMemo(
    () => (consulta.data?.data ?? []).filter((e) => cumpleFiltro(e, url.rapido, apoyo)),
    [consulta.data, url.rapido, apoyo],
  );
  return { ...url, consulta, apoyo, filas };
}
