import { useState } from "react";
import { Button } from "@/shared/ui";
import { ChordDiagram, Cuerda, Fretboard, MarcaEstado, Tablatura } from "@/shared/music";
import { Fila, Seccion } from "./Seccion";

const ACORDE_C = { frets: ["x", 3, 2, 0, 1, 0] as const, fingers: [null, 3, 2, null, 1, null] };
const ACORDE_F = {
  frets: [1, 3, 3, 2, 1, 1] as const,
  fingers: [1, 3, 4, 2, 1, 1],
  barre: { fret: 1, from: 0, to: 5 },
};

export function SeccionMusica() {
  const [tocando, setTocando] = useState(false);
  return (
    <>
      <Seccion numero={6} titulo="Cuerda">
        <Fila etiqueta="0 % · grosor 1">
          <Cuerda valor={0} etiqueta="Sin avance" grosor={1} />
        </Fila>
        <Fila etiqueta="45 % · grosor 2">
          <Cuerda valor={45} etiqueta="Avance del bloque 2" />
        </Fila>
        <Fila etiqueta="100 % · sonando">
          <Cuerda valor={100} etiqueta="Bloque aprobado" grosor={3} sonando />
        </Fila>
      </Seccion>

      <Seccion numero={7} titulo="MarcaEstado · Tablatura">
        <Fila etiqueta="estados">
          <MarcaEstado estado="bloqueado" /> Bloqueado
          <MarcaEstado estado="disponible" /> Disponible
          <MarcaEstado estado="aprobado" /> Aprobado
        </Fila>
        <Fila etiqueta="tablatura">
          <Tablatura
            datos={[
              { clave: "bpm", valor: "♩ 60 BPM" },
              { clave: "compas", valor: "4/4" },
              { clave: "duracion", valor: "20 min" },
            ]}
          />
        </Fila>
      </Seccion>

      <Seccion numero={8} titulo="ChordDiagram · Fretboard">
        <Fila etiqueta="C · F con cejilla">
          <div className="w-24">
            <ChordDiagram frets={[...ACORDE_C.frets]} fingers={ACORDE_C.fingers} />
          </div>
          <div className="w-24">
            <ChordDiagram
              frets={[...ACORDE_F.frets]}
              fingers={ACORDE_F.fingers}
              barre={ACORDE_F.barre}
            />
          </div>
        </Fila>
        <Fretboard tocando={tocando} />
        <Fila etiqueta="tocando">
          <Button variante="secundario" tamano="sm" onClick={() => setTocando((t) => !t)}>
            {tocando ? "Detener" : "Hacer sonar"}
          </Button>
        </Fila>
      </Seccion>
    </>
  );
}
