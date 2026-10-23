import { NavLink, useNavigate } from "react-router-dom";
import { ROL, useSession } from "@/features/auth";
import { cn } from "@/shared/lib/cn.js";
import { paths } from "@/shared/config/paths.js";
import { Button } from "@/shared/ui";

const SECCIONES = [
  { to: paths.docente.inicio, etiqueta: "Resumen", exacto: true },
  { to: paths.docente.cursos, etiqueta: "Cursos" },
  { to: paths.docente.contenido, etiqueta: "Contenido" },
  { to: paths.docente.evaluaciones, etiqueta: "Evaluaciones" },
];

// Selección actual: texto paper + marca accent de 2 px a la izquierda (sin fondo relleno).
function claseEnlace({ isActive }: { isActive: boolean }) {
  return cn(
    "block border-l-2 px-3 py-2 text-sm transition-colors duration-rapida",
    isActive ? "border-accent text-paper" : "border-transparent text-muted hover:text-paper",
  );
}

/** Contenido de la barra lateral del atril; en móvil se muestra dentro de un Drawer. */
export function PanelAtril({ alNavegar }: { alNavegar?: () => void }) {
  const { usuario, perfil, rol, cerrarSesion } = useSession();
  const secciones =
    rol === ROL.admin
      ? [...SECCIONES, { to: paths.admin.docentes, etiqueta: "Docentes", exacto: false }]
      : SECCIONES;
  const navigate = useNavigate();

  async function handleCerrarSesion() {
    alNavegar?.();
    await cerrarSesion();
    navigate(paths.inicio);
  }

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <nav aria-label="Atril">
        <ul className="flex flex-col gap-1">
          {secciones.map(({ to, etiqueta, exacto }) => (
            <li key={to}>
              <NavLink to={to} end={exacto} className={claseEnlace} onClick={alNavegar}>
                {etiqueta}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col gap-3 border-t border-linea pt-4">
        <NavLink
          to={paths.inicio}
          onClick={alNavegar}
          className="px-3 text-sm text-accent hover:underline"
        >
          Ver como estudiante
        </NavLink>
        <p className="truncate px-3 text-sm text-muted">{perfil?.nombre ?? usuario?.email}</p>
        <Button
          variante="fantasma"
          tamano="sm"
          className="justify-start"
          onClick={handleCerrarSesion}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
