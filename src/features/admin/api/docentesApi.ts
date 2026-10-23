import { http } from "@/shared/api/httpClient.js";
import type { Preautorizacion } from "../types";

const RUTA = "/admin/docentes/preautorizaciones";

export const docentesApi = {
  listar: (): Promise<Preautorizacion[]> => http.get(RUTA),
  /** 201 con el message del backend ("Listo: … será docente cuando confirme su correo."). */
  preautorizar: (email: string): Promise<{ data: Preautorizacion; message: string }> =>
    http.conMensaje("POST", RUTA, { email }),
  retirar: (email: string): Promise<{ data: null; message: string }> =>
    http.conMensaje("DELETE", `${RUTA}/${encodeURIComponent(email)}`),
};

export const docentesKeys = {
  todas: ["admin", "preautorizaciones"] as const,
};
