const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerAcordes() {
  const res = await fetch(`${API_URL}/acordes`);
  if (!res.ok) throw new Error("Error al obtener acordes");
  return res.json();
}
