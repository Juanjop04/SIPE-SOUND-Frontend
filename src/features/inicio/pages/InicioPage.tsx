import { usePerfil } from "@/features/auth";
import {
  avanceGlobal,
  cifrasDeProgreso,
  useActividad,
  useResumenProgreso,
} from "@/features/progreso";
import { useRuta } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { MensajeError, Skeleton } from "@/shared/ui";
import { BloquesRuta } from "../components/BloquesRuta";
import { CifrasInicio } from "../components/CifrasInicio";
import { ContinuarAprendiendo } from "../components/ContinuarAprendiendo";
import { EncabezadoInicio } from "../components/EncabezadoInicio";
import { PanelInicio } from "../components/PanelInicio";
import { ProgresoPorBloque } from "../components/ProgresoPorBloque";
import { UltimaActividad } from "../components/UltimaActividad";
import { fraseDeInicio, primerNombre, siguientePaso } from "../utils/siguientePaso";

/** Inicio del estudiante (HU-F-315): solo datos reales; cada sección carga y falla por separado. */
export default function InicioPage() {
  const { perfil } = usePerfil();
  const ruta = useRuta();
  const resumen = useResumenProgreso();
  const actividad = useActividad();

  const bloques = ruta.data;
  const paso = bloques ? siguientePaso(bloques) : null;
  const sinAvance = resumen.data
    ? resumen.data.lecciones.completadas + resumen.data.ejercicios.completados === 0
    : false;
  const avance =
    bloques && resumen.data ? avanceGlobal(cifrasDeProgreso(resumen.data, bloques.length)) : null;
  const estadoRuta = {
    cargando: ruta.isPending,
    error: ruta.error,
    onReintentar: () => ruta.refetch(),
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <EncabezadoInicio
        nombre={primerNombre(perfil?.nombre)}
        nivel={perfil?.nivel ?? null}
        frase={paso ? fraseDeInicio(paso, sinAvance) : null}
        avance={avance}
      />

      {resumen.isPending && <Skeleton className="h-28 w-full" />}
      {resumen.error && (
        <MensajeError mensaje={resumen.error.message} onReintentar={() => resumen.refetch()} />
      )}
      {resumen.data && (
        <CifrasInicio
          resumen={resumen.data}
          totalBloques={bloques ? bloques.length : null}
          actividad={actividad.data ?? null}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <PanelInicio titulo="Continuar aprendiendo" className="lg:col-span-7" {...estadoRuta}>
          {paso && <ContinuarAprendiendo paso={paso} />}
        </PanelInicio>
        <PanelInicio titulo="Tu progreso por bloques" className="lg:col-span-5" {...estadoRuta}>
          {bloques && <ProgresoPorBloque bloques={bloques} />}
        </PanelInicio>
        <PanelInicio
          titulo="Bloques de la ruta"
          enlace={{ a: paths.ruta, texto: "Ver la ruta" }}
          className="lg:col-span-7"
          {...estadoRuta}
        >
          {bloques && <BloquesRuta bloques={bloques} />}
        </PanelInicio>
        <PanelInicio
          titulo="Actividad reciente"
          enlace={{ a: paths.progreso, texto: "Ver mi progreso" }}
          className="lg:col-span-5"
          cargando={actividad.isPending}
          error={actividad.noDisponible ? null : actividad.error}
          onReintentar={() => actividad.refetch()}
        >
          {actividad.data && <UltimaActividad eventos={actividad.data.recientes} />}
          {actividad.noDisponible && (
            <p className="text-sm text-muted">
              Tu actividad aparecerá aquí cuando el servidor se actualice.
            </p>
          )}
        </PanelInicio>
      </div>
    </main>
  );
}
