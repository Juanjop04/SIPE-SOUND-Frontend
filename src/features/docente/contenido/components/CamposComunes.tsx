import type { UseFormRegisterReturn } from "react-hook-form";
import { Field, Input, Select, Textarea } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { NIVELES } from "../schemas";

// Campos que comparten lecciones y ejercicios: un solo lugar para sus atributos (contrato 08).
interface CampoProps {
  registro: UseFormRegisterReturn;
  error?: string;
}

export function CampoTitulo({ registro, error, etiqueta }: CampoProps & { etiqueta: string }) {
  return (
    <Field etiqueta={etiqueta} error={error}>
      {(c) => <Input {...c} {...registro} maxLength={LIMITES.titulo.max} />}
    </Field>
  );
}

export function CampoDescripcion({ registro, error }: CampoProps) {
  return (
    <Field etiqueta="Descripción (opcional)" error={error}>
      {(c) => (
        <Textarea {...c} {...registro} rows={3} maxLength={LIMITES.descripcion.max} contador />
      )}
    </Field>
  );
}

export function CampoNivel({ registro, error }: CampoProps) {
  return (
    <Field etiqueta="Nivel" error={error}>
      {(c) => (
        <Select {...c} {...registro}>
          {NIVELES.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </Select>
      )}
    </Field>
  );
}

export function CampoEntero({
  registro,
  error,
  etiqueta,
  min,
  max,
}: CampoProps & { etiqueta: string; min: number; max?: number }) {
  return (
    <Field etiqueta={etiqueta} error={error}>
      {(c) => (
        <Input
          {...c}
          {...registro}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          className="font-mono"
        />
      )}
    </Field>
  );
}

export function CampoDuracion({ registro, error }: CampoProps) {
  const { min, max } = LIMITES.duracionMin;
  return (
    <CampoEntero
      registro={registro}
      error={error}
      etiqueta="Duración en minutos (opcional)"
      min={min}
      max={max}
    />
  );
}
