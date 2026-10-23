
const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerBloques() {
  const res = await fetch(`${API_URL}/bloques`);
  if (!res.ok) throw new Error("Error al obtener bloques");
  return res.json();
}
