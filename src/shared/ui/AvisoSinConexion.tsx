import { WifiOff } from "lucide-react";
import { useEnLinea } from "@/shared/hooks/useEnLinea";
import { cn } from "@/shared/lib/cn.js";

/**
 * Franja "Sin conexión" bajo el encabezado (HU-F-312). La región role="status" existe siempre
 * (vacía no ocupa alto) para que el lector la anuncie al perder la red. Al volver la conexión
 * desaparece sola y TanStack Query refresca lo visible (refetchOnReconnect).
 */
export function AvisoSinConexion({ className }: { className?: string }) {
  const enLinea = useEnLinea();
  return (
    <div role="status">
      {!enLinea && (
        <div className={cn("border-b border-linea bg-surface-2", className)}>
          <p className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-sm text-paper sm:px-6">
            <WifiOff size={16} aria-hidden="true" className="shrink-0 text-muted" />
            Sin conexión: mostrando lo último que descargaste.
          </p>
        </div>
      )}
    </div>
  );
}
