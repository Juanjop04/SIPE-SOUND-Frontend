import { Button, EstadoVacio, MensajeError, Paginacion, Skeleton } from "@/shared/ui";
import { useUsuarios } from "../hooks";
import type { FiltrosUsuarios, Usuario } from "../tipos";
import type { AccionUsuario } from "./AccionesFila";
import { TablaUsuarios } from "./TablaUsuarios";

interface ListadoUsuariosProps {
  filtros: FiltrosUsuarios;
  hayFiltros: boolean;
  seleccion: ReadonlySet<string>;
  enviando: ReadonlySet<string>;
  onAlternar: (id: string) => void;
  onElegirPagina: (ids: string[], marcar: boolean) => void;
  onAccion: (accion: AccionUsuario, usuario: Usuario) => void;
  onPagina: (pagina: number) => void;
  onQuitarFiltros: () => void;
}

const FILAS_CARGANDO = 8;

/** La tabla con sus cuatro estados: carga, error, vacío y datos (contrato 03 §4). */
export function ListadoUsuarios({
  filtros,
  hayFiltros,
  seleccion,
  enviando,
  onAlternar,
  onElegirPagina,
  onAccion,
  onPagina,
  onQuitarFiltros,
}: ListadoUsuariosProps) {
  const { data, isPending, error, refetch } = useUsuarios(filtros);

  if (isPending) {
    return (
      <div aria-busy="true">
        <Skeleton lineas={FILAS_CARGANDO} className="h-11 w-full" />
      </div>
    );
  }
  if (error && !data)
    return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  if (!data || data.data.length === 0) {
    return (
      <EstadoVacio
        titulo="No hay cuentas con estos filtros."
        accion={
          hayFiltros ? (
            <Button variante="secundario" onClick={onQuitarFiltros}>
              Quitar filtros
            </Button>
          ) : undefined
        }
      />
    );
  }

  const ids = data.data.map((u) => u.id);
  const todas = ids.every((id) => seleccion.has(id));
  return (
    <div className="flex flex-col gap-3">
      <label className="flex w-fit items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={todas}
          onChange={() => onElegirPagina(ids, !todas)}
          className="h-4 w-4 accent-primary"
        />
        Elegir las {ids.length} cuentas de esta página
      </label>
      <TablaUsuarios
        usuarios={data.data}
        seleccion={seleccion}
        enviando={enviando}
        onAlternar={onAlternar}
        onAccion={onAccion}
      />
      <Paginacion meta={data.meta} onPagina={onPagina} />
    </div>
  );
}
