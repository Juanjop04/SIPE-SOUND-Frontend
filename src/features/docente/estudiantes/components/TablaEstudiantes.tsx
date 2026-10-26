import { fechaRelativa } from "@/shared/lib/formato";
import { Cuerda } from "@/shared/music";
import { Button, Table, type ColumnaTabla } from "@/shared/ui";
import type { EstudianteCurso } from "../tipos";
import { sinActividad } from "../utils";

export interface AccionesEstudiante {
  onVer: (e: EstudianteCurso) => void;
  onComentar: (e: EstudianteCurso) => void;
  onRetirar: (e: EstudianteCurso) => void;
}

interface TablaEstudiantesProps extends AccionesEstudiante {
  filas: EstudianteCurso[];
  /** Bloques de la ruta del curso; null si el curso usa la ruta general. */
  totalBloques: number | null;
  /** El curso archivado no admite comentarios ni retiros. */
  soloLectura: boolean;
  /** Ids de quienes necesitan apoyo (del resumen del backend): llevan la marca en texto. */
  apoyo?: ReadonlySet<string>;
}

function Nombre({ e, apoyo }: { e: EstudianteCurso; apoyo?: ReadonlySet<string> }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-2">
      <span className="text-paper">{e.nombre}</span>
      {apoyo?.has(e.estudiante_id) && (
        <span className="text-xs text-danger">
          <span aria-hidden="true">! </span>Necesita apoyo
        </span>
      )}
    </span>
  );
}

/** "hace 3 días" y, con más de 14 días o sin registros, "sin actividad" en texto (no solo color). */
function UltimoAvance({ fecha }: { fecha: string | null }) {
  const inactivo = sinActividad(fecha);
  return (
    <span className={inactivo ? "text-danger" : "text-muted"}>
      {fecha ? fechaRelativa(fecha) : "nunca"}
      {inactivo && " · sin actividad"}
    </span>
  );
}

function Avance({ e }: { e: EstudianteCurso }) {
  return (
    <span className="flex items-center gap-3">
      <Cuerda
        grosor={4}
        valor={e.avance_pct}
        etiqueta={`Avance de ${e.nombre}`}
        sonando={e.avance_pct === 100}
        className="w-24"
      />
      <span className="w-10 text-right font-mono tabular-nums text-paper">{e.avance_pct}%</span>
    </span>
  );
}

function Acciones({
  e,
  acciones,
  soloLectura,
}: {
  e: EstudianteCurso;
  acciones: AccionesEstudiante;
  soloLectura: boolean;
}) {
  return (
    <span className="flex flex-wrap gap-1">
      <Button
        variante="fantasma"
        tamano="sm"
        onClick={() => acciones.onVer(e)}
        aria-label={`Ver a ${e.nombre}`}
      >
        Ver
      </Button>
      {!soloLectura && (
        <>
          <Button
            variante="fantasma"
            tamano="sm"
            onClick={() => acciones.onComentar(e)}
            aria-label={`Comentar a ${e.nombre}`}
          >
            Comentar
          </Button>
          <Button
            variante="fantasma"
            tamano="sm"
            onClick={() => acciones.onRetirar(e)}
            aria-label={`Retirar a ${e.nombre}`}
          >
            Retirar
          </Button>
        </>
      )}
    </span>
  );
}

const aprobados = (e: EstudianteCurso, total: number | null) =>
  total === null ? String(e.bloques_aprobados) : `${e.bloques_aprobados}/${total}`;

/** Escritorio: tabla densa. Menos de 768 px: filas apiladas sin desplazamiento horizontal. */
export function TablaEstudiantes({
  filas,
  totalBloques,
  soloLectura,
  apoyo,
  ...acciones
}: TablaEstudiantesProps) {
  const columnas: ColumnaTabla<EstudianteCurso>[] = [
    {
      id: "nombre",
      encabezado: "Nombre",
      celda: (e) => <Nombre e={e} apoyo={apoyo} />,
    },
    {
      id: "correo",
      encabezado: "Correo",
      celda: (e) => <span className="font-mono text-xs text-muted">{e.email ?? "—"}</span>,
    },
    { id: "avance", encabezado: "Avance", celda: (e) => <Avance e={e} /> },
    {
      id: "bloques",
      encabezado: "Bloques",
      numerica: true,
      celda: (e) => aprobados(e, totalBloques),
    },
    {
      id: "ultimo",
      encabezado: "Último avance",
      celda: (e) => <UltimoAvance fecha={e.ultimo_avance} />,
    },
    {
      id: "acciones",
      encabezado: "Acciones",
      celda: (e) => <Acciones e={e} acciones={acciones} soloLectura={soloLectura} />,
    },
  ];

  return (
    <>
      <Table
        etiqueta="Estudiantes del curso"
        filas={filas}
        columnas={columnas}
        obtenerId={(e) => e.estudiante_id}
        className="hidden md:block"
      />
      <ul className="flex flex-col gap-3 md:hidden">
        {filas.map((e) => (
          <li
            key={e.estudiante_id}
            className="flex flex-col gap-2 rounded-caja border border-linea bg-surface p-4"
          >
            <Nombre e={e} apoyo={apoyo} />
            <Avance e={e} />
            <p className="text-sm">
              <span className="font-mono text-muted">bloques {aprobados(e, totalBloques)} · </span>
              <UltimoAvance fecha={e.ultimo_avance} />
            </p>
            <Acciones e={e} acciones={acciones} soloLectura={soloLectura} />
          </li>
        ))}
      </ul>
    </>
  );
}
