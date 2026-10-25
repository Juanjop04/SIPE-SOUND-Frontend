import { BookOpen, ClipboardCheck, Timer } from "lucide-react";
import { useActividad, type EventoActividad } from "@/features/progreso";
import { paths } from "@/shared/config/paths.js";
import { fechaRelativa } from "@/shared/lib/formato";
import { EstadoVacio } from "@/shared/ui";
import { PanelInicio } from "./PanelInicio";

const ICONOS = { leccion: BookOpen, ejercicio: Timer, evaluacion: ClipboardCheck };
const MAXIMO = 5;

function detalle(evento: EventoActividad): string {
  if (evento.tipo === "evaluacion") {
    return `Evaluación · ${evento.puntaje} % · ${evento.aprobado ? "aprobada" : "no aprobada"}`;
  }
  if (evento.tipo === "ejercicio") {
    return evento.mejor_bpm
      ? `Ejercicio · logrado a ${evento.mejor_bpm} BPM`
      : "Ejercicio practicado";
  }
  return evento.completado ? "Lección completada" : "Lección en curso";
}

/** Lo último que registró el estudiante (HU-B-324): solo eventos reales, con fecha relativa. */
export function UltimaActividad({ eventos }: { eventos: EventoActividad[] }) {
  if (eventos.length === 0) {
    return (
      <EstadoVacio
        titulo="Aquí verás lo que vayas practicando."
        descripcion="Completa una lección o un ejercicio para empezar."
      />
    );
  }
  return (
    <ul className="flex flex-col divide-y divide-linea">
      {eventos.slice(0, MAXIMO).map((evento) => {
        const Icono = ICONOS[evento.tipo];
        const exito = evento.completado || evento.aprobado;
        return (
          <li
            key={`${evento.tipo}-${evento.id}-${evento.fecha}`}
            className="flex items-start gap-3 py-3"
          >
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink-2 ${exito ? "text-success" : "text-accent"}`}
            >
              <Icono size={16} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-muted">{detalle(evento)}</p>
              <p className="truncate text-sm text-paper">{evento.titulo}</p>
              <p className="font-mono text-xs text-muted">{fechaRelativa(evento.fecha)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Sección "Actividad reciente" del inicio; sin HU-B-324 (404) muestra un aviso, no un error. */
export function PanelActividad({ className }: { className?: string }) {
  const actividad = useActividad();
  return (
    <PanelInicio
      titulo="Actividad reciente"
      enlace={{ a: paths.progreso, texto: "Ver mi progreso" }}
      className={className}
      cargando={actividad.isPending}
      error={actividad.noDisponible ? null : actividad.error}
      onReintentar={() => actividad.refetch()}
    >
      {actividad.data && <UltimaActividad eventos={actividad.data.recientes} />}
      {actividad.noDisponible && (
        <p className="text-sm text-muted">
          Tu actividad aparecerá aquí cuando el servidor se actualice.
        </p>
      )}
    </PanelInicio>
  );
}
