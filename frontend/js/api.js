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

// =========================================================
// Rutas de PROGRESO — requieren que el usuario haya iniciado sesión.
// Se manda el token de Supabase en el header Authorization.
// =========================================================

// Trae la sesión activa (y su token) desde el cliente de Supabase
async function obtenerToken() {
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session) {
    throw new Error("No has iniciado sesión");
  }
  return data.session.access_token;
}

async function obtenerProgreso() {
  const token = await obtenerToken();
  const res = await fetch(`${API_URL}/progreso`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Error al obtener el progreso");
  return res.json();
}

async function guardarProgreso({ tipo, contenido_id, porcentaje = 0, completado = false }) {
  const token = await obtenerToken();
  const res = await fetch(`${API_URL}/progreso`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ tipo, contenido_id, porcentaje, completado })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al guardar el progreso");
  return data;
}
