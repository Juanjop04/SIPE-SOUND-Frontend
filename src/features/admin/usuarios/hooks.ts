import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAviso } from "@/shared/ui";
import { usuariosApi, usuariosKeys } from "./api";
import type { AccionEnLote, FiltrosUsuarios, RolCuenta, Usuario } from "./tipos";
import { ETIQUETA_ROL, nombreCompleto } from "./utils";

/** El envío del código es asíncrono: se vuelve a preguntar por su resultado a los 5 s. */
const ESPERA_RESULTADO_MS = 5000;

export function useUsuarios(filtros: FiltrosUsuarios) {
  return useQuery({
    queryKey: usuariosKeys.lista(filtros),
    queryFn: () => usuariosApi.listar(filtros),
    // Al cambiar de filtro o de página la tabla anterior sigue visible hasta que llega la nueva.
    placeholderData: keepPreviousData,
  });
}

export function useDetalleUsuario(id: string | null) {
  return useQuery({
    queryKey: usuariosKeys.detalle(id ?? ""),
    queryFn: () => usuariosApi.detalle(id ?? ""),
    enabled: Boolean(id),
  });
}

interface OpcionesAccion<V, R> {
  mutationFn: (variables: V) => Promise<R>;
  /** Texto del aviso de éxito: nombra a la persona (contrato 05 §7). */
  mensaje: (variables: V, respuesta: R) => string;
  /** Las acciones con diálogo muestran su error dentro del diálogo, no como aviso. */
  errorEnDialogo?: boolean;
  alExito?: (variables: V) => void;
}

// Toda acción sobre cuentas invalida las listas, los totales y el detalle abierto.
function useAccion<V, R>({
  mutationFn,
  mensaje,
  errorEnDialogo = false,
  alExito,
}: OpcionesAccion<V, R>) {
  const queryClient = useQueryClient();
  const { avisar } = useAviso();
  return useMutation({
    mutationFn,
    onSuccess: (respuesta, variables) => {
      void queryClient.invalidateQueries({ queryKey: usuariosKeys.todo });
      avisar({ mensaje: mensaje(variables, respuesta) });
      alExito?.(variables);
    },
    onError: (error) => {
      if (!errorEnDialogo) avisar({ mensaje: error.message, tipo: "error" });
    },
  });
}

/** Reenvía el código y recuerda qué filas esperan el resultado ("Enviando…"). */
export function useReenviarCodigo() {
  const queryClient = useQueryClient();
  const [enCurso, setEnCurso] = useState<ReadonlySet<string>>(new Set());
  const accion = useAccion({
    mutationFn: (usuario: Usuario) => usuariosApi.reenviarCodigo(usuario.id),
    mensaje: (usuario) => `Reenviamos el código a ${usuario.email}.`,
    alExito: (usuario) => {
      setEnCurso((antes) => new Set(antes).add(usuario.id));
      setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: usuariosKeys.todo });
        setEnCurso((antes) => {
          const despues = new Set(antes);
          despues.delete(usuario.id);
          return despues;
        });
      }, ESPERA_RESULTADO_MS);
    },
  });
  return { reenviar: accion.mutate, enCurso };
}

const AVISO_POR_CORREO = " · se envió un aviso por correo";

export function useVerificarManual() {
  return useAccion({
    mutationFn: (usuario: Usuario) => usuariosApi.verificar(usuario.id),
    mensaje: (usuario) => `${nombreCompleto(usuario)} quedó verificado.`,
  });
}

export function useSuspender() {
  return useAccion({
    mutationFn: (datos: { usuario: Usuario; notificar: boolean }) =>
      usuariosApi.suspender({ id: datos.usuario.id, notificar: datos.notificar }),
    mensaje: ({ usuario, notificar }) =>
      `Cuenta de ${nombreCompleto(usuario)} suspendida${notificar ? AVISO_POR_CORREO : ""}`,
  });
}

export function useReactivar() {
  return useAccion({
    mutationFn: (usuario: Usuario) => usuariosApi.reactivar(usuario.id),
    mensaje: (usuario) => `Cuenta de ${nombreCompleto(usuario)} reactivada`,
  });
}

export function usePermisoNombre() {
  return useAccion({
    mutationFn: (datos: { usuario: Usuario; permitir: boolean }) =>
      usuariosApi.permitirNombre({ id: datos.usuario.id, permitir: datos.permitir }),
    mensaje: ({ permitir }) =>
      permitir ? "Cambio de nombre permitido" : "Cambio de nombre bloqueado",
  });
}

export function useCambiarRol() {
  return useAccion({
    mutationFn: (datos: { usuario: Usuario; rol: RolCuenta; notificar: boolean }) =>
      usuariosApi.cambiarRol({ id: datos.usuario.id, rol: datos.rol, notificar: datos.notificar }),
    mensaje: ({ usuario, rol, notificar }) =>
      `${nombreCompleto(usuario)} ahora es ${ETIQUETA_ROL[rol]}${notificar ? AVISO_POR_CORREO : ""}`,
  });
}

export function useEditarUsuario() {
  return useAccion({
    mutationFn: (datos: { usuario: Usuario; nombre: string; apellido: string; email: string }) =>
      usuariosApi.editar({
        id: datos.usuario.id,
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
      }),
    mensaje: ({ nombre, apellido }) => `Cambios guardados para ${nombre} ${apellido}`,
  });
}

const VERBO_LOTE: Record<AccionEnLote, (n: number, rol?: RolCuenta) => string> = {
  rol: (n, rol) =>
    `${n} ${n === 1 ? "cuenta ahora es" : "cuentas ahora son"} ${rol ? ETIQUETA_ROL[rol] : ""}`,
  activar: (n) => `${n} ${n === 1 ? "cuenta activada" : "cuentas activadas"}`,
  suspender: (n) => `${n} ${n === 1 ? "cuenta suspendida" : "cuentas suspendidas"}`,
  reenviar: (n) => `Código reenviado a ${n} ${n === 1 ? "cuenta" : "cuentas"}`,
};

/** Una acción para varias cuentas: el aviso cuenta las que cambiaron y las que se omitieron. */
export function useEnLote() {
  return useAccion({
    mutationFn: (datos: {
      ids: string[];
      accion: AccionEnLote;
      rol?: RolCuenta;
      notificar?: boolean;
    }) => usuariosApi.enLote(datos),
    mensaje: ({ accion, rol, notificar }, { data }) => {
      const omitidas = data.omitidas.length;
      const textoOmitidas = `${omitidas} ${omitidas === 1 ? "omitida" : "omitidas"}`;
      const resto = omitidas > 0 ? ` · ${textoOmitidas}` : "";
      const aviso =
        notificar && data.cambiadas.length && accion !== "activar" ? AVISO_POR_CORREO : "";
      return `${VERBO_LOTE[accion](data.cambiadas.length, rol)}${resto}${aviso}`;
    },
  });
}

export function useEliminarCuenta() {
  return useAccion({
    mutationFn: (usuario: Usuario) =>
      usuariosApi.eliminar({ id: usuario.id, correo: usuario.email }),
    mensaje: (usuario) => `Cuenta de ${nombreCompleto(usuario)} eliminada`,
    errorEnDialogo: true,
  });
}
