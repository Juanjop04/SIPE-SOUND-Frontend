import { Link } from "react-router-dom";
import { Music } from "lucide-react";
import { useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";

/** Móvil con sesión: la barra inferior prioriza Mis cursos, así que Acordes va en el encabezado. */
export function AtajoAcordes() {
  const { usuario } = useSession();
  if (!usuario) return null;
  return (
    <Link
      to={paths.acordes}
      className="inline-flex h-10 items-center text-muted transition-colors duration-rapida hover:text-paper sm:hidden"
    >
      <Music size={20} aria-hidden="true" />
      <span className="sr-only">Acordes</span>
    </Link>
  );
}
