const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerEjercicios() {
  const res = await fetch(`${API_URL}/ejercicios`);
  if (!res.ok) throw new Error("Error al obtener ejercicios");
  return res.json();
}
