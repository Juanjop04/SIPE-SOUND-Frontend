import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/shared/api/ApiError.js";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { restablecerContrasena } from "../api/authApi";
import { esquemaRestablecer, type DatosRestablecer, type EntradaRestablecer } from "../schemas";
import { borrarFragmentoDeLaUrl, leerTokenDelFragmento } from "../utils/tokenDelEnlace";

const CAMPOS = ["password"] as const;
const MENSAJE_SIN_ENLACE = "El enlace ya se usó o venció. Pide uno nuevo.";

/**
 * Estado de /restablecer. El token llega en el fragmento de la URL: se lee UNA vez, se guarda solo
 * en memoria (nunca en localStorage, sessionStorage ni en la barra de direcciones) y se borra de la
 * URL en cuanto la página carga.
 */
export function useRestablecer() {
  const [token] = useState(() => leerTokenDelFragmento(window.location.hash));
  const [enlaceInvalido, setEnlaceInvalido] = useState<string | null>(
    token ? null : MENSAJE_SIN_ENLACE,
  );
  const [listo, setListo] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const { enfriando, iniciar: iniciarEnfriamiento } = useEnfriamiento();

  // Sincroniza con la barra de direcciones (sistema externo): el token no se queda a la vista.
  useEffect(borrarFragmentoDeLaUrl, []);

  const formulario = useForm<EntradaRestablecer, unknown, DatosRestablecer>({
    resolver: zodResolver(esquemaRestablecer),
    mode: "onTouched",
    defaultValues: { password: "", confirmar: "" },
  });

  const restablecer = useMutation({
    mutationFn: restablecerContrasena,
    onSuccess: ({ message }) => setListo(message),
    onError: (error) => {
      if (esDemasiadasSolicitudes(error)) iniciarEnfriamiento();
      // 422: el enlace ya se usó o venció. 400 sobre el token: no tiene la forma de un enlace.
      if (error instanceof ApiError && (error.status === "REGLA_NEGOCIO" || error.porCampo.token)) {
        setEnlaceInvalido(error.status === "REGLA_NEGOCIO" ? error.message : MENSAJE_SIN_ENLACE);
        return;
      }
      setErrorGeneral(aplicarErroresServidor(error, formulario.setError, CAMPOS));
    },
  });

  function enviar(datos: DatosRestablecer) {
    if (!token) return;
    setErrorGeneral(null);
    restablecer.mutate({ token, password: datos.password });
  }

  return {
    formulario,
    enviar: formulario.handleSubmit(enviar),
    enviando: restablecer.isPending,
    enfriando,
    errorGeneral,
    enlaceInvalido,
    listo,
  };
}
