import { useParams, useSearchParams } from "react-router-dom";
import { TrasteDivider } from "@/shared/music";
import { MensajeError, Skeleton, Tabs } from "@/shared/ui";
import { AjustesCurso } from "../cursos/components/AjustesCurso";
import { EditorRutaCurso } from "../cursos/components/EditorRutaCurso";
import { EncabezadoCurso } from "../cursos/components/EncabezadoCurso";
import { PestanaEstudiantes } from "../estudiantes/components/PestanaEstudiantes";
import { ListaEvaluaciones } from "../evaluaciones/components/ListaEvaluaciones";
import { useCurso } from "../cursos/hooks/useCursos";
import type { CursoDetalle } from "../types";

const PESTANAS = ["estudiantes", "ruta", "evaluaciones", "ajustes"] as const;
type Pestana = (typeof PESTANAS)[number];

function Contenido({ curso }: { curso: CursoDetalle }) {
  const [parametros, setParametros] = useSearchParams();
  const valor = parametros.get("pestana");
  const activa: Pestana = PESTANAS.includes(valor as Pestana) ? (valor as Pestana) : "ruta";
  const archivado = curso.archivado_en !== null;
  // La ruta guardada cambia tras guardar: la clave reinicia el editor con los datos nuevos.
  const claveRuta = curso.ruta.map((b) => b.bloque_id).join("-");

  return (
    <>
      <EncabezadoCurso curso={curso} />
      <TrasteDivider className="my-8" />
      <Tabs
        etiqueta="Secciones del curso"
        activa={activa}
        onCambiar={(id) => setParametros({ pestana: id }, { replace: true })}
        pestanas={[
          {
            id: "estudiantes",
            etiqueta: "Estudiantes",
            contenido: <PestanaEstudiantes curso={curso} />,
          },
          {
            id: "ruta",
            etiqueta: "Ruta",
            contenido: (
              <EditorRutaCurso
                key={claveRuta}
                cursoId={curso.id}
                guardada={curso.ruta}
                soloLectura={archivado}
              />
            ),
          },
          {
            id: "evaluaciones",
            etiqueta: "Evaluaciones",
            contenido: <ListaEvaluaciones cursoFijo={curso.id} />,
          },
          { id: "ajustes", etiqueta: "Ajustes", contenido: <AjustesCurso curso={curso} /> },
        ]}
      />
    </>
  );
}

export default function CursoDetallePage() {
  const { id } = useParams();
  const { data, isPending, error, refetch } = useCurso(Number(id));
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      {isPending && <Skeleton lineas={5} className="h-10 w-full" />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && <Contenido curso={data} />}
    </main>
  );
}
