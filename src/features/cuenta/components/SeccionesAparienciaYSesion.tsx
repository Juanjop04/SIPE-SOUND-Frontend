import { useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";
import { cn } from "@/shared/lib/cn.js";
import {
  aplicarTema,
  guardarPreferencia,
  leerPreferencia,
  suscribirPreferencia,
  type PreferenciaTema,
} from "@/shared/lib/tema";
import { Button } from "@/shared/ui";
import { SeccionCuenta } from "./SeccionCuenta";

const TEMAS: { valor: PreferenciaTema; etiqueta: string }[] = [
  { valor: "sistema", etiqueta: "Sistema" },
  { valor: "claro", etiqueta: "Claro" },
  { valor: "oscuro", etiqueta: "Oscuro" },
];

/** Tema Sistema, Claro u Oscuro: la misma preferencia que el selector de la barra superior. */
export function SeccionApariencia() {
  const preferencia = useSyncExternalStore<PreferenciaTema>(
    suscribirPreferencia,
    leerPreferencia,
    () => "sistema",
  );

  function elegir(valor: PreferenciaTema) {
    guardarPreferencia(valor);
    aplicarTema(valor);
  }

  return (
    <SeccionCuenta
      id="apariencia"
      titulo="Apariencia"
      descripcion="El tema se recuerda en este dispositivo. Con «Sistema» sigue el de tu equipo."
    >
      <div
        role="radiogroup"
        aria-label="Tema"
        className="inline-flex w-fit flex-wrap overflow-hidden rounded-md border border-linea-fuerte"
      >
        {TEMAS.map(({ valor, etiqueta }) => (
          <label
            key={valor}
            className={cn(
              "flex min-h-10 cursor-pointer items-center border-l border-linea-fuerte px-4 text-sm first:border-l-0 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-accent",
              preferencia === valor
                ? "bg-primary text-sobre-primary"
                : "text-muted hover:text-paper",
            )}
          >
            <input
              type="radio"
              name="tema"
              checked={preferencia === valor}
              onChange={() => elegir(valor)}
              className="sr-only"
            />
            {etiqueta}
          </label>
        ))}
      </div>
    </SeccionCuenta>
  );
}

export function SeccionSesion() {
  const { cerrarSesion } = useSession();
  const navigate = useNavigate();

  async function salir() {
    await cerrarSesion();
    navigate(paths.inicio);
  }

  return (
    <SeccionCuenta id="sesion" titulo="Sesión" descripcion="Sal de SIPE-SOUND en este dispositivo.">
      <div>
        <Button
          variante="fantasma"
          onClick={salir}
          className="border-peligro-texto/45 text-peligro-texto hover:border-peligro-texto hover:bg-peligro-texto/10"
        >
          Cerrar sesión
        </Button>
      </div>
    </SeccionCuenta>
  );
}
