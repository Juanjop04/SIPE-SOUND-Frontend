// =========================================================
// Funciones para hablar con TU BACKEND (Flask), no con Supabase.
// El backend corre en http://localhost:5000 mientras desarrollas.
// =========================================================

const API_URL = "http://localhost:5000/api";

async function obtenerLecciones() {
  const res = await fetch(`${API_URL}/lecciones`);
  if (!res.ok) throw new Error("Error al obtener lecciones");
  return res.json();
}

async function obtenerLeccion(id) {
  const res = await fetch(`${API_URL}/lecciones/${id}`);
  if (!res.ok) throw new Error("Error al obtener la lección");
  return res.json();
}

async function obtenerAcordes() {
  const res = await fetch(`${API_URL}/acordes`);
  if (!res.ok) throw new Error("Error al obtener acordes");
  return res.json();
}

async function obtenerEjercicios() {
  const res = await fetch(`${API_URL}/ejercicios`);
  if (!res.ok) throw new Error("Error al obtener ejercicios");
  return res.json();
}
