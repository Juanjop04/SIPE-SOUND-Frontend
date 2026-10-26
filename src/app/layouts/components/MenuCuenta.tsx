import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { puedeUsarAtril, useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";

const OPCION =
  "block w-full rounded-md px-3 py-2 text-left text-sm text-muted transition-colors duration-rapida hover:bg-surface hover:text-paper";

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
        className="inline-flex h-10 max-w-[8rem] items-center gap-1 text-sm text-muted transition-colors duration-rapida hover:text-paper sm:max-w-[14rem]"
      >
        <span className="flex min-w-0 flex-col items-end text-right leading-tight">
          <span className="w-full truncate">{perfil?.nombre ?? usuario?.email}</span>
          {enAtril && rol && <span className="text-xs">{ETIQUETA_ROL[rol]}</span>}
        </span>
        <ChevronDown size={16} aria-hidden="true" className="shrink-0" />
      </button>
      {abierto && (
        <div
          id={idMenu}
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-caja border border-linea bg-surface-2 p-1 shadow-dialogo"
        >
          <Link to={paths.cuenta} className={OPCION} onClick={() => setAbierto(false)}>
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
              Ver como estudiante
            </Link>
          )}
          <button type="button" className={OPCION} onClick={handleCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
