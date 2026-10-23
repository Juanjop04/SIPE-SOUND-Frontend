import type { Intento, Pregunta, Respuestas } from "../types";
import { letra } from "../utils/respuestas";

interface RevisionPreguntasProps {
  preguntas: Pregunta[];
  respuestas: Respuestas;
  detalle: NonNullable<Intento["detalle"]>;
}

/** Revisión por pregunta: ● ámbar correcta · × danger incorrecta, con la respuesta correcta. */
export function RevisionPreguntas({ preguntas, respuestas, detalle }: RevisionPreguntasProps) {
  return (
    <ol className="flex flex-col">
      {preguntas.map((pregunta, indice) => {
        const correccion = detalle[String(pregunta.id)];
        const elegida = respuestas[String(pregunta.id)];
        const correcta = correccion?.correcta ?? false;
        return (
          <li key={pregunta.id} className="flex gap-3 border-b border-linea py-3">
            <span
              aria-hidden="true"
              className={`w-4 font-mono ${correcta ? "text-success" : "text-danger"}`}
            >
              {correcta ? "●" : "×"}
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-paper">
                <span className="sr-only">{correcta ? "Correcta: " : "Incorrecta: "}</span>
                <span className="font-mono text-sm text-muted">{indice + 1}. </span>
                {pregunta.enunciado}
              </p>
              {!correcta && correccion && (
                <p className="text-sm text-muted">
                  {elegida !== undefined && <>Respondiste {letra(elegida)} · </>}
                  Correcta:{" "}
                  <span className="text-paper">
                    {letra(correccion.respuesta_correcta)}.{" "}
                    {pregunta.opciones[correccion.respuesta_correcta]}
                  </span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
