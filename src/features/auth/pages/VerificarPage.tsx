import { Link, useLocation, useSearchParams } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Button, ENLACE_EN_TEXTO, Field, Input, MensajeError } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { CampoCodigo } from "../components/CampoCodigo";
import { CorreoConfirmado } from "../components/CorreoConfirmado";
import { ReenvioCodigo } from "../components/ReenvioCodigo";
import { VigenciaCodigo } from "../components/VigenciaCodigo";
import { useVerificacion, VIGENCIA_CODIGO_SEGUNDOS } from "../hooks/useVerificacion";
import { esquemaVerificacion } from "../schemas";

/** Vigencia del código: la misma constante que usa la cuenta regresiva. */
const VIGENCIA_MINUTOS = Math.round(VIGENCIA_CODIGO_SEGUNDOS / 60);
const TEXTO_VIGENCIA = `${VIGENCIA_MINUTOS} ${VIGENCIA_MINUTOS === 1 ? "minuto" : "minutos"}`;

const ID_AYUDA = "verificar-ayuda";

/** El correo del enlace del correo (?email=): solo si es válido; si no, se ignora sin avisar. */
function correoDelEnlace(valor: string | null): string {
  const candidato = (valor ?? "").trim().toLowerCase();
  return esquemaVerificacion.shape.email.safeParse(candidato).success ? candidato : "";
}

/** Lo que llega por `state` al navegar desde el registro o el inicio de sesión. */
export interface EstadoVerificar {
  email?: string;
  /** Segundos que le quedan al código vigente (los da el registro). */
  venceEnSegundos?: number;
  /** El correo ya había empezado a registrarse. */
  enCurso?: boolean;
}

export default function VerificarPage() {
  const estado = (useLocation().state ?? {}) as EstadoVerificar;
  const [parametros] = useSearchParams();
  // El state de la navegación (registro, inicio de sesión) manda sobre el parámetro.
  const emailInicial = estado.email ?? correoDelEnlace(parametros.get("email"));
  const v = useVerificacion(emailInicial, estado.venceEnSegundos);
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
        Escribe el código de 6 dígitos que te enviamos. Vence en {TEXTO_VIGENCIA} y solo sirve una
        vez.
      </p>

      {estado.enCurso && (
        <p role="status" className="mt-4 rounded-lg border border-linea bg-surface p-3 text-sm">
          Ya tienes un registro en curso con este correo. Escribe el código que te enviamos o pide
          uno nuevo.
        </p>
      )}

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

        <VigenciaCodigo {...v.vigencia} />

        {v.errorGeneral && <MensajeError mensaje={v.errorGeneral} />}

        {!v.completo && (
          <p id={ID_AYUDA} className="-mb-2 text-sm text-muted">
            Escribe tu correo y el código de 6 dígitos.
          </p>
        )}
        <Button
          type="submit"
          className="w-full"
          cargando={v.enviando}
          disabled={!v.completo || v.enviando}
          aria-describedby={v.completo ? undefined : ID_AYUDA}
        >
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
