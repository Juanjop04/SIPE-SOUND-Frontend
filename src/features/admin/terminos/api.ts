import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api/httpClient.js";

/** GET /admin/terminos (HU-B-411): el texto vigente con quién lo modificó. */
export interface TerminosAdmin {
  version: number;
  contenido: string;
  actualizado_en: string;
  /** Nombre de quien lo modificó por última vez; null si su cuenta ya no existe. */
  actualizado_por: string | null;
}

export interface GuardarTerminos {
  contenido: string;
  /** true: todas las cuentas deben volver a aceptarlos; false: corrección menor. */
  nueva_version: boolean;
}

export const terminosAdminKeys = { actual: () => ["admin", "terminos"] as const };

export function useTerminosAdmin() {
  return useQuery({
    queryKey: terminosAdminKeys.actual(),
    queryFn: (): Promise<TerminosAdmin> => http.get("/admin/terminos"),
  });
}

export function useGuardarTerminos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: GuardarTerminos) => http.conMensaje("PUT", "/admin/terminos", datos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: terminosAdminKeys.actual() });
      // El texto público y la versión que ven todos también cambiaron.
      void queryClient.invalidateQueries({ queryKey: ["terminos"] });
    },
  });
}
