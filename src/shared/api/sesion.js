// Sesión contra el backend (HU-F-207 / HU-B-322). El frontend no usa Supabase:
// - access token: solo en memoria (se pierde al recargar y se recupera con renovar()).
// - refresh token: cookie httpOnly "sipe_refresh" que pone el backend; JavaScript no la ve.
// Toda petición a /auth/* va con credentials: "include" para que viaje la cookie.

const API_URL = import.meta.env.VITE_API_URL;
// Se renueva un poco antes de que venza para no enviar un token caducado.
const MARGEN_RENOVACION_MS = 30_000;
const SIN_SESION = "No has iniciado sesion";

let sesionActual = null;
let renovacionEnCurso = null;

function mensajeDeError(cuerpo) {
  // Errores de validación: "campo: mensaje" → solo el mensaje, en una línea.
  if (cuerpo?.status === "VALIDACION" && cuerpo.errors?.length) {
    return cuerpo.errors.map((texto) => texto.slice(texto.indexOf(": ") + 2)).join(" ");
  }
  return cuerpo?.message || "Ocurrió un error inesperado. Inténtalo de nuevo.";
}

async function solicitarAuth(ruta, { method = "POST", body = {}, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/auth${ruta}`, {
    method,
    headers,
    credentials: "include",
    body: JSON.stringify(body),
  });
  const cuerpo = await res.json().catch(() => null);
  if (!cuerpo?.success) {
    const error = new Error(mensajeDeError(cuerpo));
    error.status = cuerpo?.status;
    throw error;
  }
  return cuerpo.data;
}

function guardar(datos) {
  sesionActual = {
    accessToken: datos.access_token,
    expiraEn: (datos.expira_en ?? 0) * 1000,
    usuario: datos.usuario,
  };
  return sesionActual;
}

function estaVigente(sesion) {
  return sesion && sesion.expiraEn - MARGEN_RENOVACION_MS > Date.now();
}

async function renovar() {
  // Varias páginas pueden pedir la sesión a la vez: una sola renovación.
  renovacionEnCurso ??= solicitarAuth("/sesion/renovar")
    .then(guardar)
    .catch(() => {
      sesionActual = null;
      return null;
    })
    .finally(() => {
      renovacionEnCurso = null;
    });
  return renovacionEnCurso;
}

export async function registrarCuenta({ nombre, email, password }) {
  return solicitarAuth("/registro", { body: { nombre, email, password } });
}

export async function iniciarSesion(email, password) {
  return guardar(await solicitarAuth("/sesion", { body: { email, password } }));
}

export async function cerrarSesion() {
  const token = sesionActual?.accessToken;
  sesionActual = null;
  await solicitarAuth("/sesion", { method: "DELETE", token });
}

// Sesión vigente o null. Nunca lanza: sin conexión o sin cookie equivale a no tener sesión.
export async function obtenerSesion() {
  if (estaVigente(sesionActual)) return sesionActual;
  return renovar();
}

export async function obtenerToken() {
  const sesion = await obtenerSesion();
  if (!sesion) throw new Error(SIN_SESION);
  return sesion.accessToken;
}
