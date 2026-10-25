import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { ApiError } from "@/shared/api/ApiError.js";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { iniciarSesion } from "../api/authApi";
import { esquemaLogin, type DatosLogin } from "../schemas";
import { useDestinoTrasLogin } from "./useDestinoTrasLogin";

const CAMPOS: readonly (keyof DatosLogin)[] = ["email", "password"];

/** Estado y envío del inicio de sesión: validación con Zod, errores del servidor y 429. */
export function useFormularioLogin() {
  const navigate = useNavigate();
  const destinoTrasLogin = useDestinoTrasLogin();
  // El mástil del AuthLayout vibra mientras se envía el formulario.
  const { setTocando } = useOutletContext<{ setTocando: (valor: boolean) => void }>();
  const { enfriando, iniciar: iniciarEnfriamiento } = useEnfriamiento();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  // La cuenta existe pero su correo no está verificado (el backend lo avisa en meta).
  const [correoSinVerificar, setCorreoSinVerificar] = useState<string | null>(null);
  // Al venir de /verificar el correo ya está escrito.
  const emailInicial = (useLocation().state as { email?: string } | null)?.email ?? "";
  const formulario = useForm<DatosLogin>({
    resolver: zodResolver(esquemaLogin),
    mode: "onTouched",
    defaultValues: { email: emailInicial, password: "" },
  });

  async function enviar(datos: DatosLogin) {
    setErrorGeneral(null);
    setCorreoSinVerificar(null);
    setTocando(true);
    try {
      await iniciarSesion(datos.email, datos.password);
      navigate(await destinoTrasLogin(), { replace: true });
    } catch (error) {
      if (esDemasiadasSolicitudes(error)) iniciarEnfriamiento();
      if (error instanceof ApiError && error.meta?.requiere_verificacion) {
        setCorreoSinVerificar(datos.email);
      }
      setErrorGeneral(aplicarErroresServidor(error, formulario.setError, CAMPOS));
    } finally {
      setTocando(false);
    }
  }

  return {
    formulario,
    enviar: formulario.handleSubmit(enviar),
    errorGeneral,
    correoSinVerificar,
    enfriando,
  };
}
