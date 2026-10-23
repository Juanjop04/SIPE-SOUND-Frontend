import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { ajustarBpm } from "../utils/compas";

interface ControlBpmProps {
  id: string;
  bpm: number;
  onCambiar: (bpm: number) => void;
}

/** BPM editable 20–300: −/+ y campo numérico; fuera de rango se ajusta al salir del campo. */
export function ControlBpm({ id, bpm, onCambiar }: ControlBpmProps) {
  // Borrador mientras se escribe ("1", "12"…): se valida y ajusta al salir.
  const [borrador, setBorrador] = useState<string | null>(null);
  const { min, max } = LIMITES.bpm;

  function confirmar() {
    if (borrador !== null) onCambiar(ajustarBpm(Number(borrador)));
    setBorrador(null);
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variante="secundario"
        tamano="sm"
        aria-label="Bajar 1 BPM"
        disabled={bpm <= min}
        onClick={() => onCambiar(ajustarBpm(bpm - 1))}
      >
        <Minus size={16} aria-hidden="true" />
      </Button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={1}
        value={borrador ?? bpm}
        onChange={(e) => setBorrador(e.target.value)}
        onBlur={confirmar}
        onKeyDown={(e) => e.key === "Enter" && confirmar()}
        className="w-24 rounded-md border border-linea-fuerte bg-ink py-1 text-center font-mono text-4xl tabular-nums text-paper focus-visible:border-accent"
      />
      <Button
        variante="secundario"
        tamano="sm"
        aria-label="Subir 1 BPM"
        disabled={bpm >= max}
        onClick={() => onCambiar(ajustarBpm(bpm + 1))}
      >
        <Plus size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}
