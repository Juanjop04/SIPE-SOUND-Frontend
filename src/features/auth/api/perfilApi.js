import { http } from "@/shared/api/httpClient.js";

export const perfilApi = {
  // El rol sale de la base (profiles), nunca del token (HU-B-304).
  obtener: () => http.get("/me"),
};

export const perfilKeys = {
  todo: ["perfil"],
  actual: () => [...perfilKeys.todo, "actual"],
};
