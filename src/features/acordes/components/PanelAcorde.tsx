import { Link } from "react-router-dom";
import { useLecciones } from "@/features/lecciones";
import { paths } from "@/shared/config/paths.js";
import { ChordDiagram, Tablatura } from "@/shared/music";
import { Drawer, Skeleton } from "@/shared/ui";
import type { Acorde } from "../types";

interface PanelAcordeProps {
  acorde: Acorde | null;
  onCerrar: () => void;
}

function LeccionesDelAcorde({ nombre }: { nombre: string }) {
  const { data, isPending } = useLecciones();
  if (isPending) return <Skeleton lineas={3} />;
  const lecciones = (data ?? []).filter((l) => l.acordes?.includes(nombre));
  if (lecciones.length === 0) {
    return <p className="text-sm text-muted">Todavía no aparece en ninguna lección.</p>;
  }
  return (
    <ul className="flex flex-col">
      {lecciones.map((leccion) => (
        <li key={leccion.id} className="border-b border-linea py-2">
          <Link to={paths.leccion(leccion.id)} className="text-paper hover:text-accent">
            <span className="font-mono text-sm text-muted">
              {String(leccion.numero).padStart(2, "0")}
            </span>{" "}
            {leccion.titulo}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Panel lateral del acorde seleccionado: diagrama, descripción y lecciones donde aparece. */
export function PanelAcorde({ acorde, onCerrar }: PanelAcordeProps) {
  return (
    <Drawer abierto={acorde !== null} onCerrar={onCerrar} titulo={acorde?.nombre ?? ""}>
      {acorde && (
        <div className="flex flex-col gap-6">
          <div className="w-32">
            <ChordDiagram {...acorde.diagram} />
          </div>
          <Tablatura
            datos={[
              { clave: "tipo", valor: acorde.tipo },
              { clave: "dificultad", valor: acorde.dificultad },
            ]}
          />
          {acorde.descripcion && <p className="leading-relaxed text-muted">{acorde.descripcion}</p>}
          <section aria-labelledby="lecciones-acorde">
            <h3
              id="lecciones-acorde"
              className="mb-2 font-display text-lg font-semibold text-paper"
            >
              Lecciones donde aparece
            </h3>
            <LeccionesDelAcorde nombre={acorde.nombre} />
          </section>
        </div>
      )}
    </Drawer>
  );
}
