import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Dialog, Field, MensajeError, Textarea, useAviso } from "@/shared/ui";
import { LIMITES, aplicarErroresServidor, texto } from "@/shared/validacion";
import { useComentarEstudiante } from "../hooks/useResumenDocente";

const { min, max } = LIMITES.mensajeRetroalimentacion;
const esquema = z.object({ mensaje: texto(min, max) });
type Datos = z.infer<typeof esquema>;

export interface Destinatario {
  estudianteId: string;
  nombre: string;
  cursoId: number;
  /** Texto sugerido y editable (p. ej. el recordatorio de una evaluación). */
  mensaje?: string;
}

interface DialogoComentarioProps {
  destinatario: Destinatario | null;
  onCerrar: () => void;
}

/** Comentario de 1–1000 caracteres para un estudiante (lo verá en su curso). */
export function DialogoComentario({ destinatario, onCerrar }: DialogoComentarioProps) {
  const comentar = useComentarEstudiante();
  const { avisar } = useAviso();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const { register, handleSubmit, setError, reset, formState } = useForm<Datos>({
    resolver: zodResolver(esquema),
    mode: "onTouched",
    defaultValues: { mensaje: destinatario?.mensaje ?? "" },
  });

  function cerrar() {
    reset();
    setErrorGeneral(null);
    onCerrar();
  }

  async function enviar({ mensaje }: Datos) {
    if (!destinatario) return;
    try {
      const { message } = await comentar.mutateAsync({ ...destinatario, mensaje });
      avisar({ mensaje: message });
      cerrar();
    } catch (error) {
      setErrorGeneral(aplicarErroresServidor(error, setError, ["mensaje"]));
    }
  }

  return (
    <Dialog
      abierto={destinatario !== null}
      onCerrar={cerrar}
      titulo={`Comentario para ${destinatario?.nombre ?? ""}`}
      descripcion="Lo verá en su curso. Sé concreto: qué practicar y por cuánto tiempo."
    >
      <form onSubmit={handleSubmit(enviar)} noValidate className="flex flex-col gap-4">
        <Field etiqueta="Mensaje" error={formState.errors.mensaje?.message}>
          {(control) => (
            <Textarea {...control} {...register("mensaje")} rows={5} maxLength={max} contador />
          )}
        </Field>
        {errorGeneral && <MensajeError mensaje={errorGeneral} />}
        <div className="flex justify-end gap-3">
          <Button variante="fantasma" onClick={cerrar}>
            Cancelar
          </Button>
          <Button type="submit" cargando={formState.isSubmitting}>
            {formState.isSubmitting ? "Enviando…" : "Enviar comentario"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
