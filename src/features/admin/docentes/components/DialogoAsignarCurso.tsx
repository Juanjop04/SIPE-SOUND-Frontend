import { useId, useState } from "react";
import { Button, Dialog, MensajeError } from "@/shared/ui";
import { useCursosSinDocenteLista } from "../hooks";
import { useReasignarCurso } from "../externos";

interface DialogoAsignarCursoProps {
  abierto: boolean;
  docenteId: string;
  /** Nombre completo del docente que recibe el curso. */
  nombre: string;
  onCerrar: () => void;
}

function Cuerpo({ docenteId, nombre, onCerrar }: Omit<DialogoAsignarCursoProps, "abierto">) {
  const { data, isPending, error } = useCursosSinDocenteLista();
  const reasignar = useReasignarCurso();
  const [cursoId, setCursoId] = useState<number | null>(null);
  const grupo = useId();
  const cursos = data?.data ?? [];

  if (isPending) return <p className="text-sm text-muted">Buscando cursos sin docente…</p>;
  if (error) return <MensajeError mensaje={error.message} />;
  if (cursos.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-paper">
          No hay cursos sin docente. Para darle un curso a {nombre}, usa «Reasignar» en el curso de
          otro docente.
        </p>
        <div className="flex justify-end">
          <Button variante="fantasma" onClick={onCerrar}>
            Cerrar
          </Button>
        </div>
      </div>
    );
  }
  const elegido = cursos.find((c) => c.id === cursoId);

  function asignar() {
    if (!elegido) return;
    const resumen = `El curso ${elegido.nombre} queda a cargo de ${nombre}. ${nombre} recibirá un correo con el curso asignado.`;
    reasignar.mutate({ cursoId: elegido.id, docenteId, resumen }, { onSuccess: onCerrar });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-paper">
        Elige un curso sin docente: {nombre} lo recibe con sus estudiantes y su contenido.
      </p>
      <div role="radiogroup" aria-label="Cursos sin docente" className="flex flex-col gap-2">
        {cursos.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 rounded-md border border-linea p-3 hover:border-linea-fuerte has-[:checked]:border-primary has-[:checked]:bg-primary/10"
          >
            <input
              id={`${grupo}-${c.id}`}
              type="radio"
              name={grupo}
              checked={cursoId === c.id}
              onChange={() => setCursoId(c.id)}
              className="h-4 w-4 accent-primary"
            />
            <label
              htmlFor={`${grupo}-${c.id}`}
              className="flex flex-1 cursor-pointer flex-col gap-0.5"
            >
              <span className="text-sm font-semibold text-paper">{c.nombre}</span>
              <span className="text-xs text-muted">{c.estudiantes} estudiantes</span>
            </label>
          </div>
        ))}
      </div>
      {reasignar.error && <MensajeError mensaje={reasignar.error.message} />}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button disabled={!elegido} cargando={reasignar.isPending} onClick={asignar}>
          Asignar curso
        </Button>
      </div>
    </div>
  );
}

/** Asignar a este docente un curso que hoy no tiene docente. */
export function DialogoAsignarCurso({ abierto, ...cuerpo }: DialogoAsignarCursoProps) {
  return (
    <Dialog abierto={abierto} onCerrar={cuerpo.onCerrar} titulo="Asignar curso">
      <Cuerpo {...cuerpo} />
    </Dialog>
  );
}
