import { http } from "@/shared/api/httpClient.js";

export const leccionesApi = {
  listar: () => http.get("/lecciones"),
  obtener: (id) => http.get(`/lecciones/${id}`),
};
