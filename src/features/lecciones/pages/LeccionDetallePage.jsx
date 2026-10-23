import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useSession } from "@/features/auth";
import { useCompletarLeccion } from "@/features/progreso";
import { useAcordes } from "@/features/acordes";
import { useLeccion } from "../hooks/useLeccion.js";
import { paths } from "@/shared/config/paths.js";
import { Button } from "@/shared/ui";

export default function LeccionDetalle() {
  // useParams() lee el ":id" de la URL. Si visitas /leccion/2, aquí id === "2"
  const { id } = useParams();

  const consultaLeccion = useLeccion(id);
  const consultaAcordes = useAcordes();
  const completarLeccion = useCompletarLeccion();
  const leccion = consultaLeccion.data;
  const cargando = consultaLeccion.isPending || consultaAcordes.isPending;
  const error = consultaLeccion.error ?? consultaAcordes.error;
  const { usuario } = useSession();
  const hayUsuario = Boolean(usuario);
  const [guardado, setGuardado] = useState(null);

  // leccion.acordes es un arreglo de nombres, ej: ["Em", "Am"]
  // Filtramos el catálogo completo (en caché) para quedarnos solo con esos
  const acordesLeccion = useMemo(
    () => (consultaAcordes.data ?? []).filter((a) => (leccion?.acordes ?? []).includes(a.nombre)),
    [consultaAcordes.data, leccion],
  );

  async function marcarCompletada() {
    try {
      await completarLeccion.mutateAsync(id);
      setGuardado("ok");
    } catch {
      setGuardado("error");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <Link
        to={paths.inicio}
        className="mb-5 flex w-fit items-center gap-1 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Volver a lecciones
      </Link>

      {cargando && <p className="text-muted">Cargando...</p>}
      {error && <p className="text-sm text-danger">{error.message}</p>}

      {leccion && (
        <>
          <h2 className="mb-1 font-display text-xl font-semibold text-paper">
            Leccion {leccion.numero}: {leccion.titulo}
          </h2>
          <p className="mb-1 text-sm text-muted">{leccion.descripcion}</p>
          <p className="mb-6 font-mono text-xs text-muted/70">
            {leccion.nivel} - {leccion.duracion_min ? `${leccion.duracion_min} min` : "N/A"}
          </p>

          <h3 className="mb-3 font-display text-base font-semibold text-paper">
            Acordes de esta leccion
          </h3>

          {acordesLeccion.length === 0 && (
            <p className="mb-6 text-sm text-muted">
              Esta leccion no tiene acordes asociados todavia.
            </p>
          )}

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {acordesLeccion.map((acorde) => (
              <div key={acorde.id} className="rounded-caja bg-surface p-5 text-center">
                <p className="font-display text-lg font-semibold text-paper">{acorde.nombre}</p>
                <p className="mt-1 font-mono text-xs text-muted">{acorde.tipo}</p>
                <p className="mt-1 text-xs text-accent">{acorde.dificultad}</p>
              </div>
            ))}
          </div>

          {hayUsuario ? (
            <div className="flex items-center gap-3">
              <Button onClick={marcarCompletada}>Marcar como completada</Button>
              {guardado === "ok" && (
                <span className="flex items-center gap-1 text-sm text-success">
                  <Check size={16} aria-hidden="true" /> guardado
                </span>
              )}
              {guardado === "error" && (
                <span className="text-sm text-danger">no se pudo guardar</span>
              )}
            </div>
          ) : (
            <p className="text-sm italic text-muted">Inicia sesion para guardar tu progreso</p>
          )}
        </>
      )}
    </main>
  );
}
