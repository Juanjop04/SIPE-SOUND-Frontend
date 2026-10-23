import { useAcordes } from "@/features/acordes";
import { cn } from "@/shared/lib/cn.js";
import { CLASE_TESELA, TeselaAcorde } from "@/shared/music";
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
            <li key={acorde.id} className={cn(CLASE_TESELA, "w-32 shrink-0 snap-start")}>
              <TeselaAcorde nombre={acorde.nombre} diagram={acorde.diagram} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
