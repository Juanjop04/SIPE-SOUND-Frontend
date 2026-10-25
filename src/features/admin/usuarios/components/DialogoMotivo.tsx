import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Dialog, Field, MensajeError, Textarea } from "@/shared/ui";
import { texto } from "@/shared/validacion";

// HU-B-405: el motivo queda en la historia de la cuenta (10 a 300 caracteres).
const MOTIVO = { min: 10, max: 300 } as const;
const esquema = z.object({ motivo: texto(MOTIVO.min, MOTIVO.max) });
type Datos = z.output<typeof esquema>;

export interface DialogoMotivoProps {
  abierto: boolean;
  titulo: string;
  descripcion: string;
  etiquetaBoton: string;
  /** Pide el motivo y lo manda; `alExito` cierra el diálogo. */
  onEnviar: (motivo: string, alExito: () => void) => void;
  enviando: boolean;
  error: string | null;
  onCerrar: () => void;
}

function Formulario({
  etiquetaBoton,
  onEnviar,
  enviando,
  error,
  onCerrar,
}: Omit<DialogoMotivoProps, "abierto" | "titulo" | "descripcion">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ motivo: string }, unknown, Datos>({
    resolver: zodResolver(esquema),
    mode: "onTouched",
    defaultValues: { motivo: "" },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((datos) => onEnviar(datos.motivo, onCerrar))}
      className="flex flex-col gap-4"
    >
      <Field
        etiqueta="Motivo"
        ayuda={`Entre ${MOTIVO.min} y ${MOTIVO.max} caracteres. Queda en la historia de la cuenta.`}
        error={errors.motivo?.message}
      >
        {(campo) => (
          <Textarea {...campo} {...register("motivo")} rows={3} maxLength={MOTIVO.max} contador />
        )}
      </Field>
      {error && <MensajeError mensaje={error} />}
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" cargando={enviando}>
          {etiquetaBoton}
        </Button>
      </div>
    </form>
  );
}

/** Pide el motivo (10 a 300 caracteres) de verificar a mano o de suspender una cuenta. */
export function DialogoMotivo({ abierto, titulo, descripcion, ...formulario }: DialogoMotivoProps) {
  return (
    <Dialog
      abierto={abierto}
      onCerrar={formulario.onCerrar}
      titulo={titulo}
      descripcion={descripcion}
    >
      <Formulario {...formulario} />
    </Dialog>
  );
}
