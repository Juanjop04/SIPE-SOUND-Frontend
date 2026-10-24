import { useState } from "react";
import { Mastil } from "@/features/ruta";
import { fechaRelativa, formatearFecha } from "@/shared/lib/formato";
import { MarcaEstado } from "@/shared/music";
import { Button, MensajeError, Skeleton } from "@/shared/ui";
import { useDetalleEstudiante } from "../hooks";
import type { BloqueSeguido, DetalleEstudiante as Detalle, Retroalimentacion } from "../tipos";

const subtitulo = "font-display text-lg font-semibold text-paper";

/** Lecciones, ejercicios (mejor BPM) e intentos del bloque elegido, tal como los registró. */
function BloqueElegido({ bloque }: { bloque: BloqueSeguido }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-center gap-2 text-paper">
        <MarcaEstado estado={bloque.estado} />
        Bloque {bloque.numero} · {bloque.titulo}
      </p>
      <ul className="flex flex-col divide-y divide-linea">
        {bloque.lecciones.map((l) => (
          <li key={l.id} className="py-2 text-sm">
            <p className={l.completado ? "text-paper" : "text-muted"}>
              <span aria-hidden="true" className={l.completado ? "text-success" : ""}>
                {l.completado ? "● " : "○ "}
              </span>
              {l.titulo}
              <span className="sr-only">{l.completado ? ", completada" : ", pendiente"}</span>
            </p>
            {l.ejercicios.map((e) => (
              <p key={e.id} className="ml-5 font-mono text-xs text-muted">
                {e.nombre} · {e.mejor_bpm ? `${e.mejor_bpm} BPM` : "sin registro"}
                {e.completado && " · completado"}
              </p>
            ))}
          </li>
        ))}
      </ul>
      {bloque.intentos.length > 0 && (
        <ul className="flex flex-col gap-1 font-mono text-sm">
          {bloque.intentos.map((i) => (
            <li key={i.id} className={i.aprobado ? "text-success" : "text-muted"}>
              {formatearFecha(i.creado_en)} · {i.puntaje} % ·{" "}
              {i.aprobado ? "aprobada" : "no aprobada"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Comentarios({ lista }: { lista: Retroalimentacion[] }) {
  if (lista.length === 0)
    return <p className="text-sm text-muted">Aún no le has escrito comentarios.</p>;
  return (
    <ul className="flex flex-col gap-3">
      {lista.map((c) => (
        <li key={c.id} className="rounded-md border border-linea bg-ink-2 p-3 text-sm">
          <p className="text-paper">{c.mensaje}</p>
          <p className="mt-1 font-mono text-xs text-muted">
            {fechaRelativa(c.creado_en)} · {c.leida_en ? "leído" : "sin leer"}
          </p>
        </li>
      ))}
    </ul>
  );
}

interface DetalleEstudianteProps {
  cursoId: number;
  estudianteId: string;
  soloLectura: boolean;
  onComentar: (detalle: Detalle) => void;
  onRetirar: (detalle: Detalle) => void;
}

/** Lo mismo que el estudiante ve en su ruta (HU-F-309), más comentarios y retiro. */
export function DetalleEstudiante({
  cursoId,
  estudianteId,
  soloLectura,
  onComentar,
  onRetirar,
}: DetalleEstudianteProps) {
  const { data, isPending, error, refetch } = useDetalleEstudiante(cursoId, estudianteId);
  const [elegido, setElegido] = useState<number | null>(null);
  if (isPending) return <Skeleton lineas={5} className="h-10 w-full" />;
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  const bloque =
    data.bloques.find((b) => b.id === elegido) ??
    data.bloques.find((b) => b.estado === "disponible") ??
    data.bloques[0];

  return (
    <div className="flex flex-col gap-8">
      <p className="font-mono text-sm text-muted">
        Inscrito el {formatearFecha(data.inscrito_en)} · {data.email ?? "—"}
      </p>
      <section aria-label="Ruta del estudiante" className="flex flex-col gap-4">
        <h3 className={subtitulo}>Su ruta</h3>
        {bloque ? (
          <>
            <Mastil
              bloques={data.bloques}
              seleccionadoId={bloque.id}
              onSeleccionar={setElegido}
              horizontal
            />
            <BloqueElegido bloque={bloque} />
          </>
        ) : (
          <p className="text-sm text-muted">El curso aún no tiene bloques en su ruta.</p>
        )}
      </section>
      <section aria-label="Comentarios" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className={subtitulo}>Comentarios</h3>
          {!soloLectura && (
            <Button variante="secundario" tamano="sm" onClick={() => onComentar(data)}>
              Escribir comentario
            </Button>
          )}
        </div>
        <Comentarios lista={data.retroalimentaciones} />
      </section>
      {!soloLectura && (
        <section aria-label="Retirar del curso" className="border-t border-danger/40 pt-6">
          <Button variante="peligro" tamano="sm" onClick={() => onRetirar(data)}>
            Retirar del curso
          </Button>
        </section>
      )}
    </div>
  );
}
