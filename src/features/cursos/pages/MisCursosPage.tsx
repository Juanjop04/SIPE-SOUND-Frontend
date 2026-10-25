import { EstadoVacio, MensajeError, Skeleton } from "@/shared/ui";
import { useMisCursos } from "../api";
import { FormularioUnirse } from "../components/FormularioUnirse";
import { TarjetaCurso } from "../components/TarjetaCurso";

/** /cursos (HU-F-311): unirme con el código del docente y leer sus comentarios. */
export default function MisCursosPage() {
  const { data, isPending, error, refetch } = useMisCursos();

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-semibold text-paper">Mis cursos</h1>
        <p className="mt-2 text-sm text-muted">
          Únete con el código de tu docente: verás la ruta de tu curso y sus comentarios.
        </p>
      </header>
      <section
        aria-label="Unirme a un curso"
        className="rounded-caja border border-linea bg-surface p-5"
      >
        <FormularioUnirse />
      </section>
      {isPending && <Skeleton lineas={3} className="h-24 w-full" />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data?.length === 0 && (
        <EstadoVacio
          titulo="Aún no estás en ningún curso."
          descripcion="Cuando te unas, aparecerá aquí con su ruta."
        />
      )}
      {data && data.length > 0 && (
        <ul className="flex flex-col gap-4">
          {data.map((curso) => (
            <TarjetaCurso key={curso.id} curso={curso} />
          ))}
        </ul>
      )}
    </main>
  );
}
