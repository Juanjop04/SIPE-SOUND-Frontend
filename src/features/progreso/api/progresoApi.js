import { http } from "@/shared/api/httpClient.js";

export const progresoApi = {
  resumen: () => http.get("/progreso/resumen"),
  registrarLeccion: (id, avance) => http.put(`/progreso/lecciones/${id}`, avance),
  registrarEjercicio: (id, avance) => http.put(`/progreso/ejercicios/${id}`, avance),
};
