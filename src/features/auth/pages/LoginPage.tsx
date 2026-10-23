import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { Button, ENLACE_EN_TEXTO, Field, Input, MensajeError } from "@/shared/ui";
import { LIMITES, aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { iniciarSesion } from "../api/authApi";
import { CampoPassword } from "../components/CampoPassword";
import { useDestinoTrasLogin } from "../hooks/useDestinoTrasLogin";
import { esquemaLogin, type DatosLogin } from "../schemas";

const CAMPOS: readonly (keyof DatosLogin)[] = ["email", "password"];

export default function LoginPage() {
  const navigate = useNavigate();
  const destinoTrasLogin = useDestinoTrasLogin();
  // El mástil del AuthLayout vibra mientras se envía el formulario.
  const { setTocando } = useOutletContext<{ setTocando: (valor: boolean) => void }>();
  const { enfriando, iniciar: iniciarEnfriamiento } = useEnfriamiento();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DatosLogin>({
    resolver: zodResolver(esquemaLogin),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  async function enviar(datos: DatosLogin) {
    setErrorGeneral(null);
    setTocando(true);
    try {
      await iniciarSesion(datos.email, datos.password);
      navigate(await destinoTrasLogin(), { replace: true });
    } catch (error) {
      if (esDemasiadasSolicitudes(error)) iniciarEnfriamiento();
      setErrorGeneral(aplicarErroresServidor(error, setError, CAMPOS));
    } finally {
      setTocando(false);
    }
  }

  return (
    <>
      <h1 className="font-display text-3xl font-semibold">Inicia sesión</h1>
      <p className="mt-2 text-muted">Sigue practicando donde lo dejaste.</p>

      <form onSubmit={handleSubmit(enviar)} noValidate className="mt-8 flex flex-col gap-5">
        <Field etiqueta="Correo electrónico" error={errors.email?.message}>
          {(control) => (
            <Input
              {...control}
              {...register("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={LIMITES.email.max}
              placeholder="tucorreo@ejemplo.com"
            />
          )}
        </Field>

        <Field etiqueta="Contraseña" error={errors.password?.message}>
          {(control) => (
            <CampoPassword
              {...control}
              {...register("password")}
              autoComplete="current-password"
              maxLength={LIMITES.password.max}
            />
          )}
        </Field>

        {errorGeneral && <MensajeError mensaje={errorGeneral} />}

        <Button type="submit" className="w-full" cargando={isSubmitting} disabled={enfriando}>
          {isSubmitting ? "Enviando…" : "Iniciar sesión"}
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link to={paths.registro} className={`font-medium ${ENLACE_EN_TEXTO}`}>
          Crea una gratis
        </Link>
      </p>
    </>
  );
}
