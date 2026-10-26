import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { colorToken, ESTADO_GRAFICO, type EstadoGrafico } from "./colores";
import { MarcoGrafico } from "./MarcoGrafico";
import { TooltipGrafico } from "./TooltipGrafico";

export interface TramoApilado {
  estado: Extract<EstadoGrafico, "sin_iniciar" | "en_curso" | "finalizado">;
  cantidad: number;
}

export interface BarraApiladaProps {
  titulo: string;
  unidad: string;
  lectura?: string;
  tramos: TramoApilado[];
}

/**
 * Una sola barra dividida por estados (en lugar de una dona): cada tramo y su leyenda llevan el
 * nombre y el conteo escritos, y los tramos se distinguen también por el orden.
 */
export function BarraApilada({ titulo, unidad, lectura, tramos }: BarraApiladaProps) {
  const total = tramos.reduce((suma, t) => suma + t.cantidad, 0);
  const fila: Record<string, number> = Object.fromEntries(
    tramos.map((t) => [t.estado, t.cantidad]),
  );
  const tabla = {
    columnas: ["Estado", "Estudiantes", "Porcentaje"],
    filas: tramos.map((t) => [
      ESTADO_GRAFICO[t.estado].texto,
      t.cantidad,
      `${total === 0 ? 0 : Math.round((t.cantidad / total) * 100)} %`,
    ]),
  };
  return (
    <MarcoGrafico titulo={titulo} unidad={unidad} lectura={lectura} tabla={tabla}>
      <div className="flex flex-col gap-3">
        <div className="h-14 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[fila]}
              layout="vertical"
              stackOffset="expand"
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis type="number" hide domain={[0, 1]} />
              <YAxis type="category" hide dataKey={() => ""} />
              <Tooltip
                cursor={false}
                content={
                  <TooltipGrafico
                    texto={() => ({
                      titulo: titulo,
                      detalle: tramos
                        .map((t) => `${ESTADO_GRAFICO[t.estado].texto}: ${t.cantidad}`)
                        .join(" · "),
                    })}
                  />
                }
              />
              {tramos.map((t) => (
                <Bar
                  key={t.estado}
                  dataKey={t.estado}
                  stackId="estados"
                  fill={colorToken(ESTADO_GRAFICO[t.estado].color)}
                  stroke={colorToken("ink-2")}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {tramos.map((t) => (
            <li key={t.estado} className="flex items-center gap-2 text-muted">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-sm"
                style={{ background: colorToken(ESTADO_GRAFICO[t.estado].color) }}
              />
              {ESTADO_GRAFICO[t.estado].texto}
              <span className="font-mono tabular-nums text-paper">{t.cantidad}</span>
            </li>
          ))}
        </ul>
      </div>
    </MarcoGrafico>
  );
}
