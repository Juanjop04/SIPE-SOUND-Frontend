import { useId } from "react";
import {
  useWatch,
  type Control,
  type FieldErrors,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { Field } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { CampoPassword } from "./CampoPassword";
import { RequisitosPassword } from "./RequisitosPassword";

const ATRIBUTOS = { autoComplete: "new-password", maxLength: LIMITES.password.max } as const;

/** Lo mínimo que debe tener un formulario para usar estos campos (registro, restablecer…). */
export interface CamposDePassword {
  password: string;
  confirmar: string;
}

interface CamposPasswordProps<T extends CamposDePassword> {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

/** Contraseña nueva + requisitos que se marcan al escribir + confirmación (solo frontend). */
export function CamposPassword<T extends CamposDePassword>({
  register,
  control,
  errors,
}: CamposPasswordProps<T>) {
  const idRequisitos = useId();
  const password = useWatch({ control, name: "password" as Path<T> }) as string | undefined;
  // FieldErrors<T> no deja indexar por nombre fijo con un tipo genérico.
  const mensajes = errors as FieldErrors<CamposDePassword>;

  return (
    <>
      <Field etiqueta="Contraseña" error={mensajes.password?.message}>
        {(campo) => (
          <>
            <CampoPassword
              {...campo}
              {...register("password" as Path<T>)}
              {...ATRIBUTOS}
              aria-describedby={[campo["aria-describedby"], idRequisitos].filter(Boolean).join(" ")}
            />
            <RequisitosPassword id={idRequisitos} password={password ?? ""} />
          </>
        )}
      </Field>

      <Field etiqueta="Confirmar contraseña" error={mensajes.confirmar?.message}>
        {(campo) => (
          <CampoPassword {...campo} {...register("confirmar" as Path<T>)} {...ATRIBUTOS} />
        )}
      </Field>
    </>
  );
}
