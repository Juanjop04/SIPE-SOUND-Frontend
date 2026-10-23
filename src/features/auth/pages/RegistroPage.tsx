import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Button, ENLACE_EN_TEXTO, Field, Input, MensajeError } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { CamposPassword } from "../components/CamposPassword";
import { CasillaTerminos } from "../components/CasillaTerminos";
import { ExitoRegistro } from "../components/ExitoRegistro";
import { useFormularioRegistro } from "../hooks/useFormularioRegistro";

export default function RegistroPage() {
  const { formulario, enviar, errorGeneral, exito, enfriando } = useFormularioRegistro();
  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = formulario;

  if (exito) return <ExitoRegistro mensaje={exito.mensaje} email={exito.email} />;

  return (
    <>
      <h1 className="font-display text-3xl font-semibold">Crea tu cuenta</h1>
      <p className="mt-2 text-muted">Después podrás empezar con tu primera lección.</p>

      <form onSubmit={enviar} noValidate className="mt-8 flex flex-col gap-5">
        <Field etiqueta="Nombre" error={errors.nombre?.message}>
          {(control) => (
            <Input
              {...control}
              {...register("nombre")}
              autoComplete="name"
              autoCapitalize="words"
              maxLength={LIMITES.nombrePersona.max}
              placeholder="Nombre completo"
            />
          )}
        </Field>

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

        <CamposPassword register={register} control={control} errors={errors} />

        <CasillaTerminos {...register("acepta_terminos")} error={errors.acepta_terminos?.message} />

        {errorGeneral && <MensajeError mensaje={errorGeneral} />}

        <Button type="submit" className="w-full" cargando={isSubmitting} disabled={enfriando}>
          {isSubmitting ? "Enviando…" : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link to={paths.login} className={`font-medium ${ENLACE_EN_TEXTO}`}>
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
