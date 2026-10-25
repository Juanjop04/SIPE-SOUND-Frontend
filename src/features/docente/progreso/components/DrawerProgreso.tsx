import { useState } from "react";
import { Mastil } from "@/features/ruta";
import { formatearFecha } from "@/shared/lib/formato";
import { MarcaEstado } from "@/shared/music";
import { Drawer, MensajeError, Skeleton } from "@/shared/ui";
import { useProgresoDeEstudiante } from "../hooks";
import type { BloqueSeguido } from "../externos";
import type { CursoDeEstudiante } from "../tipos";
import { nombreCompleto } from "../utils";

function BloqueElegido({ bloque }: { bloque: BloqueSeguido }) {
  const hechas = bloque.lecciones.filter((l) => l.completado).length;
  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-2 text-paper">
        <MarcaEstado estado={bloque.estado} />
        Bloque {bloque.numero} · {bloque.titulo}
      </p>
      <p className="text-sm text-muted">
        <span className="font-mono tabular-nums">
          {hechas} de {bloque.lecciones.length}
        </span>{" "}
        lecciones completadas
      </p>
      {bloque.intentos.length > 0 ? (
        <ul className="flex flex-col gap-1 font-mono text-sm">
          {bloque.intentos.map((i) => (
            <li key={i.id} className={i.aprobado ? "text-success" : "text-muted"}>
              {formatearFecha(i.creado_en)} · {i.puntaje} % ·{" "}
              {i.aprobado ? "aprobada" : "no aprobada"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Sin intentos en este bloque.</p>
      )}
    </div>
  );
}

function CursoDelEstudiante({ curso, nombre }: { curso: CursoDeEstudiante; nombre: string }) {
  const [elegido, setElegido] = useState<number | null>(null);
  const bloque =
    curso.bloques.find((b) => b.id === elegido) ??
    curso.bloques.find((b) => b.estado === "disponible") ??
    curso.bloques[0];
  return (
    <section aria-label={nombre} className="flex flex-col gap-4">
      <h3 className="font-display text-lg font-semibold text-paper">{nombre}</h3>
      <p className="font-mono text-xs text-muted">
        Inscrito el {formatearFecha(curso.inscrito_en)}
      </p>
      {bloque ? (
        <>
          <Mastil
            bloques={curso.bloques}
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
  );
}

interface DrawerProgresoProps {
  /** null = cerrado. */
  estudianteId: string | null;
  /** Nombres de los cursos del docente, por id (el detalle solo trae el id). */
  nombresDeCursos: Record<number, string>;
  onCerrar: () => void;
}

/** Progreso de un estudiante en todos mis cursos, en solo lectura (mástil de la ruta). */
export function DrawerProgreso({ estudianteId, nombresDeCursos, onCerrar }: DrawerProgresoProps) {
  const { data, isPending, error, refetch } = useProgresoDeEstudiante(estudianteId);
  return (
    <Drawer
      ancho="amplio"
      abierto={estudianteId !== null}
      onCerrar={onCerrar}
      titulo={data ? nombreCompleto(data) : "Progreso del estudiante"}
    >
      {isPending && estudianteId && (
        <div aria-busy="true">
          <Skeleton lineas={5} className="h-10 w-full" />
        </div>
      )}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && (
        <div className="flex flex-col gap-8">
          {data.cursos.map((c) => (
            <CursoDelEstudiante
              key={c.curso_id}
              curso={c}
              nombre={nombresDeCursos[c.curso_id] ?? `Curso ${c.curso_id}`}
            />
          ))}
        </div>
      )}
    </Drawer>
  );
}
