import { useEffect, useRef, type KeyboardEvent } from "react";

const ENFOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Sincroniza un <dialog> nativo con `abierto`: showModal() deja inerte el resto de la página,
 * Esc lo cierra (evento "close") y al cerrar el foco vuelve al elemento que lo abrió.
 * `atraparFoco` evita además que Tab salga del diálogo hacia la barra del navegador.
 */
export function useDialogoNativo(abierto: boolean, onCerrar: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  const enfocadoAntes = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) {
      enfocadoAntes.current = document.activeElement as HTMLElement | null;
      dialogo.showModal();
    } else if (!abierto && dialogo.open) {
      dialogo.close();
    }
  }, [abierto]);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return undefined;
    function alCerrar() {
      enfocadoAntes.current?.focus();
      onCerrar();
    }
    dialogo.addEventListener("close", alCerrar);
    return () => dialogo.removeEventListener("close", alCerrar);
  }, [onCerrar]);

  function atraparFoco(evento: KeyboardEvent<HTMLDialogElement>) {
    if (evento.key !== "Tab" || !ref.current) return;
    const enfocables = [...ref.current.querySelectorAll<HTMLElement>(ENFOCABLES)];
    if (enfocables.length === 0) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  return { ref, atraparFoco };
}
