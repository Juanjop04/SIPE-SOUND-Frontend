import { useNavigate } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { useAviso } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { evaluacionesApi, useMutacionEvaluacion } from "./api";
import { aEnvio, preguntasAEnvio, type DatosFormulario } from "./schemas";
import type { DetalleEvaluacionDocente, EstadoEvaluacion } from "./tipos";

// Navegar sin preguntar: lo guardado ya está a salvo (ver ConfirmarSalida).
const SIN_CONFIRMAR = { replace: true, state: { sinConfirmar: true } };

/** Guardar, publicar, cerrar, eliminar y duplicar; compone los endpoints de HU-B-311. */
export function useEditorEvaluacion(evaluacion: DetalleEvaluacionDocente | null) {
  const navigate = useNavigate();
  const { avisar } = useAviso();
  const id = evaluacion?.id ?? null;
  const guardar = useMutacionEvaluacion(
    async ({ datos, publicar }: { datos: DatosFormulario; publicar: boolean }) => {
      const { data, message } =
        id === null
          ? await evaluacionesApi.crear(aEnvio(datos, true))
          : await evaluacionesApi.editar(id, aEnvio(datos, false));
      // Con intentos las preguntas no se pueden reemplazar (422): solo se envían los datos generales.
      if (!evaluacion?.tiene_intentos && datos.preguntas.length > 0) {
        await evaluacionesApi.preguntas(data.id, preguntasAEnvio(datos));
      }
      const final = publicar ? await evaluacionesApi.estado(data.id, "publicada") : { message };
      return { id: data.id, message: final.message };
    },
  );
  const estado = useMutacionEvaluacion((nuevo: EstadoEvaluacion) =>
    evaluacionesApi.estado(id ?? 0, nuevo),
  );
  const eliminar = useMutacionEvaluacion(() => evaluacionesApi.eliminar(id ?? 0));
  const duplicar = useMutacionEvaluacion(async (origen: DetalleEvaluacionDocente) => {
    const titulo = `Copia de ${origen.titulo}`.slice(0, LIMITES.titulo.max);
    const { data } = await evaluacionesApi.crear({
      titulo,
      descripcion: origen.descripcion,
      porcentaje_aprobacion: origen.porcentaje_aprobacion,
      intentos_max: origen.intentos_max,
      fecha_limite: null,
      curso_id: origen.curso_id ?? undefined,
    });
    if (origen.preguntas.length > 0) {
      await evaluacionesApi.preguntas(
        data.id,
        origen.preguntas.map(({ enunciado, opciones, respuesta_correcta }) => ({
          enunciado,
          opciones,
          respuesta_correcta,
        })),
      );
    }
    return data.id;
  });

  async function guardarDatos(datos: DatosFormulario, publicar: boolean) {
    const resultado = await guardar.mutateAsync({ datos, publicar });
    avisar({ mensaje: resultado.message });
    if (id === null) navigate(paths.docente.evaluacion(resultado.id), SIN_CONFIRMAR);
  }

  async function cambiarEstado(nuevo: EstadoEvaluacion) {
    avisar({ mensaje: (await estado.mutateAsync(nuevo)).message });
  }

  async function eliminarEvaluacion() {
    avisar({ mensaje: (await eliminar.mutateAsync(undefined)).message });
    navigate(paths.docente.evaluaciones, SIN_CONFIRMAR);
  }

  async function duplicarComoBorrador() {
    if (!evaluacion) return;
    const nuevo = await duplicar.mutateAsync(evaluacion);
    avisar({ mensaje: "Copia creada como borrador: ya puedes cambiar sus preguntas." });
    navigate(paths.docente.evaluacion(nuevo), SIN_CONFIRMAR);
  }

  return {
    guardarDatos,
    cambiarEstado,
    eliminarEvaluacion,
    duplicarComoBorrador,
    errorEliminar: eliminar.error,
    ocupado: guardar.isPending || estado.isPending || eliminar.isPending || duplicar.isPending,
  };
}
