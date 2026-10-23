import { obtenerToken } from "@/shared/api/obtenerToken.js";

const API_URL = import.meta.env.VITE_API_URL;

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
