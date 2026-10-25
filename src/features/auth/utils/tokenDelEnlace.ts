// secrets.token_urlsafe(32) del backend: 43 caracteres base64url.
const PATRON_TOKEN = /^[A-Za-z0-9_-]{43}$/;

/**
 * Token del enlace de restablecer contraseña: va en el FRAGMENTO (`#token=…`), que el navegador
 * no envía al servidor. Devuelve null si falta o no tiene la forma esperada (no se pregunta al
 * backend por un valor que no puede ser válido).
 */
export function leerTokenDelFragmento(fragmento: string): string | null {
  const valor = new URLSearchParams(fragmento.replace(/^#/, "")).get("token")?.trim() ?? "";
  return PATRON_TOKEN.test(valor) ? valor : null;
}

/** Quita el fragmento de la barra de direcciones sin recargar ni crear otra entrada del historial. */
export function borrarFragmentoDeLaUrl(): void {
  if (!window.location.hash) return;
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, "", pathname + search);
}
