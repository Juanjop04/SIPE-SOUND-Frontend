import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { paths } from "@/shared/config/paths.js";
import { EstadoVacio, MensajeError, Skeleton, Tabs } from "@/shared/ui";
import { BotonCrearContenido } from "../components/BotonCrearContenido";
import { PaginaAtril } from "../components/PaginaAtril";
import { useListadoContenido } from "../contenido/api";
import { FiltrosContenido } from "../contenido/components/FiltrosContenido";
import { TablaContenido } from "../contenido/components/TablaContenido";
import type { EstadoContenido, FiltrosListado, TipoContenido } from "../contenido/tipos";

function leerFiltros(parametros: URLSearchParams): FiltrosListado {
  const estado = parametros.get("estado") as EstadoContenido | null;
  const bloque = Number(parametros.get("bloque"));
  return {
    estado: estado ?? undefined,
    bloque_id: bloque > 0 ? bloque : undefined,
    q: parametros.get("q") || undefined,
    pagina: Math.max(1, Number(parametros.get("pagina")) || 1),
  };
}

function Listado({
  tipo,
  filtros,
  onPagina,
}: {
  tipo: TipoContenido;
  filtros: FiltrosListado;
  onPagina: (p: number) => void;
}) {
  const { data, isPending, error, refetch } = useListadoContenido(tipo, filtros);
  if (isPending) return <Skeleton lineas={5} className="h-11 w-full" />;
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  if (data.data.length === 0) {
    const filtrando = Boolean(filtros.estado || filtros.bloque_id || filtros.q);
    return (
      <EstadoVacio
        titulo={filtrando ? "Nada coincide con esos filtros." : `Aún no has creado ${tipo}.`}
        descripcion={
          filtrando
            ? "Prueba con otro estado o búsqueda."
            : "Empieza con un borrador: nadie lo ve hasta que lo publiques."
        }
      />
    );
  }
  return <TablaContenido tipo={tipo} filas={data.data} meta={data.meta} onPagina={onPagina} />;
}

export default function ContenidoPage() {
  const [parametros, setParametros] = useSearchParams();
  const tipo: TipoContenido = parametros.get("tipo") === "ejercicios" ? "ejercicios" : "lecciones";
  const filtros = leerFiltros(parametros);

  function cambiar(clave: string, valor: string) {
    const siguiente = new URLSearchParams(parametros);
    if (valor) siguiente.set(clave, valor);
    else siguiente.delete(clave);
    if (clave !== "pagina") siguiente.delete("pagina");
    setParametros(siguiente, { replace: true });
  }

  const listado = (
    <Listado tipo={tipo} filtros={filtros} onPagina={(p) => cambiar("pagina", String(p))} />
  );
  const nuevo =
    tipo === "lecciones" ? paths.docente.leccion("nueva") : paths.docente.ejercicio("nuevo");

  return (
    <PaginaAtril
      titulo="Contenido"
      descripcion="Lecciones y ejercicios: en borrador hasta que los publiques."
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <FiltrosContenido
          key={tipo}
          tipo={tipo}
          valores={{
            estado: parametros.get("estado") ?? "",
            bloque: parametros.get("bloque") ?? "",
            q: parametros.get("q") ?? "",
          }}
          onCambiar={cambiar}
        />
        <BotonCrearContenido to={nuevo}>
          <Plus size={16} aria-hidden="true" />
          {tipo === "lecciones" ? "Nueva lección" : "Nuevo ejercicio"}
        </BotonCrearContenido>
      </div>
      <Tabs
        etiqueta="Tipo de contenido"
        activa={tipo}
        onCambiar={(id) =>
          setParametros(id === "ejercicios" ? { tipo: id } : {}, { replace: true })
        }
        pestanas={[
          {
            id: "lecciones",
            etiqueta: "Lecciones",
            contenido: tipo === "lecciones" ? listado : null,
          },
          {
            id: "ejercicios",
            etiqueta: "Ejercicios",
            contenido: tipo === "ejercicios" ? listado : null,
          },
        ]}
      />
    </PaginaAtril>
  );
}
