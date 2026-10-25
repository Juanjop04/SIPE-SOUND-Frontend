import { useCallback, useState } from "react";
import type { AccionUsuario } from "./components/MenuAcciones";
import type { Pendiente } from "./components/DialogosUsuarios";
import { usePermisoNombre, usePermisoNombreEnLote, useReactivar, useReenviarCodigo } from "./hooks";
import type { Usuario } from "./tipos";

/**
 * Qué hace cada opción del menú de una fila: abrir el detalle (URL), ejecutar al instante
 * (reenviar, reactivar, permiso) o abrir un diálogo (verificar, suspender, eliminar).
 */
export function useAccionesUsuarios(
  abrirDetalle: (id: string) => void,
  seleccion: ReadonlySet<string>,
  alTerminarLote: () => void,
) {
  const [pendiente, setPendiente] = useState<Pendiente | null>(null);
  const reenvio = useReenviarCodigo();
  const reactivar = useReactivar();
  const permiso = usePermisoNombre();
  const lote = usePermisoNombreEnLote();

  const cerrarDialogo = useCallback(() => setPendiente(null), []);

  function alAccion(accion: AccionUsuario, usuario: Usuario) {
    if (accion === "detalle") abrirDetalle(usuario.id);
    else if (accion === "reenviar") reenvio.reenviar(usuario);
    else if (accion === "reactivar") reactivar.mutate(usuario);
    else if (accion === "permitir") permiso.mutate({ usuario, permitir: true });
    else if (accion === "bloquear") permiso.mutate({ usuario, permitir: false });
    else setPendiente({ accion, usuario });
  }

  function cambiarEnLote(permitir: boolean) {
    lote.mutate({ ids: [...seleccion], permitir }, { onSuccess: alTerminarLote });
  }

  return {
    alAccion,
    cambiarEnLote,
    loteOcupado: lote.isPending,
    enviando: reenvio.enCurso,
    pendiente,
    cerrarDialogo,
  };
}
