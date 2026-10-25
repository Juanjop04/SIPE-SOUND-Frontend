import { useState, type Dispatch } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CamposPassword } from "@/features/auth";
import { ApiError } from "@/shared/api/ApiError.js";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { cambiarContrasena } from "../api/cuentaApi";
import {
  esquemaContrasenaNueva,
  type DatosContrasenaNueva,
  type EntradaContrasenaNueva,
} from "../schemas";
import { MENSAJE_VOLVER_A_CONFIRMAR, type AccionIdentidad } from "../utils/pasosIdentidad";
import { PasoFormulario } from "./PasoFormulario";

interface Props {
  token: string;
  dispatch: Dispatch<AccionIdentidad>;
  onCancelar: () => void;
}

const CAMPOS = ["password"] as const;

/** Paso 3 (contraseña): la contraseña nueva, con el token de UN solo uso. */
export function PasoContrasenaNueva({ token, dispatch, onCancelar }: Props) {
  const { enfriando, iniciar } = useEnfriamiento();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EntradaContrasenaNueva, unknown, DatosContrasenaNueva>({
    resolver: zodResolver(esquemaContrasenaNueva),
    mode: "onTouched",
    defaultValues: { password: "", confirmar: "" },
  });

  const cambiar = useMutation({
    mutationFn: cambiarContrasena,
    onSuccess: ({ message }) => dispatch({ tipo: "terminado", resultado: message }),
    onError: (error) => {
      if (esDemasiadasSolicitudes(error)) iniciar();
      // 422 con este texto: el token venció o ya se usó. Otro 422 (p. ej. "distinta de la actual")
      // se muestra aquí mismo.
      if (error instanceof ApiError && error.message === MENSAJE_VOLVER_A_CONFIRMAR) {
        dispatch({ tipo: "vencio" });
        return;
      }
      setErrorGeneral(aplicarErroresServidor(error, setError, CAMPOS));
    },
  });

  return (
    <PasoFormulario
      instruccion="Identidad confirmada. Elige tu contraseña nueva; cerraremos tus sesiones en otros equipos."
      etiqueta="Cambiar contraseña"
      onEnviar={handleSubmit((datos) => {
        setErrorGeneral(null);
        cambiar.mutate({ token, password: datos.password });
      })}
      onCancelar={onCancelar}
      enviando={cambiar.isPending}
      enfriando={enfriando}
      error={errorGeneral}
    >
      <CamposPassword register={register} control={control} errors={errors} />
    </PasoFormulario>
  );
}
