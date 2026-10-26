import { paths } from "@/shared/config/paths.js";
import { EstadoVacio, Skeleton } from "@/shared/ui";
import {
  BarraApilada,
  BarrasAgrupadas,
  BarrasHorizontales,
  BarrasPorDia,
} from "@/shared/ui/graficos";
import type { CursoProgreso, FiltrosSeries, SeriesProgreso } from "../tipos";
import {
  aprobacionPorBloque,
  categoriasDeEvaluaciones,
  estadoDeAprobacion,
  lecturaActividad,
  lecturaAprobacion,
  lecturaDistribucion,
  lecturaEstados,
  totalEstudiantes,
} from "../utils";

interface GraficosProgresoProps {
  series: SeriesProgreso;
  /** Curso elegido: sin él no hay una sola ruta de bloques que comparar. */
  curso: CursoProgreso | null;
  filtros: FiltrosSeries;
  onBloque: (bloqueId: number) => void;
}

/** Esqueletos con el alto de las gráficas, para que la página no salte al llegar los datos. */
export function EsqueletoGraficos() {
  return (
    <div aria-busy="true" className="grid gap-x-10 gap-y-12 lg:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} lineas={5} className="h-10 w-full" />
      ))}
    </div>
  );
}

function AprobacionPorBloque({
  curso,
  onBloque,
  filtros,
}: Pick<GraficosProgresoProps, "curso" | "onBloque" | "filtros">) {
  if (!curso) {
    return (
      <p className="text-sm text-muted">Elige un curso para ver la aprobación de cada bloque.</p>
    );
  }
  const filas = aprobacionPorBloque(curso);
  return (
    <BarrasHorizontales
      titulo="Aprobación por bloque"
      unidad="Porcentaje de estudiantes del curso que aprobaron cada bloque"
      lectura={lecturaAprobacion(curso)}
      etiquetaValor="Aprobaron (%)"
      textos={{ sin_iniciar: "Nadie aún", en_curso: "Parcial", aprobado: "Todos" }}
      datos={filas.map((f) => ({
        id: f.id,
        nombre: f.nombre,
        valor: f.valor,
        estado: estadoDeAprobacion(f.valor),
      }))}
      onElegir={(id) => onBloque(Number(id))}
      // Enlace de la tabla alternativa: el mismo filtro de bloque, alcanzable con teclado.
      hrefDe={(id) =>
        `${paths.docente.progreso}?curso=${curso.id}&bloque=${id}&dias=${filtros.dias}`
      }
    />
  );
}

/** Las cinco gráficas del panel (HU-F-506), cada una con título, unidad, lectura y tabla. */
export function GraficosProgreso({ series, curso, filtros, onBloque }: GraficosProgresoProps) {
  if (totalEstudiantes(series) === 0) {
    return (
      <EstadoVacio
        titulo="No hay estudiantes con estos filtros."
        descripcion="Cambia el curso, el bloque o el grupo para ver sus gráficas."
      />
    );
  }
  const hoy = series.actividad_por_dia.at(-1)?.fecha;
  const evaluaciones = categoriasDeEvaluaciones(series.evaluaciones, totalEstudiantes(series));
  const { estados } = series;
  return (
    <div className="grid gap-x-10 gap-y-12 lg:grid-cols-2">
      <BarraApilada
        titulo="Estados del grupo"
        unidad="Inscripciones por estado de avance"
        lectura={lecturaEstados(series)}
        tramos={[
          { estado: "sin_iniciar", cantidad: estados.sin_iniciar },
          { estado: "en_curso", cantidad: estados.en_curso },
          { estado: "finalizado", cantidad: estados.finalizado },
        ]}
      />
      <BarrasAgrupadas
        titulo="Distribución del avance"
        unidad="Estudiantes por tramo de avance (%)"
        lectura={lecturaDistribucion(series)}
        etiquetaCategoria="Tramo de avance"
        series={[{ clave: "estudiantes", nombre: "Estudiantes", color: "primary-claro" }]}
        categorias={series.distribucion_avance.map((t) => ({
          id: t.desde,
          nombre: `${t.desde}–${t.hasta} %`,
          valores: { estudiantes: t.estudiantes },
        }))}
      />
      <BarrasPorDia
        titulo="Actividad"
        unidad={`Estudiantes activos por día, últimos ${filtros.dias} días`}
        lectura={lecturaActividad(series)}
        etiquetaValor="estudiantes activos"
        hoy={hoy}
        datos={series.actividad_por_dia.map((d) => ({
          fecha: d.fecha,
          valor: d.estudiantes_activos,
        }))}
      />
      <AprobacionPorBloque curso={curso} onBloque={onBloque} filtros={filtros} />
      <div className="lg:col-span-2">
        {evaluaciones.length === 0 ? (
          <p className="text-sm text-muted">Aún nadie presenta una evaluación con estos filtros.</p>
        ) : (
          <BarrasAgrupadas
            titulo="Evaluaciones"
            unidad="Promedio de puntaje y aprobación por evaluación (%)"
            etiquetaCategoria="Evaluación"
            sufijo=" %"
            maximo={100}
            series={[
              { clave: "promedio", nombre: "Promedio de puntaje", color: "primary-claro" },
              { clave: "aprobacion", nombre: "Estudiantes que aprobaron", color: "accent" },
            ]}
            categorias={evaluaciones}
          />
        )}
      </div>
    </div>
  );
}
