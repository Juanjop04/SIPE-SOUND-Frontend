import { NavLink } from "react-router-dom";
import { Activity, House, Map, Music, Timer, type LucideIcon } from "lucide-react";
import { useSession } from "@/features/auth";
import { cn } from "@/shared/lib/cn.js";
import { paths } from "@/shared/config/paths.js";

interface Destino {
  to: string;
  etiqueta: string;
  Icono: LucideIcon;
  /** Solo coincide con la ruta exacta (la raíz "/" no marca todas las páginas). */
  exacto?: boolean;
  /** Inicio y Mi progreso necesitan cuenta: sin sesión no se muestran. */
  conSesion?: boolean;
}

// Orden de HU-F-318: Inicio · Ruta · Ejercicios · Acordes · Mi progreso.
const DESTINOS: Destino[] = [
  { to: paths.inicio, etiqueta: "Inicio", Icono: House, exacto: true, conSesion: true },
  { to: paths.ruta, etiqueta: "Ruta", Icono: Map },
  { to: paths.ejercicios, etiqueta: "Ejercicios", Icono: Timer },
  { to: paths.acordes, etiqueta: "Acordes", Icono: Music },
  { to: paths.progreso, etiqueta: "Mi progreso", Icono: Activity, conSesion: true },
];

function useDestinos(): Destino[] {
  const { usuario } = useSession();
  return DESTINOS.filter((d) => !d.conSesion || usuario);
}

/** Escritorio (≥ 1024 px): destinos con ícono; el activo con fondo primary (texto paper 4.64:1). */
export function BarraLateral() {
  const destinos = useDestinos();
  return (
    <nav aria-label="Principal">
      <ul className="flex flex-col gap-1">
        {destinos.map(({ to, etiqueta, Icono, exacto }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={exacto}
              className={({ isActive }) =>
                cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-rapida",
                  isActive
                    ? "bg-primary text-paper"
                    : "text-muted hover:bg-surface-2 hover:text-paper",
                )
              }
            >
              <Icono size={18} aria-hidden="true" />
              {etiqueta}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Tableta y móvil: texto paper + marca accent de 2 px (como un traste); no solo color.
const MARCA_ACTUAL = "text-paper after:absolute after:inset-x-0 after:h-0.5 after:bg-accent";

/** Tableta (640–1023 px): destinos como texto en la barra superior. */
export function NavEstudiante() {
  const destinos = useDestinos();
  return (
    <nav aria-label="Principal" className="hidden sm:block lg:hidden">
      <ul className="flex items-center gap-6">
        {destinos.map(({ to, etiqueta, exacto }) => (
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

/** Móvil: barra inferior fija con ícono y etiqueta (objetivo de 64 px) sobre la zona segura. */
export function BarraInferior() {
  const destinos = useDestinos();
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-ink-2 pb-[env(safe-area-inset-bottom)] sm:hidden"
    >
      <ul className="grid auto-cols-fr grid-flow-col">
        {destinos.map(({ to, etiqueta, Icono, exacto }) => (
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
