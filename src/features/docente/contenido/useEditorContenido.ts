import { useNavigate } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { useAviso } from "@/shared/ui";
import { contenidoApi, useMutacionContenido } from "./api";
import type { ContenidoDocente, EstadoContenido, TipoContenido } from "./tipos";

/** Lo que cambia entre lecciones y ejercicios en el editor (lo demás es común). */
export const CONFIG_CONTENIDO = {
  lecciones: {
    nombre: "la lección",
    editor: (id: number | string) => paths.docente.leccion(id),
    mensajeEnUso:
      "Esta lección tiene avance de estudiantes. Puedes archivarla para ocultarla sin perder ese historial.",
  },
  ejercicios: {
    nombre: "el ejercicio",
    editor: (id: number | string) => paths.docente.ejercicio(id),
    mensajeEnUso:
      "Este ejercicio tiene avance de estudiantes. Puedes archivarlo para ocultarlo sin perder ese historial.",
  },
} as const;

// Navegar sin preguntar: los cambios ya se guardaron (ver ConfirmarSalida).
const SIN_CONFIRMAR = { replace: true, state: { sinConfirmar: true } };

/** Guardar (crear o editar), publicar, cambiar estado y eliminar; común a ambos tipos. */
export function useEditorContenido(tipo: TipoContenido, id: number | null) {
  const navigate = useNavigate();
  const { avisar } = useAviso();
  const config = CONFIG_CONTENIDO[tipo];
  const guardar = useMutacionContenido((datos: object) =>
    id === null ? contenidoApi.crear(tipo, datos) : contenidoApi.editar(tipo, id, datos),
  );
  const estado = useMutacionContenido(
    ({ ident, nuevo }: { ident: number; nuevo: EstadoContenido }) =>
      contenidoApi.cambiarEstado(tipo, ident, nuevo),
  );
  const eliminar = useMutacionContenido(() => contenidoApi.eliminar(tipo, id ?? 0));

  /** Guarda; con `publicar`, además pasa a publicado. Lanza el ApiError para los campos. */
  async function guardarDatos(datos: object, publicar: boolean): Promise<ContenidoDocente> {
    const { data, message } = await guardar.mutateAsync(datos);
    if (publicar) {
      const publicado = await estado.mutateAsync({ ident: data.id, nuevo: "publicado" });
      avisar({ mensaje: publicado.message });
    } else {
      avisar({ mensaje: message });
    }
    if (id === null) navigate(config.editor(data.id), SIN_CONFIRMAR);
    return data;
  }

  async function cambiarEstado(nuevo: EstadoContenido) {
    if (id === null) return;
    avisar({ mensaje: (await estado.mutateAsync({ ident: id, nuevo })).message });
  }

  async function eliminarContenido() {
    avisar({ mensaje: (await eliminar.mutateAsync(undefined)).message });
    navigate(
      `${paths.docente.contenido}${tipo === "ejercicios" ? "?tipo=ejercicios" : ""}`,
      SIN_CONFIRMAR,
    );
  }

  return {
    config,
    guardarDatos,
    cambiarEstado,
    eliminarContenido,
    ocupado: guardar.isPending || estado.isPending || eliminar.isPending,
  };
}
