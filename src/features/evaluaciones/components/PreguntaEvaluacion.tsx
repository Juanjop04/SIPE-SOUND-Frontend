import { cn } from "@/shared/lib/cn.js";
import type { Pregunta } from "../types";
import { letra } from "../utils/respuestas";

interface PreguntaEvaluacionProps {
  pregunta: Pregunta;
  numero: number;
  elegida: number | undefined;
  onElegir: (opcion: number) => void;
}

/**
 * Opciones como filas completas. Radios nativos (flechas, espacio y lector de pantalla sin
 * código extra) dentro de un grupo con role="radiogroup"; seleccionada = borde accent 2 px.
 */
export function PreguntaEvaluacion({
  pregunta,
  numero,
  elegida,
  onElegir,
}: PreguntaEvaluacionProps) {
  const nombre = `pregunta-${pregunta.id}`;
  return (
    <fieldset
      id={nombre}
      role="radiogroup"
      aria-labelledby={`${nombre}-enunciado`}
      className="scroll-mt-24"
    >
      <legend id={`${nombre}-enunciado`} className="mb-3 flex gap-3 text-paper">
        <span className="font-mono text-sm text-muted">{String(numero).padStart(2, "0")}</span>
        <span>{pregunta.enunciado}</span>
      </legend>
      <div className="flex flex-col gap-2">
        {pregunta.opciones.map((opcion, indice) => {
          const marcada = elegida === indice;
          return (
            <label
              key={`${pregunta.id}-${letra(indice)}`}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-md border-2 px-3 py-2 text-sm transition-colors duration-rapida has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                marcada ? "border-accent text-paper" : "border-linea text-muted hover:text-paper",
              )}
            >
              <input
                type="radio"
                name={nombre}
                value={indice}
                checked={marcada}
                onChange={() => onElegir(indice)}
                className="sr-only"
              />
              <span className="w-5 font-mono text-paper">{letra(indice)}</span>
              {opcion}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
