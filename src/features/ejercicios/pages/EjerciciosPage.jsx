import { useState } from "react";
import { Check } from "lucide-react";
import { Card } from "@/shared/ui/Card.jsx";
import { Button } from "@/shared/ui/Button.jsx";
import { useSession } from "@/features/auth";
import { useCompletarEjercicio } from "@/features/progreso";
import { useEjercicios } from "../hooks/useEjercicios.js";

export default function Ejercicios() {
  const { data: ejercicios = [], isPending: cargando, error } = useEjercicios();
  const completarEjercicio = useCompletarEjercicio();
  const { usuario } = useSession();
  const hayUsuario = Boolean(usuario);
  const [guardados, setGuardados] = useState({});

  async function marcarCompletado(ejercicioId) {
    try {
      await completarEjercicio.mutateAsync(ejercicioId);
      setGuardados((prev) => ({ ...prev, [ejercicioId]: "ok" }));
    } catch {
      setGuardados((prev) => ({ ...prev, [ejercicioId]: "error" }));
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <h2 className="mb-1 font-display text-xl font-semibold text-paper">Ejercicios practicos</h2>
      <p className="mb-6 text-sm text-muted">Rutinas para practicar con metronomo, paso a paso.</p>

      {cargando && <p className="text-muted">Cargando...</p>}
      {error && <p className="text-sm text-danger">{error.message}</p>}

      <div className="flex flex-col gap-4">
        {ejercicios.map((ej) => (
          <Card key={ej.id}>
            <h3 className="mb-1 text-base font-medium text-paper">{ej.nombre}</h3>
            {ej.descripcion && <p className="mb-2 text-sm text-muted">{ej.descripcion}</p>}

            <div className="mb-3 flex gap-4 font-mono text-xs text-muted/80">
              <span>{ej.nivel}</span>
              {ej.bpm_recomendado && <span>{ej.bpm_recomendado} BPM</span>}
              {ej.compas && <span>compas {ej.compas}</span>}
              {ej.duracion_min && <span>{ej.duracion_min} min</span>}
            </div>

            {ej.acordes && ej.acordes.length > 0 && (
              <div className="mb-3 flex gap-2">
                {ej.acordes.map((nombreAcorde) => (
                  <span
                    key={nombreAcorde}
                    className="rounded bg-ink px-2 py-1 font-mono text-xs text-accent"
                  >
                    {nombreAcorde}
                  </span>
                ))}
              </div>
            )}

            {ej.pasos && ej.pasos.length > 0 && (
              <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-muted">
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
                  <span className="flex items-center gap-1 text-sm text-success">
                    <Check size={16} aria-hidden="true" /> guardado
                  </span>
                )}
                {guardados[ej.id] === "error" && (
                  <span className="text-sm text-danger">no se pudo guardar</span>
                )}
              </div>
            ) : (
              <p className="text-sm italic text-muted">Inicia sesion para guardar tu progreso</p>
            )}
          </Card>
        ))}
      </div>

      {!cargando && ejercicios.length === 0 && !error && (
        <p className="text-sm text-muted">
          Todavia no hay ejercicios cargados en la base de datos.
        </p>
      )}
    </main>
  );
}
