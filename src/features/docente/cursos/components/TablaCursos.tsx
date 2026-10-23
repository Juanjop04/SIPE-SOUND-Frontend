import { useNavigate } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Table, type ColumnaTabla } from "@/shared/ui";
import type { Curso } from "../datos";
import { BotonCopiar } from "./BotonCopiar";

const COLUMNAS: ColumnaTabla<Curso>[] = [
  { id: "nombre", encabezado: "Nombre", celda: (c) => c.nombre, valorOrden: (c) => c.nombre },
  { id: "nivel", encabezado: "Nivel", celda: (c) => c.nivel, valorOrden: (c) => c.nivel },
  {
    id: "estudiantes",
    encabezado: "Estudiantes",
    numerica: true,
    celda: (c) => c.estudiantes,
    valorOrden: (c) => c.estudiantes,
  },
  {
    id: "bloques",
    encabezado: "Bloques en ruta",
    numerica: true,
    celda: (c) => c.bloques_en_ruta,
    valorOrden: (c) => c.bloques_en_ruta,
  },
  {
    id: "codigo",
    encabezado: "Código",
    celda: (c) => (
      <span className="relative z-10 inline-flex items-center gap-2">
        <span className="font-mono tracking-widest text-paper">{c.codigo_invitacion}</span>
        <BotonCopiar texto={c.codigo_invitacion} etiqueta={`Copiar el código de ${c.nombre}`} />
      </span>
    ),
  },
];

/** Tabla densa de cursos; el nombre abre el detalle (fila clicable accesible). */
export function TablaCursos({ cursos }: { cursos: Curso[] }) {
  const navigate = useNavigate();
  return (
    <Table
      etiqueta="Tus cursos"
      filas={cursos}
      columnas={COLUMNAS}
      obtenerId={(c) => c.id}
      onFilaClick={(c) => navigate(paths.docente.curso(c.id))}
    />
  );
}
