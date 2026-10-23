// Sesión contra el backend (HU-F-207 / HU-B-322). El frontend no usa Supabase:
// - access token: solo en memoria (se pierde al recargar y se recupera con la cookie).
// - refresh token: cookie httpOnly "sipe_refresh" que pone el backend; JavaScript no la ve.
import { ApiError } from "./ApiError.js";
import { enviar } from "./httpClient.js";

// Se renueva un poco antes de que venza para no enviar un token caducado.
const MARGEN_RENOVACION_MS = 30_000;

let sesionActual = null;
let renovacionEnCurso = null;
// Tras un 401 al renovar ya sabemos que no hay cookie: no se vuelve a preguntar
// en cada petición de un visitante hasta que inicie sesión.
let sinSesionConfirmado = false;

// Quien necesite enterarse de los cambios (AuthProvider) se suscribe aquí.
const suscriptores = new Set();
// El access token vive en memoria de cada pestaña: las demás se enteran por este canal.
const CANAL_SESION = "sipe-sesion";
const AVISO_INICIO = "inicio";
const AVISO_CIERRE = "cierre";
const canal = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(CANAL_SESION);

function notificar() {
  suscriptores.forEach((escuchar) => escuchar(sesionActual));
}

/** Llama a `escuchar(sesion | null)` en cada inicio, renovación o cierre. Devuelve la baja. */
export function suscribirSesion(escuchar) {
  suscriptores.add(escuchar);
  return () => suscriptores.delete(escuchar);
}

function auth(metodo, ruta, opciones = {}) {
  return enviar(metodo, `/auth${ruta}`, { body: {}, ...opciones, conCredenciales: true }).then(
    (cuerpo) => cuerpo.data,
  );
}

// Errores de validación: "campo: mensaje" → solo los mensajes, en una línea.
function conDetalle(error) {
  if (error instanceof ApiError && error.status === "VALIDACION" && error.errors.length) {
    error.message = Object.values(error.porCampo).join(" ");
  }
  throw error;
}

function guardar(datos) {
  sinSesionConfirmado = false;
  sesionActual = {
    accessToken: datos.access_token,
    expiraEn: (datos.expira_en ?? 0) * 1000,
    usuario: datos.usuario,
  };
  notificar();
  return sesionActual;
}

function estaVigente(sesion) {
  return sesion && sesion.expiraEn - MARGEN_RENOVACION_MS > Date.now();
}

function descartarTrasFallo(error) {
  sesionActual = null;
  if (error instanceof ApiError && error.statusCode === 401) sinSesionConfirmado = true;
  notificar();
  return null;
}

/** Nuevo access token con la cookie. Varias llamadas a la vez comparten una sola petición. */
export function renovarSesion() {
  renovacionEnCurso ??= auth("POST", "/sesion/renovar")
    .then(guardar)
    .catch(descartarTrasFallo)
    .finally(() => {
      renovacionEnCurso = null;
    });
  return renovacionEnCurso;
}

export function olvidarSesion() {
  sesionActual = null;
  sinSesionConfirmado = true;
  notificar();
}

export async function registrarCuenta({ nombre, email, password }) {
  return auth("POST", "/registro", { body: { nombre, email, password } }).catch(conDetalle);
}

export async function iniciarSesion(email, password) {
  const sesion = guardar(
    await auth("POST", "/sesion", { body: { email, password } }).catch(conDetalle),
  );
  canal?.postMessage(AVISO_INICIO);
  return sesion;
}

export async function cerrarSesion() {
  const token = sesionActual?.accessToken;
  olvidarSesion();
  canal?.postMessage(AVISO_CIERRE);
  await auth("DELETE", "/sesion", { token });
}

// Otra pestaña inició sesión: la cookie es compartida, basta con renovar.
// Otra pestaña la cerró: se olvida también aquí.
if (canal) {
  canal.onmessage = ({ data }) => {
    if (data === AVISO_INICIO) {
      sinSesionConfirmado = false;
      renovarSesion();
    } else if (data === AVISO_CIERRE) {
      olvidarSesion();
    }
  };
}

/** Sesión vigente o null. Nunca lanza: sin conexión o sin cookie equivale a no tener sesión. */
export async function obtenerSesion() {
  if (estaVigente(sesionActual)) return sesionActual;
  if (sinSesionConfirmado) return null;
  return renovarSesion();
}
