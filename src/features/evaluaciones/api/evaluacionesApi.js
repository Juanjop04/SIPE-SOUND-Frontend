import { obtenerToken } from "@/shared/api/sesion.js";

const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerQuiz(bloqueId) {
  const res = await fetch(`${API_URL}/quiz/${bloqueId}`);
  if (!res.ok) throw new Error("Error al obtener el quiz");
  return res.json();
}

// --- Rutas que requieren sesion activa ---

// respuestas: { [preguntaId]: indiceElegido }
export async function verificarQuiz(bloqueId, respuestas) {
  const token = await obtenerToken();
  const res = await fetch(`${API_URL}/quiz/${bloqueId}/verificar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ respuestas }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al calificar el quiz");
  return data;
}
