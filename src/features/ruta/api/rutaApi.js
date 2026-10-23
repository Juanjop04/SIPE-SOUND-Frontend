import { http } from "@/shared/api/httpClient.js";

export const rutaApi = {
  // Con sesión trae el estado de cada bloque y el mejor puntaje; sin sesión, todos disponibles.
  obtener: (filtros) => http.get("/ruta", filtros),
};
