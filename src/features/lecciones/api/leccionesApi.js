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
