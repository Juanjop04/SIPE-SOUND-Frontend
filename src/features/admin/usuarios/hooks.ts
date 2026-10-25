import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAviso } from "@/shared/ui";
import { usuariosApi, usuariosKeys } from "./api";
import type { FiltrosUsuarios, Usuario } from "./tipos";
import { nombreCompleto } from "./utils";

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

export function useVerificarManual() {
  return useAccion({
    mutationFn: (datos: { usuario: Usuario; motivo: string }) =>
      usuariosApi.verificar({ id: datos.usuario.id, motivo: datos.motivo }),
    mensaje: ({ usuario }) => `Verificamos el correo de ${usuario.email}.`,
    errorEnDialogo: true,
  });
}

export function useSuspender() {
  return useAccion({
    mutationFn: (datos: { usuario: Usuario; motivo: string }) =>
      usuariosApi.suspender({ id: datos.usuario.id, motivo: datos.motivo }),
    mensaje: ({ usuario }) => `Suspendimos la cuenta de ${usuario.email}.`,
    errorEnDialogo: true,
  });
}

export function useReactivar() {
  return useAccion({
    mutationFn: (usuario: Usuario) => usuariosApi.reactivar(usuario.id),
    mensaje: (usuario) => `Reactivamos la cuenta de ${usuario.email}.`,
  });
}

export function usePermisoNombre() {
  return useAccion({
    mutationFn: (datos: { usuario: Usuario; permitir: boolean }) =>
      usuariosApi.permitirNombre({ id: datos.usuario.id, permitir: datos.permitir }),
    mensaje: ({ usuario, permitir }) =>
      permitir
        ? `${nombreCompleto(usuario)} ya puede cambiar su nombre.`
        : `${nombreCompleto(usuario)} ya no puede cambiar su nombre.`,
  });
}

export function usePermisoNombreEnLote() {
  return useAccion({
    mutationFn: (datos: { ids: string[]; permitir: boolean }) =>
      usuariosApi.permitirNombreEnLote(datos),
    mensaje: ({ permitir }, { data }) =>
      permitir
        ? `Listo: ${data.actualizados} cuentas pueden cambiar su nombre.`
        : `Listo: ${data.actualizados} cuentas ya no pueden cambiar su nombre.`,
  });
}

export function useEliminarCuenta() {
  return useAccion({
    mutationFn: (usuario: Usuario) =>
      usuariosApi.eliminar({ id: usuario.id, correo: usuario.email }),
    mensaje: (usuario) => `Eliminamos la cuenta de ${usuario.email}.`,
    errorEnDialogo: true,
  });
}
