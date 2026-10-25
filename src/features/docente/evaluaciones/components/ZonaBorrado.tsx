import { usePuedeBorrar } from "../externos";
import { ZonaEliminarEvaluacion } from "./ZonaEliminarEvaluacion";

interface ZonaBorradoProps {
  /** Quién la creó: solo él (o un administrador) la borra (HU-B-412). */
  autorId: string | null | undefined;
  publicada: boolean;
  ocupado: boolean;
  onEliminar: () => Promise<void>;
  onCerrar: () => Promise<void>;
}

/** Borrar solo a quien creó la evaluación; el resto la edita, la publica y la cierra. */
export function ZonaBorrado({ autorId, ...resto }: ZonaBorradoProps) {
  const puedeBorrar = usePuedeBorrar(autorId);
  if (puedeBorrar) return <ZonaEliminarEvaluacion {...resto} />;
  return (
    <p className="mt-12 border-t border-linea pt-6 text-sm text-muted">
      Esta evaluación la creó otra persona: puedes editarla, publicarla y cerrarla, pero solo su
      autor puede borrarla.
    </p>
  );
}
