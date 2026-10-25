import { useState, type Dispatch } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/shared/api/ApiError.js";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { Field, Input } from "@/shared/ui";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { pedirCambioDeCorreo } from "../api/cuentaApi";
import { esquemaCorreoNuevo, type DatosCorreoNuevo } from "../schemas";
import { MENSAJE_VOLVER_A_CONFIRMAR, type AccionIdentidad } from "../utils/pasosIdentidad";
import { PasoFormulario } from "./PasoFormulario";

interface Props {
  token: string;
  dispatch: Dispatch<AccionIdentidad>;
  onCancelar: () => void;
}

const CAMPOS = ["email"] as const;

/** Paso 3 (correo): el correo nuevo. El token se gasta aquí; el código llega al correo nuevo. */
export function PasoCorreoNuevo({ token, dispatch, onCancelar }: Props) {
  const { enfriando, iniciar } = useEnfriamiento();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DatosCorreoNuevo>({
    resolver: zodResolver(esquemaCorreoNuevo),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const pedir = useMutation({
    mutationFn: pedirCambioDeCorreo,
    onSuccess: (_, datos) => dispatch({ tipo: "correoNuevoPedido", correo: datos.email }),
    onError: (error) => {
      if (esDemasiadasSolicitudes(error)) iniciar();
      if (error instanceof ApiError && error.statusCode === 409) {
        setError("email", { type: "server", message: error.message });
        return;
      }
      // 422 con este texto: el token venció o ya se usó. Otro 422 (p. ej. "ya es tu correo") se
      // muestra aquí mismo.
      if (error instanceof ApiError && error.message === MENSAJE_VOLVER_A_CONFIRMAR) {
        dispatch({ tipo: "vencio" });
        return;
      }
      setErrorGeneral(aplicarErroresServidor(error, setError, CAMPOS));
    },
  });

  return (
    <PasoFormulario
      instruccion="Identidad confirmada. Escribe tu correo nuevo: te enviaremos un código para comprobar que es tuyo."
      etiqueta="Enviar código"
      onEnviar={handleSubmit((datos) => {
        setErrorGeneral(null);
        pedir.mutate({ token, email: datos.email });
      })}
      onCancelar={onCancelar}
      enviando={pedir.isPending}
      enfriando={enfriando}
      error={errorGeneral}
    >
      <Field etiqueta="Correo nuevo" error={errors.email?.message}>
        {(campo) => (
          <Input
            {...campo}
            {...register("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
          />
        )}
      </Field>
    </PasoFormulario>
  );
}
