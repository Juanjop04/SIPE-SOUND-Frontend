import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { usePerfil } from "@/features/auth";
import { useBusquedaDiferida } from "@/shared/hooks/useBusquedaDiferida";
import { Input, MensajeError, useAviso } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useDestinatarios, useEnviarMensaje } from "../hooks";
import { esquemaRespuesta } from "../schemas";
import type { Destinatario } from "../tipos";
import { useRutasMensajes } from "../useFiltrosBandeja";
import {
  asuntoDeNombre,
  confirmacionDeGrupo,
  mensajeParaDestino,
  textoDeEnvio,
  valorDestino,
} from "../utils";
import { CampoDeMensaje } from "./CampoDeMensaje";

interface NuevoMensajeChatProps {
  /** El estudiante solo elige entre sus docentes y nunca ve cursos. */
  soloDocentes: boolean;
  /** Persona con la que se abre el chat (p. ej. "Escribirle" en el panel de progreso). */
  para?: Destinatario;
}

/** Quién recibe: la ficha elegida, o el buscador (docente y admin) o la lista de docentes (estudiante). */
function SelectorPara({
  elegido,
  soloDocentes,
  onElegir,
  onQuitar,
}: {
  elegido: Destinatario | null;
  soloDocentes: boolean;
  onElegir: (d: Destinatario) => void;
  onQuitar: () => void;
}) {
  const [aplicada, setAplicada] = useState<string | undefined>(undefined);
  const [texto, setTexto] = useBusquedaDiferida(aplicada, (q) => setAplicada(q ?? undefined));
  const q = aplicada && aplicada.length >= 2 ? aplicada : undefined;
  const destinatarios = useDestinatarios(q, !elegido && (soloDocentes || q !== undefined));
  const lista = destinatarios.data ?? [];

  if (elegido) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted">Para:</span>
        <button
          type="button"
          onClick={onQuitar}
          aria-label={`Quitar a ${elegido.etiqueta} de los destinatarios`}
          className="inline-flex items-center gap-1.5 rounded-full border border-linea-fuerte bg-surface px-3 py-1 text-sm text-paper hover:border-accent"
        >
          {elegido.etiqueta}
          <X aria-hidden="true" className="h-3.5 w-3.5 text-muted" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {!soloDocentes && (
        <Input
          type="search"
          aria-label="Para"
          placeholder="Para: busca una persona (2 letras del nombre)"
          value={texto}
          maxLength={LIMITES.busqueda.max}
          autoComplete="off"
          onChange={(e) => setTexto(e.target.value)}
        />
      )}
      {destinatarios.error && <MensajeError mensaje={destinatarios.error.message} />}
      {(soloDocentes || q) && destinatarios.isSuccess && lista.length === 0 && (
        <p className="text-sm text-muted">
          {soloDocentes
            ? "Aún no tienes docentes: únete a un curso para escribirle a tu docente."
            : "No hay nadie con esa búsqueda."}
        </p>
      )}
      <ul className="flex flex-wrap gap-2" aria-label="Resultados">
        {lista.map((d) => (
          <li key={valorDestino(d)}>
            <button
              type="button"
              onClick={() => onElegir(d)}
              className="rounded-full border border-linea-fuerte px-3 py-1 text-sm text-paper hover:border-accent hover:bg-surface"
            >
              {d.etiqueta}
              {/* El estudiante ve solo el nombre; el resto distingue cursos y grupos. */}
              {!soloDocentes && d.detalle && <span className="text-muted"> · {d.detalle}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Conversación en borrador (HU-F-508): "Para:" arriba, el campo de mensaje abajo, sin ventanas. El
 * asunto es el nombre de quien escribe. Al enviar pasa a la conversación real.
 */
export function NuevoMensajeChat({ soloDocentes, para }: NuevoMensajeChatProps) {
  const { perfil } = usePerfil();
  const { avisar } = useAviso();
  const navigate = useNavigate();
  const rutas = useRutasMensajes();
  const enviar = useEnviarMensaje();
  const [destino, setDestino] = useState<Destinatario | null>(para ?? null);
  const [texto, setTexto] = useState("");
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const aviso = destino ? confirmacionDeGrupo(destino) : null;

  const mandar = () => {
    const cuerpo = esquemaRespuesta.safeParse({ cuerpo: texto });
    if (!destino) return setErrorLocal("Elige a quién le escribes.");
    if (!cuerpo.success)
      return setErrorLocal(cuerpo.error.issues[0]?.message ?? "Escribe un mensaje.");
    setErrorLocal(null);
    enviar.mutate(mensajeParaDestino(destino, asuntoDeNombre(perfil), cuerpo.data.cuerpo), {
      onSuccess: ({ data }) => {
        avisar({ mensaje: textoDeEnvio(destino, data.destinatarios) });
        navigate(rutas.hilo(data.hilo_id));
      },
    });
  };

  return (
    <div className="flex h-full min-h-[24rem] flex-col rounded-caja border border-linea">
      <header className="flex flex-col gap-2 border-b border-linea px-4 py-3">
        <h2 className="font-display text-lg font-semibold text-paper">Nuevo mensaje</h2>
        <SelectorPara
          elegido={destino}
          soloDocentes={soloDocentes}
          onElegir={setDestino}
          onQuitar={() => setDestino(null)}
        />
      </header>
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-6">
        <p className="max-w-prose text-center text-sm text-muted">
          {destino
            ? `Escribe tu primer mensaje para ${destino.etiqueta}.`
            : "Elige a quién le escribes."}
        </p>
      </div>
      {aviso && (
        <p role="status" className="border-t border-linea px-4 py-2 text-sm text-paper">
          {aviso}
        </p>
      )}
      <CampoDeMensaje
        etiqueta="Escribe tu mensaje"
        texto={texto}
        onTexto={setTexto}
        onEnviar={mandar}
        enviando={enviar.isPending}
        boton={aviso ? "Enviar aviso" : "Enviar"}
        // El backend decide a quién se puede escribir: su mensaje (403, 422, 429…) va tal cual.
        errores={[enviar.error?.message, errorLocal]}
      />
    </div>
  );
}
