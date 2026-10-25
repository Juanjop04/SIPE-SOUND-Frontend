import { useMemo, type ReactNode } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { puedeUsarAtril, useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";
import { ESCRITORIO, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { Button, EstadoVacio, claseBoton } from "@/shared/ui";
import { Bandeja } from "../components/Bandeja";
import { NuevoMensajeChat } from "../components/NuevoMensajeChat";
import { VistaHilo } from "../components/VistaHilo";
import { useDestinatarios } from "../hooks";
import type { Destinatario } from "../tipos";
import { HILO_NUEVO, conBusqueda, useFiltrosBandeja, useRutasMensajes } from "../useFiltrosBandeja";

/** Lo que se ve con la bandeja vacía: depende de quién mira (contrato de HU-F-407, estados). */
function Vacio({
  esEstudiante,
  puedeEscribir,
  onRedactar,
}: {
  esEstudiante: boolean;
  puedeEscribir: boolean;
  onRedactar: () => void;
}) {
  if (esEstudiante && !puedeEscribir) {
    return (
      <EstadoVacio
        titulo="Aún no tienes mensajes."
        descripcion="Únete a un curso para escribirle a tu docente."
        accion={
          <Link to={paths.cursos} className={claseBoton()}>
            Ir a Mis cursos
          </Link>
        }
      />
    );
  }
  return (
    <EstadoVacio
      titulo="Aún no tienes mensajes."
      accion={
        <Button onClick={onRedactar}>
          {esEstudiante ? "Escríbele a tu docente" : "Nuevo mensaje"}
        </Button>
      }
    />
  );
}

interface PanelesProps {
  ancha: boolean;
  hiloId: string | undefined;
  bandeja: ReactNode;
  hilo: ReactNode;
}

/** Escritorio: bandeja y hilo lado a lado. Móvil: una pantalla u otra, con "Volver a mensajes". */
function Paneles({ ancha, hiloId, bandeja, hilo }: PanelesProps) {
  const rutas = useRutasMensajes();
  const { busqueda } = useFiltrosBandeja();
  if (ancha) {
    return (
      <div className="grid h-[calc(100dvh-14rem)] min-h-[28rem] grid-cols-[360px_1fr] gap-6">
        <section aria-label="Bandeja" className="min-h-0 overflow-y-auto">
          {bandeja}
        </section>
        <section aria-label="Conversación" className="min-h-0 min-w-0">
          {hilo}
        </section>
      </div>
    );
  }
  if (!hiloId) return <section aria-label="Bandeja">{bandeja}</section>;
  return (
    <section
      aria-label="Conversación"
      className="flex h-[calc(100dvh-12rem)] min-h-[24rem] flex-col gap-3"
    >
      <Link
        to={conBusqueda(rutas.bandeja, busqueda)}
        className="w-fit text-sm text-accent hover:underline"
      >
        ← Volver a mensajes
      </Link>
      {hilo}
    </section>
  );
}

/** Persona con la que se abre el chat nuevo: ?para=<id>&nombre=<nombre> ("Escribirle"). */
function useParaDeLaUrl(): Destinatario | undefined {
  const [parametros] = useSearchParams();
  const id = parametros.get("para");
  const nombre = parametros.get("nombre");
  return useMemo(
    () => (id && nombre ? { tipo: "usuario", id, etiqueta: nombre, detalle: null } : undefined),
    [id, nombre],
  );
}

/** Bandeja y conversaciones (HU-F-407, HU-F-508): dos paneles en escritorio, dos pantallas en móvil. */
export default function MensajesPage() {
  const { hiloId } = useParams();
  const { rol } = useSession();
  const esEstudiante = !puedeUsarAtril(rol);
  const ancha = useMediaQuery(ESCRITORIO);
  const navigate = useNavigate();
  const rutas = useRutasMensajes();
  const para = useParaDeLaUrl();
  const redactando = hiloId === HILO_NUEVO;
  // Un estudiante solo puede escribirle a los docentes de sus cursos: sin ellos, no hay a quién.
  const docentes = useDestinatarios(undefined, esEstudiante);
  const puedeEscribir = !esEstudiante || (docentes.data?.length ?? 0) > 0;
  const redactar = () => navigate(rutas.nuevo);

  const bandeja = (
    <Bandeja
      activo={redactando ? undefined : hiloId}
      vacio={
        <Vacio esEstudiante={esEstudiante} puedeEscribir={puedeEscribir} onRedactar={redactar} />
      }
    />
  );
  let hilo: ReactNode = (
    <EstadoVacio titulo="Elige una conversación." descripcion="Su contenido aparece aquí." />
  );
  if (redactando) {
    hilo = (
      <NuevoMensajeChat key={para?.id ?? HILO_NUEVO} soloDocentes={esEstudiante} para={para} />
    );
  } else if (hiloId) {
    hilo = <VistaHilo key={hiloId} hiloId={hiloId} />;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-paper">Mensajes</h1>
        {puedeEscribir && !redactando && <Button onClick={redactar}>Nuevo mensaje</Button>}
      </div>
      <Paneles ancha={ancha} hiloId={hiloId} bandeja={bandeja} hilo={hilo} />
    </main>
  );
}
