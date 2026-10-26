import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/cn.js";
import { paths } from "@/shared/config/paths.js";
import { Cuerda } from "@/shared/music";
import type { EstadoEjercicio, Ejercicio } from "../types";
import { ESTADOS, avanceDeTempo, estadoDelEjercicio } from "../utils/tarjetas";

// Borde izquierdo de 2 px según el estado; además va el símbolo y el texto (nunca solo color).
const MARCA: Record<EstadoEjercicio, string> = {
  sin_iniciar: "border-l-linea-fuerte bg-surface",
  en_curso: "border-l-accent bg-surface",
  // Atenuado sin bajar el contraste del texto: la capa es más hundida (ink-2), no más transparente.
  finalizado: "border-l-success bg-ink-2",
};

function Estado({ estado, mejorBpm }: { estado: EstadoEjercicio; mejorBpm: number | null }) {
  const { etiqueta, simbolo } = ESTADOS.find((e) => e.valor === estado) ?? ESTADOS[0];
  return (
    <p className="flex flex-wrap items-center gap-x-3 text-sm">
      <span className={cn("flex items-center gap-2", estado === "finalizado" && "text-success")}>
        <span aria-hidden="true" className="font-mono">
          {simbolo}
        </span>
        {etiqueta}
      </span>
      {mejorBpm !== null && (
        <span className="font-mono text-xs text-muted">Tu mejor: {mejorBpm} BPM</span>
      )}
    </p>
  );
}

interface TarjetaEjercicioProps {
  ejercicio: Ejercicio;
  /** "Continúa aquí": está en curso y se ordena por lo recomendado. */
  destacado: boolean;
}

/** Ficha de práctica: el BPM recomendado es el dato principal; toda la tarjeta es el enlace. */
export function TarjetaEjercicio({ ejercicio: e, destacado }: TarjetaEjercicioProps) {
  const estado = estadoDelEjercicio(e);
  const tempo = avanceDeTempo(e);
  return (
    <li>
      <Link
        to={paths.ejercicio(e.id)}
        className={cn(
          "flex h-full flex-col gap-3 rounded-caja border border-l-2 border-linea p-5 transition-colors duration-rapida hover:border-accent",
          estado ? MARCA[estado] : "border-l-linea-fuerte bg-surface",
        )}
      >
        {destacado && <p className="font-mono text-xs text-accent">Continúa aquí</p>}
        <div>
          <h2 className="font-display text-xl font-semibold text-paper">{e.nombre}</h2>
          <p className="text-sm text-muted">
            {e.nivel} · compás {e.compas ?? "4/4"}
            {e.duracion_min ? ` · ${e.duracion_min} min` : ""}
          </p>
        </div>
        <p className="font-mono text-4xl font-semibold tabular-nums text-paper">
          {e.bpm_recomendado ? (
            <>
              <span aria-hidden="true">♩ </span>
              {e.bpm_recomendado} <span className="text-sm font-normal text-muted">BPM</span>
            </>
          ) : (
            <span className="text-muted">—</span>
          )}
        </p>
        {(e.acordes?.length ?? 0) > 0 && (
          <ul aria-label="Acordes" className="flex flex-wrap gap-1.5">
            {e.acordes?.map((acorde) => (
              <li
                key={acorde}
                className="rounded-md border border-linea-fuerte px-2 py-0.5 font-mono text-xs text-paper"
              >
                {acorde}
              </li>
            ))}
          </ul>
        )}
        {estado && (
          <div className="mt-auto flex flex-col gap-2">
            <Estado estado={estado} mejorBpm={e.mi_progreso?.mejor_bpm ?? null} />
            {tempo !== null && (
              <Cuerda
                valor={tempo}
                etiqueta={`Tu tempo frente al recomendado en ${e.nombre}`}
                grosor={2}
                sonando={tempo >= 100}
              />
            )}
          </div>
        )}
      </Link>
    </li>
  );
}
