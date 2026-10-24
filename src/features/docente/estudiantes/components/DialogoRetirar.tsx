import { Button, Dialog, MensajeError, useAviso } from "@/shared/ui";
import { useRetirarEstudiante } from "../hooks";

export interface ARetirar {
  estudianteId: string;
  nombre: string;
}

interface DialogoRetirarProps {
  cursoId: number;
  estudiante: ARetirar | null;
  onCerrar: () => void;
  /** Tras retirar (p. ej. cerrar el detalle de ese estudiante). */
  onRetirado: () => void;
}

/** Confirmación de retiro: quita la inscripción; el progreso personal se conserva. */
export function DialogoRetirar({ cursoId, estudiante, onCerrar, onRetirado }: DialogoRetirarProps) {
  const retirar = useRetirarEstudiante(cursoId);
  const { avisar } = useAviso();

  async function confirmar() {
    if (!estudiante) return;
    const { message } = await retirar.mutateAsync(estudiante.estudianteId);
    avisar({ mensaje: message });
    onCerrar();
    onRetirado();
  }

  return (
    <Dialog
      abierto={estudiante !== null}
      onCerrar={onCerrar}
      titulo={`¿Retirar a ${estudiante?.nombre ?? ""} del curso?`}
      descripcion="Se quitará del curso. Su progreso personal se conserva."
      acciones={
        <>
          <Button variante="secundario" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button
            variante="peligro"
            cargando={retirar.isPending}
            onClick={() => confirmar().catch(() => null)}
          >
            Retirar
          </Button>
        </>
      }
    >
      {retirar.error && <MensajeError mensaje={retirar.error.message} />}
    </Dialog>
  );
}
