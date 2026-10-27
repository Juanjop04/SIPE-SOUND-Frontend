import { Button, Field, Input, MensajeError } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { CamposPassword } from "../components/CamposPassword";
import { CasillaTerminos } from "../components/CasillaTerminos";
import { EnlacesRegistro } from "../components/EnlacesRegistro";
import { ExitoRegistro } from "../components/ExitoRegistro";
import { useFormularioRegistro } from "../hooks/useFormularioRegistro";

export default function RegistroPage() {
  const { formulario, enviar, errorGeneral, exito, enfriando } = useFormularioRegistro();
  const {
    register,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = formulario;
  const email = watch("email").trim().toLowerCase();

  if (exito) return <ExitoRegistro mensaje={exito.mensaje} email={exito.email} />;

  return (
    <>
      <h1 className="font-display text-3xl font-semibold">Crea tu cuenta</h1>
      <p className="mt-2 text-muted">Después podrás empezar con tu primera lección.</p>

      <form onSubmit={enviar} noValidate className="mt-8 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field etiqueta="Nombre" error={errors.nombre?.message}>
            {(control) => (
              <Input
                {...control}
                {...register("nombre")}
                autoComplete="given-name"
                autoCapitalize="words"
                maxLength={LIMITES.nombrePersona.max}
              />
            )}
          </Field>
          <Field etiqueta="Apellido" error={errors.apellido?.message}>
            {(control) => (
              <Input
                {...control}
                {...register("apellido")}
                autoComplete="family-name"
                autoCapitalize="words"
                maxLength={LIMITES.nombrePersona.max}
              />
            )}
          </Field>
        </div>

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

      <EnlacesRegistro email={email} />
    </>
  );
}
