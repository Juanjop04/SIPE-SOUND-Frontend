import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api/httpClient.js";
import { useAviso } from "@/shared/ui";

/** Fila de GET /docente/cursos/disponibles (HU-B-413): un curso activo que no tiene docente. */
export interface CursoDisponible {
  id: number;
  nombre: string;
  descripcion: string | null;
  nivel: string;
  estudiantes: number;
  bloques_en_ruta: number;
}

const CLAVE = ["docente", "cursos-disponibles"] as const;

export function useCursosDisponibles(habilitado: boolean) {
  return useQuery({
    queryKey: CLAVE,
    queryFn: (): Promise<CursoDisponible[]> => http.get("/docente/cursos/disponibles"),
    enabled: habilitado,
  });
}

/** Asignarme o retirarme cambia mis cursos, los disponibles y las cifras del atril. */
function useCambioDeAsignacion(accion: "asignarme" | "retirarme") {
  const queryClient = useQueryClient();
  const { avisar } = useAviso();
  return useMutation({
    mutationFn: (cursoId: number) =>
      http.conMensaje("POST", `/docente/cursos/${cursoId}/${accion}`),
    onSuccess: ({ message }) => {
      avisar({ mensaje: message });
      void queryClient.invalidateQueries({ queryKey: ["docente"] });
    },
    // 409: otro docente se adelantó. Se vuelve a pedir la lista para que desaparezca.
    onError: (error) => {
      avisar({ mensaje: error.message, tipo: "error" });
      void queryClient.invalidateQueries({ queryKey: CLAVE });
    },
  });
}

export const useAsignarme = () => useCambioDeAsignacion("asignarme");
export const useRetirarme = () => useCambioDeAsignacion("retirarme");
