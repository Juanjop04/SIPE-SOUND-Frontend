import { Button, Dialog, MensajeError } from "@/shared/ui";
import { useRetirarEstudiante } from "../hooks";

export interface RetiroPendiente {
  cursoId: number;
  curso: string;
  estudianteId: string;
  estudiante: string;
}

function Contenido({ retiro, onCerrar }: { retiro: RetiroPendiente; onCerrar: () => void }) {
  const retirar = useRetirarEstudiante();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-paper">
        {retiro.estudiante} deja de ver el curso {retiro.curso}. Su progreso se conserva.
      </p>
      {retirar.error && <MensajeError mensaje={retirar.error.message} />}
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button
          variante="peligro"
          cargando={retirar.isPending}
          onClick={() =>
            retirar.mutate(
              { cursoId: retiro.cursoId, estudianteId: retiro.estudianteId },
              { onSuccess: onCerrar },
            )
          }
        >
          Retirar del curso
        </Button>
      </div>
    </div>
  );
}

/** Retirar a un estudiante de un curso: nombra a la persona y al curso, y aclara que su avance se conserva. */
export function DialogoRetirar({
  retiro,
  onCerrar,
}: {
  /** null = cerrado. */
  retiro: RetiroPendiente | null;
  onCerrar: () => void;
}) {
  return (
    <Dialog
      abierto={retiro !== null}
      onCerrar={onCerrar}
      titulo="Retirar del curso"
      descripcion="Si compartió el código del curso, tendrá que pedirle al docente que lo regenere."
    >
      {retiro && <Contenido retiro={retiro} onCerrar={onCerrar} />}
    </Dialog>
  );
}
