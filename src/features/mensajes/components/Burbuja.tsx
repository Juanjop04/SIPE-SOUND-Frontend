import { cn } from "@/shared/lib/cn.js";
import type { MensajeDeHilo } from "../tipos";
import { nombreDe } from "../utils";
import { horaDelMensaje, textoDeAviso } from "../utilsChat";

/** Un mensaje: recibidos a la izquierda en `surface`, propios a la derecha en `primary`. */
export function Burbuja({ mensaje, primero }: { mensaje: MensajeDeHilo; primero: boolean }) {
  const propio = mensaje.propio;
  return (
    <article className={cn("flex flex-col gap-1", propio ? "items-end" : "items-start")}>
      {primero && (
        <p className="px-1 text-xs text-muted">
          {propio ? (
            <span className="sr-only">Tú · </span>
          ) : (
            <span className="text-paper">
              {nombreDe(mensaje.remitente)}
              {" · "}
            </span>
          )}
          <time dateTime={mensaje.creado_en} className="font-mono">
            {horaDelMensaje(mensaje.creado_en)}
          </time>
        </p>
      )}
      {!primero && (
        <time dateTime={mensaje.creado_en} className="sr-only">
          {horaDelMensaje(mensaje.creado_en)}
        </time>
      )}
      {/* Texto plano: React lo escapa y los saltos de línea se respetan con whitespace-pre-wrap. */}
      <p
        className={cn(
          "max-w-[min(68ch,85%)] whitespace-pre-wrap break-words rounded-caja border px-3 py-2",
          propio
            ? "rounded-br-none border-primary bg-primary text-sobre-primary"
            : "rounded-bl-none border-linea bg-surface text-paper",
        )}
      >
        {mensaje.cuerpo}
      </p>
    </article>
  );
}

/** Un aviso a un curso o grupo: tarjeta centrada, sin burbuja, con a quién va y quién lo envió. */
export function TarjetaDeAviso({ mensaje }: { mensaje: MensajeDeHilo }) {
  return (
    <article className="mx-auto w-full max-w-[min(68ch,90%)] rounded-caja border border-linea-fuerte bg-ink-2 p-4">
      <p className="text-xs text-muted">
        <span className="font-medium text-paper">{textoDeAviso(mensaje)}</span>
        {" · "}
        {mensaje.propio ? "Tú" : nombreDe(mensaje.remitente)}
        {" · "}
        <time dateTime={mensaje.creado_en} className="font-mono">
          {horaDelMensaje(mensaje.creado_en)}
        </time>
      </p>
      <p className="mt-2 whitespace-pre-wrap break-words text-paper">{mensaje.cuerpo}</p>
    </article>
  );
}

/** Los separadores: el día ("Hoy", "Ayer", "12 oct") y dónde empiezan los mensajes nuevos. */
export function Separador({ texto, aviso = false }: { texto: string; aviso?: boolean }) {
  return (
    <div
      role="separator"
      className={cn("flex items-center gap-3 text-xs", aviso ? "text-accent" : "text-muted")}
    >
      <span aria-hidden="true" className="h-px flex-1 bg-linea" />
      <span className="font-mono">{texto}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-linea" />
    </div>
  );
}
