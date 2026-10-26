import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { EstadoVacio, MensajeError, Skeleton, claseBoton } from "@/shared/ui";
import { PaginaAtril } from "../components/PaginaAtril";
import { useEvaluacionDocente, useResultadosEvaluacion } from "../evaluaciones/api";
import { DialogoComentario, type Destinatario } from "../evaluaciones/datos";
import {
  CifrasResultados,
  EstudiantesResultados,
  PreguntasDificiles,
  SinPresentar,
} from "../evaluaciones/components/SeccionesResultados";

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section aria-label={titulo} className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-semibold text-paper">{titulo}</h2>
      {children}
    </section>
  );
}

/** /docente/evaluaciones/:id/resultados: qué pregunta cuesta más y quién falta (HU-F-310). */
export default function ResultadosEvaluacionPage() {
  const id = Number(useParams().id);
  const evaluacion = useEvaluacionDocente(id);
  const { data, isPending, error, refetch } = useResultadosEvaluacion(id);
  const [recordar, setRecordar] = useState<Destinatario | null>(null);
  const cursoId = evaluacion.data?.curso_id ?? null;
  const titulo = evaluacion.data?.titulo ?? "";

  return (
    <PaginaAtril
      titulo={titulo ? `Resultados: ${titulo}` : "Resultados"}
      descripcion="Las preguntas van de la más difícil a la más fácil: responde «¿qué repaso mañana?»."
    >
      <Link
        to={paths.docente.evaluacion(id)}
        className={claseBoton({ variante: "secundario", tamano: "sm", className: "-mt-4 mb-6" })}
      >
        ← Volver a la evaluación
      </Link>
      {isPending && <Skeleton lineas={6} className="h-12 w-full" />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.estudiantes_que_presentaron === 0 && (
        <EstadoVacio
          titulo="Nadie ha presentado esta evaluación."
          descripcion="Los resultados aparecen con el primer intento."
        />
      )}
      {data && (
        <div className="flex flex-col gap-10">
          {data.estudiantes_que_presentaron > 0 && (
            <>
              <CifrasResultados r={data} />
              <Seccion titulo="Preguntas, de la más difícil a la más fácil">
                <PreguntasDificiles r={data} />
              </Seccion>
              <Seccion titulo="Estudiantes">
                <EstudiantesResultados r={data} cursoId={cursoId} />
              </Seccion>
            </>
          )}
          {cursoId !== null && data.sin_presentar.length > 0 && (
            <Seccion titulo={`No han presentado (${data.sin_presentar.length})`}>
              <SinPresentar
                r={data}
                onRecordar={(e) =>
                  setRecordar({
                    cursoId,
                    estudianteId: e.estudiante_id,
                    nombre: e.nombre,
                    mensaje: `Te recuerdo presentar la evaluación «${titulo}». Repasa el tema y preséntala antes de la fecha límite.`,
                  })
                }
              />
            </Seccion>
          )}
        </div>
      )}
      <DialogoComentario
        key={recordar?.estudianteId ?? "ninguno"}
        destinatario={recordar}
        onCerrar={() => setRecordar(null)}
      />
    </PaginaAtril>
  );
}
