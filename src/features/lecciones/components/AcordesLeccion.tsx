import { useAcordes } from "@/features/acordes";
import { ChordDiagram } from "@/shared/music";
import { Skeleton } from "@/shared/ui";

/** Fila de diagramas de la lección; en móvil se desplaza en horizontal con scroll snap. */
export function AcordesLeccion({ nombres }: { nombres: string[] }) {
  const { data, isPending } = useAcordes();
  if (nombres.length === 0) return null;
  const acordes = (data ?? []).filter((a) => nombres.includes(a.nombre));

  return (
    <section aria-labelledby="acordes-leccion" className="mt-10">
      <h2 id="acordes-leccion" className="font-display text-xl font-semibold text-paper">
        Acordes de la lección
      </h2>
      {isPending ? (
        <Skeleton className="mt-4 h-36 w-full" />
      ) : (
        <ul className="mt-4 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
          {acordes.map((acorde) => (
            <li
              key={acorde.id}
              className="flex w-28 shrink-0 snap-start flex-col items-center gap-2"
            >
              <ChordDiagram {...acorde.diagram} />
              <span className="font-mono text-sm text-paper">{acorde.nombre}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
