import { useBusquedaDiferida } from "@/shared/hooks/useBusquedaDiferida";
import {
  Button,
  EstadoVacio,
  Field,
  Input,
  MensajeError,
  Paginacion,
  Select,
  Skeleton,
} from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { ORDENES, descargar, useCurso } from "../externos";
import { useMatriz } from "../hooks";
import type { CursoProgreso, FiltrosProgreso } from "../tipos";
import { matrizACsv } from "../utils";
import { MatrizProgreso } from "./MatrizProgreso";

interface SeccionMatrizProps {
  curso: CursoProgreso;
  filtros: FiltrosProgreso;
  onCambiar: (cambios: Record<string, string | null>) => void;
  onVer: (estudianteId: string) => void;
}

/** Curso sin estudiantes: el siguiente paso concreto es compartir el código. */
function SinEstudiantes({ cursoId }: { cursoId: number }) {
  const { data } = useCurso(cursoId);
  return (
    <EstadoVacio
      titulo="Aún no tienes estudiantes en este curso."
      descripcion={
        data
          ? `Comparte el código ${data.codigo_invitacion} con tu grupo.`
          : "Comparte el código del curso con tu grupo."
      }
    />
  );
}

function Controles({
  filtros,
  onCambiar,
  onExportar,
  puedeExportar,
}: {
  filtros: FiltrosProgreso;
  onCambiar: SeccionMatrizProps["onCambiar"];
  onExportar: () => void;
  puedeExportar: boolean;
}) {
  const [texto, setTexto] = useBusquedaDiferida(filtros.q, (q) => onCambiar({ q }));
  return (
    <div className="grid gap-3 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
      <Field etiqueta="Buscar estudiante">
        {(campo) => (
          <Input
            {...campo}
            type="search"
            value={texto}
            maxLength={LIMITES.busqueda.max}
            autoComplete="off"
            onChange={(e) => setTexto(e.target.value)}
          />
        )}
      </Field>
      <Field etiqueta="Ordenar por">
        {(campo) => (
          <Select
            {...campo}
            value={filtros.orden}
            onChange={(e) => onCambiar({ orden: e.target.value })}
          >
            {ORDENES.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.etiqueta}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Button variante="secundario" disabled={!puedeExportar} onClick={onExportar}>
        Exportar CSV
      </Button>
    </div>
  );
}

/** Matriz de un curso con búsqueda, orden y exportación (la vista visible, sin correos). */
export function SeccionMatriz({ curso, filtros, onCambiar, onVer }: SeccionMatrizProps) {
  const { data, isPending, error, refetch } = useMatriz(filtros);
  if (curso.estudiantes === 0) return <SinEstudiantes cursoId={curso.id} />;

  return (
    <div className="flex flex-col gap-4">
      <Controles
        filtros={filtros}
        onCambiar={onCambiar}
        puedeExportar={Boolean(data && data.data.length > 0)}
        onExportar={() =>
          data &&
          descargar(`progreso-${curso.nombre}.csv`, matrizACsv(data.data, data.meta.bloques))
        }
      />
      {isPending && (
        <div aria-busy="true">
          <Skeleton lineas={6} className="h-10 w-full" />
        </div>
      )}
      {error && !data && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.data.length === 0 && (
        <EstadoVacio titulo="No hay estudiantes con esa búsqueda." />
      )}
      {data && data.data.length > 0 && (
        <>
          <MatrizProgreso
            filas={data.data}
            columnas={data.meta.bloques}
            bloques={curso.bloques}
            estudiantesDelCurso={curso.estudiantes}
            onVer={onVer}
          />
          <Paginacion meta={data.meta} onPagina={(p) => onCambiar({ pagina: String(p) })} />
        </>
      )}
    </div>
  );
}
