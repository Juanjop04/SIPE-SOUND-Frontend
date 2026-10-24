import { useState } from "react";
import { useWatch } from "react-hook-form";
import { PreguntaEvaluacion } from "@/features/evaluaciones";
import { Drawer, EstadoVacio } from "@/shared/ui";
import type { ControlEvaluacion } from "../schemas";

interface VistaEstudianteProps {
  abierta: boolean;
  onCerrar: () => void;
  control: ControlEvaluacion;
}

/** La evaluación tal como la verá el estudiante (componentes de HU-F-306), sin enviar nada. */
export function VistaEstudiante({ abierta, onCerrar, control }: VistaEstudianteProps) {
  const titulo = useWatch({ control, name: "titulo" });
  const preguntas = useWatch({ control, name: "preguntas" }) ?? [];
  const [elegidas, setElegidas] = useState<Record<number, number>>({});

  return (
    <Drawer
      ancho="amplio"
      abierto={abierta}
      onCerrar={onCerrar}
      titulo={titulo || "Vista de estudiante"}
      descripcion="Así la verá el estudiante. Puedes marcar opciones; no se envía nada."
    >
      {preguntas.length === 0 ? (
        <EstadoVacio titulo="Aún no hay preguntas que mostrar." />
      ) : (
        <ol className="flex flex-col gap-8">
          {preguntas.map((p, i) => (
            <li key={`${i}-${p.enunciado}`}>
              <PreguntaEvaluacion
                numero={i + 1}
                pregunta={{
                  id: i,
                  orden: i + 1,
                  enunciado: p.enunciado || "Enunciado de la pregunta",
                  opciones: p.opciones.map((o, j) => o.texto || `Opción ${j + 1}`),
                }}
                elegida={elegidas[i]}
                onElegir={(opcion) => setElegidas((actual) => ({ ...actual, [i]: opcion }))}
              />
            </li>
          ))}
        </ol>
      )}
    </Drawer>
  );
}
