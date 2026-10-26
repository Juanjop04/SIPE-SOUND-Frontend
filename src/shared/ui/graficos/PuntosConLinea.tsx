import {
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colorToken } from "./colores";
import { MarcoGrafico } from "./MarcoGrafico";
import { TooltipGrafico } from "./TooltipGrafico";

export interface PuntoEvaluacion {
  id: number;
  /** Número del bloque: es el eje horizontal. */
  numero: number;
  nombre: string;
  /** Mejor puntaje, 0 a 100. */
  valor: number;
  aprobado: boolean;
}

export interface PuntosConLineaProps {
  titulo: string;
  unidad: string;
  lectura?: string;
  datos: PuntoEvaluacion[];
  /** Puntaje que se necesita para aprobar: la línea de referencia. */
  aprobacion: number;
}

interface PuntoProps {
  cx?: number;
  cy?: number;
  payload?: PuntoEvaluacion;
}

/** ● aprobado (relleno) · ○ no aprobado (solo contorno): la forma lo dice, no solo el color. */
function Punto({ cx = 0, cy = 0, payload }: PuntoProps) {
  const aprobado = payload?.aprobado;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill={aprobado ? colorToken("success") : colorToken("ink-2")}
      stroke={aprobado ? colorToken("success") : colorToken("muted")}
      strokeWidth={2}
    />
  );
}

/** Mejor puntaje de cada evaluación con la línea de aprobación marcada. */
export function PuntosConLinea({
  titulo,
  unidad,
  lectura,
  datos,
  aprobacion,
}: PuntosConLineaProps) {
  const numeros = datos.map((d) => d.numero);
  const tabla = {
    columnas: ["Bloque", "Mejor puntaje (%)", "Resultado"],
    filas: datos.map((d) => [
      `Bloque ${d.numero} · ${d.nombre}`,
      d.valor,
      d.aprobado ? "● Aprobado" : "○ No aprobado",
    ]),
  };
  return (
    <MarcoGrafico titulo={titulo} unidad={unidad} lectura={lectura} tabla={tabla}>
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 12, right: 16, bottom: 0, left: -12 }}>
            <XAxis
              type="number"
              dataKey="numero"
              ticks={numeros}
              domain={[Math.min(...numeros) - 0.5, Math.max(...numeros) + 0.5]}
              tickFormatter={(n: number) => `B${n}`}
              tick={{ fill: colorToken("muted"), fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: colorToken("linea") }}
              allowDecimals={false}
            />
            <YAxis
              type="number"
              dataKey="valor"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fill: colorToken("muted"), fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(n: number) => `${n} %`}
            />
            <ReferenceLine
              y={aprobacion}
              stroke={colorToken("accent")}
              strokeDasharray="4 4"
              label={{
                value: `Aprobación ${aprobacion} %`,
                position: "insideTopRight",
                fill: colorToken("accent"),
                fontSize: 11,
              }}
            />
            <Tooltip
              cursor={{ stroke: colorToken("linea"), strokeDasharray: "3 3" }}
              content={
                <TooltipGrafico
                  texto={(d) => ({
                    titulo: `Bloque ${d.numero} · ${d.nombre}`,
                    detalle: `${d.valor} % · ${d.aprobado ? "Aprobado" : "No aprobado"}`,
                  })}
                />
              }
            />
            <Scatter data={datos} shape={<Punto />} isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </MarcoGrafico>
  );
}
