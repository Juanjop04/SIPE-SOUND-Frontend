import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import type { ColumnaTabla } from "@/shared/ui";
import type { DocenteActividad } from "../tipos";

/** Primera columna: el nombre abre el detalle y debajo va el correo en mono. */
export const COLUMNA_NOMBRE: ColumnaTabla<DocenteActividad> = {
  id: "nombre",
  encabezado: "Nombre y correo",
  celda: (d) => (
    <span className="flex min-w-0 flex-col gap-0.5">
      <Link
        to={paths.admin.docente(d.docente_id)}
        className="font-semibold text-paper underline-offset-4 hover:underline"
      >
        {d.nombre}
      </Link>
      <span className="truncate font-mono text-xs text-muted">{d.email}</span>
    </span>
  ),
};

/** Última columna de las tablas de docentes: la flecha que abre su detalle. */
export const COLUMNA_DETALLE: ColumnaTabla<DocenteActividad> = {
  id: "abrir",
  encabezado: "Detalle",
  celda: (d) => (
    <Link
      to={paths.admin.docente(d.docente_id)}
      aria-label={`Ver el detalle de ${d.nombre}`}
      title="Ver el detalle"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-accent transition-colors duration-rapida hover:border-linea-fuerte hover:bg-surface"
    >
      <ChevronRight size={18} aria-hidden="true" />
    </Link>
  ),
};
