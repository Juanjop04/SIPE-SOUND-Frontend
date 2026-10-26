import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, Input, MensajeError, Select, Textarea } from "@/shared/ui";
import { LIMITES, aplicarErroresServidor } from "@/shared/validacion";
import type { DatosCurso } from "../datos";
import { NIVELES, esquemaCurso, type DatosCursoFormulario, type EntradaCurso } from "../schemas";

const CAMPOS = ["nombre", "descripcion", "nivel"] as const;

interface FormularioCursoProps {
  inicial?: DatosCurso;
  textoEnviar: string;
  /** Lanza el ApiError del backend: sus errores 400 se asignan a cada campo. */
  onGuardar: (datos: DatosCurso) => Promise<unknown>;
  deshabilitado?: boolean;
}

/** Nombre, descripción y nivel: el mismo formulario para crear (Drawer) y para Ajustes. */
export function FormularioCurso({
  inicial,
  textoEnviar,
  onGuardar,
  deshabilitado,
}: FormularioCursoProps) {
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const { register, handleSubmit, setError, formState } = useForm<
    EntradaCurso,
    unknown,
    DatosCursoFormulario
  >({
    resolver: zodResolver(esquemaCurso),
    mode: "onTouched",
    defaultValues: {
      nombre: inicial?.nombre ?? "",
      descripcion: inicial?.descripcion ?? "",
      nivel: inicial?.nivel ?? "principiante",
    },
  });
  const { errors, isSubmitting } = formState;

  async function enviar(datos: DatosCursoFormulario) {
    setErrorGeneral(null);
    try {
      await onGuardar(datos);
    } catch (error) {
      setErrorGeneral(aplicarErroresServidor(error, setError, CAMPOS));
    }
  }

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="flex flex-col gap-5">
      <fieldset disabled={deshabilitado} className="flex flex-col gap-5">
        <Field etiqueta="Nombre del curso" error={errors.nombre?.message}>
          {(c) => (
            <Input
              {...c}
              {...register("nombre")}
              maxLength={LIMITES.titulo.max}
              placeholder="Guitarra 7°A"
            />
          )}
        </Field>
        <Field etiqueta="Descripción (opcional)" error={errors.descripcion?.message}>
          {(c) => (
            <Textarea
              {...c}
              {...register("descripcion")}
              rows={4}
              maxLength={LIMITES.descripcion.max}
              contador
            />
          )}
        </Field>
        <Field etiqueta="Nivel" error={errors.nivel?.message}>
          {(c) => (
            <Select {...c} {...register("nivel")}>
              {NIVELES.map((nivel) => (
                <option key={nivel} value={nivel}>
                  {nivel}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </fieldset>
      {errorGeneral && <MensajeError mensaje={errorGeneral} />}
      <Button type="submit" className="self-start" cargando={isSubmitting} disabled={deshabilitado}>
        {isSubmitting ? "Enviando…" : textoEnviar}
      </Button>
    </form>
  );
}
