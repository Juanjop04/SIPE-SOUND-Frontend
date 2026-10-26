import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colorToken, type TokenColor } from "./colores";
import { MarcoGrafico } from "./MarcoGrafico";
import { TooltipGrafico } from "./TooltipGrafico";

export interface SerieAgrupada {
  /** Clave del valor dentro de cada categoría. */
  clave: string;
  /** Nombre escrito en la leyenda, en el tooltip y en la tabla. */
  nombre: string;
  color: TokenColor;
}

export interface CategoriaAgrupada {
  id: string | number;
  nombre: string;
  /** Valor de cada serie; `null` = sin datos (se escribe "—"). */
  valores: Record<string, number | null>;
}

export interface BarrasAgrupadasProps {
  titulo: string;
  unidad: string;
  lectura?: string;
  series: SerieAgrupada[];
  categorias: CategoriaAgrupada[];
  /** Sufijo de cada valor ("%"); vacío si son conteos. */
  sufijo?: string;
  /** Tope del eje (100 para porcentajes); sin él se ajusta a los datos. */
  maximo?: number;
  /** Encabezado de la primera columna de la tabla ("Tramo", "Evaluación"). */
  etiquetaCategoria: string;
}

const MAX_NOMBRE = 14;
const recortar = (t: string) => (t.length > MAX_NOMBRE ? `${t.slice(0, MAX_NOMBRE - 1)}…` : t);

const textoDeValor = (v: number | null | undefined, sufijo: string) =>
  v == null ? "—" : `${v}${sufijo}`;

function tablaDe(
  etiquetaCategoria: string,
  series: SerieAgrupada[],
  categorias: CategoriaAgrupada[],
  sufijo: string,
) {
  return {
    columnas: [etiquetaCategoria, ...series.map((s) => s.nombre)],
    filas: categorias.map((c) => [
      c.nombre,
      ...series.map((s) => textoDeValor(c.valores[s.clave], sufijo)),
    ]),
  };
}

/**
 * Barras verticales por categoría, una por serie, con el valor escrito sobre cada barra y la
 * leyenda con el nombre de la serie: no se distinguen solo por color. Sirve para conteos
 * (distribución del avance) y para comparar dos medidas (puntaje y aprobación).
 */
export function BarrasAgrupadas({
  titulo,
  unidad,
  lectura,
  series,
  categorias,
  sufijo = "",
  maximo,
  etiquetaCategoria,
}: BarrasAgrupadasProps) {
  const datos = categorias.map((c) => ({ nombre: c.nombre, ...c.valores }));
  const texto = (v: number | null | undefined) => textoDeValor(v, sufijo);
  const tabla = tablaDe(etiquetaCategoria, series, categorias, sufijo);
  return (
    <MarcoGrafico titulo={titulo} unidad={unidad} lectura={lectura} tabla={tabla}>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos} margin={{ top: 20, right: 8, bottom: 0, left: -16 }}>
            <XAxis
              dataKey="nombre"
              tickFormatter={recortar}
              tick={{ fill: colorToken("muted"), fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: colorToken("linea") }}
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, maximo ?? "auto"]}
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
                    titulo: String(d.nombre),
                    detalle: series
                      .map((s) => `${s.nombre}: ${texto(d[s.clave] as number | null | undefined)}`)
                      .join(" · "),
                  })}
                />
              }
            />
            {series.length > 1 && (
              <Legend
                verticalAlign="bottom"
                formatter={(v: string) => (
                  <span style={{ color: colorToken("paper"), fontSize: 12 }}>{v}</span>
                )}
              />
            )}
            {series.map((s) => (
              <Bar
                key={s.clave}
                dataKey={s.clave}
                name={s.nombre}
                fill={colorToken(s.color)}
                radius={[3, 3, 0, 0]}
                minPointSize={2}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey={s.clave}
                  position="top"
                  fill={colorToken("paper")}
                  fontSize={11}
                  formatter={(v: unknown) => (typeof v === "number" ? `${v}${sufijo}` : "")}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </MarcoGrafico>
  );
}
