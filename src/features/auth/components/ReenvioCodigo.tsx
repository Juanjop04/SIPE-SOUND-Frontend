import { formatearEspera } from "@/shared/hooks/useCuentaRegresiva";
import { Button } from "@/shared/ui";

interface ReenvioCodigoProps {
  onPedir: () => void;
  pidiendo: boolean;
  /** Segundos que faltan para poder pedir otro; 0 = ya se puede. */
  esperaRestante: number;
  /** Respuesta del backend al último reenvío (siempre el mismo texto). */
  aviso: string | null;
}

/** "¿No te llegó?": pedir otro código, con la espera de un minuto visible. */
export function ReenvioCodigo({ onPedir, pidiendo, esperaRestante, aviso }: ReenvioCodigoProps) {
  return (
    <div className="mt-6 flex flex-col gap-2 text-sm text-muted">
      <p>¿No te llegó?</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variante="secundario"
          tamano="sm"
          onClick={onPedir}
          cargando={pidiendo}
          disabled={esperaRestante > 0}
        >
          Enviar otro código
        </Button>
        {esperaRestante > 0 && (
          <span className="font-mono">Puedes pedir otro en {formatearEspera(esperaRestante)}</span>
        )}
      </div>
      {aviso && (
        <p role="status" className="text-paper">
          {aviso}
        </p>
      )}
      <p>Revisa también la carpeta de correo no deseado.</p>
    </div>
  );
}
