import { Link } from "react-router-dom";
import { useHistoriales } from "@/features/evaluaciones";
import { useRuta, type BloqueRuta } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { TrasteDivider } from "@/shared/music";
import { EstadoVacio, MensajeError, Skeleton } from "@/shared/ui";
import { ActividadReciente } from "../components/ActividadReciente";
import { FranjaCifras } from "../components/FranjaCifras";
import { HistorialEvaluacion } from "../components/HistorialEvaluacion";
import { useResumenProgreso, type ResumenProgreso } from "../hooks/useResumenProgreso";
import {
  actividadReciente,
  avanceGlobal,
  bloquesConIntentos,
  cifrasDeProgreso,
} from "../utils/calculos";

function Historial({ bloques }: { bloques: BloqueRuta[] }) {
  const conIntentos = bloquesConIntentos(bloques);
  const historiales = useHistoriales(conIntentos.map((b) => b.evaluacion_id));
  if (conIntentos.length === 0) {
    return (
      <EstadoVacio
        titulo="Aún no has presentado evaluaciones."
        descripcion="Cuando termines las lecciones del bloque 1, presenta su evaluación desde la ruta."
        accion={
          <Link to={paths.ruta} className="text-sm text-accent hover:underline">
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

function Contenido({ resumen, bloques }: { resumen: ResumenProgreso; bloques: BloqueRuta[] }) {
  const cifras = cifrasDeProgreso(resumen, bloques.length);
  return (
    <>
      <FranjaCifras cifras={cifras} avance={avanceGlobal(cifras)} />
      <TrasteDivider className="my-10" />
      <Historial bloques={bloques} />
    </>
  );
}

export default function ProgresoPage() {
  const resumen = useResumenProgreso();
  const ruta = useRuta();
  const error = resumen.error ?? ruta.error;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
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
