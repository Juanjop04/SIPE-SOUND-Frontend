import type { FieldErrors, UseFormGetValues, UseFormRegister } from "react-hook-form";
import type { ControlEvaluacion, EntradaEvaluacion } from "../schemas";
import type { DetalleEvaluacionDocente } from "../tipos";
import { EditorPreguntas } from "./EditorPreguntas";
import { PreguntasSoloLectura } from "./PreguntasSoloLectura";

interface SeccionPreguntasProps {
  inicial: DetalleEvaluacionDocente | null;
  control: ControlEvaluacion;
  register: UseFormRegister<EntradaEvaluacion>;
  getValues: UseFormGetValues<EntradaEvaluacion>;
  errores?: FieldErrors<EntradaEvaluacion>["preguntas"];
}

/** Editable o, si ya hay intentos, de solo lectura (protege el historial de los estudiantes). */
export function SeccionPreguntas({
  inicial,
  control,
  register,
  getValues,
  errores,
}: SeccionPreguntasProps) {
  if (!inicial?.tiene_intentos) {
    return (
      <EditorPreguntas
        control={control}
        register={register}
        getValues={getValues}
        errores={errores}
      />
    );
  }
  return (
    <section aria-labelledby="preguntas-fijas" className="flex flex-col gap-4">
      <h2 id="preguntas-fijas" className="font-display text-xl font-semibold text-paper">
        Preguntas
      </h2>
      <p
        role="note"
        className="rounded-md border border-linea bg-ink-2 px-4 py-3 text-sm text-muted"
      >
        Ya hay intentos: para cambiar preguntas, duplica la evaluación.
      </p>
      <PreguntasSoloLectura preguntas={inicial.preguntas} />
    </section>
  );
}
