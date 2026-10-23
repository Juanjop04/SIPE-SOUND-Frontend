import { http } from "@/shared/api/httpClient.js";

export const evaluacionesApi = {
  obtener: (id) => http.get(`/evaluaciones/${id}`),
  // respuestas: { [preguntaId]: indiceElegido }
  presentarIntento: (id, respuestas) => http.post(`/evaluaciones/${id}/intentos`, { respuestas }),
};
