import { useCallback, useState } from "react";
import { TrasteDivider } from "@/shared/music";
import { BarraLote } from "../usuarios/components/BarraLote";
import { DetalleUsuario } from "../usuarios/components/DetalleUsuario";
import { DialogosUsuarios } from "../usuarios/components/DialogosUsuarios";
import { FiltrosUsuarios } from "../usuarios/components/FiltrosUsuarios";
import { FranjaCifras } from "../usuarios/components/FranjaCifras";
import { ListadoUsuarios } from "../usuarios/components/ListadoUsuarios";
import { useUsuarios } from "../usuarios/hooks";
import { useAccionesUsuarios } from "../usuarios/useAccionesUsuarios";
import { useFiltrosUsuarios } from "../usuarios/useFiltrosUsuarios";
import { useSeleccion } from "../usuarios/useSeleccion";

/** Cuentas de usuario (solo admin, HU-F-404 / HU-B-405 y HU-B-407). */
export default function UsuariosPage() {
  const {
    filtros,
    usuarioId,
    cambiar,
    hayFiltros,
    quitarFiltros: limpiarUrl,
  } = useFiltrosUsuarios();
  // Remontar los filtros vacía el buscador cuando "Quitar filtros" cambia la URL.
  const [reinicio, setReinicio] = useState(0);
  const quitarFiltros = useCallback(() => {
    limpiarUrl();
    setReinicio((n) => n + 1);
  }, [limpiarUrl]);
  const totales = useUsuarios(filtros).data?.meta.totales;
  const { seleccion, alternar, elegirPagina, limpiar } = useSeleccion();
  const acciones = useAccionesUsuarios((id) => cambiar({ usuario: id }), seleccion, limpiar);
  const cerrarDetalle = useCallback(() => cambiar({ usuario: null }), [cambiar]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-paper">Usuarios</h1>
      <p className="mt-2 max-w-prose text-sm text-muted">
        Quién tiene cuenta, en qué estado está y qué puede hacer: reenviar el código, verificar,
        suspender, eliminar y permitir el cambio de nombre.
      </p>
      <div className="mt-6">
        <FranjaCifras
          totales={totales}
          seleccionado={filtros.estado}
          onElegir={(estado) => cambiar({ estado })}
        />
      </div>
      <TrasteDivider className="my-6" />
      <div className="flex flex-col gap-6">
        <FiltrosUsuarios
          key={reinicio}
          filtros={filtros}
          hayFiltros={hayFiltros}
          onCambiar={cambiar}
          onQuitar={quitarFiltros}
        />
        <ListadoUsuarios
          filtros={filtros}
          hayFiltros={hayFiltros}
          seleccion={seleccion}
          enviando={acciones.enviando}
          onAlternar={alternar}
          onElegirPagina={elegirPagina}
          onAccion={acciones.alAccion}
          onPagina={(pagina) => cambiar({ pagina: String(pagina) })}
          onQuitarFiltros={quitarFiltros}
        />
      </div>
      {seleccion.size > 0 && (
        <BarraLote
          cantidad={seleccion.size}
          ocupada={acciones.loteOcupado}
          onPermitir={() => acciones.cambiarEnLote(true)}
          onBloquear={() => acciones.cambiarEnLote(false)}
          onLimpiar={limpiar}
        />
      )}
      <DetalleUsuario usuarioId={usuarioId} onCerrar={cerrarDetalle} />
      <DialogosUsuarios pendiente={acciones.pendiente} onCerrar={acciones.cerrarDialogo} />
    </main>
  );
}
