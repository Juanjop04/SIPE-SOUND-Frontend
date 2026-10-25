import { useState } from "react";
import { Link } from "react-router-dom";
import { fechaRelativa } from "@/shared/lib/formato";
import { cn } from "@/shared/lib/cn.js";
import { paths } from "@/shared/config/paths.js";
import { Cuerda } from "@/shared/music";
import { Button, MensajeError, Skeleton, claseBoton } from "@/shared/ui";
import { useComentarios, useRutaDeUnCurso, type EstadoDeCurso, type MiCurso } from "../api";
import { ESTADOS, accionPrincipal, primeraLeccionPendiente } from "../utils";

// Borde izquierdo de 2 px según el estado; además va el símbolo y el texto (nunca solo color).
const MARCA: Record<EstadoDeCurso, string> = {
  sin_iniciar: "border-l-linea-fuerte",
  en_curso: "border-l-accent",
  finalizado: "border-l-success",
};

/** ○ Sin iniciar · ◐ En curso · ● Finalizado. */
function EstadoDelCurso({ estado }: { estado: EstadoDeCurso }) {
  const { etiqueta, simbolo } = ESTADOS.find((e) => e.valor === estado) ?? ESTADOS[0];
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-sm",
        estado === "finalizado" ? "text-success" : "text-paper",
      )}
    >
      <span aria-hidden="true" className="font-mono">
        {simbolo}
      </span>
      {etiqueta}
    </p>
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

/** Botón principal: lleva a la lección donde seguir (de la ruta de ESTE curso) o a la ruta. */
function AccionDelCurso({ curso }: { curso: MiCurso }) {
  const { data } = useRutaDeUnCurso(curso.id);
  const leccion = curso.estado === "finalizado" || !data ? null : primeraLeccionPendiente(data);
  const destino = leccion === null ? `${paths.ruta}?curso=${curso.id}` : paths.leccion(leccion);
  return (
    <Link to={destino} className={claseBoton()}>
      {accionPrincipal(curso.estado)}
      <span className="sr-only"> el curso {curso.nombre}</span>
    </Link>
  );
}

/** Tarjeta de un curso (HU-F-504): cuánto llevo, en qué estado está y cómo seguir. */
export function TarjetaCurso({ curso }: { curso: MiCurso }) {
  const [abierto, setAbierto] = useState(false);
  const { avance } = curso;
  const sinLeer = curso.retroalimentaciones_sin_leer;
  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-caja border border-l-2 border-linea bg-surface p-5",
        MARCA[curso.estado],
      )}
    >
      <div>
        <h2 className="font-display text-xl font-semibold text-paper">{curso.nombre}</h2>
        <p className="text-sm text-muted">
          {[curso.docente.nombre, curso.docente.apellido].filter(Boolean).join(" ")} · {curso.nivel}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between gap-3">
          <EstadoDelCurso estado={curso.estado} />
          <p className="font-mono text-2xl font-semibold tabular-nums text-paper">
            {avance.pct}
            <span className="text-base text-muted"> %</span>
          </p>
        </div>
        <Cuerda
          valor={avance.pct}
          etiqueta={`Avance en ${curso.nombre}`}
          grosor={5}
          sonando={curso.estado === "finalizado"}
        />
        <p className="font-mono text-xs text-muted">
          Lecciones {avance.lecciones.completadas}/{avance.lecciones.total} · Bloques{" "}
          {avance.bloques_aprobados}/{avance.bloques_total}
        </p>
        <p className="text-xs text-muted">
          {curso.ultimo_avance
            ? `Último avance ${fechaRelativa(curso.ultimo_avance)}`
            : "Aún no registras avances en este curso."}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-3">
        <AccionDelCurso curso={curso} />
        <Link
          to={`${paths.ruta}?curso=${curso.id}`}
          className={claseBoton({ variante: "secundario" })}
        >
          Ver ruta del curso
        </Link>
        <Button
          variante="fantasma"
          tamano="sm"
          aria-expanded={abierto}
          onClick={() => setAbierto((a) => !a)}
        >
          {abierto ? "Ocultar comentarios" : "Comentarios"}
          {sinLeer > 0 && (
            <span className="font-mono text-accent">
              {sinLeer} {sinLeer === 1 ? "nuevo" : "nuevos"}
            </span>
          )}
        </Button>
      </div>
      {abierto && <Comentarios cursoId={curso.id} />}
    </li>
  );
}
