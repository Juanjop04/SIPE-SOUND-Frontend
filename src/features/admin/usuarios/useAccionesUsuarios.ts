import { useCallback, useState } from "react";
import { useAviso } from "@/shared/ui";
import type { AccionUsuario } from "./components/AccionesFila";
import type { Pendiente } from "./components/DialogosUsuarios";
import {
  useEnLote,
  usePermisoNombre,
  useReactivar,
  useReenviarCodigo,
  useVerificarManual,
} from "./hooks";
import type { RolCuenta, Usuario } from "./tipos";

/**
 * Qué hace cada acción de una fila o de la selección: abrir el panel (URL), ejecutar al instante
 * (reenviar, verificar, reactivar, permiso de nombre) o pedir confirmación (rol, suspender,
 * eliminar). Reactivar y los permisos no piden confirmación.
 */
export function useAccionesUsuarios(
  abrirDetalle: (id: string) => void,
  seleccion: ReadonlyMap<string, Usuario>,
  miId: string | undefined,
) {
  const [pendiente, setPendiente] = useState<Pendiente | null>(null);
  const { avisar } = useAviso();
  const reenvio = useReenviarCodigo();
  const verificar = useVerificarManual();
  const reactivar = useReactivar();
  const permiso = usePermisoNombre();
  const lote = useEnLote();

  const cerrarDialogo = useCallback(() => setPendiente(null), []);

  function alAccion(accion: AccionUsuario, usuario: Usuario) {
    if (accion === "detalle") abrirDetalle(usuario.id);
    else if (accion === "reenviar") reenvio.reenviar(usuario);
    else if (accion === "verificar") verificar.mutate(usuario);
    else if (accion === "reactivar") reactivar.mutate(usuario);
    else if (accion === "permitir") permiso.mutate({ usuario, permitir: true });
    else if (accion === "bloquear") permiso.mutate({ usuario, permitir: false });
    else if (accion === "suspender") setPendiente({ accion, usuarios: [usuario] });
    else setPendiente({ accion: "eliminar", usuario });
  }

  /** El selector de rol de una fila (o del panel): siempre pasa por el diálogo. */
  function alCambiarRol(usuario: Usuario, rol: RolCuenta) {
    if (usuario.id === miId || usuario.rol === rol) return;
    setPendiente({ accion: "rol", usuarios: [usuario], rol });
  }

  // La propia cuenta nunca entra en una acción en lote.
  const ajenas = [...seleccion.values()].filter((u) => u.id !== miId);

  function rolEnLote(rol: RolCuenta) {
    const cambian = ajenas.filter((u) => u.rol !== rol);
    if (cambian.length === 0) avisar({ mensaje: "Ninguna cuenta cambia de rol" });
    else setPendiente({ accion: "rol", usuarios: cambian, rol });
  }

  function suspenderEnLote() {
    const activas = ajenas.filter((u) => u.estado !== "suspendida");
    if (activas.length === 0) avisar({ mensaje: "Las cuentas elegidas ya están suspendidas" });
    else setPendiente({ accion: "suspender", usuarios: activas });
  }

  function activarEnLote(alTerminar: () => void) {
    const ids = ajenas.filter((u) => u.estado === "suspendida").map((u) => u.id);
    if (ids.length === 0) avisar({ mensaje: "Las cuentas elegidas ya están activas" });
    else lote.mutate({ ids, accion: "activar" }, { onSuccess: alTerminar });
  }

  function reenviarEnLote(alTerminar: () => void) {
    const ids = ajenas.filter((u) => u.estado === "pendiente_verificacion").map((u) => u.id);
    if (ids.length === 0) avisar({ mensaje: "Ninguna de las cuentas elegidas está pendiente" });
    else lote.mutate({ ids, accion: "reenviar" }, { onSuccess: alTerminar });
  }

  return {
    alAccion,
    alCambiarRol,
    rolEnLote,
    suspenderEnLote,
    activarEnLote,
    reenviarEnLote,
    loteOcupado: lote.isPending,
    enviando: reenvio.enCurso,
    pendiente,
    setPendiente,
    cerrarDialogo,
  };
}
