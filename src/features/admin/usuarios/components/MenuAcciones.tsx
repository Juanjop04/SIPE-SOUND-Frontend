import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { MoreHorizontal } from "lucide-react";
import type { Usuario } from "../tipos";
import { nombreCompleto } from "../utils";

export type AccionUsuario =
  | "detalle"
  | "reenviar"
  | "verificar"
  | "suspender"
  | "reactivar"
  | "permitir"
  | "bloquear"
  | "eliminar";

interface Opcion {
  accion: AccionUsuario;
  etiqueta: string;
  peligro?: boolean;
}

const OPCION =
  "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors duration-rapida hover:bg-surface";

/** Qué se puede hacer con cada cuenta (el backend rechaza suspender o eliminar a un admin). */
export function opcionesDe(usuario: Usuario): Opcion[] {
  const pendiente = usuario.estado === "pendiente_verificacion";
  const esAdmin = usuario.rol === "admin";
  const opciones: (Opcion | false)[] = [
    { accion: "detalle", etiqueta: "Ver detalle" },
    pendiente && { accion: "reenviar", etiqueta: "Reenviar código" },
    pendiente && { accion: "verificar", etiqueta: "Verificar manualmente" },
    usuario.estado === "suspendida" && { accion: "reactivar", etiqueta: "Reactivar" },
    usuario.estado !== "suspendida" && !esAdmin && { accion: "suspender", etiqueta: "Suspender" },
    usuario.puede_editar_nombre
      ? { accion: "bloquear", etiqueta: "Bloquear cambio de nombre" }
      : { accion: "permitir", etiqueta: "Permitir cambio de nombre" },
    !esAdmin && { accion: "eliminar", etiqueta: "Eliminar", peligro: true },
  ];
  return opciones.filter((opcion): opcion is Opcion => opcion !== false);
}

interface MenuAccionesProps {
  usuario: Usuario;
  onAccion: (accion: AccionUsuario, usuario: Usuario) => void;
}

/** Menú de acciones de una fila. Va con `position: fixed` para no quedar recortado por la tabla. */
export function MenuAcciones({ usuario, onAccion }: MenuAccionesProps) {
  const [posicion, setPosicion] = useState<CSSProperties | null>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const idMenu = useId();

  function alternar() {
    if (posicion) {
      setPosicion(null);
      return;
    }
    const caja = boton.current?.getBoundingClientRect();
    if (caja) setPosicion({ top: caja.bottom + 4, right: window.innerWidth - caja.right });
  }

  // Se cierra al hacer clic fuera, con Esc (el foco vuelve al botón) o al desplazar la página.
  useEffect(() => {
    if (!posicion) return undefined;
    const cerrar = () => setPosicion(null);
    function alPulsarFuera(evento: PointerEvent) {
      const destino = evento.target as Node;
      if (!menu.current?.contains(destino) && !boton.current?.contains(destino)) cerrar();
    }
    function alTeclear(evento: KeyboardEvent) {
      if (evento.key !== "Escape") return;
      cerrar();
      boton.current?.focus();
    }
    document.addEventListener("pointerdown", alPulsarFuera);
    document.addEventListener("keydown", alTeclear);
    window.addEventListener("scroll", cerrar, true);
    window.addEventListener("resize", cerrar);
    return () => {
      document.removeEventListener("pointerdown", alPulsarFuera);
      document.removeEventListener("keydown", alTeclear);
      window.removeEventListener("scroll", cerrar, true);
      window.removeEventListener("resize", cerrar);
    };
  }, [posicion]);

  return (
    <>
      <button
        ref={boton}
        type="button"
        aria-haspopup="true"
        aria-expanded={posicion !== null}
        aria-controls={posicion ? idMenu : undefined}
        aria-label={`Acciones de ${nombreCompleto(usuario)}`}
        onClick={alternar}
        className="relative z-10 rounded-md p-2 text-muted transition-colors duration-rapida hover:bg-surface hover:text-paper"
      >
        <MoreHorizontal size={18} aria-hidden="true" />
      </button>
      {posicion && (
        <div
          ref={menu}
          id={idMenu}
          style={posicion}
          className="fixed z-50 w-60 rounded-caja border border-linea bg-surface-2 p-1 shadow-dialogo"
        >
          {opcionesDe(usuario).map(({ accion, etiqueta, peligro }) => (
            <button
              key={accion}
              type="button"
              className={`${OPCION} ${peligro ? "text-danger" : "text-paper"}`}
              onClick={() => {
                setPosicion(null);
                onAccion(accion, usuario);
              }}
            >
              {etiqueta}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
