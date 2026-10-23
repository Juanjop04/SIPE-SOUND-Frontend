import { useBlocker } from "react-router-dom";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

export interface ConfirmarSalidaProps {
  /** true mientras haya algo sin guardar o sin enviar. */
  bloquear: boolean;
  titulo: string;
  descripcion: string;
  textoSalir: string;
  textoQuedarse: string;
}

/** Pregunta antes de salir de la página si hay cambios pendientes (useBlocker del router). */
export function ConfirmarSalida(props: ConfirmarSalidaProps) {
  const { bloquear, titulo, descripcion, textoSalir, textoQuedarse } = props;
  // Una navegación con state { sinConfirmar: true } (p. ej. tras guardar) no pregunta.
  const bloqueo = useBlocker(
    ({ currentLocation, nextLocation }) =>
      bloquear &&
      currentLocation.pathname !== nextLocation.pathname &&
      !(nextLocation.state as { sinConfirmar?: boolean } | null)?.sinConfirmar,
  );

  return (
    <Dialog
      abierto={bloqueo.state === "blocked"}
      onCerrar={() => bloqueo.reset?.()}
      titulo={titulo}
      descripcion={descripcion}
      acciones={
        <>
          <Button variante="fantasma" onClick={() => bloqueo.proceed?.()}>
            {textoSalir}
          </Button>
          <Button onClick={() => bloqueo.reset?.()}>{textoQuedarse}</Button>
        </>
      }
    />
  );
}
