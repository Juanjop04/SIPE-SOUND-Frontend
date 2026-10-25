// Enlaces de YouTube (HU-F-408). Función pura con las mismas reglas que app/core/youtube.py del
// backend: si cambia una, cambia la otra. Nunca llama a la red.

/** Lo que devuelven las lecturas del backend (`video`): solo el id y el segundo de inicio. */
export interface VideoGuiaDatos {
  youtube_id: string;
  inicio_seg: number | null;
}

export const VIDEO_URL_MAX = 300;
export const VIDEO_INICIO_MAX = 43_200;
export const MENSAJE_VIDEO =
  "Pega el enlace de un video de YouTube (por ejemplo, https://youtu.be/…).";

const PATRON_ID = /^[A-Za-z0-9_-]{11}$/;
// 90, 90s, 1m30s, 1h2m3s
const PATRON_TIEMPO = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;
const HOSTS_YOUTUBE = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
]);
const HOSTS_CORTOS = new Set(["youtu.be", "www.youtu.be"]);
const HOSTS_SIN_COOKIES = new Set(["youtube-nocookie.com", "www.youtube-nocookie.com"]);
const TIPOS_DE_RUTA = new Set(["embed", "shorts", "live"]);

function idDe(host: string, ruta: string, consulta: URLSearchParams): string | null {
  const partes = ruta.split("/").filter(Boolean);
  if (HOSTS_CORTOS.has(host)) return partes[0] ?? null;
  if (HOSTS_YOUTUBE.has(host) && partes.length === 1 && partes[0] === "watch") {
    return consulta.get("v");
  }
  const admiteRuta = HOSTS_YOUTUBE.has(host) || HOSTS_SIN_COOKIES.has(host);
  if (admiteRuta && partes.length === 2 && TIPOS_DE_RUTA.has(partes[0])) return partes[1];
  return null;
}

/** "90", "90s" o "1m30s" → 90. Un valor ilegible o fuera de rango se ignora (null). */
function segundos(texto: string | null): number | null {
  const limpio = texto?.trim().toLowerCase();
  if (!limpio) return null;
  let total: number;
  if (/^\d+$/.test(limpio)) {
    total = Number(limpio);
  } else {
    const partes = PATRON_TIEMPO.exec(limpio);
    if (!partes || !partes.slice(1).some(Boolean)) return null;
    const [, horas, minutos, segs] = partes;
    total = Number(horas ?? 0) * 3600 + Number(minutos ?? 0) * 60 + Number(segs ?? 0);
  }
  return total <= VIDEO_INICIO_MAX ? total : null;
}

export interface VideoExtraido {
  id: string;
  /** El `t=` o `start=` del enlace, si trae. */
  inicioSeg: number | null;
}

/**
 * De un enlace saca el id del video (11 caracteres) y, si trae, el segundo de inicio. Devuelve
 * null si no es un enlace de YouTube: otro dominio, lista sin `v=` o más de 300 caracteres.
 */
export function extraerVideo(url: string): VideoExtraido | null {
  let texto = url.trim();
  if (!texto || texto.length > VIDEO_URL_MAX) return null;
  if (!texto.includes("://")) texto = `https://${texto}`;
  let enlace: URL;
  try {
    enlace = new URL(texto);
  } catch {
    return null;
  }
  if (enlace.protocol !== "http:" && enlace.protocol !== "https:") return null;
  const id = idDe(enlace.hostname.toLowerCase(), enlace.pathname, enlace.searchParams);
  if (id === null || !PATRON_ID.test(id)) return null;
  // El tiempo puede venir en la consulta (?t=, ?start=) o en el fragmento (#t=).
  const fragmento = new URLSearchParams(enlace.hash.replace(/^#/, ""));
  for (const origen of [enlace.searchParams, fragmento]) {
    for (const clave of ["t", "start"]) {
      const inicio = segundos(origen.get(clave));
      if (inicio !== null) return { id, inicioSeg: inicio };
    }
  }
  return { id, inicioSeg: null };
}

/** 42 → "0:42"; 3725 → "1:02:05". */
export function formatearInicio(total: number): string {
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const resto = String(total % 60).padStart(2, "0");
  if (horas === 0) return `${minutos}:${resto}`;
  return `${horas}:${String(minutos).padStart(2, "0")}:${resto}`;
}

/** "m:ss" (o "h:mm:ss", o solo segundos) → segundos; null si no se entiende o pasa de 12 h. */
export function leerInicio(texto: string): number | null {
  const limpio = texto.trim();
  if (!limpio) return null;
  const partes = limpio.split(":");
  if (partes.length > 3 || !partes.every((p) => /^\d+$/.test(p))) return null;
  const total = partes.reduce((suma, p) => suma * 60 + Number(p), 0);
  return total <= VIDEO_INICIO_MAX ? total : null;
}

/** Enlace corto para volver a mostrar en el editor un video ya guardado (solo trae el id). */
export const enlaceDeVideo = (id: string) => `https://youtu.be/${id}`;

/** URL del reproductor sin cookies. Solo se usa al pulsar "Reproducir video". */
export function urlDeReproductor(id: string, inicioSeg: number | null): string {
  const consulta = new URLSearchParams({ rel: "0", playsinline: "1", autoplay: "1" });
  if (inicioSeg) consulta.set("start", String(inicioSeg));
  return `https://www.youtube-nocookie.com/embed/${id}?${consulta.toString()}`;
}
