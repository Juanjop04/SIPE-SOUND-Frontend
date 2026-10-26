import { useParams, useSearchParams } from "react-router-dom";
import { MensajeError, Skeleton } from "@/shared/ui";
import { PaginaAtril } from "../components/PaginaAtril";
import { textoDeAutoria } from "../autoria";
import { useEvaluacionDocente } from "../evaluaciones/api";
import { FormularioEvaluacion } from "../evaluaciones/components/FormularioEvaluacion";

const ESTADOS = { borrador: "borrador", publicada: "publicada", cerrada: "cerrada" } as const;

/** /docente/evaluaciones/nueva (?curso= preelige el curso) y /docente/evaluaciones/:id. */
export default function EditorEvaluacionPage() {
  const { id } = useParams();
  const [parametros] = useSearchParams();
  const nueva = id === "nueva";
  const evaluacionId = nueva ? null : Number(id);
  const cursoId = Number(parametros.get("curso")) || null;
  const { data, isPending, error, refetch } = useEvaluacionDocente(evaluacionId);

  if (nueva) {
    return (
      <PaginaAtril
        titulo="Nueva evaluación"
        descripcion="Se guarda como borrador hasta que la publiques."
      >
        <FormularioEvaluacion key="nueva" inicial={null} cursoId={cursoId} />
      </PaginaAtril>
    );
  }
  return (
    <PaginaAtril
      titulo={data?.titulo ?? "Evaluación"}
      descripcion={
        data
          ? [
              `Estado: ${ESTADOS[data.estado]} · ${data.preguntas.length} preguntas`,
              textoDeAutoria({
                autor: data.autor ?? null,
                modificado_por: data.modificado_por ?? null,
                actualizado_en: data.actualizado_en,
              }),
            ]
              .filter(Boolean)
              .join(" · ")
          : ""
      }
    >
      {isPending && <Skeleton lineas={6} className="h-12 w-full" />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {/* La clave reinicia el formulario cuando cambia lo guardado (p. ej. tras publicar). */}
      {data && (
        <FormularioEvaluacion
          key={`${data.id}-${data.actualizado_en}`}
          inicial={data}
          cursoId={null}
        />
      )}
    </PaginaAtril>
  );
}
