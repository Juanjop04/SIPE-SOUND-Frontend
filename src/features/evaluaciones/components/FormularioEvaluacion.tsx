import { useState, type Dispatch } from "react";
import { ESCRITORIO, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { Cuerda } from "@/shared/music";
import { Button, MensajeError } from "@/shared/ui";
import type { Pregunta, Respuestas } from "../types";
import { describirFaltantes, preguntasFaltantes, type AccionRespuestas } from "../utils/respuestas";
import { IndicePreguntas } from "./IndicePreguntas";
import { PreguntaEvaluacion } from "./PreguntaEvaluacion";

interface FormularioEvaluacionProps {
  preguntas: Pregunta[];
  respuestas: Respuestas;
  despachar: Dispatch<AccionRespuestas>;
  enviando: boolean;
  error: string | null;
  onEnviar: () => void;
}

/** Escritorio: todas las preguntas + índice lateral fijo. Móvil: una por pantalla. */
export function FormularioEvaluacion(props: FormularioEvaluacionProps) {
  const { preguntas, respuestas, despachar, enviando, error, onEnviar } = props;
  const esEscritorio = useMediaQuery(ESCRITORIO);
  const [actual, setActual] = useState(0);
  const faltantes = preguntasFaltantes(preguntas, respuestas);
  const respondidas = preguntas.length - faltantes.length;
  const visibles = esEscritorio ? preguntas : preguntas.slice(actual, actual + 1);

  function ir(indice: number) {
    if (esEscritorio) document.getElementById(`pregunta-${preguntas[indice].id}`)?.scrollIntoView();
    else setActual(indice);
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
      <aside className="mb-6 lg:sticky lg:top-6 lg:col-span-2 lg:self-start">
        <IndicePreguntas
          preguntas={preguntas}
          respuestas={respuestas}
          onIr={ir}
          actual={esEscritorio ? undefined : actual}
        />
      </aside>
      <div className="flex flex-col gap-8 lg:col-span-10">
        {!esEscritorio && (
          <Cuerda
            valor={(respondidas / preguntas.length) * 100}
            etiqueta={`${respondidas} de ${preguntas.length} respondidas`}
          />
        )}
        {visibles.map((pregunta) => (
          <PreguntaEvaluacion
            key={pregunta.id}
            pregunta={pregunta}
            numero={preguntas.indexOf(pregunta) + 1}
            elegida={respuestas[String(pregunta.id)]}
            onElegir={(opcion) => despachar({ tipo: "elegir", preguntaId: pregunta.id, opcion })}
          />
        ))}
        {!esEscritorio && (
          <div className="flex justify-between">
            <Button
              variante="fantasma"
              disabled={actual === 0}
              onClick={() => setActual(actual - 1)}
            >
              ← Anterior
            </Button>
            <Button
              variante="fantasma"
              disabled={actual === preguntas.length - 1}
              onClick={() => setActual(actual + 1)}
            >
              Siguiente →
            </Button>
          </div>
        )}
        {error && <MensajeError mensaje={error} />}
        <div className="flex flex-wrap items-center gap-4">
          <Button cargando={enviando} disabled={faltantes.length > 0} onClick={onEnviar}>
            {enviando ? "Calificando…" : "Enviar respuestas"}
          </Button>
          <p aria-live="polite" className="text-sm text-muted">
            {describirFaltantes(faltantes)}
          </p>
        </div>
      </div>
    </div>
  );
}
