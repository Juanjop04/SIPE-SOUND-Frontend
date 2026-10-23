import { cn } from "@/shared/lib/cn.js";
import type { Pregunta, Respuestas } from "../types";

interface IndicePreguntasProps {
  preguntas: Pregunta[];
  respuestas: Respuestas;
  onIr: (indice: number) => void;
  /** Móvil: la pregunta visible se marca con accent. */
  actual?: number;
}

/** Números en mono que se marcan al responder (● respondida · ○ pendiente). */
export function IndicePreguntas({ preguntas, respuestas, onIr, actual }: IndicePreguntasProps) {
  return (
    <nav aria-label="Preguntas">
      <ol className="flex flex-wrap gap-2 lg:flex-col">
        {preguntas.map((pregunta, indice) => {
          const respondida = respuestas[String(pregunta.id)] !== undefined;
          const numero = String(indice + 1).padStart(2, "0");
          return (
            <li key={pregunta.id}>
              <button
                type="button"
                onClick={() => onIr(indice)}
                aria-current={actual === indice ? "step" : undefined}
                aria-label={`Pregunta ${indice + 1}, ${respondida ? "respondida" : "sin responder"}`}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1 font-mono text-sm transition-colors duration-rapida",
                  actual === indice ? "text-accent" : "text-muted hover:text-paper",
                )}
              >
                <span aria-hidden="true" className={respondida ? "text-paper" : "text-muted"}>
                  {respondida ? "●" : "○"}
                </span>
                {numero}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
