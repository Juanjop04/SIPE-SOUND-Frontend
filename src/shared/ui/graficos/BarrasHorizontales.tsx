import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colorToken, ESTADO_GRAFICO, type EstadoGrafico } from "./colores";
import { MarcoGrafico } from "./MarcoGrafico";
import { TooltipGrafico } from "./TooltipGrafico";

export interface BarraHorizontal {
  id: string | number;
  nombre: string;
  /** 0 a 100. */
  valor: number;
  estado: EstadoGrafico;
}

export interface BarrasHorizontalesProps {
  titulo: string;
  unidad: string;
  lectura?: string;
  datos: BarraHorizontal[];
  /** Clic en una barra (por ejemplo, abrir el bloque). */
  onElegir?: (id: string | number) => void;
}

const ALTO_FILA = 44;
const ANCHO_NOMBRES = 150;
const MAX_NOMBRE = 18;

function recortar(texto: string): string {
  return texto.length > MAX_NOMBRE ? `${texto.slice(0, MAX_NOMBRE - 1)}…` : texto;
}

// Nombre del bloque o curso, recortado; el completo va en el tooltip y en la tabla.
function NombreEje(props: { x?: number; y?: number; payload?: { value: string } }) {
  const { x = 0, y = 0, payload } = props;
  return (
    <text x={x - 8} y={y} dy={4} textAnchor="end" fill={colorToken("paper")} fontSize={13}>
      <title>{payload?.value}</title>
      {recortar(payload?.value ?? "")}
    </text>
  );
}

interface EtiquetaProps {
  datos: BarraHorizontal[];
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  index?: number;
}

/** Porcentaje y estado escritos al final de la barra. */
function EtiquetaBarra({ datos, x, y, width, height, index }: EtiquetaProps) {
  const d = datos[Number(index)];
  if (!d) return null;
  return (
    <text
      x={Number(x) + Number(width) + 8}
      y={Number(y) + Number(height) / 2}
      dy={4}
      fontSize={12}
      fill={colorToken("muted")}
    >
      <tspan fill={colorToken("paper")} fontFamily="var(--font-mono, monospace)">
        {d.valor} %
      </tspan>
      <tspan dx={6}>{ESTADO_GRAFICO[d.estado].texto}</tspan>
    </text>
  );
}

/**
 * Una barra por bloque o curso, con su porcentaje y su estado escrito al final (el estado nunca va
 * solo por color). La pista gris muestra el 100 %. Recharts dibuja el SVG y da el foco con teclado.
 */
export function BarrasHorizontales({
  titulo,
  unidad,
  lectura,
  datos,
  onElegir,
}: BarrasHorizontalesProps) {
  const tabla = {
    columnas: ["Nombre", "Avance (%)", "Estado"],
    filas: datos.map((d) => [d.nombre, d.valor, ESTADO_GRAFICO[d.estado].texto]),
  };
  return (
    <MarcoGrafico titulo={titulo} unidad={unidad} lectura={lectura} tabla={tabla}>
      <div style={{ height: datos.length * ALTO_FILA + 12 }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={datos}
            layout="vertical"
            margin={{ top: 0, right: 112, bottom: 0, left: 0 }}
            barCategoryGap={10}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="nombre"
              width={ANCHO_NOMBRES}
              tick={<NombreEje />}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: colorToken("surface", 0.6) }}
              content={
                <TooltipGrafico
                  texto={(d) => ({
                    titulo: String(d.nombre),
                    detalle: `${d.valor} % · ${ESTADO_GRAFICO[d.estado as EstadoGrafico].texto}`,
                  })}
                />
              }
            />
            <Bar
              dataKey="valor"
              radius={4}
              background={{ fill: colorToken("ink-2"), radius: 4 }}
              minPointSize={3}
              cursor={onElegir ? "pointer" : undefined}
              onClick={(_, i) => onElegir?.(datos[i].id)}
              isAnimationActive={false}
            >
              {datos.map((d) => (
                <Cell key={d.id} fill={colorToken(ESTADO_GRAFICO[d.estado].color)} />
              ))}
              <LabelList
                dataKey="valor"
                position="right"
                content={<EtiquetaBarra datos={datos} />}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </MarcoGrafico>
  );
}
