import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api/httpClient.js";
import { useAviso } from "@/shared/ui";

export type EstadoSolicitudNombre = "pendiente" | "aceptada" | "rechazada";
export type RolSolicitante = "estudiante" | "docente";

/** Fila de GET /admin/solicitudes-nombre (HU-B-415): quién la envió, sin correo. */
export interface SolicitudDeNombre {
  id: string;
  usuario_id: string;
  nombre: string;
  apellido: string | null;
  rol: RolSolicitante;
  /** Si hoy ya puede editar su nombre. */
  puede_editar_nombre: boolean;
  mensaje: string;
  estado: EstadoSolicitudNombre;
  creado_en: string;
  resuelta_en: string | null;
  resuelta_por_nombre: string | null;
  resuelta_por_apellido: string | null;
}

export type TotalesPorRol = Record<RolSolicitante, Record<EstadoSolicitudNombre, number>>;

export interface PaginaDeSolicitudesDeNombre {
  data: SolicitudDeNombre[];
  meta: { totales: TotalesPorRol };
}

export const solicitudesNombreKeys = {
  todo: ["admin", "solicitudes-nombre"] as const,
  lista: (rol: RolSolicitante, estado: EstadoSolicitudNombre) =>
    [...solicitudesNombreKeys.todo, "lista", rol, estado] as const,
};

export function useSolicitudesDeNombre(rol: RolSolicitante, estado: EstadoSolicitudNombre) {
  return useQuery({
    queryKey: solicitudesNombreKeys.lista(rol, estado),
    queryFn: (): Promise<PaginaDeSolicitudesDeNombre> =>
      http.getPaginado("/admin/solicitudes-nombre", { rol, estado }),
    placeholderData: keepPreviousData,
  });
}

/** Aceptar habilita el cambio de nombre de esa cuenta; rechazar solo la cierra. */
export function useResolverSolicitudDeNombre() {
  const queryClient = useQueryClient();
  const { avisar } = useAviso();
  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: "aceptada" | "rechazada" }) =>
      http.conMensaje("PATCH", `/admin/solicitudes-nombre/${id}`, { estado }),
    onSuccess: ({ message }) => {
      avisar({ mensaje: message });
      void queryClient.invalidateQueries({ queryKey: solicitudesNombreKeys.todo });
      // El permiso cambió en la lista de usuarios.
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (error) => avisar({ mensaje: error.message, tipo: "error" }),
  });
}
