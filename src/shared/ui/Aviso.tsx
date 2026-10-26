import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

export type TipoAviso = "exito" | "error";

export interface DatosAviso {
  /** Texto del backend (`message`) u otro ya redactado en español. */
  mensaje: string;
  tipo?: TipoAviso;
}

interface AvisoVisible extends Required<DatosAviso> {
  id: number;
}

interface ContextoAvisos {
  avisar: (aviso: DatosAviso) => void;
}

const DURACION_MS = 5000;
// Sin cn(): este proveedor va en el bundle inicial y tailwind-merge pesa ~7 kB gzip.
const CLASES_TIPO: Record<TipoAviso, string> = { exito: "text-paper", error: "text-danger" };
const AvisosContext = createContext<ContextoAvisos | null>(null);

/** Toast: un aviso visible a la vez, anunciado con aria-live="polite". Va en AppProviders. */
export function AvisosProvider({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<AvisoVisible | null>(null);

  const avisar = useCallback(({ mensaje, tipo = "exito" }: DatosAviso) => {
    setAviso({ id: Date.now(), mensaje, tipo });
  }, []);

  // Temporizador: sincroniza con un sistema externo (el reloj), no pide datos.
  useEffect(() => {
    if (!aviso) return undefined;
    const temporizador = setTimeout(() => setAviso(null), DURACION_MS);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  const value = useMemo(() => ({ avisar }), [avisar]);

  return (
    <AvisosContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center"
      >
        {aviso && (
          <div
            key={aviso.id}
            className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-md border border-linea bg-surface-2 px-4 py-3 text-sm ${CLASES_TIPO[aviso.tipo]}`}
          >
            <p>{aviso.mensaje}</p>
            <button
              type="button"
              onClick={() => setAviso(null)}
              aria-label="Cerrar aviso"
              className="rounded-md p-1 text-muted hover:text-paper"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </AvisosContext.Provider>
  );
}

export function useAviso(): ContextoAvisos {
  const contexto = useContext(AvisosContext);
  if (!contexto) throw new Error("useAviso debe usarse dentro de AvisosProvider");
  return contexto;
}
