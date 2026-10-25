import { useSearchParams } from "react-router-dom";
import { SelectorRuta, useRutaDeCurso } from "@/features/cursos";
import { useSession } from "@/features/auth";
import { ESCRITORIO, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { EstadoVacio, MensajeError } from "@/shared/ui";
import { DetalleBloque } from "../components/DetalleBloque";
import { EsqueletoRuta } from "../components/EsqueletoRuta";
import { Mastil } from "../components/Mastil";
import { useRuta } from "../hooks/useRuta";
import type { BloqueRuta } from "../types";
import { bloqueInicial } from "../utils/presentacion";

const PARAMETRO = "bloque";

/** ?bloque=<id> si existe en la ruta; si no, el primer bloque disponible. */
function bloqueSeleccionado(bloques: BloqueRuta[], valor: string | null): BloqueRuta | undefined {
  return bloques.find((b) => String(b.id) === valor) ?? bloqueInicial(bloques);
}

function Ruta({ bloques }: { bloques: BloqueRuta[] }) {
  const { usuario } = useSession();
  const esEscritorio = useMediaQuery(ESCRITORIO);
  const [parametros, setParametros] = useSearchParams();
  const seleccionado = bloqueSeleccionado(bloques, parametros.get(PARAMETRO));
  if (!seleccionado) return null;
  const indice = bloques.indexOf(seleccionado);

  function seleccionar(id: number) {
    setParametros({ [PARAMETRO]: String(id) }, { replace: true });
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
      {/* Móvil: la tira del mástil queda fija bajo la barra superior. */}
      <nav
        aria-label="Mástil de la ruta"
        data-fijo="arriba"
        className="sticky top-0 z-20 -mx-4 border-b border-linea bg-ink px-4 pt-3 lg:static lg:col-span-4 lg:mx-0 lg:border-0 lg:p-0"
      >
        <Mastil
          bloques={bloques}
          seleccionadoId={seleccionado.id}
          onSeleccionar={seleccionar}
          horizontal={!esEscritorio}
        />
      </nav>
      <div className="mt-8 lg:col-span-8 lg:mt-0">
        <DetalleBloque
          bloque={seleccionado}
          anterior={bloques[indice - 1]}
          conSesion={Boolean(usuario)}
        />
      </div>
    </div>
  );
}

export default function RutaPage() {
  const { cursoId, cursos, elegir } = useRutaDeCurso();
  const {
    data: bloques,
    isPending,
    error,
    refetch,
  } = useRuta(cursoId ? { curso_id: cursoId } : undefined);

  function contenido() {
    if (isPending) return <EsqueletoRuta />;
    if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
    if (bloques.length === 0) {
      return (
        <EstadoVacio
          titulo="Aún no hay bloques publicados."
          descripcion="Cuando tu docente publique el primer bloque, aquí verás tu ruta."
        />
      );
    }
    return <Ruta bloques={bloques} />;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <h1 className="sr-only">Ruta de aprendizaje</h1>
      <div className="mb-6 flex justify-end">
        <SelectorRuta cursoId={cursoId} cursos={cursos} onElegir={elegir} />
      </div>
      {contenido()}
    </main>
  );
}
