import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { MensajeDeHilo } from "../tipos";
import { agruparMensajes } from "../utilsChat";
import { Burbuja, Separador, TarjetaDeAviso } from "./Burbuja";

const CERCA_DEL_FINAL_PX = 80;

/**
 * Los mensajes del hilo con scroll propio. Al abrir baja al primer mensaje nuevo (o al final); si
 * llega algo mientras se lee más arriba, no mueve la vista y ofrece "Mensajes nuevos ↓".
 */
export function ListaDeMensajes({
  mensajes,
  pendiente,
}: {
  mensajes: MensajeDeHilo[];
  /** Lo que se está enviando, para dibujarlo ya al final. */
  pendiente?: ReactNode;
}) {
  const items = useMemo(() => agruparMensajes(mensajes), [mensajes]);
  const caja = useRef<HTMLDivElement>(null);
  const marcaNuevos = useRef<HTMLDivElement>(null);
  // Cuántos mensajes ya se leyeron al pie: "Mensajes nuevos ↓" sale si hay más que eso.
  const [vistos, setVistos] = useState(mensajes.length);
  const hayNuevos = mensajes.length > vistos;

  const alFinal = () => {
    const c = caja.current;
    return !c || c.scrollHeight - c.scrollTop - c.clientHeight < CERCA_DEL_FINAL_PX;
  };
  const bajar = () => caja.current?.scrollTo({ top: caja.current.scrollHeight });

  // Primera carga: al primer mensaje sin leer, o al final.
  useLayoutEffect(() => {
    const c = caja.current;
    if (!c) return;
    if (marcaNuevos.current) c.scrollTop = Math.max(0, marcaNuevos.current.offsetTop - 16);
    else c.scrollTop = c.scrollHeight;
  }, []);

  // Llegó algo propio, o se estaba al final: baja (y el scroll marca todo como visto).
  const total = mensajes.length;
  const propio = mensajes.at(-1)?.propio ?? false;
  useEffect(() => {
    if (total > vistos && (propio || alFinal())) {
      caja.current?.scrollTo({ top: caja.current.scrollHeight, behavior: "smooth" });
    }
    // `vistos` solo cambia por el scroll: no debe reiniciar este efecto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, propio]);

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={caja}
        role="log"
        aria-live="polite"
        aria-label="Mensajes de la conversación"
        // Región con scroll: debe poder enfocarse para desplazarla con el teclado.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onScroll={() => alFinal() && setVistos(mensajes.length)}
        className="flex h-full flex-col gap-2 overflow-y-auto px-4 py-4"
      >
        {items.map((it) => {
          if (it.tipo === "dia") return <Separador key={it.clave} texto={it.etiqueta} />;
          if (it.tipo === "nuevos")
            return (
              <div key={it.clave} ref={marcaNuevos}>
                <Separador texto="Mensajes nuevos" aviso />
              </div>
            );
          if (it.tipo === "aviso") return <TarjetaDeAviso key={it.clave} mensaje={it.mensaje} />;
          return <Burbuja key={it.clave} mensaje={it.mensaje} primero={it.primero} />;
        })}
        {pendiente}
      </div>
      {hayNuevos && (
        <button
          type="button"
          onClick={bajar}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-accent bg-ink-2 px-3 py-1 text-xs text-paper"
        >
          Mensajes nuevos ↓
        </button>
      )}
    </div>
  );
}
