import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paths } from "@/shared/config/paths.js";
import { Button, claseBoton, Dialog, EstadoVacio, Interruptor, useAviso } from "@/shared/ui";
import { progresoKeys } from "../datos";
import { descargar, evaluacionesApi, evaluacionesKeys } from "../externos";
import type { BloqueDelCurso, EvaluacionDelPanel } from "../tipos";
import { ETIQUETA_EVALUACION, evaluacionesACsv } from "../utils";

interface EvaluacionesCursoProps {
  evaluaciones: EvaluacionDelPanel[];
  bloques: BloqueDelCurso[];
}

/** Abrir = publicar; cerrar = cerrar. Refresca las series, la lista y el resumen del atril. */
function useCambiarEstado() {
  const queryClient = useQueryClient();
  const { avisar } = useAviso();
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: "publicada" | "cerrada" }) =>
      evaluacionesApi.estado(id, estado),
    onSuccess: ({ message }) => {
      avisar({ mensaje: message });
      queryClient.invalidateQueries({ queryKey: progresoKeys.todo });
      queryClient.invalidateQueries({ queryKey: evaluacionesKeys.todo });
    },
    onError: (error) => avisar({ mensaje: error.message, tipo: "error" }),
  });
}

function Cifra({ valor, etiqueta }: { valor: string | number; etiqueta: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dd className="font-mono tabular-nums text-paper">{valor}</dd>
      <dt className="text-xs text-muted">{etiqueta}</dt>
    </div>
  );
}

interface FilaProps {
  evaluacion: EvaluacionDelPanel;
  bloque: BloqueDelCurso | undefined;
  ocupada: boolean;
  onAbrir: () => void;
  onPedirCierre: () => void;
}

function Fila({ evaluacion: e, bloque, ocupada, onAbrir, onPedirCierre }: FilaProps) {
  const abierta = e.estado === "publicada";
  const fallada = bloque?.pregunta_mas_fallada;
  return (
    <li className="flex flex-col gap-3 py-4 lg:grid lg:grid-cols-[2fr_auto_auto] lg:items-center lg:gap-6">
      <div className="min-w-0">
        <p className="text-paper">{e.titulo}</p>
        <p className="text-xs text-muted">
          {bloque ? `Bloque ${bloque.numero} · ${bloque.titulo}` : "Evaluación del curso"}
          {" · "}
          {ETIQUETA_EVALUACION[e.estado]}
        </p>
        <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <Cifra valor={e.intentos} etiqueta="intentos" />
          <Cifra valor={e.aprobados} etiqueta="aprobados" />
          <Cifra
            valor={e.promedio_puntaje === null ? "—" : `${e.promedio_puntaje} %`}
            etiqueta="promedio"
          />
        </dl>
        {fallada && (
          <p className="mt-2 line-clamp-2 text-sm text-muted">
            Más fallada: «{fallada.enunciado}» ({fallada.fallos}{" "}
            {fallada.fallos === 1 ? "fallo" : "fallos"})
          </p>
        )}
      </div>
      {e.estado === "borrador" ? (
        <p className="text-sm text-muted">Se abre desde el editor.</p>
      ) : (
        <Interruptor
          activo={abierta}
          disabled={ocupada}
          etiqueta={`${e.titulo}: ${abierta ? "abierta" : "cerrada"}`}
          texto={abierta ? "Abierta: se puede presentar" : "Cerrada: no se puede presentar"}
          titulo={abierta ? "Cerrar la evaluación" : "Abrir la evaluación"}
          onCambiar={abierta ? onPedirCierre : onAbrir}
        />
      )}
      <div className="flex gap-2">
        <Link
          to={paths.docente.evaluacion(e.evaluacion_id)}
          className={claseBoton({ variante: "fantasma", tamano: "sm" })}
        >
          Editar
        </Link>
        <Link
          to={paths.docente.resultados(e.evaluacion_id)}
          className={claseBoton({ variante: "secundario", tamano: "sm" })}
        >
          Resultados
        </Link>
      </div>
    </li>
  );
}

/**
 * Evaluaciones del curso con un interruptor Abierta/Cerrada. Cerrar pide confirmación (los
 * estudiantes dejan de poder presentarla); abrir, no. Sin excepciones por estudiante.
 */
export function EvaluacionesCurso({ evaluaciones, bloques }: EvaluacionesCursoProps) {
  const cambiar = useCambiarEstado();
  const [porCerrar, setPorCerrar] = useState<EvaluacionDelPanel | null>(null);

  if (evaluaciones.length === 0) {
    return (
      <EstadoVacio
        titulo="No hay evaluaciones con estos filtros."
        descripcion="Las evaluaciones de los bloques de tu ruta aparecen aquí."
      />
    );
  }
  const ocupadaId = cambiar.isPending ? cambiar.variables.id : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button
          variante="secundario"
          tamano="sm"
          onClick={() => descargar("evaluaciones.csv", evaluacionesACsv(evaluaciones, bloques))}
        >
          Exportar CSV
        </Button>
      </div>
      <ul className="divide-y divide-linea">
        {evaluaciones.map((e) => (
          <Fila
            key={e.evaluacion_id}
            evaluacion={e}
            bloque={bloques.find((b) => b.bloque_id === e.bloque_id)}
            ocupada={ocupadaId === e.evaluacion_id}
            onAbrir={() => cambiar.mutate({ id: e.evaluacion_id, estado: "publicada" })}
            onPedirCierre={() => setPorCerrar(e)}
          />
        ))}
      </ul>
      <Dialog
        abierto={porCerrar !== null}
        onCerrar={() => setPorCerrar(null)}
        titulo={`¿Cerrar «${porCerrar?.titulo ?? ""}»?`}
        descripcion="Los estudiantes ya no podrán presentarla. Puedes abrirla de nuevo cuando quieras."
      >
        <div className="flex justify-end gap-3">
          <Button variante="fantasma" onClick={() => setPorCerrar(null)}>
            Cancelar
          </Button>
          <Button
            cargando={cambiar.isPending}
            onClick={() => {
              if (!porCerrar) return;
              cambiar.mutate(
                { id: porCerrar.evaluacion_id, estado: "cerrada" },
                { onSettled: () => setPorCerrar(null) },
              );
            }}
          >
            Cerrar evaluación
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
