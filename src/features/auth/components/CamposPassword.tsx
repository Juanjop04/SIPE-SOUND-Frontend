import { useId } from "react";
import { useWatch, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Field } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import type { EntradaRegistro } from "../schemas";
import { CampoPassword } from "./CampoPassword";
import { RequisitosPassword } from "./RequisitosPassword";

const ATRIBUTOS = { autoComplete: "new-password", maxLength: LIMITES.password.max } as const;

interface CamposPasswordProps {
  register: UseFormRegister<EntradaRegistro>;
  control: Control<EntradaRegistro>;
  errors: FieldErrors<EntradaRegistro>;
}

/** Contraseña nueva + requisitos que se marcan al escribir + confirmación (solo frontend). */
export function CamposPassword({ register, control, errors }: CamposPasswordProps) {
  const idRequisitos = useId();
  const password = useWatch({ control, name: "password" });

  return (
    <>
      <Field etiqueta="Contraseña" error={errors.password?.message}>
        {(campo) => (
          <>
            <CampoPassword
              {...campo}
              {...register("password")}
              {...ATRIBUTOS}
              aria-describedby={[campo["aria-describedby"], idRequisitos].filter(Boolean).join(" ")}
            />
            <RequisitosPassword id={idRequisitos} password={password ?? ""} />
          </>
        )}
      </Field>

      <Field etiqueta="Confirmar contraseña" error={errors.confirmar?.message}>
        {(campo) => <CampoPassword {...campo} {...register("confirmar")} {...ATRIBUTOS} />}
      </Field>
    </>
  );
}
