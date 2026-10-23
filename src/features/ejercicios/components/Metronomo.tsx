import { useEffect, useId } from "react";
import { cn } from "@/shared/lib/cn.js";
import { Button } from "@/shared/ui";
import { useMetronomo } from "../hooks/useMetronomo";
import { ControlBpm } from "./ControlBpm";

interface MetronomoProps {
  bpm: number;
  onCambiarBpm: (bpm: number) => void;
  tiempos: number;
  compas: string;
}

const NO_CAPTURAR = new Set(["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"]);

/** Metrónomo: pulso visual (un traste por tiempo; el 1 en ámbar) y sonoro (Web Audio). */
export function Metronomo({ bpm, onCambiarBpm, tiempos, compas }: MetronomoProps) {
  const idBpm = useId();
  const { sonando, pulso, alternar } = useMetronomo(bpm, tiempos);
  const trastes = Array.from({ length: tiempos }, (_, i) => i);

  // Barra espaciadora = iniciar/pausar (salvo en campos y botones, que ya usan el espacio).
  useEffect(() => {
    function alTeclear(evento: KeyboardEvent) {
      const destino = evento.target as HTMLElement;
      if (evento.code !== "Space" || NO_CAPTURAR.has(destino.tagName)) return;
      evento.preventDefault();
      alternar();
    }
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [alternar]);

  return (
    <section aria-labelledby={`${idBpm}-titulo`} className="flex flex-col gap-5">
      <h2 id={`${idBpm}-titulo`} className="font-display text-xl font-semibold text-paper">
        Metrónomo
      </h2>
      <div className="flex flex-col gap-2">
        <label htmlFor={idBpm} className="font-mono text-xs text-muted">
          BPM · compás {compas}
        </label>
        <ControlBpm id={idBpm} bpm={bpm} onCambiar={onCambiarBpm} />
      </div>

      <div className="flex gap-2" aria-hidden="true">
        {trastes.map((tiempo) => (
          <span
            key={tiempo}
            className={cn(
              "h-8 flex-1 rounded-md border border-linea-fuerte transition-colors duration-rapida",
              pulso === tiempo &&
                (tiempo === 0 ? "border-success bg-success" : "border-accent bg-accent"),
            )}
          />
        ))}
      </div>

      <Button variante={sonando ? "secundario" : "primario"} onClick={alternar} className="w-full">
        {sonando ? "Pausar" : "Iniciar"}
        <span className="font-mono text-xs">espacio</span>
      </Button>
      <p aria-live="polite" className="sr-only">
        {sonando ? `Metrónomo en marcha, ${bpm} BPM` : "Metrónomo en pausa"}
      </p>
    </section>
  );
}
