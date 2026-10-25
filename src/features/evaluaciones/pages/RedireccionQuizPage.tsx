import { Navigate, useParams } from "react-router-dom";
import { useRuta } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { EstadoVacio, MensajeError, Skeleton } from "@/shared/ui";

/**
 * /quiz/:bloqueId (URL anterior) → /evaluacion/:id con el evaluacion_id del bloque en GET /ruta.
 * La API ya no tiene /quiz/* (HU-B-312).
 */
export default function RedireccionQuizPage() {
  const { bloqueId } = useParams();
  const { data: bloques, isPending, error, refetch } = useRuta();
  const bloque = bloques?.find((b) => String(b.id) === bloqueId);

  if (bloque?.evaluacion_id) {
    return <Navigate to={paths.evaluacion(bloque.evaluacion_id)} replace />;
  }
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      {isPending && <Skeleton lineas={3} />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {bloques && <EstadoVacio titulo="Este bloque aún no tiene evaluación." />}
    </main>
  );
}
