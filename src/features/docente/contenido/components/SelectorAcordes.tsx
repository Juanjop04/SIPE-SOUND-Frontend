import { useAcordes } from "@/features/acordes";
import { cn } from "@/shared/lib/cn.js";
import { ChordDiagram } from "@/shared/music";
import { MensajeError, Skeleton } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";

interface SelectorAcordesProps {
  valor: string[];
  onCambiar: (acordes: string[]) => void;
  error?: string;
}

/** Selector múltiple del catálogo con el diagrama en miniatura; máximo 24 (contrato 08). */
export function SelectorAcordes({ valor, onCambiar, error }: SelectorAcordesProps) {
  const { data, isPending, error: errorCarga, refetch } = useAcordes();
  const lleno = valor.length >= LIMITES.maximoAcordes;

  function alternar(nombre: string) {
    onCambiar(valor.includes(nombre) ? valor.filter((v) => v !== nombre) : [...valor, nombre]);
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-medium text-paper">
        Acordes{" "}
        <span className="font-mono text-xs text-muted">
          {valor.length}/{LIMITES.maximoAcordes}
        </span>
      </legend>
      {isPending && <Skeleton className="h-24 w-full" />}
      {errorCarga && <MensajeError mensaje={errorCarga.message} onReintentar={() => refetch()} />}
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {(data ?? []).map((acorde) => {
          const elegido = valor.includes(acorde.nombre);
          return (
            <li key={acorde.id}>
              <button
                type="button"
                aria-pressed={elegido}
                disabled={!elegido && lleno}
                onClick={() => alternar(acorde.nombre)}
                className={cn(
                  "flex w-full flex-col items-center gap-1 rounded-md border-2 p-1 transition-colors duration-rapida disabled:opacity-40",
                  elegido ? "border-accent" : "border-transparent hover:border-linea",
                )}
              >
                <span className="w-12">
                  <ChordDiagram {...acorde.diagram} />
                </span>
                <span className="font-mono text-xs text-paper">{acorde.nombre}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {lleno && (
        <p className="text-xs text-muted">Llegaste al máximo de {LIMITES.maximoAcordes}.</p>
      )}
      {error && <p className="text-xs text-danger">{error}</p>}
    </fieldset>
  );
}
