import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { puedeUsarAtril, useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";

const OPCION =
  "block w-full rounded-md px-3 py-2 text-left text-sm text-muted transition-colors duration-rapida hover:bg-surface hover:text-paper";

/** Menú de la cuenta del estudiante: botón con el nombre que despliega las opciones. */
export function MenuCuenta() {
  const { usuario, perfil, rol, cerrarSesion } = useSession();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const idMenu = useId();

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
        className="inline-flex h-10 max-w-[12rem] items-center gap-1 text-sm text-muted transition-colors duration-rapida hover:text-paper"
      >
        <span className="truncate">{perfil?.nombre ?? usuario?.email}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {abierto && (
        <div
          id={idMenu}
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-caja border border-linea bg-surface-2 p-1 shadow-dialogo"
        >
          {puedeUsarAtril(rol) && (
            <Link to={paths.docente.inicio} className={OPCION} onClick={() => setAbierto(false)}>
              Volver al atril
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
