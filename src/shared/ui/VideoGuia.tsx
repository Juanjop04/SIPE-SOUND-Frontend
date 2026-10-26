import { useEffect, useRef, useState, type RefObject } from "react";
import { Maximize, Play } from "lucide-react";
import { useEnLinea } from "@/shared/hooks/useEnLinea";
import { cn } from "@/shared/lib/cn.js";
import { formatearInicio, urlDeReproductor, type VideoGuiaDatos } from "@/shared/lib/youtube";
import { Button } from "./Button";

/** Si el reproductor no termina de cargar en este tiempo se ofrece abrirlo en YouTube. */
const ESPERA_CARGA_MS = 15_000;

type Fase = "fachada" | "cargando" | "listo" | "error";

export interface VideoGuiaProps {
  video: VideoGuiaDatos;
  /** Título del contenido: nombra el botón y el iframe para lectores de pantalla. */
  titulo: string;
  className?: string;
}

// Safari iOS solo trae la versión con prefijo.
type ConPrefijo = HTMLElement & { webkitRequestFullscreen?: () => void };
type DocumentoConPrefijo = Document & { webkitFullscreenElement?: Element | null };

function hayPantallaCompleta(): boolean {
  return Boolean(document.fullscreenEnabled || "webkitRequestFullscreen" in document.body);
}

function pedirPantallaCompleta(contenedor: HTMLElement | null): void {
  const el = contenedor as ConPrefijo | null;
  if (!el) return;
  if (el.requestFullscreen) void el.requestFullscreen();
  else el.webkitRequestFullscreen?.();
}

/** Al salir de pantalla completa (Esc) el foco vuelve al botón que la pidió. */
function useFocoAlSalirDePantallaCompleta(boton: RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    function alCambiar() {
      const doc = document as DocumentoConPrefijo;
      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) boton.current?.focus();
    }
    document.addEventListener("fullscreenchange", alCambiar);
    document.addEventListener("webkitfullscreenchange", alCambiar);
    return () => {
      document.removeEventListener("fullscreenchange", alCambiar);
      document.removeEventListener("webkitfullscreenchange", alCambiar);
    };
  }, [boton]);
}

function ErrorDeVideo({ href }: { href: string }) {
  return (
    <div role="alert" className="absolute inset-0 flex flex-col items-start justify-end gap-2 p-4">
      <p className="text-sm text-danger">No pudimos cargar el video.</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-accent underline underline-offset-2"
      >
        Ábrelo en YouTube
      </a>
    </div>
  );
}

/**
 * Video guía de YouTube con fachada: hasta pulsar "Reproducir video" no se carga nada de YouTube
 * (ni iframe, ni miniatura, ni scripts), por privacidad de menores y poca conectividad. Al pulsar
 * monta el reproductor sin cookies (youtube-nocookie.com). Presentacional: no pide datos.
 */
export function VideoGuia({ video, titulo, className }: VideoGuiaProps) {
  const [fase, setFase] = useState<Fase>("fachada");
  const enLinea = useEnLinea();
  const contenedor = useRef<HTMLDivElement>(null);
  const botonPantalla = useRef<HTMLButtonElement>(null);
  const inicio = video.inicio_seg;

  // Si el reproductor no carga en 15 s (sin red, bloqueado), se ofrece abrirlo en YouTube.
  useEffect(() => {
    if (fase !== "cargando") return undefined;
    const temporizador = setTimeout(() => setFase("error"), ESPERA_CARGA_MS);
    return () => clearTimeout(temporizador);
  }, [fase]);

  useFocoAlSalirDePantallaCompleta(botonPantalla);

  const reproduciendo = fase === "cargando" || fase === "listo";
  const desde = inicio ? "&t=" + inicio + "s" : "";
  const enlaceExterno = "https://www.youtube.com/watch?v=" + video.youtube_id + desde;

  return (
    <section aria-label={`Video guía: ${titulo}`} className={cn("flex flex-col gap-2", className)}>
      <div
        ref={contenedor}
        className="relative aspect-video w-full overflow-hidden rounded-caja border border-linea bg-surface"
      >
        {reproduciendo && (
          <iframe
            src={urlDeReproductor(video.youtube_id, inicio)}
            title={`Video guía: ${titulo}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            onLoad={() => setFase("listo")}
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
        {fase === "cargando" && (
          <p role="status" className="absolute bottom-3 left-3 text-sm text-muted">
            Cargando video…
          </p>
        )}
        {reproduciendo && hayPantallaCompleta() && (
          <Button
            ref={botonPantalla}
            variante="secundario"
            tamano="sm"
            className="absolute right-3 top-3 bg-ink"
            onClick={() => pedirPantallaCompleta(contenedor.current)}
          >
            <Maximize size={16} aria-hidden="true" />
            Pantalla completa
          </Button>
        )}
        {fase === "error" && <ErrorDeVideo href={enlaceExterno} />}
        {fase === "fachada" && (
          <Fachada
            titulo={titulo}
            inicio={inicio}
            enLinea={enLinea}
            onReproducir={() => setFase("cargando")}
          />
        )}
      </div>
    </section>
  );
}

function Fachada({
  titulo,
  inicio,
  enLinea,
  onReproducir,
}: {
  titulo: string;
  inicio: number | null;
  enLinea: boolean;
  onReproducir: () => void;
}) {
  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={onReproducir}
          disabled={!enLinea}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-sobre-primary transition-colors duration-rapida hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size={28} aria-hidden="true" />
          <span className="sr-only">Reproducir video: {titulo}</span>
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-4">
        <p className="text-sm text-muted">Video guía</p>
        <p className="truncate text-paper">{titulo}</p>
        <p className="font-mono text-[13px] text-muted">
          {enLinea ? "YouTube · se carga al reproducir" : "Necesitas conexión para ver el video."}
          {inicio ? ` · Empieza en ${formatearInicio(inicio)}` : ""}
        </p>
      </div>
    </>
  );
}
