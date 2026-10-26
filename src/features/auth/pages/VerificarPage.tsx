import { Link, useLocation } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Button, ENLACE_EN_TEXTO, Field, Input, MensajeError } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { CampoCodigo } from "../components/CampoCodigo";
import { CorreoConfirmado } from "../components/CorreoConfirmado";
import { ReenvioCodigo } from "../components/ReenvioCodigo";
import { useVerificacion } from "../hooks/useVerificacion";

/** Lo que llega por `state` al navegar desde el registro o el inicio de sesión. */
export interface EstadoVerificar {
  email?: string;
  /** El código acaba de enviarse: el reenvío espera un minuto. */
  recienEnviado?: boolean;
}

export default function VerificarPage() {
  const estado = (useLocation().state ?? {}) as EstadoVerificar;
  const v = useVerificacion(estado.email ?? "", estado.recienEnviado ?? false);
  const {
    register,
    formState: { errors },
  } = v.formulario;

  if (v.confirmado) {
    return <CorreoConfirmado mensaje={v.confirmado.mensaje} email={v.confirmado.email} />;
  }

  return (
    <>
      <h1 className="font-display text-3xl font-semibold">Confirma tu correo</h1>
      <p className="mt-2 text-muted">
        Escribe el código de 6 dígitos que te enviamos. Vence en 15 minutos y solo sirve una vez.
      </p>

      <form onSubmit={v.enviar} noValidate className="mt-8 flex flex-col gap-5">
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

        <Field etiqueta="Código de 6 dígitos" error={errors.codigo?.message}>
          {(control) => <CampoCodigo {...control} {...register("codigo")} />}
        </Field>

        {v.errorGeneral && <MensajeError mensaje={v.errorGeneral} />}

        <Button type="submit" className="w-full" cargando={v.enviando}>
          {v.enviando ? "Confirmando…" : "Confirmar"}
        </Button>
      </form>

      <ReenvioCodigo
        onPedir={v.pedirOtroCodigo}
        pidiendo={v.reenviando}
        esperaRestante={v.reenvio.restante}
        aviso={v.avisoReenvio}
      />

      <p className="mt-8 text-sm text-muted">
        ¿Correo equivocado?{" "}
        <Link to={paths.registro} className={`font-medium ${ENLACE_EN_TEXTO}`}>
          Regístrate de nuevo
        </Link>
      </p>
    </>
  );
}
