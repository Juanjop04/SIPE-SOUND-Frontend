import { MensajeError, Markdown, Skeleton } from "@/shared/ui";
import { useTerminosVigentes } from "../api";
import { formatearFecha } from "@/shared/lib/formato";

/** Lectura editorial de los términos vigentes (los edita el administrador, HU-F-510). */
export default function TerminosPage() {
  const { data, isPending, error, refetch } = useTerminosVigentes();
  return (
    <main className="mx-auto max-w-[68ch] px-4 py-8 sm:px-6">
      {isPending && (
        <div aria-busy="true">
          <Skeleton lineas={8} className="h-6 w-full" />
        </div>
      )}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && (
        <>
          <Markdown texto={data.contenido} />
          <p className="mt-8 font-mono text-xs text-muted">
            Versión {data.version} · Actualizada el {formatearFecha(data.actualizado_en)}
          </p>
        </>
      )}
    </main>
  );
}
