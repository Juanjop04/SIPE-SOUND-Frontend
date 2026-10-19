import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Header from "../components/Header.jsx";
import { Card } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { obtenerQuiz, verificarQuiz } from "../lib/api.js";

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

  const todasRespondidas = preguntas.length > 0 && preguntas.every((p) => respuestas[p.id] !== undefined);

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <Link to="/" className="flex items-center gap-1 text-muted hover:text-primary text-sm mb-5 w-fit">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver a bloques
        </Link>

        <h2 className="font-display font-semibold text-paper text-xl mb-1">Quiz del bloque</h2>
        <p className="text-muted text-sm mb-6">
          Necesitas 80% o mas para desbloquear el siguiente bloque.
        </p>

        {cargando && <p className="text-muted">Cargando...</p>}
        {error && <p className="text-danger text-sm mb-4">{error}</p>}

        {/* Resultado final */}
        {resultado && (
          <Card className="border-l-0 mb-6 text-center">
            {resultado.aprobado ? (
              <CheckCircle2 size={40} className="text-success mx-auto mb-2" aria-hidden="true" />
            ) : (
              <XCircle size={40} className="text-danger mx-auto mb-2" aria-hidden="true" />
            )}
            <p className="font-display font-semibold text-paper text-lg">
              {resultado.correctas} de {resultado.total} correctas ({resultado.porcentaje}%)
            </p>
            <p className={`text-sm mt-1 ${resultado.aprobado ? "text-success" : "text-danger"}`}>
              {resultado.aprobado ? "Aprobado, siguiente bloque desbloqueado" : "No alcanzaste el minimo, intenta de nuevo"}
            </p>
            {!resultado.aprobado && (
              <Button variant="primary" className="mt-4" onClick={reintentar}>
                Reintentar
              </Button>
            )}
            {resultado.aprobado && (
              <Link to="/">
                <Button variant="success" className="mt-4">Volver a bloques</Button>
              </Link>
            )}
          </Card>
        )}

        {/* Preguntas */}
        {!resultado && !cargando && preguntas.map((p, i) => (
          <Card key={p.id} className="border-l-0 mb-4">
            <p className="text-paper text-sm mb-3">
              {i + 1}. {p.pregunta}
            </p>
            <div className="flex flex-col gap-2">
              {p.opciones.map((opcion, idx) => (
                <button
                  key={idx}
                  onClick={() => elegirRespuesta(p.id, idx)}
                  className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
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
