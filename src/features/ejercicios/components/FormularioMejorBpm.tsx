import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCompletarEjercicio } from "@/features/progreso";
import { Button, Field, Input, MensajeError, useAviso } from "@/shared/ui";
import { LIMITES, aplicarErroresServidor, entero } from "@/shared/validacion";

const esquema = z.object({ mejor_bpm: entero(LIMITES.bpm.min, LIMITES.bpm.max) });
type Entrada = z.input<typeof esquema>;
type Datos = z.output<typeof esquema>;

interface FormularioMejorBpmProps {
  ejercicioId: number;
  /** Tempo actual del metrónomo: atajo para no escribirlo. */
  bpmActual: number;
}

/** "Lo logré a ___ BPM" → PUT /progreso/ejercicios/{id} con mejor_bpm (no se envía si es inválido). */
export function FormularioMejorBpm({ ejercicioId, bpmActual }: FormularioMejorBpmProps) {
  const completar = useCompletarEjercicio();
  const { avisar } = useAviso();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Entrada, unknown, Datos>({
    resolver: zodResolver(esquema),
    mode: "onTouched",
    defaultValues: { mejor_bpm: bpmActual },
  });

  async function enviar({ mejor_bpm }: Datos) {
    setErrorGeneral(null);
    try {
      await completar.mutateAsync({ id: ejercicioId, mejorBpm: mejor_bpm });
      avisar({ mensaje: `Guardado: lo lograste a ${mejor_bpm} BPM.` });
    } catch (error) {
      setErrorGeneral(aplicarErroresServidor(error, setError, ["mejor_bpm"]));
    }
  }

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <Field etiqueta="Lo logré a (BPM)" error={errors.mejor_bpm?.message} className="w-36">
          {(control) => (
            <Input
              {...control}
              {...register("mejor_bpm")}
              type="number"
              inputMode="numeric"
              min={LIMITES.bpm.min}
              max={LIMITES.bpm.max}
              step={1}
              className="font-mono"
            />
          )}
        </Field>
        <Button type="submit" cargando={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Guardar"}
        </Button>
        <Button
          variante="fantasma"
          tamano="sm"
          onClick={() => setValue("mejor_bpm", bpmActual, { shouldValidate: true })}
        >
          Usar {bpmActual} BPM
        </Button>
      </div>
      {errorGeneral && <MensajeError mensaje={errorGeneral} />}
    </form>
  );
}
