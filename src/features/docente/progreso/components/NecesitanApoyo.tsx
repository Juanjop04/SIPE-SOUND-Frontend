import { Button, EstadoVacio } from "@/shared/ui";
import type { NecesitaApoyo } from "../tipos";
import { nombreCompleto, textoMotivos } from "../utils";

/** Quién necesita apoyo hoy y por qué, en texto. "Escribirle" llega con la mensajería (HU-F-407). */
export function NecesitanApoyo({
  filas,
  onVer,
}: {
  filas: NecesitaApoyo[];
  onVer: (estudianteId: string) => void;
}) {
  if (filas.length === 0) {
    return (
      <EstadoVacio
        titulo="Nadie necesita apoyo ahora."
        descripcion="Todos avanzaron en las últimas dos semanas."
      />
    );
  }
  return (
    <ul className="divide-y divide-linea">
      {filas.map((f) => (
        <li key={`${f.estudiante_id}-${f.curso_id}`} className="flex flex-col gap-1 py-3">
          <p className="text-paper">{nombreCompleto(f)}</p>
          <p className="text-xs text-muted">{f.curso}</p>
          {textoMotivos(f).map((motivo) => (
            <p key={motivo} className="text-sm text-muted">
              {motivo}
            </p>
          ))}
          <div className="mt-1">
            <Button variante="secundario" tamano="sm" onClick={() => onVer(f.estudiante_id)}>
              Ver progreso
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
