import { Button, EstadoVacio, MensajeError, Paginacion, Skeleton } from "@/shared/ui";
import { useUsuarios } from "../hooks";
import type { FiltrosUsuarios, RolCuenta, Usuario } from "../tipos";
import type { AccionUsuario } from "./AccionesFila";
import { BarraLote } from "./BarraLote";
import { TablaUsuarios } from "./TablaUsuarios";

interface ListadoUsuariosProps {
  filtros: FiltrosUsuarios;
  hayFiltros: boolean;
  seleccion: ReadonlyMap<string, Usuario>;
  miId: string | undefined;
  editandoId: string | null;
  enviando: ReadonlySet<string>;
  loteOcupado: boolean;
  onAlternar: (usuario: Usuario) => void;
  onElegirPagina: (usuarios: Usuario[], marcar: boolean) => void;
  onAccion: (accion: AccionUsuario, usuario: Usuario) => void;
  onCambiarRol: (usuario: Usuario, rol: RolCuenta) => void;
  onRolEnLote: (rol: RolCuenta) => void;
  onActivarEnLote: () => void;
  onSuspenderEnLote: () => void;
  onReenviarEnLote: () => void;
  onLimpiarSeleccion: () => void;
  onPagina: (pagina: number) => void;
  onQuitarFiltros: () => void;
}

const FILAS_CARGANDO = 8;

/** La tabla con sus cuatro estados: carga, error, vacío y datos (contrato 03 §4). */
export function ListadoUsuarios({
  filtros,
  hayFiltros,
  seleccion,
  miId,
  editandoId,
  enviando,
  loteOcupado,
  onAlternar,
  onElegirPagina,
  onAccion,
  onCambiarRol,
  onRolEnLote,
  onActivarEnLote,
  onSuspenderEnLote,
  onReenviarEnLote,
  onLimpiarSeleccion,
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
        titulo="Ninguna cuenta coincide con la búsqueda."
        accion={
          hayFiltros ? (
            <Button variante="secundario" onClick={onQuitarFiltros}>
              Limpiar filtros
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <section
      aria-label="Lista de usuarios"
      className="overflow-hidden rounded-caja border border-linea bg-surface"
    >
      {seleccion.size > 0 && (
        <BarraLote
          cantidad={seleccion.size}
          ocupada={loteOcupado}
          onRol={onRolEnLote}
          onActivar={onActivarEnLote}
          onSuspender={onSuspenderEnLote}
          onReenviar={onReenviarEnLote}
          onLimpiar={onLimpiarSeleccion}
        />
      )}
      <TablaUsuarios
        usuarios={data.data}
        seleccion={seleccion}
        miId={miId}
        editandoId={editandoId}
        enviando={enviando}
        onAlternar={onAlternar}
        onElegirPagina={onElegirPagina}
        onAccion={onAccion}
        onCambiarRol={onCambiarRol}
      />
      <div className="border-t border-linea px-4 py-3">
        <Paginacion meta={data.meta} onPagina={onPagina} />
      </div>
    </section>
  );
}
