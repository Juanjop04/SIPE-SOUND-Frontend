import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ESPERA_REENVIO_SEGUNDOS, useCuentaRegresiva } from "@/shared/hooks/useCuentaRegresiva";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { reenviarCodigo, verificarCorreo } from "../api/authApi";
import { esquemaVerificacion, type DatosVerificacion, type EntradaVerificacion } from "../schemas";

const CAMPOS = ["email", "codigo"] as const;

/** Lo que dura un código de verificación (el backend: VIGENCIA_CODIGO_MIN, 1 minuto). */
export const VIGENCIA_CODIGO_SEGUNDOS = 60;

/**
 * Estado de /verificar: confirmar el código (POST /auth/verificacion) y pedir otro.
 * `venceEnSegundos` llega del registro: lo que le queda al código vigente. Sin él (viene del
 * inicio de sesión) no se sabe cuándo salió el último y no se muestra cuenta regresiva.
 */
export function useVerificacion(emailInicial: string, venceEnSegundos?: number) {
  // Mientras el código vive, otro no puede pedirse: ambas cuentas arrancan igual.
  const reenvio = useCuentaRegresiva(ESPERA_REENVIO_SEGUNDOS, venceEnSegundos ?? 0);
  const vigencia = useCuentaRegresiva(VIGENCIA_CODIGO_SEGUNDOS, venceEnSegundos ?? 0);
  const [seguimiento, setSeguimiento] = useState(venceEnSegundos !== undefined);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [avisoReenvio, setAvisoReenvio] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState<{ mensaje: string; email: string } | null>(null);
  const formulario = useForm<EntradaVerificacion, unknown, DatosVerificacion>({
    resolver: zodResolver(esquemaVerificacion),
    mode: "onTouched",
    defaultValues: { email: emailInicial, codigo: "" },
  });

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
      vigencia.iniciar();
      setSeguimiento(true);
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
    enviar: formulario.handleSubmit(enviar),
    pedirOtroCodigo,
    enviando: verificar.isPending,
    reenviando: reenviar.isPending,
    reenvio,
    vigencia: { restante: vigencia.restante, seguimiento },
    errorGeneral,
    avisoReenvio,
    confirmado,
  };
}
