import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BloqueRuta } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { Fretboard, TrasteDivider } from "@/shared/music";
import { Button, claseBoton } from "@/shared/ui";
import type { Evaluacion, Intento, Respuestas } from "../types";
import { RevisionPreguntas } from "./RevisionPreguntas";

const DURACION_VIBRACION_MS = 1200;

interface ResultadoEvaluacionProps {
  evaluacion: Evaluacion;
  intento: Intento;
  respuestas: Respuestas;
  siguienteBloque?: BloqueRuta;
  puedeRepetir: boolean;
  onRepetir: () => void;
}

function mensajeDeResultado(
  aprobado: boolean,
  evaluacion: Evaluacion,
  siguienteBloque?: BloqueRuta,
): string {
  if (!aprobado) {
    return `Te faltó poco: necesitas ${evaluacion.porcentaje_aprobacion} %. Repasa las preguntas marcadas.`;
  }
  if (!siguienteBloque) return "Bloque superado.";
  return `Bloque superado. Ya puedes seguir con el bloque ${siguienteBloque.numero}.`;
}

/** Aprobado: el mástil vibra una vez y la cifra va en ámbar. No aprobado: cifra en paper. */
export function ResultadoEvaluacion(props: ResultadoEvaluacionProps) {
  const { evaluacion, intento, respuestas, siguienteBloque, puedeRepetir, onRepetir } = props;
  const [vibrando, setVibrando] = useState(intento.aprobado);

  // Una sola vibración: se apaga sola (Fretboard respeta prefers-reduced-motion).
  useEffect(() => {
    if (!vibrando) return undefined;
    const temporizador = setTimeout(() => setVibrando(false), DURACION_VIBRACION_MS);
    return () => clearTimeout(temporizador);
  }, [vibrando]);

  const mensaje = mensajeDeResultado(intento.aprobado, evaluacion, siguienteBloque);

  return (
    <section aria-labelledby="resultado-titulo" className="flex flex-col gap-6">
      {intento.aprobado && <Fretboard tocando={vibrando} />}
      <div role="status">
        <h2 id="resultado-titulo" className="sr-only">
          Resultado
        </h2>
        <p
          className={`font-mono text-6xl tabular-nums ${intento.aprobado ? "text-success" : "text-paper"}`}
        >
          {intento.puntaje} %
        </p>
        <p className="mt-1 font-mono text-sm text-muted">
          {intento.correctas} de {intento.total} correctas
        </p>
        <p className="mt-4 text-paper">{mensaje}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {puedeRepetir && !intento.aprobado && (
          <Button onClick={onRepetir}>Repetir evaluación</Button>
        )}
        <Link
          to={
            siguienteBloque && intento.aprobado
              ? `${paths.ruta}?bloque=${siguienteBloque.id}`
              : paths.ruta
          }
          className={claseBoton({ variante: intento.aprobado ? "primario" : "secundario" })}
        >
          Volver a la ruta
        </Link>
      </div>

      {intento.detalle && (
        <>
          <TrasteDivider />
          <RevisionPreguntas
            preguntas={evaluacion.preguntas}
            respuestas={respuestas}
            detalle={intento.detalle}
          />
        </>
      )}
    </section>
  );
}
