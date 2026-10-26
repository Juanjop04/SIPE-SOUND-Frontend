import { useParams } from "react-router-dom";
import { MensajeError, Skeleton } from "@/shared/ui";
import { useContenido } from "../contenido/api";
import { FormularioEjercicio } from "../contenido/components/FormularioEjercicio";
import { FormularioLeccion } from "../contenido/components/FormularioLeccion";
import type { EjercicioDocente, LeccionDocente, TipoContenido } from "../contenido/tipos";

const NUEVOS = new Set(["nueva", "nuevo"]);

function Editor({ tipo }: { tipo: TipoContenido }) {
  const { id } = useParams();
  const ident = id && !NUEVOS.has(id) ? Number(id) : null;
  const { data, isPending, error, refetch } = useContenido(tipo, ident);

  if (ident !== null && isPending) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8" aria-busy="true">
        <Skeleton lineas={8} className="h-10 w-full" />
      </main>
    );
  }
  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <MensajeError mensaje={error.message} onReintentar={() => refetch()} />
      </main>
    );
  }
  // La clave reinicia el formulario al pasar de "nueva" al id recién creado.
  const clave = `${tipo}-${ident ?? "nuevo"}`;
  return tipo === "lecciones" ? (
    <FormularioLeccion key={clave} inicial={(data as LeccionDocente | undefined) ?? null} />
  ) : (
    <FormularioEjercicio key={clave} inicial={(data as EjercicioDocente | undefined) ?? null} />
  );
}

export function EditorLeccionPage() {
  return <Editor tipo="lecciones" />;
}

export function EditorEjercicioPage() {
  return <Editor tipo="ejercicios" />;
}
