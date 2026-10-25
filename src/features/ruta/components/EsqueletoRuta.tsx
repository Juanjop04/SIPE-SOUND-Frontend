import { Skeleton } from "@/shared/ui";

const TRASTES = ["t1", "t2", "t3", "t4", "t5", "t6"];

/** Carga: 6 trastes del mástil y el encabezado del detalle. */
export function EsqueletoRuta() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando la ruta"
      className="lg:grid lg:grid-cols-12 lg:gap-12"
    >
      <div className="flex gap-3 overflow-hidden lg:col-span-4 lg:flex-col">
        {TRASTES.map((id) => (
          <Skeleton key={id} className="h-10 w-32 shrink-0 lg:w-full" />
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-4 lg:col-span-8 lg:mt-0">
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton lineas={4} className="h-11 w-full" />
      </div>
    </div>
  );
}
