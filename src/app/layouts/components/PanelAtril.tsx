import { NavLink, useNavigate } from "react-router-dom";
import { ROL, useSession } from "@/features/auth";
import { ContadorNoLeidos } from "@/features/mensajes";
import { cn } from "@/shared/lib/cn.js";
import { paths } from "@/shared/config/paths.js";
import { Button, SelectorTema } from "@/shared/ui";

interface Seccion {
  to: string;
  etiqueta: string;
  exacto?: boolean;
  contador?: boolean;
}

const SECCIONES: Seccion[] = [
  { to: paths.docente.inicio, etiqueta: "Resumen", exacto: true },
  { to: paths.docente.cursos, etiqueta: "Cursos" },
  { to: paths.docente.progreso, etiqueta: "Progreso" },
  { to: paths.docente.contenido, etiqueta: "Contenido" },
  { to: paths.docente.evaluaciones, etiqueta: "Evaluaciones" },
  { to: paths.docente.mensajes, etiqueta: "Mensajes", contador: true },
];

// Colores sobre la barra morada (escritorio) o sobre una superficie (Drawer en móvil).
const TONOS = {
  barra: {
    activo: "border-barra-texto text-barra-texto",
    inactivo: "border-transparent text-barra-texto-2 hover:text-barra-texto",
    secundario: "text-barra-texto-2",
    boton: "text-barra-texto-2 hover:bg-barra-hover hover:text-barra-texto",
  },
  superficie: {
    activo: "border-accent text-paper",
    inactivo: "border-transparent text-muted hover:text-paper",
    secundario: "text-muted",
    boton: "",
  },
};
type Tono = (typeof TONOS)["barra"];

// Selección actual: texto + marca de 2 px a la izquierda (sin fondo relleno).
function claseEnlace(tono: Tono) {
  return ({ isActive }: { isActive: boolean }) =>
    cn(
      "block border-l-2 px-3 py-2 text-sm transition-colors duration-rapida",
      isActive ? tono.activo : tono.inactivo,
    );
}

/** Contenido de la barra lateral del atril; en móvil se muestra dentro de un Drawer. */
export function PanelAtril({
  alNavegar,
  enBarra = false,
}: {
  alNavegar?: () => void;
  enBarra?: boolean;
}) {
  const tono = enBarra ? TONOS.barra : TONOS.superficie;
  const { usuario, perfil, rol, cerrarSesion } = useSession();
  const secciones =
    rol === ROL.admin
      ? [
          ...SECCIONES,
          { to: paths.admin.usuarios, etiqueta: "Usuarios", exacto: false },
          { to: paths.admin.cursos, etiqueta: "Todos los cursos", exacto: false },
          { to: paths.admin.docentes, etiqueta: "Docentes", exacto: false },
        ]
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
          {secciones.map(({ to, etiqueta, exacto, contador }) => (
            <li key={to}>
              <NavLink to={to} end={exacto} className={claseEnlace(tono)} onClick={alNavegar}>
                <span className="flex items-center">
                  {etiqueta}
                  {contador && <ContadorNoLeidos />}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col gap-3 border-t border-linea pt-4">
        <NavLink
          to={paths.inicio}
          onClick={alNavegar}
          className={cn(
            "px-3 text-sm hover:underline",
            enBarra ? "text-barra-texto" : "text-accent",
          )}
        >
          Ver como estudiante
        </NavLink>
        <SelectorTema enBarra={enBarra} className="px-2" />
        <NavLink
          to={paths.cuenta}
          onClick={alNavegar}
          className={cn("truncate px-3 text-sm hover:underline", tono.secundario)}
        >
          {perfil?.nombre ?? usuario?.email}
          <span className="block text-xs">Mi cuenta</span>
        </NavLink>
        <Button
          variante="fantasma"
          tamano="sm"
          className={cn("justify-start", tono.boton)}
          onClick={handleCerrarSesion}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
