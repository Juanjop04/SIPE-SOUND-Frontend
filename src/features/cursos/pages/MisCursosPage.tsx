import { Link, useSearchParams } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { cn } from "@/shared/lib/cn.js";
import { EstadoVacio, MensajeError, Select, Skeleton, claseBoton } from "@/shared/ui";
import { useMisCursos, type MiCurso } from "../api";
import { TarjetaCurso } from "../components/TarjetaCurso";
import {
  ESTADOS,
  ORDENES,
  contarPorEstado,
  filtrarYOrdenar,
  filtroDe,
  ordenDe,
  type FiltroEstado,
} from "../utils";

const PESTANAS: { valor: FiltroEstado; etiqueta: string }[] = [
  { valor: "todos", etiqueta: "Todos" },
  ...ESTADOS.map((e) => ({ valor: e.valor, etiqueta: e.etiqueta })),
];

/** Pestañas por estado con su conteo; el filtro y el orden viven en la URL. */
function Filtros({ cursos }: { cursos: MiCurso[] }) {
  const [parametros, setParametros] = useSearchParams();
  const filtro = filtroDe(parametros.get("estado"));
  const orden = ordenDe(parametros.get("orden"));
  const conteo = contarPorEstado(cursos);

  function cambiar(clave: string, valor: string | null) {
    setParametros(
      (previos) => {
        const nuevos = new URLSearchParams(previos);
        if (valor) nuevos.set(clave, valor);
        else nuevos.delete(clave);
        return nuevos;
      },
      { replace: true },
    );
  }

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div role="tablist" aria-label="Estado del curso" className="flex flex-wrap gap-x-5 gap-y-1">
        {PESTANAS.map(({ valor, etiqueta }) => (
          <button
            key={valor}
            type="button"
            role="tab"
            aria-selected={filtro === valor}
            onClick={() => cambiar("estado", valor === "todos" ? null : valor)}
            className={cn(
              "flex items-baseline gap-2 border-b-2 py-1 text-sm transition-colors duration-rapida",
              filtro === valor
                ? "border-accent text-paper"
                : "border-transparent text-muted hover:text-paper",
            )}
          >
            {etiqueta}
            <span className="font-mono tabular-nums">{conteo[valor]}</span>
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-muted">
        Ordenar por
        <Select
          value={orden}
          className="w-auto py-1"
          onChange={(e) =>
            cambiar("orden", e.target.value === "ultimo_avance" ? null : e.target.value)
          }
        >
          {ORDENES.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.etiqueta}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}

/** La tarjeta final: pedir entrar a otro curso o unirse con un código (HU-F-517). */
function TarjetaMasCursos() {
  return (
    <li className="flex flex-col justify-center gap-3 rounded-caja border border-dashed border-linea-fuerte p-5 md:col-span-2">
      <h2 className="font-display text-lg font-semibold text-paper">¿Quieres otro curso?</h2>
      <p className="text-sm text-muted">
        Mira los cursos disponibles y pide entrar, o únete directo con el código de tu docente.
      </p>
      <div>
        <Link to={paths.cursosDisponibles} className={claseBoton()}>
          Ver cursos disponibles
        </Link>
      </div>
    </li>
  );
}

/** /cursos (HU-F-311 y HU-F-504): mis cursos con su avance, filtrados por estado. */
export default function MisCursosPage() {
  const [parametros] = useSearchParams();
  const { data, isPending, error, refetch } = useMisCursos();
  const visibles = data
    ? filtrarYOrdenar(data, filtroDe(parametros.get("estado")), ordenDe(parametros.get("orden")))
    : [];

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-paper">Mis cursos</h1>
          <p className="mt-2 text-sm text-muted">
            Cuánto llevas en cada curso y por dónde seguir. Cada curso tiene su propia ruta.
          </p>
        </div>
        <Link to={paths.cursosDisponibles} className={claseBoton({ variante: "secundario" })}>
          Ver cursos disponibles
        </Link>
      </header>
      {isPending && <Skeleton lineas={3} className="h-40 w-full" />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.length > 0 && <Filtros cursos={data} />}
      {data && data.length === 0 && (
        <EstadoVacio
          titulo="Aún no estás en ningún curso."
          descripcion="Entra a «Ver cursos disponibles»: pide entrar a uno o únete con el código que te dio tu docente. Tu curso aparecerá aquí con su ruta."
        />
      )}
      {data && data.length > 0 && visibles.length === 0 && (
        <EstadoVacio titulo="No tienes cursos en este estado." descripcion="Prueba con «Todos»." />
      )}
      {data && (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibles.map((curso) => (
            <TarjetaCurso key={curso.id} curso={curso} />
          ))}
          <TarjetaMasCursos />
        </ul>
      )}
    </main>
  );
}
