import { useNavigate, useSearchParams } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import {
  type ColumnaTabla,
  EncabezadoPagina,
  EstadoVacio,
  MensajeError,
  Skeleton,
  Table,
} from "@/shared/ui";
import { FiltroNivel } from "../components/FiltroNivel";
import { useEjercicios } from "../hooks/useEjercicios";
import type { Ejercicio } from "../types";

const COLUMNAS: ColumnaTabla<Ejercicio>[] = [
  { id: "nombre", encabezado: "Nombre", celda: (e) => e.nombre, valorOrden: (e) => e.nombre },
  { id: "nivel", encabezado: "Nivel", celda: (e) => e.nivel, valorOrden: (e) => e.nivel },
  {
    id: "bpm",
    encabezado: "BPM",
    numerica: true,
    celda: (e) => e.bpm_recomendado ?? "—",
    valorOrden: (e) => e.bpm_recomendado ?? 0,
  },
  { id: "compas", encabezado: "Compás", numerica: true, celda: (e) => e.compas ?? "—" },
];

function Contenido({ nivel }: { nivel: string }) {
  const navigate = useNavigate();
  const { data, isPending, error, refetch } = useEjercicios();
  if (isPending) return <Skeleton lineas={5} className="h-11 w-full" />;
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;

  const filas = nivel ? data.filter((e) => e.nivel === nivel) : data;
  if (filas.length === 0) {
    return (
      <EstadoVacio
        titulo={
          nivel ? `No hay ejercicios de nivel ${nivel}.` : "Aún no hay ejercicios publicados."
        }
        descripcion="Mientras tanto, repasa los acordes de tu ruta."
      />
    );
  }
  return (
    <Table
      etiqueta="Ejercicios para practicar con metrónomo"
      filas={filas}
      columnas={COLUMNAS}
      obtenerId={(e) => e.id}
      onFilaClick={(e) => navigate(paths.ejercicio(e.id))}
    />
  );
}

export default function EjerciciosPage() {
  const [parametros, setParametros] = useSearchParams();
  const nivel = parametros.get("nivel") ?? "";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <EncabezadoPagina
        titulo="Ejercicios"
        descripcion="Rutinas para practicar a tempo, paso a paso."
        foto="practica-ritmo"
      >
        <FiltroNivel
          valor={nivel}
          onCambiar={(valor) => setParametros(valor ? { nivel: valor } : {}, { replace: true })}
        />
      </EncabezadoPagina>
      <div className="mt-8" aria-live="polite">
        <Contenido nivel={nivel} />
      </div>
    </main>
  );
}
