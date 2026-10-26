import { useState } from "react";
import { Button, Dialog } from "@/shared/ui";
import { useRetirarme } from "../hooks/useCursosDisponibles";

/** "Retirarme" del curso con confirmación: queda disponible y sus estudiantes siguen inscritos. */
export function BotonRetirarme({ cursoId, nombre }: { cursoId: number; nombre: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const retirarme = useRetirarme();
  return (
    <>
      <Button
        variante="fantasma"
        tamano="sm"
        onClick={() => setConfirmando(true)}
        aria-label={`Retirarme del curso ${nombre}`}
      >
        Retirarme
      </Button>
      <Dialog
        abierto={confirmando}
        onCerrar={() => setConfirmando(false)}
        titulo={`¿Retirarte de «${nombre}»?`}
        descripcion="El curso quedará disponible para otro docente. Sus estudiantes y su ruta se conservan, pero dejarás de verlo y de gestionarlo."
      >
        <div className="flex justify-end gap-3">
          <Button variante="fantasma" onClick={() => setConfirmando(false)}>
            Cancelar
          </Button>
          <Button
            variante="peligro"
            cargando={retirarme.isPending}
            onClick={() =>
              retirarme.mutate(cursoId, {
                onSettled: () => setConfirmando(false),
              })
            }
          >
            Retirarme
          </Button>
        </div>
      </Dialog>
    </>
  );
}
