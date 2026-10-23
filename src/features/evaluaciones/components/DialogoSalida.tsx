import { useBlocker } from "react-router-dom";
import { Button, Dialog } from "@/shared/ui";

/** Si hay respuestas sin enviar, pregunta antes de salir de la página (useBlocker). */
export function DialogoSalida({ bloquear }: { bloquear: boolean }) {
  const bloqueo = useBlocker(
    ({ currentLocation, nextLocation }) =>
      bloquear && currentLocation.pathname !== nextLocation.pathname,
  );
  const abierto = bloqueo.state === "blocked";

  return (
    <Dialog
      abierto={abierto}
      onCerrar={() => bloqueo.reset?.()}
      titulo="¿Salir sin enviar?"
      descripcion="Tus respuestas no se guardan hasta que envíes la evaluación."
      acciones={
        <>
          <Button variante="fantasma" onClick={() => bloqueo.proceed?.()}>
            Salir sin enviar
          </Button>
          <Button onClick={() => bloqueo.reset?.()}>Seguir respondiendo</Button>
        </>
      }
    />
  );
}
