import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Button, ENLACE_EN_TEXTO, Field, Input, MensajeError } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { CampoPassword } from "../components/CampoPassword";
import { useFormularioLogin } from "../hooks/useFormularioLogin";

export default function LoginPage() {
  const { formulario, enviar, errorGeneral, correoSinVerificar, enfriando } = useFormularioLogin();
  const {
    register,
    formState: { errors, isSubmitting },
  } = formulario;

  return (
    <>
      <h1 className="font-display text-3xl font-semibold">Inicia sesión</h1>
      <p className="mt-2 text-muted">Sigue practicando donde lo dejaste.</p>

      <form onSubmit={enviar} noValidate className="mt-8 flex flex-col gap-5">
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
        {correoSinVerificar && (
          <p className="text-sm text-muted">
            <Link
              to={paths.verificar}
              state={{ email: correoSinVerificar }}
              className={`font-medium ${ENLACE_EN_TEXTO}`}
            >
              Escribir el código
            </Link>{" "}
            o pedir uno nuevo.
          </p>
        )}

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
