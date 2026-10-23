import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import logo from "@/assets/brand/logo.png";

/** Logo + nombre; lleva a la ruta (estudiante) o al resumen del atril (docente). */
export function Marca({ destino = paths.inicio }: { destino?: string }) {
  return (
    <Link to={destino} className="flex shrink-0 items-center gap-2 text-paper">
      <img src={logo} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
      <span className="font-display text-lg font-semibold">SIPE-SOUND</span>
    </Link>
  );
}
