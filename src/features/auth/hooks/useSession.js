import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider.jsx";

/** { sesion, usuario, estaCargando, cerrarSesion } — requiere AuthProvider (AppProviders). */
export function useSession() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useSession debe usarse dentro de AuthProvider");
  return contexto;
}
