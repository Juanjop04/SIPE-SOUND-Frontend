import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";
import { useNoLeidos } from "../hooks";

/**
 * Contador junto a "Mensajes": el número en mono y el texto accesible ("Mensajes, 3 sin leer").
 * Con 0 no se muestra nada visible (la etiqueta del enlace ya dice "Mensajes").
 */
export function ContadorNoLeidos() {
  const total = useNoLeidos();
  if (total === 0) return null;
  return (
    <>
      <span aria-hidden="true" className="ml-auto font-mono text-xs tabular-nums">
        {total}
      </span>
      <span className="sr-only">, {total} sin leer</span>
    </>
  );
}

/** Móvil: la barra inferior ya tiene 5 destinos, así que Mensajes va como ícono en el encabezado. */
export function AtajoMensajes() {
  const { usuario } = useSession();
  const total = useNoLeidos();
  if (!usuario) return null;
  return (
    <Link
      to={paths.mensajes}
      className="relative inline-flex h-10 items-center gap-1 text-muted transition-colors duration-rapida hover:text-paper sm:hidden"
    >
      <Mail size={20} aria-hidden="true" />
      {total > 0 && (
        <span aria-hidden="true" className="font-mono text-xs tabular-nums text-paper">
          {total}
        </span>
      )}
      <span className="sr-only">{total > 0 ? `Mensajes, ${total} sin leer` : "Mensajes"}</span>
    </Link>
  );
}
