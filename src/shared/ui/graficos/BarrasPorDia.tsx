import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { colorToken } from "./colores";
import { MarcoGrafico } from "./MarcoGrafico";
import { TooltipGrafico } from "./TooltipGrafico";

export interface BarraDia {
  /** AAAA-MM-DD. */
  fecha: string;
  valor: number;
}

export interface BarrasPorDiaProps {
  titulo: string;
  unidad: string;
  lectura?: string;
  datos: BarraDia[];
  /** Fecha (AAAA-MM-DD) que se marca como "hoy". */
  hoy?: string;
  /** Nombre de lo que se cuenta, en plural ("registros"). */
  etiquetaValor: string;
}

const CORTA = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", timeZone: "UTC" });
const LARGA = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const fechaUtc = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** Barras por día (actividad). Los días sin registros se ven como un trazo mínimo, no como un hueco. */
export function BarrasPorDia({
  titulo,
  unidad,
  lectura,
  datos,
  hoy,
  etiquetaValor,
}: BarrasPorDiaProps) {
  const tabla = {
    columnas: ["Día", etiquetaValor],
    filas: datos.map((d) => [LARGA.format(fechaUtc(d.fecha)), d.valor]),
  };
  return (
    <MarcoGrafico titulo={titulo} unidad={unidad} lectura={lectura} tabla={tabla}>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <XAxis
              dataKey="fecha"
              tickFormatter={(f: string) => CORTA.format(fechaUtc(f))}
              tick={{ fill: colorToken("muted"), fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: colorToken("linea") }}
              minTickGap={24}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: colorToken("muted"), fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              cursor={{ fill: colorToken("surface", 0.6) }}
              content={
                <TooltipGrafico
                  texto={(d) => ({
                    titulo: LARGA.format(fechaUtc(String(d.fecha))),
                    detalle: `${d.valor} ${etiquetaValor}`,
                  })}
                />
              }
            />
            <Bar dataKey="valor" radius={[3, 3, 0, 0]} minPointSize={2} isAnimationActive={false}>
              {datos.map((d) => (
                <Cell
                  key={d.fecha}
                  fill={colorToken(d.valor > 0 ? "primary-claro" : "linea")}
                  stroke={d.fecha === hoy ? colorToken("accent") : "none"}
                  strokeWidth={d.fecha === hoy ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </MarcoGrafico>
  );
}
