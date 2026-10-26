import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";
import {
  Button,
  ENLACE_EN_TEXTO,
  EncabezadoPagina,
  EstadoVacio,
  MensajeError,
  Skeleton,
} from "@/shared/ui";
import { BarraDeFiltros } from "../components/BarraDeFiltros";
import { PestanasDeAvance } from "../components/PestanasDeAvance";
import { TarjetaEjercicio } from "../components/TarjetaEjercicio";
import { useEjercicios } from "../hooks/useEjercicios";
import { useFiltrosEjercicios } from "../hooks/useFiltrosEjercicios";
import {
  acordesDisponibles,
  contarPorEstado,
  estadoDelEjercicio,
  filtrarYOrdenar,
  hayFiltros,
  sinFiltroDeEstado,
  soloPorEstado,
  type FiltrosEjercicios,
} from "../utils/tarjetas";

function SinResultados({
  filtros,
  onQuitar,
}: {
  filtros: FiltrosEjercicios;
  onQuitar: () => void;
}) {
  const conFiltros = hayFiltros(filtros);
  const soloEnCurso = filtros.estado === "en_curso" && soloPorEstado(filtros);
  return (
    <EstadoVacio
      titulo={soloEnCurso ? "No hay ejercicios en curso." : "No hay ejercicios con estos filtros."}
      descripcion={
        conFiltros ? "Prueba con «Todos» o quita los filtros." : "Aún no hay ejercicios."
      }
      accion={
        conFiltros ? (
          <Button variante="secundario" onClick={onQuitar}>
            Quitar filtros
          </Button>
        ) : undefined
      }
    />
  );
}

/** Ejercicios en tarjetas con filtro por estado de avance (HU-F-503). */
export default function EjerciciosPage() {
  const { usuario } = useSession();
  const { filtros, cambiar, quitar: quitarDeLaUrl } = useFiltrosEjercicios();
  // Remontar la barra vacía el buscador cuando "Quitar filtros" cambia la URL.
  const [reinicio, setReinicio] = useState(0);
  const quitar = useCallback(() => {
    quitarDeLaUrl();
    setReinicio((n) => n + 1);
  }, [quitarDeLaUrl]);
  const { data, isPending, error, refetch } = useEjercicios();
  const conFiltros = hayFiltros(filtros);
  const visibles = data ? filtrarYOrdenar(data, filtros) : [];
  const conteo = contarPorEstado(data ? sinFiltroDeEstado(data, filtros) : []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <EncabezadoPagina
        titulo="Ejercicios"
        descripcion="Rutinas para practicar a tempo, paso a paso."
        foto="practica-ritmo"
      >
        {usuario ? (
          <PestanasDeAvance
            actual={filtros.estado}
            conteo={conteo}
            onElegir={(estado) => cambiar({ estado: estado === "todos" ? null : estado })}
          />
        ) : (
          <p className="text-sm text-muted">
            <Link to={paths.login} className={ENLACE_EN_TEXTO}>
              Inicia sesión
            </Link>{" "}
            para guardar tu avance y filtrar por estado.
          </p>
        )}
      </EncabezadoPagina>

      <div className="mt-6">
        <BarraDeFiltros
          key={reinicio}
          filtros={filtros}
          acordes={acordesDisponibles(data ?? [])}
          conSesion={Boolean(usuario)}
          hayFiltros={conFiltros}
          onCambiar={cambiar}
          onQuitar={quitar}
        />
      </div>

      <div className="mt-8" aria-live="polite">
        {isPending && <Skeleton lineas={4} className="h-40 w-full" />}
        {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
        {data && visibles.length === 0 && <SinResultados filtros={filtros} onQuitar={quitar} />}
        {visibles.length > 0 && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibles.map((e) => (
              <TarjetaEjercicio
                key={e.id}
                ejercicio={e}
                destacado={filtros.orden === "recomendado" && estadoDelEjercicio(e) === "en_curso"}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
