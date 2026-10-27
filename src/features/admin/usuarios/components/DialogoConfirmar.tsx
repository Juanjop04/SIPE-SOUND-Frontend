import { useState, type ReactNode } from "react";
import { Button, Dialog } from "@/shared/ui";

interface DialogoConfirmarProps {
  abierto: boolean;
  titulo: string;
  /** Texto del botón de la acción ("Sí, suspender"). */
  cta: string;
  /** Rojo: la acción borra o quita el acceso. */
  peligro?: boolean;
  /** Si existe, muestra la casilla de aviso por correo (marcada de entrada). */
  etiquetaAviso?: string;
  /** Debe lanzar si falla: el diálogo sigue abierto y muestra el error. */
  onConfirmar: (avisar: boolean) => Promise<void>;
  /** Error de fuera (p. ej. de una mutación) que se muestra bajo el contenido. */
  error?: ReactNode;
  onCerrar: () => void;
  children: ReactNode;
}

type CuerpoProps = Omit<DialogoConfirmarProps, "abierto" | "titulo">;

function Cuerpo({
  cta,
  peligro,
  etiquetaAviso,
  onConfirmar,
  error,
  onCerrar,
  children,
}: CuerpoProps) {
  const [avisar, setAvisar] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [fallo, setFallo] = useState<string | null>(null);

  async function confirmar() {
    setEnviando(true);
    setFallo(null);
    try {
      await onConfirmar(avisar);
      onCerrar();
    } catch (e) {
      setFallo(e instanceof Error ? e.message : "No se pudo completar la acción.");
    } finally {
      setEnviando(false);
    }
  }

  const mensaje = fallo ?? error;
  return (
    <div className="flex flex-col gap-4">
      {children}
      {etiquetaAviso && (
        <label className="flex cursor-pointer items-center gap-3 py-1 text-sm text-paper">
          <input
            type="checkbox"
            checked={avisar}
            onChange={(e) => setAvisar(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          {etiquetaAviso}
        </label>
      )}
      {mensaje && (
        <p role="alert" className="text-sm text-danger">
          {mensaje}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button variante={peligro ? "peligro" : "primario"} cargando={enviando} onClick={confirmar}>
          {cta}
        </Button>
      </div>
    </div>
  );
}

/**
 * Confirmación de una acción sobre cuentas: título, quién y qué cambia (children), casilla de
 * aviso por correo y dos botones. Cancelar o Escape no cambian nada.
 */
export function DialogoConfirmar({ abierto, titulo, ...cuerpo }: DialogoConfirmarProps) {
  return (
    <Dialog abierto={abierto} onCerrar={cuerpo.onCerrar} titulo={titulo}>
      <Cuerpo {...cuerpo} />
    </Dialog>
  );
}

/** Caja con el sujeto de la acción: nombre y correo en mono. */
export function SujetoDelDialogo({ nombre, detalle }: { nombre: string; detalle: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-linea bg-ink-2 p-3.5">
      <span className="text-sm font-semibold text-paper">{nombre}</span>
      <span className="break-all font-mono text-xs text-muted">{detalle}</span>
    </div>
  );
}
