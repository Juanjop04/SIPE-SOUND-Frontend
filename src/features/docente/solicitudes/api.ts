import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api/httpClient.js";
import { useAviso } from "@/shared/ui";

export type EstadoSolicitud = "pendiente" | "aceptada" | "rechazada";

/** Fila de GET /docente/solicitudes-inscripcion (HU-B-414). Sin correos. */
export interface SolicitudDeInscripcion {
  id: string;
  curso_id: number;
  curso: string;
  /** Solo el administrador puede resolver las de un curso sin docente. */
  curso_sin_docente: boolean;
  estudiante_id: string;
  nombre: string;
  apellido: string | null;
  estado: EstadoSolicitud;
  creado_en: string;
  resuelta_en: string | null;
  resuelta_por_nombre: string | null;
  resuelta_por_apellido: string | null;
}

export type TotalesDeSolicitudes = Record<EstadoSolicitud, number>;

export interface PaginaDeSolicitudes {
  data: SolicitudDeInscripcion[];
  meta: { totales: TotalesDeSolicitudes };
}

export const solicitudesKeys = {
  todo: ["docente", "solicitudes-inscripcion"] as const,
  lista: (estado: EstadoSolicitud, curso: number | null) =>
    [...solicitudesKeys.todo, "lista", estado, curso] as const,
};

export function useSolicitudes(estado: EstadoSolicitud, curso: number | null) {
  return useQuery({
    queryKey: solicitudesKeys.lista(estado, curso),
    queryFn: (): Promise<PaginaDeSolicitudes> =>
      http.getPaginado("/docente/solicitudes-inscripcion", {
        estado,
        curso_id: curso ?? undefined,
      }),
    placeholderData: keepPreviousData,
  });
}

/** Aceptar crea la inscripción; rechazar solo la cierra. Refresca el panel y los cursos. */
export function useResolverSolicitud() {
  const queryClient = useQueryClient();
  const { avisar } = useAviso();
  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: "aceptada" | "rechazada" }) =>
      http.conMensaje("PATCH", `/docente/solicitudes-inscripcion/${id}`, { estado }),
    onSuccess: ({ message }) => {
      avisar({ mensaje: message });
      void queryClient.invalidateQueries({ queryKey: solicitudesKeys.todo });
      // Un estudiante nuevo cambia las cifras de los cursos y del panel (claves de docente/cursos).
      void queryClient.invalidateQueries({ queryKey: ["docente"] });
    },
    onError: (error) => avisar({ mensaje: error.message, tipo: "error" }),
  });
}
