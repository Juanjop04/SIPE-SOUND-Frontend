import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCuentaRegresiva } from "@/shared/hooks/useCuentaRegresiva";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { pedirRecuperacion } from "../api/authApi";
import { esquemaRecuperacion, type DatosRecuperacion, type EntradaRecuperacion } from "../schemas";

/** El backend manda un enlace por cuenta cada 2 minutos. */
export const ESPERA_RECUPERACION_SEGUNDOS = 120;
const CAMPOS = ["email"] as const;

/** Estado de /recuperar: pedir el enlace (la respuesta es siempre la misma, exista o no la cuenta). */
export function useRecuperacion() {
  const espera = useCuentaRegresiva(ESPERA_RECUPERACION_SEGUNDOS);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const formulario = useForm<EntradaRecuperacion, unknown, DatosRecuperacion>({
    resolver: zodResolver(esquemaRecuperacion),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const pedir = useMutation({
    mutationFn: pedirRecuperacion,
    onSuccess: ({ message }) => {
      setRespuesta(message);
      espera.iniciar();
    },
    onError: (error) => {
      if (esDemasiadasSolicitudes(error)) espera.iniciar();
      setErrorGeneral(aplicarErroresServidor(error, formulario.setError, CAMPOS));
    },
  });

  function enviar(datos: DatosRecuperacion) {
    setErrorGeneral(null);
    setRespuesta(null);
    pedir.mutate(datos.email);
  }

  return {
    formulario,
    enviar: formulario.handleSubmit(enviar),
    enviando: pedir.isPending,
    espera,
    errorGeneral,
    respuesta,
  };
}
