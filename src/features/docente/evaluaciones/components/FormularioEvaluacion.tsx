import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfirmarSalida, MensajeError } from "@/shared/ui";
import { aplicarErroresServidor } from "@/shared/validacion";
import {
  esquemaEvaluacion,
  valoresDe,
  type DatosFormulario,
  type EntradaEvaluacion,
} from "../schemas";
import type { DetalleEvaluacionDocente } from "../tipos";
import { useEditorEvaluacion } from "../useEditorEvaluacion";
import { AccionesEvaluacion } from "./AccionesEvaluacion";
import { DatosGenerales } from "./DatosGenerales";
import { SeccionPreguntas } from "./SeccionPreguntas";
import { VistaEstudiante } from "./VistaEstudiante";
import { ZonaEliminarEvaluacion } from "./ZonaEliminarEvaluacion";

const CAMPOS = [
  "titulo",
  "descripcion",
  "curso_id",
  "porcentaje_aprobacion",
  "intentos_max",
  "fecha_limite",
] as const;

/** Pide confirmar antes de salir con cambios sin guardar. */
function SalidaSinGuardar({ bloquear }: { bloquear: boolean }) {
  return (
    <ConfirmarSalida
      bloquear={bloquear}
      titulo="¿Salir sin guardar?"
      descripcion="Los cambios de esta evaluación se perderán."
      textoSalir="Salir sin guardar"
      textoQuedarse="Seguir editando"
    />
  );
}

interface FormularioEvaluacionProps {
  inicial: DetalleEvaluacionDocente | null;
  /** Curso preelegido al crear desde la pestaña del curso. */
  cursoId: number | null;
}

/** Datos generales + preguntas (o su versión de solo lectura si ya hay intentos). */
export function FormularioEvaluacion({ inicial, cursoId }: FormularioEvaluacionProps) {
  const editor = useEditorEvaluacion(inicial);
  const [vista, setVista] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const { register, control, handleSubmit, getValues, setError, reset, formState } = useForm<
    EntradaEvaluacion,
    unknown,
    DatosFormulario
  >({
    resolver: zodResolver(esquemaEvaluacion) as unknown as Resolver<
      EntradaEvaluacion,
      unknown,
      DatosFormulario
    >,
    mode: "onTouched",
    defaultValues: valoresDe(inicial, cursoId),
  });
  const creando = inicial === null;

  function enviar(publicar: boolean) {
    return handleSubmit(async (datos) => {
      setErrorGeneral(null);
      if (creando && !datos.curso_id) return setError("curso_id", { message: "Elige el curso." });
      if (publicar && datos.preguntas.length === 0 && !inicial?.tiene_intentos) {
        return setErrorGeneral("Agrega al menos una pregunta antes de publicar.");
      }
      try {
        await editor.guardarDatos(datos, publicar);
        reset(getValues());
      } catch (error) {
        setErrorGeneral(aplicarErroresServidor(error, setError, CAMPOS));
      }
    });
  }

  return (
    <form onSubmit={enviar(false)} noValidate className="flex flex-col gap-10">
      <DatosGenerales
        register={register}
        control={control}
        errores={formState.errors}
        creando={creando}
      />
      <SeccionPreguntas
        inicial={inicial}
        control={control}
        register={register}
        getValues={getValues}
        errores={formState.errors.preguntas}
      />
      {errorGeneral && <MensajeError mensaje={errorGeneral} />}
      <AccionesEvaluacion
        id={inicial?.id ?? null}
        estado={inicial?.estado ?? null}
        ocupado={editor.ocupado}
        tieneIntentos={inicial?.tiene_intentos ?? false}
        onPublicar={() => enviar(true)()}
        onCerrar={() =>
          editor.cambiarEstado("cerrada").catch((e: Error) => setErrorGeneral(e.message))
        }
        onDuplicar={() =>
          editor.duplicarComoBorrador().catch((e: Error) => setErrorGeneral(e.message))
        }
        onVistaEstudiante={() => setVista(true)}
      />
      {inicial && (
        <ZonaEliminarEvaluacion
          publicada={inicial.estado === "publicada"}
          ocupado={editor.ocupado}
          onEliminar={editor.eliminarEvaluacion}
          onCerrar={() => editor.cambiarEstado("cerrada")}
        />
      )}
      <VistaEstudiante abierta={vista} onCerrar={() => setVista(false)} control={control} />
      <SalidaSinGuardar bloquear={formState.isDirty && !editor.ocupado} />
    </form>
  );
}
