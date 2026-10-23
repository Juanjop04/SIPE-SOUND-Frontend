import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Header from "@/app/layouts/components/Header.jsx";
import { Card } from "@/shared/ui/Card.jsx";
import { Button } from "@/shared/ui/Button.jsx";
import { obtenerQuiz, verificarQuiz } from "@/lib/api.js";

export default function QuizBloque() {
  const { bloqueId } = useParams();

  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({}); // { [preguntaId]: indice }
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    obtenerQuiz(bloqueId)
      .then(setPreguntas)
      .catch(() => setError("No se pudo cargar el quiz."))
      .finally(() => setCargando(false));
  }, [bloqueId]);

  function elegirRespuesta(preguntaId, indice) {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: indice }));
  }

  async function enviarQuiz() {
    setEnviando(true);
    setError(null);
    try {
      const data = await verificarQuiz(bloqueId, respuestas);
      setResultado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  function reintentar() {
    setResultado(null);
    setRespuestas({});
  }

  const todasRespondidas =
    preguntas.length > 0 && preguntas.every((p) => respuestas[p.id] !== undefined);

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <Link
          to="/"
          className="mb-5 flex w-fit items-center gap-1 text-sm text-muted hover:text-primary"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Volver a bloques
        </Link>

        <h2 className="mb-1 font-display text-xl font-semibold text-paper">Quiz del bloque</h2>
        <p className="mb-6 text-sm text-muted">
          Necesitas 80% o mas para desbloquear el siguiente bloque.
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
              {resultado.correctas} de {resultado.total} correctas ({resultado.porcentaje}%)
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
              <Link to="/">
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
                {i + 1}. {p.pregunta}
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
    </div>
  );
}
