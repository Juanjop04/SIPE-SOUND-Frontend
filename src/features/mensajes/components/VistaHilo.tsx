import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { formatearFecha } from "@/shared/lib/formato";
import { Button, Field, MensajeError, Skeleton, Textarea, useAviso } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useEditarHilo, useEnviarMensaje, useHilo } from "../hooks";
import { esquemaRespuesta, type DatosRespuesta } from "../schemas";
import type { Hilo, MensajeDeHilo } from "../tipos";
import { conBusqueda, useFiltrosBandeja, useRutasMensajes } from "../useFiltrosBandeja";
import { nombreDe, rolDe } from "../utils";

const FECHA_HORA = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/** Un mensaje: bloque con borde, remitente y fecha arriba. Los propios dicen "Tú"; no se distinguen por color. */
function Mensaje({ mensaje }: { mensaje: MensajeDeHilo }) {
  return (
    <article className="rounded-caja border border-linea p-4">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium text-paper">
          {mensaje.propio ? "Tú" : nombreDe(mensaje.remitente)}
          {!mensaje.propio && mensaje.remitente && (
            <span className="font-normal text-muted"> · {rolDe(mensaje.remitente)}</span>
          )}
          {mensaje.nuevo && <span className="ml-2 text-xs font-normal text-paper">Nuevo</span>}
        </p>
        <p className="font-mono text-xs text-muted">
          {FECHA_HORA.format(new Date(mensaje.creado_en))}
        </p>
      </header>
      {mensaje.curso && <p className="mt-1 text-xs text-muted">Curso: {mensaje.curso}</p>}
      {/* Texto plano: React lo escapa y los saltos de línea se respetan con whitespace-pre-wrap. */}
      <p className="mt-3 max-w-[68ch] whitespace-pre-wrap break-words text-paper">
        {mensaje.cuerpo}
      </p>
    </article>
  );
}

function Responder({ hilo }: { hilo: Hilo }) {
  const enviar = useEnviarMensaje();
  const { avisar } = useAviso();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DatosRespuesta>({
    resolver: zodResolver(esquemaRespuesta),
    mode: "onTouched",
    defaultValues: { cuerpo: "" },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((datos) =>
        enviar.mutate(
          { respuesta_a_id: hilo.responder_a ?? "", cuerpo: datos.cuerpo },
          {
            onSuccess: () => {
              reset();
              avisar({ mensaje: "Respuesta enviada." });
            },
          },
        ),
      )}
      className="flex flex-col gap-3"
    >
      <Field etiqueta="Responder" error={errors.cuerpo?.message}>
        {(campo) => (
          <Textarea
            {...campo}
            {...register("cuerpo")}
            rows={4}
            maxLength={LIMITES.cuerpoMensaje.max}
            contador
          />
        )}
      </Field>
      {/* El backend decide quién responde a quién: su mensaje (403, 429…) se muestra tal cual. */}
      {enviar.error && <MensajeError mensaje={enviar.error.message} />}
      <div>
        <Button type="submit" cargando={enviar.isPending}>
          Enviar respuesta
        </Button>
      </div>
    </form>
  );
}

function Acciones({ id, alIr }: { id: string; alIr: () => void }) {
  const editar = useEditarHilo();
  // El hilo no trae su estado de archivado: se deduce del filtro desde el que se abrió.
  const { filtros } = useFiltrosBandeja();
  const archivado = filtros.filtro === "archivados";
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variante="secundario"
        tamano="sm"
        cargando={editar.isPending}
        onClick={() => editar.mutate({ id, archivado: !archivado }, { onSuccess: alIr })}
      >
        {archivado ? "Desarchivar" : "Archivar"}
      </Button>
      <Button
        variante="secundario"
        tamano="sm"
        cargando={editar.isPending}
        onClick={() => editar.mutate({ id, leido: false }, { onSuccess: alIr })}
      >
        Marcar como no leído
      </Button>
      {editar.error && <MensajeError mensaje={editar.error.message} />}
    </div>
  );
}

/** El hilo abierto: mensajes en orden, acciones y, si el backend lo permite, "Responder". */
export function VistaHilo({ hiloId }: { hiloId: string }) {
  const { data, isPending, error, refetch } = useHilo(hiloId);
  const navigate = useNavigate();
  const rutas = useRutasMensajes();
  const { busqueda } = useFiltrosBandeja();
  const volver = () => navigate(conBusqueda(rutas.bandeja, busqueda));

  if (isPending) return <Skeleton lineas={5} className="h-16 w-full" />;
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-paper">{data.asunto}</h2>
        <Acciones id={data.hilo_id} alIr={volver} />
      </div>
      <div className="flex flex-col gap-4">
        {data.mensajes.map((m) => (
          <Mensaje key={m.id} mensaje={m} />
        ))}
      </div>
      {data.puede_responder && data.responder_a && <Responder hilo={data} />}
      <p className="font-mono text-xs text-muted">
        {data.mensajes.length} {data.mensajes.length === 1 ? "mensaje" : "mensajes"} · última
        actividad {formatearFecha(data.mensajes.at(-1)?.creado_en)}
      </p>
    </div>
  );
}
