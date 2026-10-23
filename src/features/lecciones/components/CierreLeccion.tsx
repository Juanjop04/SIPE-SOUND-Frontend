import { useState } from "react";
import { Link } from "react-router-dom";
import { useCompletarLeccion } from "@/features/progreso";
import type { LeccionRuta } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { Button, MensajeError } from "@/shared/ui";

interface CierreLeccionProps {
  leccionId: number;
  conSesion: boolean;
  yaPracticada: boolean;
  anterior?: LeccionRuta;
  siguiente?: LeccionRuta;
}

/** Cuerda de 6 px que suena (ámbar) y vibra al marcar la lección; sin vibración si se pide. */
function CuerdaQueSuena({ vibrar }: { vibrar: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`h-1.5 w-full rounded-full bg-success ${vibrar ? "motion-safe:animate-vibrar" : ""}`}
    />
  );
}

export function CierreLeccion({
  leccionId,
  conSesion,
  yaPracticada,
  anterior,
  siguiente,
}: CierreLeccionProps) {
  const completar = useCompletarLeccion();
  const [recienMarcada, setRecienMarcada] = useState(false);
  const practicada = yaPracticada || recienMarcada;

  async function marcar() {
    await completar.mutateAsync(leccionId);
    setRecienMarcada(true);
  }

  return (
    <section aria-label="Cierre de la lección" className="mt-12 flex flex-col gap-6">
      {practicada && <CuerdaQueSuena vibrar={recienMarcada} />}
      <p aria-live="polite" className="text-sm text-muted">
        {practicada ? "Lección practicada: la ruta ya refleja tu avance." : ""}
      </p>
      {conSesion && !practicada && (
        <Button
          className="self-start"
          cargando={completar.isPending}
          onClick={() => marcar().catch(() => null)}
        >
          {completar.isPending ? "Enviando…" : "Marcar como practicada"}
        </Button>
      )}
      {!conSesion && (
        <p className="text-sm text-muted">
          <Link to={paths.login} className="text-accent hover:underline">
            Inicia sesión
          </Link>{" "}
          para guardar tu avance.
        </p>
      )}
      {completar.error && <MensajeError mensaje={completar.error.message} />}

      <nav
        aria-label="Lecciones"
        className="flex justify-between gap-4 border-t border-linea pt-4 text-sm"
      >
        {anterior ? (
          <Link to={paths.leccion(anterior.id)} className="text-muted hover:text-accent">
            ← Lección anterior
          </Link>
        ) : (
          <span />
        )}
        {siguiente && (
          <Link to={paths.leccion(siguiente.id)} className="text-muted hover:text-accent">
            Lección siguiente →
          </Link>
        )}
      </nav>
    </section>
  );
}
