import { useNavigate, useSearchParams } from "react-router-dom";
import { useMisCursos } from "@/features/cursos";
import type { BloqueRuta } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { cn } from "@/shared/lib/cn.js";
import { EstadoVacio, MensajeError, Skeleton } from "@/shared/ui";
import { BarrasHorizontales, BarrasPorDia, PuntosConLinea } from "@/shared/ui/graficos";
import { useActividad } from "../hooks/useActividad";
import {
  APROBACION,
  RANGOS_ACTIVIDAD,
  barrasDeBloques,
  barrasDeCursos,
  lecturaDeActividad,
  lecturaDeBloques,
  lecturaDeCursos,
  lecturaDePuntajes,
  puntosDeEvaluaciones,
  rangoDe,
} from "../utils/graficos";

const hrefDeBloque = (id: string | number) => `${paths.ruta}?bloque=${id}`;
const hrefDeCurso = (id: string | number) => `${paths.ruta}?curso=${id}`;

/** Avance de cada bloque de la ruta: barra, porcentaje y estado escrito. */
export function AvancePorBloque({ bloques }: { bloques: BloqueRuta[] }) {
  const navigate = useNavigate();
  return (
    <BarrasHorizontales
      titulo="Avance por bloque"
      unidad="Porcentaje de lecciones completadas en cada bloque de la ruta"
      lectura={lecturaDeBloques(bloques)}
      datos={barrasDeBloques(bloques)}
      onElegir={(id) => navigate(hrefDeBloque(id))}
      hrefDe={hrefDeBloque}
    />
  );
}

/** Avance en cada curso en el que estoy inscrito (no aparece sin cursos). */
export function AvancePorCurso() {
  const navigate = useNavigate();
  const { data, isPending, error, refetch } = useMisCursos();
  if (isPending) return <Skeleton lineas={3} className="h-12 w-full" />;
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  if (data.length === 0) return null;
  return (
    <BarrasHorizontales
      titulo="Avance por curso"
      unidad="Porcentaje de lecciones completadas en la ruta de cada curso"
      lectura={lecturaDeCursos(data)}
      datos={barrasDeCursos(data)}
      onElegir={(id) => navigate(hrefDeCurso(id))}
      hrefDe={hrefDeCurso}
    />
  );
}

/** 7 · 28 · 90 días en la URL (?dias=). */
function SelectorDeRango({ rango }: { rango: number }) {
  const [, setParametros] = useSearchParams();
  return (
    <div role="group" aria-label="Rango de días" className="flex gap-1">
      {RANGOS_ACTIVIDAD.map((r) => (
        <button
          key={r}
          type="button"
          aria-pressed={rango === r}
          onClick={() =>
            setParametros(
              (previos) => {
                const nuevos = new URLSearchParams(previos);
                if (r === 28) nuevos.delete("dias");
                else nuevos.set("dias", String(r));
                return nuevos;
              },
              { replace: true },
            )
          }
          className={cn(
            "rounded-md px-3 py-1 font-mono text-sm transition-colors duration-rapida",
            rango === r
              ? "bg-surface text-paper ring-1 ring-linea-fuerte"
              : "text-muted hover:text-paper",
          )}
        >
          {r} días
        </button>
      ))}
    </div>
  );
}

/** Registros de avance por día, con selector de rango. */
export function Actividad() {
  const [parametros] = useSearchParams();
  const rango = rangoDe(parametros.get("dias"));
  const { data, isPending, error, refetch, noDisponible } = useActividad(rango);
  return (
    <div className="flex flex-col gap-3">
      <SelectorDeRango rango={rango} />
      {isPending && !error && <Skeleton className="h-56 w-full" />}
      {noDisponible && <EstadoVacio titulo="La actividad por día aún no está disponible." />}
      {error && !noDisponible && (
        <MensajeError mensaje={error.message} onReintentar={() => refetch()} />
      )}
      {data && (
        <BarrasPorDia
          titulo="Actividad"
          unidad={`Registros de avance por día, últimos ${rango} días`}
          lectura={lecturaDeActividad(data.dias_con_practica, rango)}
          datos={data.por_dia.map((d) => ({ fecha: d.fecha, valor: d.registros }))}
          hoy={data.por_dia.at(-1)?.fecha}
          etiquetaValor="registros"
        />
      )}
    </div>
  );
}

/** Mejor puntaje de cada evaluación presentada, con la línea de aprobación. */
export function Puntajes({ bloques }: { bloques: BloqueRuta[] }) {
  const puntos = puntosDeEvaluaciones(bloques);
  if (puntos.length === 0) return null;
  return (
    <PuntosConLinea
      titulo="Mejores puntajes"
      unidad="Mejor puntaje de cada evaluación, en porcentaje"
      lectura={lecturaDePuntajes(puntos)}
      datos={puntos}
      aprobacion={APROBACION}
    />
  );
}
