import type { PreguntaDocente } from "../tipos";

const numero = (n: number) => String(n).padStart(2, "0");

/** Preguntas de una evaluación con intentos: no se pueden cambiar (protegen el historial). */
export function PreguntasSoloLectura({ preguntas }: { preguntas: PreguntaDocente[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {preguntas.map((p, i) => (
        <li key={p.id} className="rounded-caja border border-linea bg-surface p-4">
          <p className="text-paper">
            <span className="mr-2 font-mono text-sm text-primary-claro">{numero(i + 1)}</span>
            {p.enunciado}
          </p>
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            {p.opciones.map((opcion, j) => (
              <li
                key={opcion}
                className={j === p.respuesta_correcta ? "text-success" : "text-muted"}
              >
                <span aria-hidden="true">{j === p.respuesta_correcta ? "● " : "○ "}</span>
                {opcion}
                {j === p.respuesta_correcta && <span className="ml-1 text-xs">(correcta)</span>}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
