import { http } from "@/shared/api/httpClient.js";

export const perfilApi = {
  // El rol sale de la base (profiles), nunca del token (HU-B-304).
  obtener: () => http.get("/me"),
};

// El rol cambia muy pocas veces (lo asigna un admin): 10 min de caché.
export const TIEMPO_PERFIL_MS = 10 * 60 * 1000;

export const perfilKeys = {
  todo: ["perfil"],
  actual: () => [...perfilKeys.todo, "actual"],
};
