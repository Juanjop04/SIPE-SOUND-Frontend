import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Header from "../components/Header.jsx";
import { Card } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { obtenerEjercicios, guardarProgreso } from "../lib/api.js";

export default function Ejercicios() {
  const [ejercicios, setEjercicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [hayUsuario, setHayUsuario] = useState(false);
  const [guardados, setGuardados] = useState({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHayUsuario(!!data.session);
    });

    obtenerEjercicios()
      .then(setEjercicios)
      .catch(() => setError("No se pudo conectar con el backend. Esta corriendo?"))
      .finally(() => setCargando(false));
  }, []);

  async function marcarCompletado(ejercicioId) {
    try {
      await guardarProgreso({ tipo: "ejercicio", contenido_id: ejercicioId, porcentaje: 100, completado: true });
      setGuardados((prev) => ({ ...prev, [ejercicioId]: "ok" }));
    } catch (err) {
      setGuardados((prev) => ({ ...prev, [ejercicioId]: "error" }));
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="font-display font-semibold text-paper text-xl mb-1">Ejercicios practicos</h2>
        <p className="text-muted text-sm mb-6">Rutinas para practicar con metronomo, paso a paso.</p>

        {cargando && <p className="text-muted">Cargando...</p>}
        {error && <p className="text-danger text-sm">{error}</p>}

        <div className="flex flex-col gap-4">
          {ejercicios.map((ej) => (
            <Card key={ej.id}>
              <h3 className="font-medium text-paper text-base mb-1">{ej.nombre}</h3>
              {ej.descripcion && <p className="text-muted text-sm mb-2">{ej.descripcion}</p>}

              <div className="flex gap-4 font-mono text-xs text-muted/80 mb-3">
                <span>{ej.nivel}</span>
                {ej.bpm_recomendado && <span>{ej.bpm_recomendado} BPM</span>}
                {ej.compas && <span>compas {ej.compas}</span>}
                {ej.duracion && <span>{ej.duracion}</span>}
              </div>

              {ej.acordes && ej.acordes.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {ej.acordes.map((nombreAcorde) => (
                    <span
                      key={nombreAcorde}
                      className="font-mono text-xs bg-ink text-accent px-2 py-1 rounded"
                    >
                      {nombreAcorde}
                    </span>
                  ))}
                </div>
              )}

              {ej.pasos && ej.pasos.length > 0 && (
                <ol className="list-decimal list-inside text-muted text-sm mb-3 space-y-1">
                  {ej.pasos.map((paso, i) => (
                    <li key={i}>{paso}</li>
                  ))}
                </ol>
              )}

              {hayUsuario ? (
                <div className="flex items-center gap-3">
                  <Button variant="success" onClick={() => marcarCompletado(ej.id)}>
                    Marcar como completado
                  </Button>
                  {guardados[ej.id] === "ok" && (
                    <span className="flex items-center gap-1 text-success text-sm">
                      <Check size={16} aria-hidden="true" /> guardado
                    </span>
                  )}
                  {guardados[ej.id] === "error" && (
                    <span className="text-danger text-sm">no se pudo guardar</span>
                  )}
                </div>
              ) : (
                <p className="text-muted text-sm italic">Inicia sesion para guardar tu progreso</p>
              )}
            </Card>
          ))}
        </div>

        {!cargando && ejercicios.length === 0 && !error && (
          <p className="text-muted text-sm">
            Todavia no hay ejercicios cargados en la base de datos.
          </p>
        )}
      </main>
    </div>
  );
}
