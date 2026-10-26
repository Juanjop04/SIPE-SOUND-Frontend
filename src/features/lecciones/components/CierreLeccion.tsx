import { useState } from "react";
import { Link } from "react-router-dom";
import { useCompletarLeccion } from "@/features/progreso";
import type { BloqueRuta, LeccionRuta } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { Button, claseBoton, ENLACE_EN_TEXTO, MensajeError } from "@/shared/ui";
import { continuidad } from "../utils/ubicacion";

interface CierreLeccionProps {
  leccionId: number;
  conSesion: boolean;
  yaPracticada: boolean;
  anterior?: LeccionRuta;
  siguiente?: LeccionRuta;
  /** Bloque de la lección en GET /ruta; sin él solo se ofrece volver a la ruta. */
  bloque?: BloqueRuta;
}

/** Tras practicar: un único primario con lo que sigue y "Volver al bloque" (HU-F-318). */
function QueSigue({ bloque, leccionId }: { bloque?: BloqueRuta; leccionId: number }) {
  const paso = continuidad(bloque, leccionId);
  const volver = bloque ? `${paths.ruta}?bloque=${bloque.id}` : paths.ruta;
  return (
    <div className="flex flex-wrap gap-3">
      {paso?.tipo === "leccion" && (
        <Link to={paths.leccion(paso.leccion.id)} className={claseBoton()}>
          Siguiente lección: {paso.leccion.titulo}
        </Link>
      )}
      {paso?.tipo === "evaluacion" && (
        <Link to={paths.evaluacion(paso.evaluacionId)} className={claseBoton()}>
          Presentar evaluación del bloque
        </Link>
      )}
      <Link to={volver} className={claseBoton({ variante: "secundario" })}>
        {bloque ? "Volver al bloque" : "Volver a la ruta"}
      </Link>
    </div>
  );
}

/** Cuerda de 6 px que suena (ámbar) y vibra al marcar la lección; sin vibración si se pide. */
function CuerdaQueSuena({ vibrar }: { vibrar: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`h-1.5 w-full rounded-full bg-suena ${vibrar ? "motion-safe:animate-vibrar" : ""}`}
    />
  );
}

export function CierreLeccion({
  leccionId,
  conSesion,
  yaPracticada,
  anterior,
  siguiente,
  bloque,
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
      {conSesion && practicada && <QueSigue bloque={bloque} leccionId={leccionId} />}
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
          <Link to={paths.login} className={ENLACE_EN_TEXTO}>
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
          <Link to={paths.leccion(anterior.id)} className={claseBoton({ variante: "secundario" })}>
            ← Lección anterior
          </Link>
        ) : (
          <span />
        )}
        {siguiente && (
          <Link to={paths.leccion(siguiente.id)} className={claseBoton()}>
            Lección siguiente →
          </Link>
        )}
      </nav>
    </section>
  );
}
