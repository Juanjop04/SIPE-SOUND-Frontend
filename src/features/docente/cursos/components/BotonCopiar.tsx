import { Copy } from "lucide-react";
import { Button, useAviso, type TamanoBoton } from "@/shared/ui";

interface BotonCopiarProps {
  texto: string;
  /** Nombre accesible: "Copiar el código de Guitarra 7°A". */
  etiqueta: string;
  tamano?: TamanoBoton;
}

/** Copia al portapapeles y avisa "Código copiado" (o qué hacer si el navegador no deja). */
export function BotonCopiar({ texto, etiqueta, tamano = "sm" }: BotonCopiarProps) {
  const { avisar } = useAviso();

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      avisar({ mensaje: "Código copiado" });
    } catch {
      avisar({ mensaje: `No se pudo copiar. El código es ${texto}.`, tipo: "error" });
    }
  }

  return (
    <Button variante="fantasma" tamano={tamano} aria-label={etiqueta} onClick={() => void copiar()}>
      <Copy size={16} aria-hidden="true" />
      Copiar
    </Button>
  );
}
