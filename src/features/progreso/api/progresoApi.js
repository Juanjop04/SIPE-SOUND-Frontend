import { http } from "@/shared/api/httpClient.js";

export const progresoApi = {
  resumen: () => http.get("/progreso/resumen"),
  /** @param {number} dias */
  actividad: (dias) => http.get("/progreso/actividad", { dias }),
  registrarLeccion: (id, avance) => http.put(`/progreso/lecciones/${id}`, avance),
  registrarEjercicio: (id, avance) => http.put(`/progreso/ejercicios/${id}`, avance),
};
