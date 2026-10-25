import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CampoCodigo } from "@/features/auth";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { Field } from "@/shared/ui";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { esquemaCodigo, type DatosCodigo, type EntradaCodigo } from "../schemas";
import { PasoFormulario } from "./PasoFormulario";

interface PasoCodigoProps<R> {
  instruccion: string;
  etiqueta: string;
  /** Llama al backend con el código ya limpio (6 dígitos). */
  confirmar: (codigo: string) => Promise<R>;
  alConfirmar: (respuesta: R) => void;
  onCancelar: () => void;
}

const CAMPOS = ["codigo"] as const;

/** Paso con el campo del código de 6 dígitos (el mismo de HU-F-401), para los dos códigos del flujo. */
export function PasoCodigo<R>({
  instruccion,
  etiqueta,
  confirmar,
  alConfirmar,
  onCancelar,
}: PasoCodigoProps<R>) {
  const { enfriando, iniciar } = useEnfriamiento();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EntradaCodigo, unknown, DatosCodigo>({
    resolver: zodResolver(esquemaCodigo),
    mode: "onTouched",
    defaultValues: { codigo: "" },
  });

  const enviar = useMutation({
    mutationFn: confirmar,
    onSuccess: alConfirmar,
    onError: (error) => {
      if (esDemasiadasSolicitudes(error)) iniciar();
      setErrorGeneral(aplicarErroresServidor(error, setError, CAMPOS));
    },
  });

  return (
    <PasoFormulario
      instruccion={instruccion}
      etiqueta={etiqueta}
      onEnviar={handleSubmit((datos) => {
        setErrorGeneral(null);
        enviar.mutate(datos.codigo);
      })}
      onCancelar={onCancelar}
      enviando={enviar.isPending}
      enfriando={enfriando}
      error={errorGeneral}
    >
      <Field etiqueta="Código de 6 dígitos" error={errors.codigo?.message}>
        {(campo) => <CampoCodigo {...campo} {...register("codigo")} />}
      </Field>
    </PasoFormulario>
  );
}
