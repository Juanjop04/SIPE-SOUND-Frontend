import { useState } from "react";
import { ChordDiagram, type TrasteCuerda } from "@/shared/music";
import {
  Atril,
  EstucheAbierto,
  GuitarraAcustica,
  ManoEnAcorde,
} from "@/shared/music/ilustraciones";
import { Button } from "@/shared/ui";
import { Fila, Seccion } from "./Seccion";

const ACORDE_AM = {
  frets: ["x", 0, 2, 2, 1, 0] as TrasteCuerda[],
  fingers: [null, null, 2, 3, 1, null],
};
const ACORDE_F = {
  frets: [1, 3, 3, 2, 1, 1] as TrasteCuerda[],
  fingers: [1, 3, 4, 2, 1, 1],
  barre: { fret: 1, from: 0, to: 5 },
};

export function SeccionIlustraciones() {
  const [sonando, setSonando] = useState(false);

  return (
    <Seccion numero={9} titulo="Ilustraciones">
      <GuitarraAcustica sonando={sonando} className="h-auto w-full" />
      <Fila etiqueta="sonando (un rasgueo)">
        <Button variante="secundario" tamano="sm" onClick={() => setSonando((s) => !s)}>
          {sonando ? "Reiniciar" : "Rasguear"}
        </Button>
      </Fila>
      <Fila etiqueta="ManoEnAcorde junto a su ChordDiagram · Am · F con cejilla">
        <ManoEnAcorde nombre="Am" {...ACORDE_AM} className="h-auto w-32" />
        <div className="w-24">
          <ChordDiagram {...ACORDE_AM} />
        </div>
        <ManoEnAcorde nombre="F" {...ACORDE_F} className="h-auto w-32" />
        <div className="w-24">
          <ChordDiagram {...ACORDE_F} />
        </div>
      </Fila>
      <Fila etiqueta="Atril · EstucheAbierto">
        <Atril className="h-auto w-40" />
        <EstucheAbierto className="h-auto w-48" />
      </Fila>
    </Seccion>
  );
}
