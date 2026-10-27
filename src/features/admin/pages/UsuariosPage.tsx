import { useCallback, useState } from "react";
import { usePerfil } from "@/features/auth";
import { AccionesCursosDeUsuario } from "../cursos/components/AccionesCursosDeUsuario";
import { nombreCompleto } from "../usuarios/utils";
import type { AccionUsuario } from "../usuarios/components/AccionesFila";
import { DetalleUsuario } from "../usuarios/components/DetalleUsuario";
import { DialogosUsuarios } from "../usuarios/components/DialogosUsuarios";
import { FiltrosUsuarios } from "../usuarios/components/FiltrosUsuarios";
import { FranjaCifras } from "../usuarios/components/FranjaCifras";
import { ListadoUsuarios } from "../usuarios/components/ListadoUsuarios";
import { useUsuarios } from "../usuarios/hooks";
import type { DetalleUsuario as Detalle } from "../usuarios/tipos";
import { useAccionesUsuarios } from "../usuarios/useAccionesUsuarios";
import { useGuardarCuenta } from "../usuarios/useGuardarCuenta";
import { useFiltrosUsuarios } from "../usuarios/useFiltrosUsuarios";
import { useSeleccion } from "../usuarios/useSeleccion";

/** Cuentas de usuario (solo admin, HU-F-404 y rediseño HU-F-521). */
export default function UsuariosPage() {
  const {
    filtros,
    usuarioId,
    cambiar,
    hayFiltros,
    quitarFiltros: limpiarUrl,
  } = useFiltrosUsuarios();
  const { perfil } = usePerfil();
  const miId: string | undefined = perfil?.id;
  // Remontar los filtros vacía el buscador cuando "Quitar filtros" cambia la URL.
  const [reinicio, setReinicio] = useState(0);
  const quitarFiltros = useCallback(() => {
    limpiarUrl();
    setReinicio((n) => n + 1);
  }, [limpiarUrl]);
  const meta = useUsuarios(filtros).data?.meta;
  const total = meta
    ? meta.totales.activa + meta.totales.pendiente_verificacion + meta.totales.suspendida
    : null;
  const { seleccion, alternar, elegirPagina, limpiar } = useSeleccion();
  const acciones = useAccionesUsuarios((id) => cambiar({ usuario: id }), seleccion, miId);
  const cerrarDetalle = useCallback(() => cambiar({ usuario: null }), [cambiar]);

  const { guardar, guardando } = useGuardarCuenta(miId, acciones.setPendiente, cerrarDetalle);

  function desdePanel(accion: AccionUsuario, u: Detalle) {
    // Eliminar cierra el panel: el diálogo es lo único que queda a la vista.
    if (accion === "eliminar") cerrarDetalle();
    acciones.alAccion(accion, u);
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-display text-3xl font-semibold text-paper">
          Usuarios{" "}
          {total !== null && (
            <span className="font-mono text-lg font-normal text-muted">{total}</span>
          )}
        </h1>
        <p className="max-w-prose text-sm text-muted">
          Edita los datos de cada cuenta, asigna su rol y controla su acceso.
        </p>
      </header>
      <FranjaCifras
        totales={meta?.totales}
        seleccionado={filtros.estado}
        onElegir={(estado) => cambiar({ estado })}
      />
      <FiltrosUsuarios
        key={reinicio}
        filtros={filtros}
        roles={meta?.roles}
        hayFiltros={hayFiltros}
        onCambiar={cambiar}
        onQuitar={quitarFiltros}
      />
      <ListadoUsuarios
        filtros={filtros}
        hayFiltros={hayFiltros}
        seleccion={seleccion}
        miId={miId}
        editandoId={usuarioId}
        enviando={acciones.enviando}
        loteOcupado={acciones.loteOcupado}
        onAlternar={alternar}
        onElegirPagina={elegirPagina}
        onAccion={acciones.alAccion}
        onCambiarRol={acciones.alCambiarRol}
        onRolEnLote={acciones.rolEnLote}
        onActivarEnLote={() => acciones.activarEnLote(limpiar)}
        onSuspenderEnLote={acciones.suspenderEnLote}
        onReenviarEnLote={() => acciones.reenviarEnLote(limpiar)}
        onLimpiarSeleccion={limpiar}
        onPagina={(pagina) => cambiar({ pagina: String(pagina) })}
        onQuitarFiltros={quitarFiltros}
      />
      <DetalleUsuario
        usuarioId={usuarioId}
        miId={miId}
        guardando={guardando}
        onCerrar={cerrarDetalle}
        onGuardar={guardar}
        onAccion={desdePanel}
        accionesCursos={(cuenta) => (
          <AccionesCursosDeUsuario
            usuario={{
              id: cuenta.id,
              nombre: nombreCompleto(cuenta),
              rol: cuenta.rol,
              inscripciones: cuenta.inscripciones.length,
            }}
          />
        )}
      />
      <DialogosUsuarios
        pendiente={acciones.pendiente}
        onCerrar={acciones.cerrarDialogo}
        onTerminarLote={limpiar}
        onEliminada={(u) => {
          if (seleccion.has(u.id)) alternar(u);
        }}
      />
    </main>
  );
}
