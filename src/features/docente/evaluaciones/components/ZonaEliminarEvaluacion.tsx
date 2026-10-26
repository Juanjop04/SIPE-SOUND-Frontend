import { useState } from "react";
import { ApiError } from "@/shared/api/ApiError.js";
import { Button, Dialog, MensajeError } from "@/shared/ui";

const HTTP_CONFLICTO = 409;

interface ZonaEliminarEvaluacionProps {
  publicada: boolean;
  ocupado: boolean;
  onEliminar: () => Promise<void>;
  onCerrar: () => Promise<void>;
}

/** Eliminar con confirmación; si ya tiene intentos (409) ofrece cerrarla en su lugar. */
export function ZonaEliminarEvaluacion({
  publicada,
  ocupado,
  onEliminar,
  onCerrar,
}: ZonaEliminarEvaluacionProps) {
  const [confirmar, setConfirmar] = useState(false);
  const [conIntentos, setConIntentos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function eliminar() {
    setError(null);
    try {
      await onEliminar();
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === HTTP_CONFLICTO) setConIntentos(true);
      else setError(e instanceof Error ? e.message : "No pudimos eliminarla.");
    }
  }

  return (
    <section
      aria-label="Eliminar evaluación"
      className="mt-12 flex flex-col gap-3 border-t border-danger/40 pt-6"
    >
      <Button
        variante="peligro"
        tamano="sm"
        className="self-start"
        onClick={() => setConfirmar(true)}
      >
        Eliminar evaluación
      </Button>
      {error && <MensajeError mensaje={error} />}
      <Dialog
        abierto={confirmar}
        onCerrar={() => setConfirmar(false)}
        titulo="¿Eliminar esta evaluación?"
        descripcion={
          conIntentos
            ? "Tiene intentos de estudiantes: ciérrala para que nadie más la presente y conservar sus resultados."
            : "Se borrará con sus preguntas. No se puede deshacer."
        }
        acciones={
          <>
            <Button variante="secundario" onClick={() => setConfirmar(false)}>
              Cancelar
            </Button>
            {conIntentos ? (
              publicada && (
                <Button
                  cargando={ocupado}
                  onClick={() => onCerrar().then(() => setConfirmar(false))}
                >
                  Cerrar evaluación
                </Button>
              )
            ) : (
              <Button
                variante="peligro"
                cargando={ocupado}
                onClick={() => eliminar().catch(() => null)}
              >
                Eliminar
              </Button>
            )}
          </>
        }
      />
    </section>
  );
}
