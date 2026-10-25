import { useEffect } from "react";

/**
 * Mientras la página está montada, el navegador no envía `Referer` a otros sitios. Se usa donde la
 * URL llevó un secreto (el enlace de restablecer contraseña): aunque el token ya no esté en la
 * barra, ningún recurso externo debe enterarse de dónde viene la persona.
 */
export function useReferrerNulo() {
  // Sincroniza con el <head> del documento (sistema externo), no pide datos.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}
