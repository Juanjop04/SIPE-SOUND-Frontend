import { useEffect, useState } from "react";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import {
  aplicarTema,
  CONSULTA_CLARO,
  guardarPreferencia,
  leerPreferencia,
  type PreferenciaTema,
} from "@/shared/lib/tema";

const OPCIONES: { valor: PreferenciaTema; etiqueta: string; Icono: LucideIcon }[] = [
  { valor: "sistema", etiqueta: "Tema del sistema", Icono: Monitor },
  { valor: "claro", etiqueta: "Tema claro", Icono: Sun },
  { valor: "oscuro", etiqueta: "Tema oscuro", Icono: Moon },
];

export interface SelectorTemaProps {
  /** Sobre la barra lateral morada (texto de barra) en lugar de una superficie normal. */
  enBarra?: boolean;
  /** Debajo de 640 px, un solo botón que alterna los tres temas (encabezado angosto, HU-F-312). */
  compactoEnMovil?: boolean;
  className?: string;
}

/** Un solo botón: muestra el tema actual y pasa al siguiente (sistema → claro → oscuro). */
function BotonTemaCompacto({
  preferencia,
  onElegir,
}: {
  preferencia: PreferenciaTema;
  onElegir: (valor: PreferenciaTema) => void;
}) {
  const indice = OPCIONES.findIndex((o) => o.valor === preferencia);
  const { etiqueta, Icono } = OPCIONES[indice];
  const siguiente = OPCIONES[(indice + 1) % OPCIONES.length];
  const nombre = `${etiqueta}. Cambiar a ${siguiente.etiqueta.toLowerCase()}`;
  return (
    <button
      type="button"
      aria-label={nombre}
      title={nombre}
      onClick={() => onElegir(siguiente.valor)}
      className="flex h-8 w-8 items-center justify-center rounded-md text-paper ring-1 ring-linea-fuerte transition-colors duration-rapida hover:bg-surface sm:hidden"
    >
      <Icono size={16} aria-hidden="true" />
    </button>
  );
}

/** Claro · Oscuro · Sistema (HU-F-323): botones con aria-pressed; la elección se recuerda. */
export function SelectorTema({
  enBarra = false,
  compactoEnMovil = false,
  className,
}: SelectorTemaProps) {
  const [preferencia, setPreferencia] = useState<PreferenciaTema>(leerPreferencia);

  // Con "sistema", el tema sigue los cambios de la preferencia del dispositivo.
  useEffect(() => {
    aplicarTema(preferencia);
    if (preferencia !== "sistema") return undefined;
    const consulta = window.matchMedia(CONSULTA_CLARO);
    const seguir = () => aplicarTema("sistema");
    consulta.addEventListener("change", seguir);
    return () => consulta.removeEventListener("change", seguir);
  }, [preferencia]);

  function elegir(valor: PreferenciaTema) {
    guardarPreferencia(valor);
    setPreferencia(valor);
  }

  return (
    <>
      {compactoEnMovil && <BotonTemaCompacto preferencia={preferencia} onElegir={elegir} />}
      <div
        role="group"
        aria-label="Tema"
        className={cn("flex items-center gap-0.5", compactoEnMovil && "hidden sm:flex", className)}
      >
        {OPCIONES.map(({ valor, etiqueta, Icono }) => {
          const activo = preferencia === valor;
          return (
            <button
              key={valor}
              type="button"
              aria-pressed={activo}
              aria-label={etiqueta}
              title={etiqueta}
              onClick={() => elegir(valor)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-rapida",
                enBarra &&
                  (activo
                    ? "bg-barra-hover text-barra-texto"
                    : "text-barra-texto-2 hover:text-barra-texto"),
                !enBarra &&
                  (activo
                    ? "bg-surface text-paper ring-1 ring-linea-fuerte"
                    : "text-muted hover:text-paper"),
              )}
            >
              <Icono size={16} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </>
  );
}
