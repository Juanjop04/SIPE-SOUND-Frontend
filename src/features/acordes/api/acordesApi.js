import { http } from "@/shared/api/httpClient.js";

export const acordesApi = {
  listar: () => http.get("/acordes"),
};
