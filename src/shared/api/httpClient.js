// Único lugar con fetch (contrato 04 §3). Lee SIEMPRE la respuesta estándar:
// success → devuelve data; si no → lanza ApiError con el message del backend.
import { env } from "@/shared/config/env.js";
import { loginConRegreso, paths } from "@/shared/config/paths.js";
import { ApiError, MENSAJE_SIN_CONEXION, SIN_CONEXION } from "./ApiError.js";
import { obtenerSesion, olvidarSesion, renovarSesion } from "./sesion.js";

// Conectividad baja: no esperar indefinidamente.
const TIMEOUT_MS = 15_000;
const HTTP_NO_AUTENTICADO = 401;

function construirUrl(ruta, params) {
  const url = new URL(env.apiUrl + ruta);
  Object.entries(params ?? {}).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") {
      url.searchParams.set(clave, String(valor));
    }
  });
  return url.toString();
}

function construirCabeceras(token, conCuerpo) {
  const cabeceras = { Accept: "application/json" };
  if (conCuerpo) cabeceras["Content-Type"] = "application/json";
  if (token) cabeceras.Authorization = `Bearer ${token}`;
  return cabeceras;
}

/**
 * Una petición sin lógica de sesión. La usan `http` (abajo) y `sesion` (/auth/*).
 * `conCredenciales` envía cookies: solo para /auth/* (cookie httpOnly del refresh token).
 */
export async function enviar(metodo, ruta, { params, body, token, conCredenciales = false } = {}) {
  const conCuerpo = body !== undefined;
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(construirUrl(ruta, params), {
      method: metodo,
      headers: construirCabeceras(token, conCuerpo),
      body: conCuerpo ? JSON.stringify(body) : undefined,
      credentials: conCredenciales ? "include" : "same-origin",
      signal: controlador.signal,
    });
  } catch {
    throw new ApiError(0, SIN_CONEXION, MENSAJE_SIN_CONEXION);
  } finally {
    clearTimeout(temporizador);
  }
  const cuerpo = await res.json().catch(() => null);
  // Un proxy o una caída devuelven HTML u otra cosa: se trata como falta de conexión.
  if (typeof cuerpo?.success !== "boolean") {
    throw new ApiError(res.status, SIN_CONEXION, MENSAJE_SIN_CONEXION);
  }
  if (!cuerpo.success) {
    throw new ApiError(
      cuerpo.statusCode,
      cuerpo.status,
      cuerpo.message,
      cuerpo.errors,
      cuerpo.meta,
    );
  }
  return cuerpo;
}

function esNoAutenticado(error) {
  return error instanceof ApiError && error.statusCode === HTTP_NO_AUTENTICADO;
}

function irAlLogin() {
  olvidarSesion();
  const { pathname, search } = window.location;
  if (pathname === paths.login) return;
  window.location.assign(loginConRegreso(pathname + search));
}

function redirigirSiNoAutenticado(error) {
  if (esNoAutenticado(error)) irAlLogin();
  throw error;
}

// Adjunta el token si hay sesión. Ante 401: una renovación y un reintento; si vuelve a
// fallar, se cierra la sesión local y se va a /login?volver=<ruta actual>.
async function conSesion(metodo, ruta, opciones) {
  const sesion = await obtenerSesion();
  try {
    return await enviar(metodo, ruta, { ...opciones, token: sesion?.accessToken });
  } catch (error) {
    if (!esNoAutenticado(error) || !sesion) return redirigirSiNoAutenticado(error);
    const renovada = await renovarSesion();
    if (!renovada) return redirigirSiNoAutenticado(error);
    return enviar(metodo, ruta, { ...opciones, token: renovada.accessToken }).catch(
      redirigirSiNoAutenticado,
    );
  }
}

const soloData = (cuerpo) => cuerpo.data;

export const http = {
  get: (ruta, params) => conSesion("GET", ruta, { params }).then(soloData),
  getPaginado: (ruta, params) =>
    conSesion("GET", ruta, { params }).then(({ data, meta, message }) => ({ data, meta, message })),
  post: (ruta, body = {}) => conSesion("POST", ruta, { body }).then(soloData),
  put: (ruta, body = {}) => conSesion("PUT", ruta, { body }).then(soloData),
  patch: (ruta, body = {}) => conSesion("PATCH", ruta, { body }).then(soloData),
  delete: (ruta) => conSesion("DELETE", ruta).then(soloData),
  /** Para mutaciones cuyo aviso usa el `message` del backend. */
  conMensaje: (metodo, ruta, body) =>
    conSesion(metodo, ruta, { body }).then(({ data, message }) => ({ data, message })),
};
