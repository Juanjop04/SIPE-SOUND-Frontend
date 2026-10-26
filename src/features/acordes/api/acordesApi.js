import { http } from "@/shared/api/httpClient.js";

export const acordesApi = {
  listar: () => http.get("/acordes"),
  // Video guía de un acorde (HU-B-410). El catálogo es global: solo el administrador.
  /** @param {number} id @param {{ video_url: string, video_inicio_seg: number | null }} datos */
  ponerVideo: (id, datos) => http.conMensaje("PUT", `/admin/acordes/${id}/video`, datos),
  /** @param {number} id */
  quitarVideo: (id) => http.conMensaje("DELETE", `/admin/acordes/${id}/video`),
};
