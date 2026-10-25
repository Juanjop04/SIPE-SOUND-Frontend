import { useState, type Dispatch } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CampoPassword } from "@/features/auth";
import { ApiError } from "@/shared/api/ApiError.js";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { Field } from "@/shared/ui";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { pedirCodigoDeIdentidad } from "../api/cuentaApi";
import { esquemaContrasenaActual, type DatosContrasenaActual } from "../schemas";
import type { AccionIdentidad } from "../utils/pasosIdentidad";
import { PasoFormulario } from "./PasoFormulario";

interface Props {
  aviso: string | null;
  dispatch: Dispatch<AccionIdentidad>;
  onCancelar: () => void;
}

const CAMPOS = ["password_actual"] as const;

/** Paso 1: la contraseña actual. Si coincide, el backend envía un código al correo actual. */
export function PasoContrasenaActual({ aviso, dispatch, onCancelar }: Props) {
  const { enfriando, iniciar } = useEnfriamiento();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DatosContrasenaActual>({
    resolver: zodResolver(esquemaContrasenaActual),
    mode: "onTouched",
    defaultValues: { password_actual: "" },
  });

  const pedir = useMutation({
    mutationFn: pedirCodigoDeIdentidad,
    onSuccess: ({ data }) => dispatch({ tipo: "codigoEnviado", enviadoA: data.enviado_a }),
    onError: (error) => {
      if (esDemasiadasSolicitudes(error)) iniciar();
      // 401: la contraseña no coincide; el texto del backend va en el campo, no arriba.
      if (error instanceof ApiError && error.statusCode === 401) {
        setError("password_actual", { type: "server", message: error.message });
        return;
      }
      setErrorGeneral(aplicarErroresServidor(error, setError, CAMPOS));
    },
  });

  return (
    <PasoFormulario
      instruccion="Para proteger tu cuenta, primero escribe tu contraseña actual. Te enviaremos un código a tu correo."
      aviso={aviso}
      etiqueta="Enviar código"
      onEnviar={handleSubmit((datos) => {
        setErrorGeneral(null);
        pedir.mutate(datos.password_actual);
      })}
      onCancelar={onCancelar}
      enviando={pedir.isPending}
      enfriando={enfriando}
      error={errorGeneral}
    >
      <Field etiqueta="Contraseña actual" error={errors.password_actual?.message}>
        {(campo) => (
          <CampoPassword
            {...campo}
            {...register("password_actual")}
            autoComplete="current-password"
          />
        )}
      </Field>
    </PasoFormulario>
  );
}
