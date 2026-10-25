import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { Button, Field, Input, MensajeError, useAviso } from "@/shared/ui";
import { LIMITES, aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { usePreautorizar } from "../hooks/usePreautorizaciones";
import { esquemaPreautorizacion, type DatosPreautorizacion } from "../schemas";

const CAMPOS = ["email"] as const;

/** Autoriza un correo como docente: el rol se aplica cuando la persona confirma su correo. */
export function FormularioPreautorizar() {
  const preautorizar = usePreautorizar();
  const { avisar } = useAviso();
  const { enfriando, iniciar: iniciarEnfriamiento } = useEnfriamiento();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DatosPreautorizacion>({
    resolver: zodResolver(esquemaPreautorizacion),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  async function enviar({ email }: DatosPreautorizacion) {
    setErrorGeneral(null);
    try {
      const { message } = await preautorizar.mutateAsync(email);
      avisar({ mensaje: message });
      reset();
    } catch (error) {
      if (esDemasiadasSolicitudes(error)) iniciarEnfriamiento();
      setErrorGeneral(aplicarErroresServidor(error, setError, CAMPOS));
    }
  }

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Field
          etiqueta="Correo del docente"
          ayuda="Recibirá el rol docente cuando se registre y confirme este correo."
          error={errors.email?.message}
          className="flex-1"
        >
          {(control) => (
            <Input
              {...control}
              {...register("email")}
              type="email"
              inputMode="email"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={LIMITES.email.max}
              placeholder="profe@colegio.edu.co"
            />
          )}
        </Field>
        <Button type="submit" className="sm:mt-7" cargando={isSubmitting} disabled={enfriando}>
          {isSubmitting ? "Enviando…" : "Autorizar"}
        </Button>
      </div>
      {/* Ej.: "Ese correo ya está preautorizado." (409) */}
      {errorGeneral && <MensajeError mensaje={errorGeneral} />}
    </form>
  );
}
