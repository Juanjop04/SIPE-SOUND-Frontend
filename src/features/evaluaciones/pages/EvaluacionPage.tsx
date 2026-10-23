import { useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { useRuta } from "@/features/ruta";
import { Tablatura, type DatoTablatura } from "@/shared/music";
import { EstadoVacio, MensajeError, Skeleton } from "@/shared/ui";
import { DialogoSalida } from "../components/DialogoSalida";
import { FormularioEvaluacion } from "../components/FormularioEvaluacion";
import { ResultadoEvaluacion } from "../components/ResultadoEvaluacion";
import { useEvaluacion, usePresentarIntento } from "../hooks/useEvaluacion";
import type { Evaluacion, Intento } from "../types";
import { reducirRespuestas } from "../utils/respuestas";

function datos(e: Evaluacion): DatoTablatura[] {
  const lista: DatoTablatura[] = [
    { clave: "preguntas", valor: `${e.preguntas.length} preguntas` },
    { clave: "aprobar", valor: `aprobar con ${e.porcentaje_aprobacion} %` },
    { clave: "intento", valor: `intento ${e.intentos_realizados + 1}` },
  ];
  if (e.intentos_restantes !== null) {
    lista.push({ clave: "restantes", valor: `quedan ${e.intentos_restantes}` });
  }
  return lista;
}

function Presentar({ evaluacion }: { evaluacion: Evaluacion }) {
  const { data: bloques } = useRuta();
  const presentar = usePresentarIntento(evaluacion.id);
  const [respuestas, despachar] = useReducer(reducirRespuestas, {});
  const [intento, setIntento] = useState<Intento | null>(null);
  const hayRespuestas = Object.keys(respuestas).length > 0;
  const indiceBloque = bloques?.findIndex((b) => b.id === evaluacion.bloque_id) ?? -1;
  const sinIntentos = evaluacion.intentos_restantes === 0 && !intento;

  async function enviar() {
    setIntento(await presentar.mutateAsync(respuestas));
  }

  function repetir() {
    despachar({ tipo: "reiniciar" });
    presentar.reset();
    setIntento(null);
  }

  return (
    <>
      <h1 className="font-display text-[2rem] font-semibold leading-tight text-paper">
        {evaluacion.titulo}
      </h1>
      <Tablatura datos={datos(evaluacion)} className="mt-3" />
      <div className="mt-8">
        {sinIntentos && (
          <EstadoVacio
            titulo="Ya usaste todos los intentos."
            descripcion={`Tu mejor puntaje fue ${evaluacion.mejor_puntaje ?? 0} %. Habla con tu docente si necesitas otro intento.`}
          />
        )}
        {!sinIntentos && intento && (
          <ResultadoEvaluacion
            evaluacion={evaluacion}
            intento={intento}
            respuestas={respuestas}
            siguienteBloque={indiceBloque >= 0 ? bloques?.[indiceBloque + 1] : undefined}
            puedeRepetir={evaluacion.intentos_restantes !== 0}
            onRepetir={repetir}
          />
        )}
        {!sinIntentos && !intento && (
          <FormularioEvaluacion
            preguntas={evaluacion.preguntas}
            respuestas={respuestas}
            despachar={despachar}
            enviando={presentar.isPending}
            error={presentar.error?.message ?? null}
            onEnviar={() => enviar().catch(() => null)}
          />
        )}
      </div>
      <DialogoSalida bloquear={hayRespuestas && !intento} />
    </>
  );
}

export default function EvaluacionPage() {
  const { id } = useParams();
  const { data, isPending, error, refetch } = useEvaluacion(Number(id));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {isPending && <Skeleton lineas={6} className="h-10 w-full" />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data?.preguntas.length === 0 && (
        <EstadoVacio titulo="Esta evaluación todavía no tiene preguntas." />
      )}
      {data && data.preguntas.length > 0 && <Presentar evaluacion={data} />}
    </main>
  );
}
