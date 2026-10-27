import { CifraCompacta } from "@/shared/ui";
import type { CursoResumen } from "../tipos";

/**
 * Avance promedio del docente: el de sus cursos ponderado por estudiantes, redondeado hacia abajo.
 * Sin estudiantes no hay promedio ("—").
 */
export function avancePromedio(cursos: CursoResumen[]): number | null {
  const estudiantes = cursos.reduce((suma, c) => suma + c.estudiantes, 0);
  if (estudiantes === 0) return null;
  const total = cursos.reduce((suma, c) => suma + c.avance_promedio_pct * c.estudiantes, 0);
  return Math.floor(total / estudiantes);
}

interface CifrasDelDocenteProps {
  cursos: CursoResumen[] | undefined;
  /** Estudiantes únicos entre todos sus cursos (la lista de docentes lo calcula). */
  estudiantes: number | undefined;
}

/** Cursos, estudiantes, avance promedio y quiénes llevan 7 días sin avance. */
export function CifrasDelDocente({ cursos, estudiantes }: CifrasDelDocenteProps) {
  const promedio = cursos ? avancePromedio(cursos) : null;
  const textoPromedio = promedio === null ? "—" : `${promedio} %`;
  const sinAvance = cursos?.reduce((suma, c) => suma + c.estudiantes_sin_actividad_7d, 0);
  return (
    <div
      role="group"
      aria-label="Cifras del docente"
      className="grid grid-cols-2 gap-2 min-[821px]:grid-cols-[repeat(auto-fill,minmax(170px,220px))]"
    >
      <CifraCompacta etiqueta="Cursos" valor={cursos?.length} />
      <CifraCompacta etiqueta="Estudiantes" valor={estudiantes} />
      <CifraCompacta etiqueta="Avance promedio" valor={cursos ? textoPromedio : undefined} />
      <CifraCompacta
        etiqueta="Sin avance 7 días"
        valor={sinAvance}
        colorValor={sinAvance ? "text-aviso" : "text-paper"}
      />
    </div>
  );
}
