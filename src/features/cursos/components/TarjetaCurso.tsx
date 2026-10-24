import { useState } from "react";
import { fechaRelativa } from "@/shared/lib/formato";
import { MarcaEstado } from "@/shared/music";
import { Button, MensajeError, Skeleton } from "@/shared/ui";
import { useComentarios, useRutaDeUnCurso, type MiCurso } from "../api";

/** La ruta del curso como una fila de marcas (× ○ ●) con su estado accesible. */
function MiniMastil({ cursoId }: { cursoId: number }) {
  const { data, isPending } = useRutaDeUnCurso(cursoId);
  if (isPending) return <Skeleton className="h-6 w-48" />;
  if (!data?.length)
    return <p className="text-sm text-muted">Ruta general (el curso no definió la suya).</p>;
  return (
    <ol aria-label="Ruta del curso" className="flex flex-wrap items-center gap-3">
      {data.map((b) => (
        <li
          key={b.id}
          className="flex items-center gap-1 font-mono text-xs text-muted"
          title={b.titulo}
        >
          <MarcaEstado estado={b.estado} />
          {String(b.numero).padStart(2, "0")}
        </li>
      ))}
    </ol>
  );
}

/** Comentarios del docente como notas de cuaderno; los nuevos con un punto accent. */
function Comentarios({ cursoId }: { cursoId: number }) {
  const { data, isPending, error, refetch } = useComentarios(cursoId);
  if (isPending) return <Skeleton lineas={2} className="h-12 w-full" />;
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  if (data.length === 0)
    return <p className="text-sm text-muted">Tu docente aún no te ha escrito.</p>;
  return (
    <ul className="flex flex-col gap-3">
      {data.map((c) => (
        <li key={c.id} className="rounded-md border border-linea bg-ink-2 p-3 text-sm">
          <p className="flex items-center gap-2 font-mono text-xs text-muted">
            {c.nueva && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />}
            {fechaRelativa(c.creado_en)}
            {c.nueva && <span className="text-accent">nuevo</span>}
          </p>
          <p className="mt-1 text-paper">{c.mensaje}</p>
        </li>
      ))}
    </ul>
  );
}

export function TarjetaCurso({ curso }: { curso: MiCurso }) {
  const [abierto, setAbierto] = useState(false);
  const sinLeer = curso.retroalimentaciones_sin_leer;
  return (
    <li className="flex flex-col gap-4 rounded-caja border border-linea bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl font-semibold text-paper">{curso.nombre}</p>
          <p className="text-sm text-muted">
            {curso.docente_nombre} · {curso.nivel}
          </p>
        </div>
        <Button
          variante="secundario"
          tamano="sm"
          aria-expanded={abierto}
          onClick={() => setAbierto((a) => !a)}
        >
          {abierto ? "Ocultar comentarios" : "Comentarios"}
          {sinLeer > 0 && <span className="font-mono text-accent">{sinLeer} nuevos</span>}
        </Button>
      </div>
      <MiniMastil cursoId={curso.id} />
      {abierto && <Comentarios cursoId={curso.id} />}
    </li>
  );
}
