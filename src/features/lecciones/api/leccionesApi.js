import { http } from "@/shared/api/httpClient.js";

export const leccionesApi = {
  obtener: (id) => http.get(`/lecciones/${id}`),
};
