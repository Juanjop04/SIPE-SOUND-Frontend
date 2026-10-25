import { Link } from "react-router-dom";
import { fechaRelativa } from "@/shared/lib/formato";
import { useBusquedaDiferida } from "@/shared/hooks/useBusquedaDiferida";
import { cn } from "@/shared/lib/cn.js";
import { EstadoVacio, Input, MensajeError, Paginacion, Skeleton } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useBandeja } from "../hooks";
import type { HiloDeBandeja } from "../tipos";
import { FILTROS, conBusqueda, useFiltrosBandeja, useRutasMensajes } from "../useFiltrosBandeja";
import { nombreDe, rolDe } from "../utils";
import type { ReactNode } from "react";

interface BandejaProps {
  /** Hilo abierto (resaltado). */
  activo: string | undefined;
  /** Qué mostrar cuando no hay nada: depende de quién mira (estudiante o docente). */
  vacio: ReactNode;
}

function FilaHilo({
  hilo,
  activo,
  destino,
}: {
  hilo: HiloDeBandeja;
  activo: boolean;
  destino: string;
}) {
  const sinLeer = hilo.no_leidos > 0;
  const { remitente, propio, extracto, creado_en } = hilo.ultimo;
  return (
    <li>
      <Link
        to={destino}
        aria-current={activo ? "page" : undefined}
        className={cn(
          "flex flex-col gap-1 border-l-2 px-3 py-3 transition-colors duration-rapida hover:bg-surface",
          activo ? "border-accent bg-surface" : "border-transparent",
        )}
      >
        <span className="flex items-baseline justify-between gap-3">
          <span
            className={cn("truncate text-sm", sinLeer ? "font-semibold text-paper" : "text-paper")}
          >
            {propio ? "Tú" : nombreDe(remitente)}
            {!propio && remitente && (
              <span className="font-normal text-muted"> · {rolDe(remitente)}</span>
            )}
          </span>
          <span className="shrink-0 font-mono text-xs text-muted">{fechaRelativa(creado_en)}</span>
        </span>
        <span
          className={cn("truncate text-sm", sinLeer ? "font-semibold text-paper" : "text-muted")}
        >
          {hilo.asunto}
        </span>
        <span className="truncate text-xs text-muted">{extracto}</span>
        {sinLeer && (
          <span className="flex items-center gap-1.5 text-xs text-paper">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            Sin leer
          </span>
        )}
      </Link>
    </li>
  );
}

/** Bandeja de hilos: filtros y búsqueda por asunto en la URL, paginada por el backend. */
export function Bandeja({ activo, vacio }: BandejaProps) {
  const { filtros, cambiar, busqueda } = useFiltrosBandeja();
  const rutas = useRutasMensajes();
  const [texto, setTexto] = useBusquedaDiferida(filtros.q, (q) => cambiar({ q }));
  const { data, isPending, error, refetch } = useBandeja(filtros);

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Filtros de la bandeja"
        className="flex flex-wrap gap-x-4 gap-y-1"
      >
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            type="button"
            role="tab"
            aria-selected={filtros.filtro === f.valor}
            onClick={() => cambiar({ filtro: f.valor === "recibidos" ? null : f.valor })}
            className={cn(
              "border-b-2 py-1 text-sm transition-colors duration-rapida",
              filtros.filtro === f.valor
                ? "border-accent text-paper"
                : "border-transparent text-muted hover:text-paper",
            )}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>
      <Input
        type="search"
        aria-label="Buscar por asunto"
        placeholder="Buscar por asunto"
        value={texto}
        maxLength={LIMITES.busqueda.max}
        autoComplete="off"
        onChange={(e) => setTexto(e.target.value)}
      />
      {isPending && (
        <div aria-busy="true">
          <Skeleton lineas={6} className="h-16 w-full" />
        </div>
      )}
      {error && !data && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data &&
        data.data.length === 0 &&
        (filtros.q || filtros.filtro !== "recibidos" ? (
          <EstadoVacio titulo="No hay mensajes con estos filtros." />
        ) : (
          vacio
        ))}
      {data && data.data.length > 0 && (
        <>
          <ul className="divide-y divide-linea rounded-caja border border-linea">
            {data.data.map((h) => (
              <FilaHilo
                key={h.hilo_id}
                hilo={h}
                activo={h.hilo_id === activo}
                destino={conBusqueda(rutas.hilo(h.hilo_id), busqueda)}
              />
            ))}
          </ul>
          <Paginacion meta={data.meta} onPagina={(p) => cambiar({ pagina: String(p) })} />
        </>
      )}
    </div>
  );
}
