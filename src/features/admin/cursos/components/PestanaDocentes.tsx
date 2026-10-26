import { useState } from "react";
import { formatearFecha } from "@/shared/lib/formato";
import {
  EstadoVacio,
  Field,
  Input,
  MensajeError,
  Paginacion,
  Skeleton,
  Table,
  type ColumnaTabla,
} from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useDocentes } from "../hooks";
import type { DocenteAdmin } from "../tipos";
import { DialogoReasignar, type CursoPorReasignar } from "./DialogoReasignar";
import { DrawerDocente } from "./DrawerDocente";

const ESTADO: Record<DocenteAdmin["estado"], string> = {
  pendiente_verificacion: "Pendiente",
  activa: "Activa",
  suspendida: "Suspendida",
};

export const nombreDocente = (d: Pick<DocenteAdmin, "nombre" | "apellido">) =>
  [d.nombre, d.apellido].filter(Boolean).join(" ");

const COLUMNAS: ColumnaTabla<DocenteAdmin>[] = [
  { id: "nombre", encabezado: "Nombre", celda: (d) => nombreDocente(d) },
  {
    id: "correo",
    encabezado: "Correo",
    celda: (d) => <span className="whitespace-nowrap font-mono text-xs">{d.email}</span>,
  },
  { id: "estado", encabezado: "Estado", celda: (d) => ESTADO[d.estado] },
  { id: "cursos", encabezado: "Cursos activos", numerica: true, celda: (d) => d.cursos_activos },
  { id: "estudiantes", encabezado: "Estudiantes", numerica: true, celda: (d) => d.estudiantes },
  {
    id: "acceso",
    encabezado: "Último acceso",
    celda: (d) => <span className="font-mono text-xs">{formatearFecha(d.ultimo_acceso)}</span>,
  },
];

/** Pestaña "Docentes": tabla con búsqueda; abrir una fila muestra sus cursos y permite reasignarlos. */
export function PestanaDocentes() {
  const [q, setQ] = useState("");
  const [pagina, setPagina] = useState(1);
  const [abierto, setAbierto] = useState<DocenteAdmin | null>(null);
  const [porReasignar, setPorReasignar] = useState<CursoPorReasignar | null>(null);
  const { data, isPending, error, refetch } = useDocentes(q.trim() || undefined, pagina);

  return (
    <div className="flex flex-col gap-4">
      <Field etiqueta="Buscar docente" ayuda="Nombre, apellido o correo.">
        {(campo) => (
          <Input
            {...campo}
            type="search"
            value={q}
            maxLength={LIMITES.busqueda.max}
            autoComplete="off"
            onChange={(e) => {
              setQ(e.target.value);
              setPagina(1);
            }}
            className="max-w-md"
          />
        )}
      </Field>
      {isPending && (
        <div aria-busy="true">
          <Skeleton lineas={5} className="h-11 w-full" />
        </div>
      )}
      {error && !data && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.data.length === 0 && (
        <EstadoVacio titulo="No hay docentes con esta búsqueda." />
      )}
      {data && data.data.length > 0 && (
        <>
          <Table
            etiqueta="Docentes"
            filas={data.data}
            columnas={COLUMNAS}
            obtenerId={(d) => d.id}
            onFilaClick={setAbierto}
          />
          <Paginacion meta={data.meta} onPagina={setPagina} />
        </>
      )}
      <DrawerDocente
        docente={abierto}
        nombre={abierto ? nombreDocente(abierto) : ""}
        onCerrar={() => setAbierto(null)}
        onReasignar={setPorReasignar}
      />
      <DialogoReasignar curso={porReasignar} onCerrar={() => setPorReasignar(null)} />
    </div>
  );
}
