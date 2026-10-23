import { http } from "@/shared/api/httpClient.js";

export const ejerciciosApi = {
  listar: () => http.get("/ejercicios"),
};
