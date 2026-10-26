import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, MensajeError, Skeleton } from "@/shared/ui";
import { useAvisarLectura, useEditarHilo, useHilo } from "../hooks";
import type { Hilo } from "../tipos";
import { conBusqueda, useFiltrosBandeja, useRutasMensajes } from "../useFiltrosBandeja";
import { subtituloDelChat, tituloDelChat } from "../utilsChat";
import { Iniciales } from "./Iniciales";
import { ListaDeMensajes } from "./ListaDeMensajes";
import { EnviandoBurbuja, RedactorDeChat } from "./RedactorDeChat";

function Acciones({ id, alIr }: { id: string; alIr: () => void }) {
  const editar = useEditarHilo();
  // El hilo no trae su estado de archivado: se deduce del filtro desde el que se abrió.
  const { filtros } = useFiltrosBandeja();
  const archivado = filtros.filtro === "archivados";
  return (
    <div className="flex shrink-0 flex-wrap gap-2">
      <Button
        variante="secundario"
        tamano="sm"
        cargando={editar.isPending}
        onClick={() => editar.mutate({ id, archivado: !archivado }, { onSuccess: alIr })}
      >
        {archivado ? "Desarchivar" : "Archivar"}
      </Button>
      <Button
        variante="secundario"
        tamano="sm"
        cargando={editar.isPending}
        onClick={() => editar.mutate({ id, leido: false }, { onSuccess: alIr })}
      >
        Marcar como no leído
      </Button>
    </div>
  );
}

function Encabezado({ hilo, alIr }: { hilo: Hilo; alIr: () => void }) {
  const ajeno = hilo.mensajes.find((m) => !m.propio && m.remitente)?.remitente ?? null;
  const subtitulo = subtituloDelChat(hilo);
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-linea px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Iniciales persona={ajeno} />
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-semibold text-paper">
            {tituloDelChat(hilo)}
          </h2>
          {subtitulo && <p className="truncate text-xs text-muted">{subtitulo}</p>}
        </div>
      </div>
      <Acciones id={hilo.hilo_id} alIr={alIr} />
    </header>
  );
}

/** La conversación abierta como chat: encabezado, mensajes con scroll y campo de respuesta. */
export function VistaHilo({ hiloId }: { hiloId: string }) {
  const { data, isPending, error, refetch, dataUpdatedAt } = useHilo(hiloId);
  const navigate = useNavigate();
  const rutas = useRutasMensajes();
  const { busqueda } = useFiltrosBandeja();
  const avisarLectura = useAvisarLectura();
  const [pendiente, setPendiente] = useState<{ texto: string; fallo: boolean } | null>(null);
  const reintento = useRef<() => void>(() => undefined);
  const volver = () => navigate(conBusqueda(rutas.bandeja, busqueda));

  // Abrir o recibir algo en un hilo cambia el contador y la bandeja.
  useEffect(() => {
    if (dataUpdatedAt) avisarLectura();
  }, [dataUpdatedAt, avisarLectura]);

  if (isPending) return <Skeleton lineas={5} className="h-16 w-full" />;
  if (error && !data)
    return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  if (!data) return null;
  const puedeResponder = data.puede_responder && data.responder_a;
  return (
    <div className="flex h-full min-h-[24rem] flex-col rounded-caja border border-linea">
      <Encabezado hilo={data} alIr={volver} />
      <ListaDeMensajes
        mensajes={data.mensajes}
        pendiente={
          pendiente && (
            <EnviandoBurbuja
              texto={pendiente.texto}
              fallo={pendiente.fallo}
              onReintentar={() => reintento.current()}
            />
          )
        }
      />
      {puedeResponder ? (
        <RedactorDeChat
          responderA={data.responder_a ?? ""}
          onPendiente={(texto, fallo) => setPendiente(texto === null ? null : { texto, fallo })}
          onReintento={(fn) => {
            reintento.current = fn;
          }}
        />
      ) : (
        <p className="border-t border-linea px-4 py-3 text-sm text-muted">
          Este aviso no admite respuestas.
        </p>
      )}
    </div>
  );
}
