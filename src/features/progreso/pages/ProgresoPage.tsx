import { Link } from "react-router-dom";
import { useHistoriales } from "@/features/evaluaciones";
import { useRuta, type BloqueRuta } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { TrasteDivider } from "@/shared/music";
import { EstadoVacio, MensajeError, Skeleton, claseBoton } from "@/shared/ui";
import { ActividadReciente } from "../components/ActividadReciente";
import { FranjaCifras } from "../components/FranjaCifras";
import {
  Actividad,
  AvancePorBloque,
  AvancePorCurso,
  Puntajes,
} from "../components/GraficosProgreso";
import { HistorialEvaluacion } from "../components/HistorialEvaluacion";
import { useResumenProgreso, type ResumenProgreso } from "../hooks/useResumenProgreso";
import {
  actividadReciente,
  avanceGlobal,
  bloquesConIntentos,
  cifrasDeProgreso,
} from "../utils/calculos";
import { sinAvances } from "../utils/graficos";

function Historial({ bloques }: { bloques: BloqueRuta[] }) {
  const conIntentos = bloquesConIntentos(bloques);
  const historiales = useHistoriales(conIntentos.map((b) => b.evaluacion_id));
  if (conIntentos.length === 0) {
    return (
      <EstadoVacio
        titulo="Aún no has presentado evaluaciones."
        descripcion="Cuando termines las lecciones del bloque 1, presenta su evaluación desde la ruta."
        accion={
          <Link
            to={paths.ruta}
            className="text-sm text-accent underline underline-offset-2 hover:decoration-2"
          >
            Ir a la ruta
          </Link>
        }
      />
    );
  }
  if (historiales.some((h) => h.isPending)) return <Skeleton lineas={4} className="h-11 w-full" />;
  const datos = historiales.map((h) => h.data);
  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="historial-intentos" className="flex flex-col gap-8">
        <h2 id="historial-intentos" className="font-display text-xl font-semibold text-paper">
          Tus evaluaciones
        </h2>
        {conIntentos.map((bloque, i) => (
          <HistorialEvaluacion key={bloque.id} bloque={bloque} intentos={datos[i] ?? []} />
        ))}
      </section>
      <ActividadReciente actividad={actividadReciente(conIntentos, datos)} />
    </div>
  );
}

/** Primer paso: sin ningún avance no se dibujan gráficos vacíos. */
function SinAvances() {
  return (
    <EstadoVacio
      titulo="Aún no hay avances."
      descripcion="Empieza por la lección 1: aquí verás tu avance por bloque, por curso y por día."
      accion={
        <Link to={paths.ruta} className={claseBoton()}>
          Ir a la ruta
        </Link>
      }
    />
  );
}

function Contenido({ resumen, bloques }: { resumen: ResumenProgreso; bloques: BloqueRuta[] }) {
  const cifras = cifrasDeProgreso(resumen, bloques.length);
  const vacio = sinAvances(bloques, resumen.lecciones.completadas, resumen.ejercicios.completados);
  return (
    <>
      <FranjaCifras cifras={cifras} avance={avanceGlobal(cifras)} />
      <TrasteDivider className="my-10" />
      {vacio ? (
        <SinAvances />
      ) : (
        <div className="flex flex-col gap-12">
          <div className="grid gap-12 lg:grid-cols-2">
            <AvancePorBloque bloques={bloques} />
            <AvancePorCurso />
          </div>
          <Actividad />
          <Puntajes bloques={bloques} />
          <TrasteDivider />
          <Historial bloques={bloques} />
        </div>
      )}
    </>
  );
}

export default function ProgresoPage() {
  const resumen = useResumenProgreso();
  const ruta = useRuta();
  const error = resumen.error ?? ruta.error;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-semibold text-paper">Mi progreso</h1>
      {(resumen.isPending || ruta.isPending) && !error && (
        <Skeleton lineas={4} className="h-10 w-full" />
      )}
      {error && (
        <MensajeError
          mensaje={error.message}
          onReintentar={() => {
            resumen.refetch();
            ruta.refetch();
          }}
        />
      )}
      {resumen.data && ruta.data && <Contenido resumen={resumen.data} bloques={ruta.data} />}
    </main>
  );
}
