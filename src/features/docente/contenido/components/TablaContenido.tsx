import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { formatearFecha } from "@/shared/lib/formato";
import { Button, Table, type ColumnaTabla } from "@/shared/ui";
import { useBloques } from "../api";
import type { ContenidoDocente, EjercicioDocente, LeccionDocente, TipoContenido } from "../tipos";
import { EstadoPunto } from "./EstadoPunto";

const esLeccion = (c: ContenidoDocente): c is LeccionDocente => "titulo" in c;
const titulo = (c: ContenidoDocente) => (esLeccion(c) ? c.titulo : (c as EjercicioDocente).nombre);

function columnasDe(
  tipo: TipoContenido,
  nombreBloque: (id: number) => string,
  editor: (c: ContenidoDocente) => string,
): ColumnaTabla<ContenidoDocente>[] {
  const primera: ColumnaTabla<ContenidoDocente> =
    tipo === "lecciones"
      ? {
          id: "numero",
          encabezado: "N.º",
          numerica: true,
          celda: (c) => (c as LeccionDocente).numero,
          valorOrden: (c) => (c as LeccionDocente).numero,
        }
      : { id: "nivel", encabezado: "Nivel", celda: (c) => c.nivel, valorOrden: (c) => c.nivel };
  return [
    primera,
    {
      id: "titulo",
      encabezado: tipo === "lecciones" ? "Título" : "Nombre",
      celda: titulo,
      valorOrden: titulo,
    },
    {
      id: "relacion",
      encabezado: tipo === "lecciones" ? "Bloque" : "Lección",
      celda: (c) => (esLeccion(c) ? nombreBloque(c.bloque_id) : (c.leccion_id ?? "—")),
    },
    {
      id: "estado",
      encabezado: "Estado",
      celda: (c) => <EstadoPunto estado={c.estado} />,
      valorOrden: (c) => c.estado,
    },
    {
      id: "actualizado",
      encabezado: "Actualizado",
      numerica: true,
      celda: (c) => formatearFecha(c.actualizado_en),
      valorOrden: (c) => c.actualizado_en,
    },
    {
      id: "acciones",
      encabezado: "Acciones",
      celda: (c) => (
        <Link to={editor(c)} className="text-sm text-accent hover:underline">
          Editar
        </Link>
      ),
    },
  ];
}

interface TablaContenidoProps {
  tipo: TipoContenido;
  filas: ContenidoDocente[];
  meta: { pagina: number; por_pagina: number; total: number };
  onPagina: (pagina: number) => void;
}

/** Tabla densa común a lecciones y ejercicios, con paginación en mono. */
export function TablaContenido({ tipo, filas, meta, onPagina }: TablaContenidoProps) {
  const bloques = useBloques();
  const nombreBloque = (id: number) => {
    const bloque = bloques.data?.find((b) => b.id === id);
    return bloque ? `${bloque.numero}. ${bloque.titulo}` : "—";
  };
  const editor = (c: ContenidoDocente) =>
    tipo === "lecciones" ? paths.docente.leccion(c.id) : paths.docente.ejercicio(c.id);

  const columnas = columnasDe(tipo, nombreBloque, editor);

  return (
    <div className="flex flex-col gap-4">
      <Table
        etiqueta={tipo === "lecciones" ? "Tus lecciones" : "Tus ejercicios"}
        filas={filas}
        columnas={columnas}
        obtenerId={(c) => c.id}
      />
      <Paginacion meta={meta} onPagina={onPagina} />
    </div>
  );
}

/** "← Anterior · 1–20 de 45 · Siguiente →" en mono. */
function Paginacion({ meta, onPagina }: Pick<TablaContenidoProps, "meta" | "onPagina">) {
  const desde = (meta.pagina - 1) * meta.por_pagina + 1;
  const hasta = Math.min(meta.pagina * meta.por_pagina, meta.total);
  return (
    <nav aria-label="Páginas" className="flex items-center justify-between gap-3">
      <Button
        variante="fantasma"
        tamano="sm"
        disabled={meta.pagina <= 1}
        onClick={() => onPagina(meta.pagina - 1)}
      >
        ← Anterior
      </Button>
      <span className="font-mono text-sm text-muted">
        {desde}–{hasta} de {meta.total}
      </span>
      <Button
        variante="fantasma"
        tamano="sm"
        disabled={hasta >= meta.total}
        onClick={() => onPagina(meta.pagina + 1)}
      >
        Siguiente →
      </Button>
    </nav>
  );
}
