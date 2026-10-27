import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Eye, LogOut, User } from "lucide-react";
import { puedeUsarAtril, useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";

const OPCION =
  "flex min-h-10 w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-paper transition-colors duration-rapida hover:bg-surface";

const ETIQUETA_ROL = {
  estudiante: "Estudiante",
  docente: "Docente",
  admin: "Administrador",
} as const;

interface MenuCuentaProps {
  /** "atril": barra superior de docente y administrador (HU-F-507); por defecto, la del estudiante. */
  variante?: "estudiante" | "atril";
}

/** Menú de la cuenta: botón con el nombre que despliega "Mi cuenta", el cambio de vista y "Cerrar sesión". */
export function MenuCuenta({ variante = "estudiante" }: MenuCuentaProps) {
  const { usuario, perfil, rol, cerrarSesion } = useSession();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const idMenu = useId();
  const enAtril = variante === "atril";
  const nombre = [perfil?.nombre, perfil?.apellido].filter(Boolean).join(" ") || usuario?.email;
  const iniciales =
    `${perfil?.nombre?.[0] ?? ""}${perfil?.apellido?.[0] ?? ""}`.toUpperCase() ||
    (usuario?.email?.[0] ?? "?").toUpperCase();

  // Se cierra al hacer clic fuera o con Esc (el foco vuelve al botón).
  useEffect(() => {
    if (!abierto) return undefined;
    function alPulsarFuera(evento: PointerEvent) {
      if (!contenedor.current?.contains(evento.target as Node)) setAbierto(false);
    }
    function alTeclear(evento: KeyboardEvent) {
      if (evento.key !== "Escape") return;
      setAbierto(false);
      boton.current?.focus();
    }
    document.addEventListener("pointerdown", alPulsarFuera);
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("pointerdown", alPulsarFuera);
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierto]);

  async function handleCerrarSesion() {
    setAbierto(false);
    await cerrarSesion();
    navigate(paths.inicio);
  }

  return (
    <div ref={contenedor} className="relative">
      <button
        ref={boton}
        type="button"
        aria-expanded={abierto}
        aria-controls={idMenu}
        onClick={() => setAbierto((valor) => !valor)}
        aria-label="Menú de la cuenta"
        className="inline-flex min-h-11 items-center gap-2.5 rounded-md p-1 pr-2 text-sm text-paper transition-colors duration-rapida hover:bg-surface"
      >
        <span
          aria-hidden="true"
          className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-md bg-accent text-[13px] font-bold text-ink"
        >
          {iniciales}
        </span>
        <span className="hidden min-w-0 max-w-[14rem] flex-col items-start leading-tight min-[561px]:flex">
          <span className="w-full truncate font-semibold">{nombre}</span>
          {rol && <span className="text-xs text-muted">{ETIQUETA_ROL[rol]}</span>}
        </span>
        <ChevronDown size={16} aria-hidden="true" className="shrink-0 text-muted" />
      </button>
      {abierto && (
        <div
          id={idMenu}
          className="absolute right-0 top-full z-50 mt-2 w-60 rounded-caja border border-linea bg-surface-2 p-1.5 shadow-dialogo"
        >
          <div className="mb-1.5 flex flex-col gap-0.5 border-b border-linea px-3 pb-3 pt-2">
            <span className="text-sm font-semibold text-paper">{nombre}</span>
            <span className="break-all font-mono text-xs text-muted">
              {perfil?.email ?? usuario?.email}
            </span>
          </div>
          <Link to={paths.cuenta} className={OPCION} onClick={() => setAbierto(false)}>
            <User size={16} aria-hidden="true" />
            Mi cuenta
          </Link>
          {!enAtril && !puedeUsarAtril(rol) && (
            <Link to={paths.cursos} className={OPCION} onClick={() => setAbierto(false)}>
              Mis cursos
            </Link>
          )}
          {!enAtril && puedeUsarAtril(rol) && (
            <Link to={paths.docente.inicio} className={OPCION} onClick={() => setAbierto(false)}>
              Volver al atril
            </Link>
          )}
          {enAtril && (
            <Link to={paths.inicio} className={OPCION} onClick={() => setAbierto(false)}>
              <Eye size={16} aria-hidden="true" />
              Ver como estudiante
            </Link>
          )}
          <button type="button" className={`${OPCION} text-danger`} onClick={handleCerrarSesion}>
            <LogOut size={16} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
