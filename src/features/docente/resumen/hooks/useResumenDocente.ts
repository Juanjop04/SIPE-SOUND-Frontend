import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { docenteApi, docenteKeys } from "../datos";

export function useResumenDocente() {
  return useQuery({ queryKey: docenteKeys.resumen(), queryFn: docenteApi.resumen });
}

interface Comentario {
  cursoId: number;
  estudianteId: string;
  mensaje: string;
}

/** POST …/retroalimentaciones: el estudiante lo ve en su curso (HU-F-311). */
export function useComentarEstudiante() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cursoId, estudianteId, mensaje }: Comentario) =>
      docenteApi.comentar(cursoId, estudianteId, mensaje),
    onSuccess: (_datos, { cursoId }) => {
      queryClient.invalidateQueries({ queryKey: docenteKeys.resumen() });
      queryClient.invalidateQueries({ queryKey: docenteKeys.estudiantes(cursoId) });
    },
  });
}
