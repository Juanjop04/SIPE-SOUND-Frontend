import { useState } from "react";
import { ApiError } from "@/shared/api/ApiError.js";
import { Button, Dialog, MensajeError } from "@/shared/ui";

const HTTP_CONFLICTO = 409;

interface ZonaEliminarProps {
  /** "la lección" / "el ejercicio". */
  nombre: string;
  /** "Esta lección tiene avance de estudiantes. Puedes archivarla…" (concordancia por tipo). */
  mensajeEnUso: string;
  onEliminar: () => Promise<unknown>;
  onArchivar: () => Promise<unknown>;
}

/** Eliminar; si el backend responde 409 (tiene avance), ofrece archivar en su lugar. */
export function ZonaEliminar({ nombre, mensajeEnUso, onEliminar, onArchivar }: ZonaEliminarProps) {
  const [abierto, setAbierto] = useState(false);
  const [enUso, setEnUso] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  function cerrar() {
    setAbierto(false);
    setEnUso(false);
    setError(null);
  }

  async function ejecutar(accion: () => Promise<unknown>) {
    setOcupado(true);
    setError(null);
    try {
      await accion();
      cerrar();
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === HTTP_CONFLICTO) setEnUso(true);
      else setError(e instanceof Error ? e.message : "No se pudo completar la acción.");
    } finally {
      setOcupado(false);
    }
  }

  return (
    <section aria-labelledby="eliminar-contenido" className="mt-12 border-t border-danger/40 pt-6">
      <h2 id="eliminar-contenido" className="font-display text-lg font-semibold text-danger">
        Eliminar
      </h2>
      <p className="mt-1 text-sm text-muted">
        Se borra para siempre. Si tiene avance de estudiantes, podrás archivar en su lugar.
      </p>
      <Button variante="peligro" className="mt-4" onClick={() => setAbierto(true)}>
        Eliminar {nombre}
      </Button>
      <Dialog
        abierto={abierto}
        onCerrar={cerrar}
        titulo={enUso ? "Tiene avance de estudiantes" : `¿Eliminar ${nombre}?`}
        descripcion={enUso ? mensajeEnUso : "No se puede deshacer."}
        acciones={
          enUso ? (
            <Button cargando={ocupado} onClick={() => void ejecutar(onArchivar)}>
              Archivar
            </Button>
          ) : (
            <Button variante="peligro" cargando={ocupado} onClick={() => void ejecutar(onEliminar)}>
              Eliminar
            </Button>
          )
        }
      >
        {error && <MensajeError mensaje={error} />}
      </Dialog>
    </section>
  );
}
