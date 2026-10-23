import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/shared/ui/Card.jsx";
import { Button } from "@/shared/ui/Button.jsx";
import { useRuta } from "@/features/ruta";
import { useEvaluacion, usePresentarIntento } from "../hooks/useEvaluacion.js";
import { paths } from "@/shared/config/paths.js";

const PORCENTAJE_APROBACION_POR_DEFECTO = 80;
const MENSAJE_SIN_QUIZ = "Este bloque todavía no tiene quiz.";

export default function QuizBloque() {
  const { bloqueId } = useParams();
  const ruta = useRuta();
  const bloque = ruta.data?.find((b) => String(b.id) === bloqueId);
  const evaluacionId = bloque?.evaluacion_id;
  const consulta = useEvaluacion(evaluacionId);
  const presentar = usePresentarIntento(evaluacionId);

  const [respuestas, setRespuestas] = useState({}); // { [preguntaId]: indice }
  const [errorEnvio, setErrorEnvio] = useState(null);
  const [resultado, setResultado] = useState(null);

  const preguntas = consulta.data?.preguntas ?? [];
  const minimo = consulta.data?.porcentaje_aprobacion ?? PORCENTAJE_APROBACION_POR_DEFECTO;
  const sinQuiz = ruta.isSuccess && !evaluacionId;
  const cargando = ruta.isPending || (Boolean(evaluacionId) && consulta.isPending);
  const enviando = presentar.isPending;
  const error = sinQuiz
    ? MENSAJE_SIN_QUIZ
    : (errorEnvio ?? (ruta.error ?? consulta.error)?.message);

  function elegirRespuesta(preguntaId, indice) {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: indice }));
  }

  async function enviarQuiz() {
    setErrorEnvio(null);
    try {
      setResultado(await presentar.mutateAsync(respuestas));
    } catch (err) {
      setErrorEnvio(err.message);
    }
  }

  function reintentar() {
    setResultado(null);
    setRespuestas({});
  }

  const todasRespondidas =
    preguntas.length > 0 && preguntas.every((p) => respuestas[p.id] !== undefined);

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <Link
        to={paths.inicio}
        className="mb-5 flex w-fit items-center gap-1 text-sm text-muted hover:text-primary"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Volver a bloques
      </Link>

      <h2 className="mb-1 font-display text-xl font-semibold text-paper">Quiz del bloque</h2>
      <p className="mb-6 text-sm text-muted">
        Necesitas {minimo}% o mas para desbloquear el siguiente bloque.
      </p>

      {cargando && <p className="text-muted">Cargando...</p>}
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      {/* Resultado final */}
      {resultado && (
        <Card className="mb-6 border-l-0 text-center">
          {resultado.aprobado ? (
            <CheckCircle2 size={40} className="mx-auto mb-2 text-success" aria-hidden="true" />
          ) : (
            <XCircle size={40} className="mx-auto mb-2 text-danger" aria-hidden="true" />
          )}
          <p className="font-display text-lg font-semibold text-paper">
            {resultado.correctas} de {resultado.total} correctas ({resultado.puntaje}%)
          </p>
          <p className={`mt-1 text-sm ${resultado.aprobado ? "text-success" : "text-danger"}`}>
            {resultado.aprobado
              ? "Aprobado, siguiente bloque desbloqueado"
              : "No alcanzaste el minimo, intenta de nuevo"}
          </p>
          {!resultado.aprobado && (
            <Button variant="primary" className="mt-4" onClick={reintentar}>
              Reintentar
            </Button>
          )}
          {resultado.aprobado && (
            <Link to={paths.inicio}>
              <Button variant="success" className="mt-4">
                Volver a bloques
              </Button>
            </Link>
          )}
        </Card>
      )}

      {/* Preguntas */}
      {!resultado &&
        !cargando &&
        preguntas.map((p, i) => (
          <Card key={p.id} className="mb-4 border-l-0">
            <p className="mb-3 text-sm text-paper">
              {i + 1}. {p.enunciado}
            </p>
            <div className="flex flex-col gap-2">
              {p.opciones.map((opcion, idx) => (
                <button
                  key={idx}
                  onClick={() => elegirRespuesta(p.id, idx)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    respuestas[p.id] === idx
                      ? "border-primary bg-primary/20 text-paper"
                      : "border-border text-muted hover:border-primary/50"
                  }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </Card>
        ))}

      {!resultado && !cargando && preguntas.length > 0 && (
        <Button
          variant="primary"
          disabled={!todasRespondidas || enviando}
          onClick={enviarQuiz}
          className="w-full"
        >
          {enviando ? "Calificando..." : "Enviar respuestas"}
        </Button>
      )}
    </main>
  );
}
