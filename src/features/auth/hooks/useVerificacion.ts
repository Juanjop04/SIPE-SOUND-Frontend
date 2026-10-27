import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCuentaRegresiva } from "@/shared/hooks/useCuentaRegresiva";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { reenviarCodigo, verificarCorreo } from "../api/authApi";
import { esquemaVerificacion, type DatosVerificacion, type EntradaVerificacion } from "../schemas";

const CAMPOS = ["email", "codigo"] as const;

/** Estado de /verificar: confirmar el código (POST /auth/verificacion) y pedir otro. */
export function useVerificacion(emailInicial: string, esperarAlEntrar: boolean) {
  // Venir del registro significa que el código acaba de salir: otro no puede pedirse ya.
  const reenvio = useCuentaRegresiva(undefined, esperarAlEntrar);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [avisoReenvio, setAvisoReenvio] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState<{ mensaje: string; email: string } | null>(null);
  const formulario = useForm<EntradaVerificacion, unknown, DatosVerificacion>({
    resolver: zodResolver(esquemaVerificacion),
    mode: "onTouched",
    defaultValues: { email: emailInicial, codigo: "" },
  });

  // Con el correo ya escrito (enlace del correo, registro o inicio de sesión) solo falta el código.
  const { setFocus } = formulario;
  useEffect(() => {
    if (emailInicial) setFocus("codigo");
  }, [emailInicial, setFocus]);

  const verificar = useMutation({
    mutationFn: verificarCorreo,
    onSuccess: ({ message }, datos) => setConfirmado({ mensaje: message, email: datos.email }),
    onError: (error) => {
      if (esDemasiadasSolicitudes(error)) reenvio.iniciar();
      setErrorGeneral(aplicarErroresServidor(error, formulario.setError, CAMPOS));
    },
  });

  const reenviar = useMutation({
    mutationFn: reenviarCodigo,
    onSuccess: ({ message }) => {
      setAvisoReenvio(message);
      formulario.resetField("codigo");
      reenvio.iniciar();
    },
    onError: (error) => {
      if (esDemasiadasSolicitudes(error)) reenvio.iniciar();
      setErrorGeneral(aplicarErroresServidor(error, formulario.setError, CAMPOS));
    },
  });

  function enviar(datos: DatosVerificacion) {
    setErrorGeneral(null);
    setAvisoReenvio(null);
    verificar.mutate({ email: datos.email, codigo: datos.codigo });
  }

  async function pedirOtroCodigo() {
    setErrorGeneral(null);
    setAvisoReenvio(null);
    // Solo hace falta un correo válido para pedir otro código.
    if (!(await formulario.trigger("email"))) return;
    reenviar.mutate(formulario.getValues("email").trim().toLowerCase());
  }

  return {
    formulario,
    /** Correo válido y código de 6 dígitos: solo entonces se puede confirmar. */
    completo: formulario.formState.isValid,
    enviar: formulario.handleSubmit(enviar),
    pedirOtroCodigo,
    enviando: verificar.isPending,
    reenviando: reenviar.isPending,
    reenvio,
    errorGeneral,
    avisoReenvio,
    confirmado,
  };
}
