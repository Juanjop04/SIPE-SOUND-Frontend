import {
  useFieldArray,
  type FieldErrors,
  type UseFormGetValues,
  type UseFormRegister,
} from "react-hook-form";
import { Plus } from "lucide-react";
import { Button, EstadoVacio } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { preguntaVacia, type ControlEvaluacion, type EntradaEvaluacion } from "../schemas";
import { PreguntaEditable } from "./PreguntaEditable";

interface EditorPreguntasProps {
  control: ControlEvaluacion;
  register: UseFormRegister<EntradaEvaluacion>;
  getValues: UseFormGetValues<EntradaEvaluacion>;
  errores?: FieldErrors<EntradaEvaluacion>["preguntas"];
}

/** Lista numerada de preguntas: agregar, duplicar, reordenar (Subir/Bajar) y eliminar. */
export function EditorPreguntas({ control, register, getValues, errores }: EditorPreguntasProps) {
  const preguntas = useFieldArray({ control, name: "preguntas" });
  const lleno = preguntas.fields.length >= LIMITES.preguntas.max;

  return (
    <section aria-labelledby="titulo-preguntas" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id="titulo-preguntas" className="font-display text-xl font-semibold text-paper">
          Preguntas <span className="font-mono text-sm text-muted">{preguntas.fields.length}</span>
        </h2>
        <Button
          variante="secundario"
          tamano="sm"
          disabled={lleno}
          onClick={() => preguntas.append(preguntaVacia())}
        >
          <Plus size={16} aria-hidden="true" />
          Agregar pregunta
        </Button>
      </div>
      {preguntas.fields.length === 0 ? (
        <EstadoVacio
          titulo="Aún no hay preguntas."
          descripcion="Agrega al menos una para poder publicar."
        />
      ) : (
        <ol className="flex flex-col gap-4">
          {preguntas.fields.map((pregunta, indice) => (
            <PreguntaEditable
              key={pregunta.id}
              indice={indice}
              total={preguntas.fields.length}
              control={control}
              register={register}
              errores={errores}
              onMover={preguntas.move}
              onDuplicar={(i) =>
                !lleno && preguntas.insert(i + 1, structuredClone(getValues(`preguntas.${i}`)))
              }
              onQuitar={preguntas.remove}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
