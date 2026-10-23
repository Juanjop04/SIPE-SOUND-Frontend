import { PanelModal, type PanelModalProps } from "./PanelModal";

export type DialogProps = PanelModalProps;

/** Diálogo centrado sobre <dialog> nativo. Única pieza con shadow-dialogo (contrato 05 §2.4). */
export function Dialog(props: DialogProps) {
  return (
    <PanelModal
      {...props}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-caja shadow-dialogo"
    />
  );
}
