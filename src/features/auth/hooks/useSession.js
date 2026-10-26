import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider.jsx";

/** { sesion, usuario, estaCargando, perfil, rol, cerrarSesion… } — requiere AuthProvider. */
/** @returns {import("../types").ValorSesion} */
export function useSession() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useSession debe usarse dentro de AuthProvider");
  return contexto;
}
