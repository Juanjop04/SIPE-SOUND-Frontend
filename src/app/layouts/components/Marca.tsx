import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import logo from "@/assets/brand/logo-120.webp";

/** Logo + nombre; lleva a la ruta (estudiante) o al resumen del atril (docente). */
export function Marca({
  destino = paths.inicio,
  enBarra = false,
  compacta = false,
}: {
  destino?: string;
  /** Sobre la barra lateral morada: texto de barra. */
  enBarra?: boolean;
  /** Menú contraído: solo el logo (el nombre sigue en el DOM para lectores de pantalla). */
  compacta?: boolean;
}) {
  return (
    <Link
      to={destino}
      className={`flex shrink-0 items-center gap-2 ${enBarra ? "text-barra-texto" : "text-paper"}`}
    >
      <img src={logo} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
      <span
        className={`whitespace-nowrap font-display text-lg font-semibold ${compacta ? "sr-only" : ""}`}
      >
        SIPE-SOUND
      </span>
    </Link>
  );
}
