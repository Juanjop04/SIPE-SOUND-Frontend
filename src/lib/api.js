import { obtenerToken } from "@/shared/api/obtenerToken.js";

const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerLecciones() {
  const res = await fetch(`${API_URL}/lecciones`);
  if (!res.ok) throw new Error("Error al obtener lecciones");
  return res.json();
}

export async function obtenerLeccion(id) {
  const res = await fetch(`${API_URL}/lecciones/${id}`);
  if (!res.ok) throw new Error("Error al obtener la leccion");
  return res.json();
}

export async function obtenerAcordes() {
  const res = await fetch(`${API_URL}/acordes`);
  if (!res.ok) throw new Error("Error al obtener acordes");
  return res.json();
}

export async function obtenerEjercicios() {
  const res = await fetch(`${API_URL}/ejercicios`);
  if (!res.ok) throw new Error("Error al obtener ejercicios");
  return res.json();
}

export async function obtenerBloques() {
  const res = await fetch(`${API_URL}/bloques`);
  if (!res.ok) throw new Error("Error al obtener bloques");
  return res.json();
}

export async function obtenerQuiz(bloqueId) {
  const res = await fetch(`${API_URL}/quiz/${bloqueId}`);
  if (!res.ok) throw new Error("Error al obtener el quiz");
  return res.json();
}

// --- Rutas que requieren sesion activa ---

export async function obtenerProgreso() {
  const token = await obtenerToken();
  const res = await fetch(`${API_URL}/progreso`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener el progreso");
  return res.json();
}

export async function guardarProgreso({ tipo, contenido_id, porcentaje = 0, completado = false }) {
  const token = await obtenerToken();
  const res = await fetch(`${API_URL}/progreso`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tipo, contenido_id, porcentaje, completado }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al guardar el progreso");
  return data;
}

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
