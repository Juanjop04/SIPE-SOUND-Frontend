import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ESCRITORIO, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { paths } from "@/shared/config/paths.js";
import { Tabs } from "@/shared/ui";

interface MarcoEditorProps {
  titulo: string;
  formulario: ReactNode;
  previa: ReactNode;
}

/** Escritorio: formulario (7/12) + vista previa en vivo (5/12). Móvil: Tabs "Editar / Vista previa". */
export function MarcoEditor({ titulo, formulario, previa }: MarcoEditorProps) {
  const esEscritorio = useMediaQuery(ESCRITORIO);
  const marcoPrevia = (
    <div
      aria-label="Vista previa como la verá el estudiante"
      className="rounded-caja border border-linea p-5"
    >
      <p className="mb-2 font-mono text-xs text-muted">vista previa</p>
      {previa}
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-8">
      <Link
        to={paths.docente.contenido}
        className="font-mono text-sm text-accent underline underline-offset-2 hover:decoration-2"
      >
        ← Contenido
      </Link>
      <h1 className="mb-8 mt-2 font-display text-3xl font-semibold text-paper">{titulo}</h1>
      {esEscritorio ? (
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-7">{formulario}</div>
          <aside className="sticky top-6 col-span-5 self-start">{marcoPrevia}</aside>
        </div>
      ) : (
        <Tabs
          etiqueta="Editor"
          pestanas={[
            { id: "editar", etiqueta: "Editar", contenido: formulario },
            { id: "previa", etiqueta: "Vista previa", contenido: marcoPrevia },
          ]}
        />
      )}
    </main>
  );
}
