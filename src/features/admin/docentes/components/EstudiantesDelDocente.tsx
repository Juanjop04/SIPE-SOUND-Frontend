import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { paths } from "@/shared/config/paths.js";
import { fechaRelativa } from "@/shared/lib/formato";
import {
  EstadoVacio,
  Field,
  Input,
  MensajeError,
  Select,
  Skeleton,
  Table,
  type ColumnaTabla,
} from "@/shared/ui";
import { cursosAdminApi, cursosAdminKeys, type EstudianteDeCurso } from "../externos";
import type { CursoResumen } from "../tipos";

interface Fila extends EstudianteDeCurso {
  cursoId: number;
  curso: string;
}

const nombreDe = (e: Fila) => [e.nombre, e.apellido].filter(Boolean).join(" ");

const COLUMNAS: ColumnaTabla<Fila>[] = [
  { id: "nombre", encabezado: "Estudiante", celda: (e) => <strong>{nombreDe(e)}</strong> },
  {
    id: "curso",
    encabezado: "Curso",
    celda: (e) => (
      <Link
        to={paths.docente.curso(e.cursoId)}
        className="text-accent underline underline-offset-2 hover:decoration-2"
      >
        {e.curso}
      </Link>
    ),
  },
  {
    id: "avance",
    encabezado: "Avance",
    numerica: true,
    celda: (e) => (
      <span className="inline-flex items-center justify-end gap-2.5">
        <span aria-hidden="true" className="h-1.5 w-[72px] overflow-hidden rounded-sm bg-ink-2">
          <span className="block h-full bg-primary" style={{ width: `${e.avance_pct}%` }} />
        </span>
        {e.avance_pct} %
      </span>
    ),
  },
  {
    id: "ultimo",
    encabezado: "Último avance",
    celda: (e) =>
      e.ultimo_avance ? (
        fechaRelativa(e.ultimo_avance)
      ) : (
        <span className="font-semibold text-aviso">Sin avance</span>
      ),
  },
];

interface FiltrosProps {
  texto: string;
  curso: string;
  orden: string;
  cursos: CursoResumen[];
  onTexto: (v: string) => void;
  onCurso: (v: string) => void;
  onOrden: (v: string) => void;
}

function Filtros({ texto, curso, orden, cursos, onTexto, onCurso, onOrden }: FiltrosProps) {
  return (
    <div className="grid gap-3 min-[561px]:grid-cols-2 min-[1101px]:max-w-[900px] min-[1101px]:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]">
      <Field
        etiqueta="Buscar estudiante"
        className="min-[561px]:col-span-2 min-[1101px]:col-span-1"
      >
        {(campo) => (
          <Input
            {...campo}
            type="search"
            placeholder="Nombre del estudiante"
            value={texto}
            autoComplete="off"
            onChange={(e) => onTexto(e.target.value)}
          />
        )}
      </Field>
      <Field etiqueta="Curso">
        {(campo) => (
          <Select {...campo} value={curso} onChange={(e) => onCurso(e.target.value)}>
            <option value="">Todos los cursos</option>
            {cursos.map((c) => (
              <option key={c.curso_id} value={c.curso_id}>
                {c.nombre}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field etiqueta="Ordenar por">
        {(campo) => (
          <Select {...campo} value={orden} onChange={(e) => onOrden(e.target.value)}>
            <option value="nombre">Nombre</option>
            <option value="avance">Menor avance</option>
          </Select>
        )}
      </Field>
    </div>
  );
}

/**
 * Estudiantes de los cursos del docente, con búsqueda, curso y orden, y el enlace al seguimiento
 * del curso (HU-F-506). Sin correos: el administrador los ve en Todos los cursos si los necesita.
 */
export function EstudiantesDelDocente({ cursos }: { cursos: CursoResumen[] }) {
  const [texto, setTexto] = useState("");
  const [curso, setCurso] = useState("");
  const [orden, setOrden] = useState("nombre");
  const consultas = useQueries({
    queries: cursos.map((c) => ({
      queryKey: cursosAdminKeys.estudiantes(c.curso_id, 1),
      queryFn: () => cursosAdminApi.estudiantes(c.curso_id, 1),
    })),
  });
  if (cursos.length === 0) {
    return <EstadoVacio titulo="Este docente aún no tiene cursos activos." />;
  }
  if (consultas.some((q) => q.isPending)) {
    return (
      <div aria-busy="true">
        <Skeleton lineas={4} className="h-11 w-full" />
      </div>
    );
  }
  const fallida = consultas.find((q) => q.error);
  if (fallida?.error) {
    return <MensajeError mensaje={fallida.error.message} onReintentar={() => fallida.refetch()} />;
  }
  const todas: Fila[] = consultas.flatMap((q, i) =>
    (q.data?.data ?? []).map((e) => ({
      ...e,
      cursoId: cursos[i].curso_id,
      curso: cursos[i].nombre,
    })),
  );
  const incompleta = consultas.some((q) => q.data && q.data.meta.total > q.data.data.length);
  const buscado = texto.trim().toLowerCase();
  const filas = todas
    .filter(
      (e) =>
        (curso === "" || String(e.cursoId) === curso) &&
        nombreDe(e).toLowerCase().includes(buscado),
    )
    .sort((a, b) =>
      orden === "avance"
        ? a.avance_pct - b.avance_pct
        : nombreDe(a).localeCompare(nombreDe(b), "es", { sensitivity: "base" }),
    );

  return (
    <div className="flex flex-col gap-4">
      <Filtros
        texto={texto}
        curso={curso}
        orden={orden}
        cursos={cursos}
        onTexto={setTexto}
        onCurso={setCurso}
        onOrden={setOrden}
      />
      {filas.length === 0 ? (
        <EstadoVacio titulo="No hay estudiantes para mostrar." />
      ) : (
        <Table
          etiqueta="Estudiantes de los cursos del docente"
          filas={filas}
          columnas={COLUMNAS}
          obtenerId={(e) => `${e.cursoId}-${e.estudiante_id}`}
        />
      )}
      {incompleta && (
        <p className="text-sm text-muted">
          Se muestran los primeros 20 de cada curso. Abre el curso para ver a todos.
        </p>
      )}
    </div>
  );
}
