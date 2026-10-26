import { useQuery } from "@tanstack/react-query";
import { http } from "@/shared/api/httpClient.js";

/** Forma de GET /terminos (HU-B-411): el texto vigente en Markdown y su versión. */
export interface TerminosVigentes {
  version: number;
  contenido: string;
  actualizado_en: string;
}

export const terminosKeys = { vigente: () => ["terminos", "vigente"] as const };

export const terminosApi = {
  vigente: (): Promise<TerminosVigentes> => http.get("/terminos"),
  /** Acepta la versión vigente; 409 si cambió mientras se leía. */
  aceptar: (version: number) => http.conMensaje("POST", "/me/terminos", { version }),
};

export function useTerminosVigentes() {
  return useQuery({ queryKey: terminosKeys.vigente(), queryFn: terminosApi.vigente });
}
