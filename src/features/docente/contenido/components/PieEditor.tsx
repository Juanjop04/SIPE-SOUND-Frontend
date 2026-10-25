import { ConfirmarSalida, MensajeError } from "@/shared/ui";
import { usePuedeBorrar } from "../externos";
import type { EstadoContenido } from "../tipos";
import type { useEditorContenido } from "../useEditorContenido";
import { BarraAcciones } from "./BarraAcciones";
import { ZonaEliminar } from "./ZonaEliminar";

interface PieEditorProps {
  editor: ReturnType<typeof useEditorContenido>;
  /** null = contenido nuevo (aún no se puede eliminar ni cambiar de estado). */
  estado: EstadoContenido | null;
  errorGeneral: string | null;
  hayCambios: boolean;
  onPublicar: () => void;
  /** Quién lo creó: solo él (o un admin) puede borrarlo (HU-B-412). */
  autorId?: string | null;
}

/** Errores, barra de acciones, zona de eliminar y confirmación al salir: comunes a ambos editores. */
export function PieEditor({
  editor,
  estado,
  errorGeneral,
  hayCambios,
  onPublicar,
  autorId,
}: PieEditorProps) {
  const puedeBorrar = usePuedeBorrar(autorId);
  return (
    <>
      {errorGeneral && <MensajeError className="mt-6" mensaje={errorGeneral} />}
      <BarraAcciones
        estado={estado}
        ocupado={editor.ocupado}
        onPublicar={onPublicar}
        onCambiarEstado={(nuevo) => editor.cambiarEstado(nuevo).catch(() => null)}
      />
      {estado !== null && !puedeBorrar && (
        <p className="mt-12 border-t border-linea pt-6 text-sm text-muted">
          Este contenido lo creó otra persona: puedes editarlo, publicarlo y archivarlo, pero solo
          su autor puede borrarlo.
        </p>
      )}
      {estado !== null && puedeBorrar && (
        <ZonaEliminar
          nombre={editor.config.nombre}
          mensajeEnUso={editor.config.mensajeEnUso}
          onEliminar={editor.eliminarContenido}
          onArchivar={() => editor.cambiarEstado("archivado")}
        />
      )}
      <ConfirmarSalida
        bloquear={hayCambios && !editor.ocupado}
        titulo="¿Salir sin guardar?"
        descripcion="Hay cambios que todavía no guardaste."
        textoSalir="Salir sin guardar"
        textoQuedarse="Seguir editando"
      />
    </>
  );
}
