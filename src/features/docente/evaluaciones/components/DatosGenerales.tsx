import { useWatch, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Field, Input, Select, Textarea } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useCursos } from "../datos";
import { manana, type ControlEvaluacion, type EntradaEvaluacion } from "../schemas";

interface DatosGeneralesProps {
  register: UseFormRegister<EntradaEvaluacion>;
  control: ControlEvaluacion;
  errores: FieldErrors<EntradaEvaluacion>;
  /** El curso solo se elige al crear (la API no permite moverla de curso). */
  creando: boolean;
}

/** Título, curso, descripción, % de aprobación, intentos máximos y fecha límite. */
export function DatosGenerales({ register, control, errores, creando }: DatosGeneralesProps) {
  const cursos = useCursos("activo");
  const aprobacion = useWatch({ control, name: "porcentaje_aprobacion" });
  const { aprobacion: rango, intentosMax } = LIMITES;

  return (
    <section aria-label="Datos generales" className="flex flex-col gap-5">
      <Field etiqueta="Título" error={errores.titulo?.message}>
        {(c) => <Input {...c} {...register("titulo")} maxLength={LIMITES.titulo.max} />}
      </Field>
      {creando && (
        <Field etiqueta="Curso" error={errores.curso_id?.message}>
          {(c) => (
            <Select {...c} {...register("curso_id")}>
              <option value="">Elige un curso</option>
              {(cursos.data ?? []).map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombre}
                </option>
              ))}
            </Select>
          )}
        </Field>
      )}
      <Field etiqueta="Descripción (opcional)" error={errores.descripcion?.message}>
        {(c) => (
          <Textarea
            {...c}
            {...register("descripcion")}
            rows={3}
            maxLength={LIMITES.descripcion.max}
            contador
          />
        )}
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          etiqueta="Aprobación (%)"
          ayuda={`Los estudiantes aprueban con ${aprobacion || "…"} % o más.`}
          error={errores.porcentaje_aprobacion?.message}
        >
          {(c) => (
            <Input
              {...c}
              {...register("porcentaje_aprobacion")}
              type="number"
              inputMode="numeric"
              min={rango.min}
              max={rango.max}
            />
          )}
        </Field>
        <Field etiqueta="Intentos máximos (opcional)" error={errores.intentos_max?.message}>
          {(c) => (
            <Input
              {...c}
              {...register("intentos_max")}
              type="number"
              inputMode="numeric"
              min={intentosMax.min}
              max={intentosMax.max}
            />
          )}
        </Field>
        <Field etiqueta="Fecha límite (opcional)" error={errores.fecha_limite?.message}>
          {(c) => <Input {...c} {...register("fecha_limite")} type="date" min={manana()} />}
        </Field>
      </div>
    </section>
  );
}
