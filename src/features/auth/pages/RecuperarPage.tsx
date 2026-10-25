import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { formatearEspera } from "@/shared/hooks/useCuentaRegresiva";
import { Button, ENLACE_EN_TEXTO, Field, Input, MensajeError } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useRecuperacion } from "../hooks/useRecuperacion";

export default function RecuperarPage() {
  const { formulario, enviar, enviando, espera, errorGeneral, respuesta } = useRecuperacion();
  const {
    register,
    formState: { errors },
  } = formulario;

  return (
    <>
      <h1 className="font-display text-3xl font-semibold">Recupera tu contraseña</h1>
      <p className="mt-2 text-muted">Escribe el correo con el que te registraste.</p>

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

        {errorGeneral && <MensajeError mensaje={errorGeneral} />}
        {respuesta && (
          <p role="status" className="text-paper">
            {respuesta}
          </p>
        )}

        <Button type="submit" className="w-full" cargando={enviando} disabled={espera.activa}>
          {enviando ? "Enviando…" : "Enviar enlace"}
        </Button>
        {espera.activa && (
          <p className="font-mono text-sm text-muted">
            Puedes pedir otro en {formatearEspera(espera.restante)}
          </p>
        )}
      </form>

      <p className="mt-8 text-sm text-muted">
        ¿Ya la recordaste?{" "}
        <Link to={paths.login} className={`font-medium ${ENLACE_EN_TEXTO}`}>
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
