import { useId } from "react";
import { Controller, useFieldArray, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { ArrowDown, ArrowUp, Copy, Plus, Trash2, X } from "lucide-react";
import { Button, Field, Input, Textarea } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import type { ControlEvaluacion, EntradaEvaluacion } from "../schemas";

type Errores = FieldErrors<EntradaEvaluacion>["preguntas"];

interface PreguntaEditableProps {
  indice: number;
  total: number;
  control: ControlEvaluacion;
  register: UseFormRegister<EntradaEvaluacion>;
  errores?: Errores;
  onMover: (desde: number, hacia: number) => void;
  onDuplicar: (indice: number) => void;
  onQuitar: (indice: number) => void;
}

const numero = (n: number) => String(n).padStart(2, "0");

/** Subir, bajar, duplicar y eliminar: cada botón dice a qué pregunta afecta. */
function AccionesPregunta({
  indice,
  total,
  onMover,
  onDuplicar,
  onQuitar,
}: Omit<PreguntaEditableProps, "control" | "register" | "errores">) {
  const nombre = `pregunta ${indice + 1}`;
  return (
    <div className="flex gap-1">
      <Button
        variante="fantasma"
        tamano="sm"
        aria-label={`Subir ${nombre}`}
        disabled={indice === 0}
        onClick={() => onMover(indice, indice - 1)}
      >
        <ArrowUp size={16} aria-hidden="true" />
      </Button>
      <Button
        variante="fantasma"
        tamano="sm"
        aria-label={`Bajar ${nombre}`}
        disabled={indice === total - 1}
        onClick={() => onMover(indice, indice + 1)}
      >
        <ArrowDown size={16} aria-hidden="true" />
      </Button>
      <Button
        variante="fantasma"
        tamano="sm"
        aria-label={`Duplicar ${nombre}`}
        onClick={() => onDuplicar(indice)}
      >
        <Copy size={16} aria-hidden="true" />
      </Button>
      <Button
        variante="fantasma"
        tamano="sm"
        aria-label={`Eliminar ${nombre}`}
        onClick={() => onQuitar(indice)}
      >
        <Trash2 size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}

/** 2–6 opciones con un radio "Correcta" junto a cada una; el error se muestra en la pregunta. */
function OpcionesPregunta({
  indice,
  control,
  register,
  errores,
}: Pick<PreguntaEditableProps, "indice" | "control" | "register" | "errores">) {
  const idGrupo = useId();
  const opciones = useFieldArray({ control, name: `preguntas.${indice}.opciones` });
  const error = errores?.[indice];
  const mensaje =
    error?.correcta?.message ?? error?.opciones?.message ?? error?.opciones?.root?.message;
  return (
    <Controller
      control={control}
      name={`preguntas.${indice}.correcta`}
      render={({ field }) => (
        <fieldset
          className="flex flex-col gap-2"
          aria-describedby={mensaje ? `${idGrupo}-error` : undefined}
        >
          <legend className="mb-1 text-sm font-medium text-paper">
            Opciones (marca la correcta)
          </legend>
          {opciones.fields.map((opcion, i) => (
            <div key={opcion.id} className="flex items-center gap-2">
              <input
                type="radio"
                name={`${idGrupo}-correcta`}
                checked={field.value === i}
                onChange={() => field.onChange(i)}
                aria-label={`Opción ${i + 1} es la correcta`}
                className="h-5 w-5 shrink-0 accent-[rgb(var(--color-primary))]"
              />
              <Input
                {...register(`preguntas.${indice}.opciones.${i}.texto`)}
                aria-label={`Opción ${i + 1}`}
                maxLength={LIMITES.opcion.max}
                aria-invalid={Boolean(error?.opciones?.[i]?.texto)}
              />
              <Button
                variante="fantasma"
                tamano="sm"
                aria-label={`Quitar opción ${i + 1}`}
                disabled={opciones.fields.length <= LIMITES.opciones.min}
                onClick={() => {
                  opciones.remove(i);
                  if (field.value === i) field.onChange(-1);
                  else if (field.value > i) field.onChange(field.value - 1);
                }}
              >
                <X size={16} aria-hidden="true" />
              </Button>
            </div>
          ))}
          <Button
            variante="fantasma"
            tamano="sm"
            className="self-start"
            disabled={opciones.fields.length >= LIMITES.opciones.max}
            onClick={() => opciones.append({ texto: "" })}
          >
            <Plus size={16} aria-hidden="true" />
            Agregar opción
          </Button>
          {mensaje && (
            <p id={`${idGrupo}-error`} role="alert" className="text-xs text-danger">
              {mensaje}
            </p>
          )}
        </fieldset>
      )}
    />
  );
}

/** Enunciado y opciones de una pregunta de opción única. */
export function PreguntaEditable(props: PreguntaEditableProps) {
  const { indice, register, errores } = props;
  return (
    <li className="flex flex-col gap-4 rounded-caja border border-linea bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-sm text-primary-claro">{numero(indice + 1)}</p>
        <AccionesPregunta {...props} />
      </div>
      <Field etiqueta="Enunciado" error={errores?.[indice]?.enunciado?.message}>
        {(c) => (
          <Textarea
            {...c}
            {...register(`preguntas.${indice}.enunciado`)}
            rows={2}
            maxLength={LIMITES.enunciado.max}
            contador
          />
        )}
      </Field>
      <OpcionesPregunta {...props} />
    </li>
  );
}
