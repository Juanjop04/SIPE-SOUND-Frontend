import { fechaRelativa } from "@/shared/lib/formato";
import {
  Button,
  EstadoVacio,
  Field,
  Input,
  MensajeError,
  Paginacion,
  Select,
  Skeleton,
  Table,
  type ColumnaTabla,
} from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useDocentesActividad } from "../hooks";
import type { DocenteActividad, EstadoActividad, OrdenDocentes } from "../tipos";
import { useFiltrosDocentes } from "../useFiltrosDocentes";
import { COLUMNA_DETALLE, COLUMNA_NOMBRE } from "./ColumnaDetalle";
import { EstadoDeActividad, TEXTO_ESTADO } from "./EstadoDeActividad";

const COLUMNAS: ColumnaTabla<DocenteActividad>[] = [
  COLUMNA_NOMBRE,
  {
    id: "estado",
    encabezado: "Actividad",
    celda: (d) => <EstadoDeActividad estado={d.estado_actividad} />,
  },
  {
    id: "ultima",
    encabezado: "Última actividad",
    celda: (d) => (d.ultima_actividad ? fechaRelativa(d.ultima_actividad) : "Nunca"),
  },
  { id: "acciones", encabezado: "Acciones 30 d", numerica: true, celda: (d) => d.acciones_30d },
  { id: "cursos", encabezado: "Cursos", numerica: true, celda: (d) => d.cursos_asignados },
  { id: "estudiantes", encabezado: "Estudiantes", numerica: true, celda: (d) => d.estudiantes },
  COLUMNA_DETALLE,
];

const PLURAL_ESTADO: Record<EstadoActividad, string> = {
  activo: "Activos",
  inactivo: "Inactivos",
  sin_actividad: "Sin actividad",
};

const ORDENES: { valor: OrdenDocentes; etiqueta: string }[] = [
  { valor: "nombre", etiqueta: "Nombre" },
  { valor: "-cursos", etiqueta: "Más cursos" },
  { valor: "-estudiantes", etiqueta: "Más estudiantes" },
  { valor: "ultima_actividad", etiqueta: "Más tiempo sin actividad" },
  { valor: "-acciones_30d", etiqueta: "Más acciones en 30 días" },
];

/** Pestaña "Docentes": tabla con búsqueda, estado de actividad y orden; abrir una fila lleva a su detalle. */
export function PestanaDocentes() {
  const { filtros, cambiar, hayFiltros } = useFiltrosDocentes();
  const { data, isPending, error, refetch } = useDocentesActividad(filtros);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <Field etiqueta="Buscar docente">
          {(campo) => (
            <Input
              {...campo}
              type="search"
              value={filtros.q ?? ""}
              maxLength={LIMITES.busqueda.max}
              autoComplete="off"
              placeholder="Nombre, apellido o correo"
              onChange={(e) => cambiar({ q: e.target.value || null })}
              className="w-64"
            />
          )}
        </Field>
        <Field etiqueta="Actividad">
          {(campo) => (
            <Select
              {...campo}
              value={filtros.estado ?? ""}
              onChange={(e) => cambiar({ estado: e.target.value || null })}
            >
              <option value="">Todos</option>
              {(Object.keys(TEXTO_ESTADO) as EstadoActividad[]).map((e) => (
                <option key={e} value={e}>
                  {PLURAL_ESTADO[e]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field etiqueta="Ordenar por">
          {(campo) => (
            <Select
              {...campo}
              value={filtros.orden}
              onChange={(e) =>
                cambiar({ orden: e.target.value === "nombre" ? null : e.target.value })
              }
            >
              {ORDENES.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.etiqueta}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      {isPending && (
        <div aria-busy="true">
          <Skeleton lineas={5} className="h-11 w-full" />
        </div>
      )}
      {error && !data && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.data.length === 0 && (
        <EstadoVacio
          titulo="Ningún docente cumple estos filtros."
          accion={
            hayFiltros ? (
              <Button variante="secundario" onClick={() => cambiar({ q: null, estado: null })}>
                Quitar filtros
              </Button>
            ) : undefined
          }
        />
      )}
      {data && data.data.length > 0 && (
        <>
          <Table
            etiqueta="Docentes"
            filas={data.data}
            columnas={COLUMNAS}
            obtenerId={(d) => d.docente_id}
          />
          <p className="font-mono text-xs text-muted">
            {data.data.length} de {data.meta.total} docentes
          </p>
          <Paginacion meta={data.meta} onPagina={(p) => cambiar({ pagina: String(p) })} />
        </>
      )}
    </div>
  );
}
