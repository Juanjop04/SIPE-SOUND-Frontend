import { supabase } from "./supabaseClient.js";

const API_URL = "http://localhost:5000/api";

export async function obtenerLecciones() {
  const res = await fetch(`${API_URL}/lecciones`);
  if (!res.ok) throw new Error("Error al obtener lecciones");
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

// --- Progreso (requieren sesión activa) ---

async function obtenerToken() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("No has iniciado sesión");
  return data.session.access_token;
}

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
