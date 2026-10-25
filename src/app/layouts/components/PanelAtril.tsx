import { NavLink } from "react-router-dom";
import {
  Activity,
  BookOpen,
  ClipboardCheck,
  FileText,
  GraduationCap,
  House,
  Library,
  Mail,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ROL, useSession } from "@/features/auth";
import { ContadorNoLeidos } from "@/features/mensajes";
import { cn } from "@/shared/lib/cn.js";
import { paths } from "@/shared/config/paths.js";
import { EtiquetaFlotante } from "./EtiquetaFlotante";

interface Seccion {
  to: string;
  etiqueta: string;
  Icono: LucideIcon;
  exacto?: boolean;
  contador?: boolean;
}

const SECCIONES: Seccion[] = [
  { to: paths.docente.inicio, etiqueta: "Resumen", Icono: House, exacto: true },
  { to: paths.docente.cursos, etiqueta: "Cursos", Icono: BookOpen },
  { to: paths.docente.progreso, etiqueta: "Progreso", Icono: Activity },
  { to: paths.docente.contenido, etiqueta: "Contenido", Icono: FileText },
  { to: paths.docente.evaluaciones, etiqueta: "Evaluaciones", Icono: ClipboardCheck },
  { to: paths.docente.mensajes, etiqueta: "Mensajes", Icono: Mail, contador: true },
];

const SECCIONES_ADMIN: Seccion[] = [
  { to: paths.admin.usuarios, etiqueta: "Usuarios", Icono: Users },
  { to: paths.admin.cursos, etiqueta: "Todos los cursos", Icono: Library },
  { to: paths.admin.docentes, etiqueta: "Docentes", Icono: GraduationCap },
];

// Colores sobre la barra morada (escritorio) o sobre una superficie (Drawer en móvil).
const TONOS = {
  barra: {
    activo: "border-barra-texto text-barra-texto",
    inactivo: "border-transparent text-barra-texto-2 hover:text-barra-texto",
  },
  superficie: {
    activo: "border-accent text-paper",
    inactivo: "border-transparent text-muted hover:text-paper",
  },
};
type Tono = (typeof TONOS)["barra"];

// Selección actual: texto + marca de 2 px a la izquierda (sin fondo relleno).
function claseEnlace(tono: Tono, contraido: boolean) {
  return ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative flex items-center gap-3 border-l-2 py-2 text-sm transition-colors duration-rapida",
      contraido ? "justify-center px-0" : "px-3",
      isActive ? tono.activo : tono.inactivo,
    );
}

interface PanelAtrilProps {
  alNavegar?: () => void;
  enBarra?: boolean;
  /** Solo íconos (escritorio, menú contraído). En el Drawer móvil siempre va expandido. */
  contraido?: boolean;
}

function Enlace({
  seccion,
  tono,
  contraido,
  alNavegar,
}: {
  seccion: Seccion;
  tono: Tono;
  contraido: boolean;
  alNavegar?: () => void;
}) {
  const { to, etiqueta, Icono, exacto, contador } = seccion;
  const enlace = (
    <NavLink
      to={to}
      end={exacto}
      onClick={alNavegar}
      title={contraido ? etiqueta : undefined}
      className={claseEnlace(tono, contraido)}
    >
      <Icono size={18} aria-hidden="true" className="shrink-0" />
      <span className={cn("flex flex-1 items-center", contraido && "sr-only")}>{etiqueta}</span>
      {contador && (
        <span
          className={cn("flex items-center", contraido && "absolute right-1 top-0.5 text-[10px]")}
        >
          <ContadorNoLeidos />
        </span>
      )}
    </NavLink>
  );
  return contraido ? <EtiquetaFlotante texto={etiqueta}>{enlace}</EtiquetaFlotante> : enlace;
}

/**
 * Navegación del atril. Solo secciones: el perfil, el tema y "Cerrar sesión" viven en la barra
 * superior (HU-F-507). En móvil se muestra dentro de un Drawer.
 */
export function PanelAtril({ alNavegar, enBarra = false, contraido = false }: PanelAtrilProps) {
  const tono = enBarra ? TONOS.barra : TONOS.superficie;
  const { rol } = useSession();
  const secciones = rol === ROL.admin ? [...SECCIONES, ...SECCIONES_ADMIN] : SECCIONES;

  return (
    <nav aria-label="Atril">
      <ul className="flex flex-col gap-1">
        {secciones.map((seccion) => (
          <li key={seccion.to}>
            <Enlace seccion={seccion} tono={tono} contraido={contraido} alNavegar={alNavegar} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
