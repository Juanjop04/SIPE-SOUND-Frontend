import { http } from "@/shared/api/httpClient.js";
import type { DetalleUsuario, FiltrosUsuarios, PaginaUsuarios } from "./tipos";

const RUTA = "/admin/usuarios";
export const POR_PAGINA = 20;

interface ConMensaje<T> {
  data: T;
  message: string;
}

/** Los filtros de la URL, con los nombres que espera el backend. */
function paramsDe(filtros: FiltrosUsuarios) {
  return {
    estado: filtros.estado,
    rol: filtros.rol,
    q: filtros.q,
    orden: filtros.orden,
    pagina: filtros.pagina,
    por_pagina: POR_PAGINA,
    puede_editar_nombre: filtros.permiso ? filtros.permiso === "si" : undefined,
  };
}

export const usuariosApi = {
  listar: (filtros: FiltrosUsuarios): Promise<PaginaUsuarios> =>
    http.getPaginado(RUTA, paramsDe(filtros)),
  detalle: (id: string): Promise<DetalleUsuario> => http.get(`${RUTA}/${id}`),
  /** Código nuevo; el resultado del envío se ve en `ultimo_envio_verificacion`. */
  reenviarCodigo: (id: string): Promise<ConMensaje<null>> =>
    http.conMensaje("POST", `${RUTA}/${id}/verificacion/reenviar`, {}),
  verificar: (datos: { id: string; motivo: string }): Promise<ConMensaje<null>> =>
    http.conMensaje("POST", `${RUTA}/${datos.id}/verificacion`, { motivo: datos.motivo }),
  suspender: (datos: { id: string; motivo: string }): Promise<ConMensaje<unknown>> =>
    http.conMensaje("PATCH", `${RUTA}/${datos.id}/estado`, {
      estado: "suspendida",
      motivo: datos.motivo,
    }),
  reactivar: (id: string): Promise<ConMensaje<unknown>> =>
    http.conMensaje("PATCH", `${RUTA}/${id}/estado`, { estado: "activa" }),
  permitirNombre: (datos: { id: string; permitir: boolean }): Promise<ConMensaje<unknown>> =>
    http.conMensaje("PATCH", `${RUTA}/${datos.id}/permisos`, {
      puede_editar_nombre: datos.permitir,
    }),
  permitirNombreEnLote: (datos: {
    ids: string[];
    permitir: boolean;
  }): Promise<ConMensaje<{ actualizados: number }>> =>
    http.conMensaje("POST", `${RUTA}/permisos`, {
      usuario_ids: datos.ids,
      puede_editar_nombre: datos.permitir,
    }),
  /** No se deshace: el backend exige el correo de la cuenta como confirmación. */
  eliminar: (datos: { id: string; correo: string }): Promise<ConMensaje<null>> =>
    http.conMensaje("DELETE", `${RUTA}/${datos.id}`, { confirmacion: datos.correo }),
};

export const usuariosKeys = {
  todo: ["admin", "usuarios"] as const,
  lista: (filtros: FiltrosUsuarios) => [...usuariosKeys.todo, "lista", filtros] as const,
  detalle: (id: string) => [...usuariosKeys.todo, "detalle", id] as const,
};
