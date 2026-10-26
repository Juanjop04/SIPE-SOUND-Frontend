import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { Button, Dialog, Field, MensajeError, Textarea } from "@/shared/ui";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { claveSolicitudDeNombre, solicitarCambioDeNombre } from "../api/cuentaApi";
import { esquemaSolicitudNombre, type DatosSolicitudNombre } from "../schemas";

const MAXIMO = 500;
const CAMPOS = ["cuerpo"] as const;

function Formulario({ onCerrar }: { onCerrar: () => void }) {
  const { enfriando, iniciar } = useEnfriamiento();
  const queryClient = useQueryClient();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviado, setEnviado] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DatosSolicitudNombre>({
    resolver: zodResolver(esquemaSolicitudNombre),
    mode: "onTouched",
    defaultValues: { cuerpo: "" },
  });

  const enviar = useMutation({
    mutationFn: solicitarCambioDeNombre,
    onSuccess: ({ message }) => {
      setEnviado(message);
      // La cuenta pasa a mostrar "solicitud pendiente".
      void queryClient.invalidateQueries({ queryKey: claveSolicitudDeNombre });
    },
    onError: (error) => {
      if (esDemasiadasSolicitudes(error)) iniciar();
      setErrorGeneral(aplicarErroresServidor(error, setError, CAMPOS));
    },
  });

  if (enviado) {
    return (
      <div role="status" className="flex flex-col gap-4">
        <p className="text-paper">{enviado}</p>
        <p className="text-sm text-muted">
          Cuando un administrador habilite el cambio, podrás editar tu nombre aquí mismo.
        </p>
        <div className="flex justify-end">
          <Button onClick={onCerrar}>Listo</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((datos) => {
        setErrorGeneral(null);
        enviar.mutate(datos.cuerpo);
      })}
      className="flex flex-col gap-4"
    >
      <Field
        etiqueta="Mensaje para los administradores"
        ayuda="Cuenta qué nombre o apellido quieres corregir y por qué."
        error={errors.cuerpo?.message}
      >
        {(campo) => (
          <Textarea {...campo} {...register("cuerpo")} rows={4} maxLength={MAXIMO} contador />
        )}
      </Field>
      {errorGeneral && <MensajeError mensaje={errorGeneral} />}
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" cargando={enviar.isPending} disabled={enfriando}>
          Enviar solicitud
        </Button>
      </div>
    </form>
  );
}

/** Pedir a los administradores que habiliten el cambio de nombre (aviso con asunto fijo). */
export function DialogoSolicitudNombre({
  abierto,
  onCerrar,
}: {
  abierto: boolean;
  onCerrar: () => void;
}) {
  return (
    <Dialog
      abierto={abierto}
      onCerrar={onCerrar}
      titulo="Solicitar cambio de nombre"
      descripcion="Tu mensaje les llega a todos los administradores."
    >
      <Formulario onCerrar={onCerrar} />
    </Dialog>
  );
}
