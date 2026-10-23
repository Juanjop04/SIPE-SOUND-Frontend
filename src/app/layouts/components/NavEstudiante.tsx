import { NavLink } from "react-router-dom";
import { Activity, Map, Music, Timer, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import { paths } from "@/shared/config/paths.js";

interface Destino {
  to: string;
  etiqueta: string;
  Icono: LucideIcon;
  /** Solo coincide con la ruta exacta (la raíz "/" no marca todas las páginas). */
  exacto?: boolean;
}

const DESTINOS: Destino[] = [
  { to: paths.ruta, etiqueta: "Ruta", Icono: Map },
  { to: paths.acordes, etiqueta: "Acordes", Icono: Music },
  { to: paths.ejercicios, etiqueta: "Ejercicios", Icono: Timer },
  { to: paths.progreso, etiqueta: "Mi progreso", Icono: Activity },
];

// Selección actual: texto paper + marca accent de 2 px (bajo el enlace, como un traste).
const MARCA_ACTUAL = "text-paper after:absolute after:inset-x-0 after:h-0.5 after:bg-accent";

/** Escritorio: navegación de texto en la barra superior. */
export function NavEstudiante() {
  return (
    <nav aria-label="Principal" className="hidden sm:block">
      <ul className="flex items-center gap-6">
        {DESTINOS.map(({ to, etiqueta, exacto }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={exacto}
              className={({ isActive }) =>
                cn(
                  "relative inline-flex h-14 items-center text-sm transition-colors duration-rapida",
                  isActive ? `${MARCA_ACTUAL} after:bottom-0` : "text-muted hover:text-paper",
                )
              }
            >
              {etiqueta}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Móvil: barra inferior fija con los 4 destinos (texto + ícono de línea). */
export function BarraInferior() {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-ink-2 sm:hidden"
    >
      <ul className="grid grid-cols-4">
        {DESTINOS.map(({ to, etiqueta, Icono, exacto }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={exacto}
              className={({ isActive }) =>
                cn(
                  "relative flex h-16 flex-col items-center justify-center gap-1 text-xs transition-colors duration-rapida",
                  isActive ? `${MARCA_ACTUAL} after:top-0` : "text-muted",
                )
              }
            >
              <Icono size={20} aria-hidden="true" />
              {etiqueta}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
