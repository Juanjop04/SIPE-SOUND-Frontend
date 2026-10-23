import { useId } from "react";
import { ESCRITORIO, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import {
  areaBajo,
  etiquetaX,
  escalaY,
  fechaLarga,
  puntos,
  resumenEvolucion,
  trazoSuave,
  yDe,
  type Dia,
} from "../utils/evolucion";

const MARCO_ESCRITORIO = { ancho: 600, alto: 200, izquierda: 28, abajo: 24, arriba: 10 };
const MARCO_MOVIL = { ancho: 360, alto: 160, izquierda: 24, abajo: 24, arriba: 10 };
const registros = (n: number) => `${n} ${n === 1 ? "registro" : "registros"}`;
// La primera y la última etiqueta se anclan al borde para no salirse del gráfico.
function anclaX(i: number, total: number): "start" | "middle" | "end" {
  if (i === total - 1) return "end";
  return i === 0 ? "start" : "middle";
}

/**
 * Registros de avance por día en una curva SVG propia (HU-F-317, HU-F-322): sin librería; el área
 * bajo la curva se desvanece. Es una imagen con resumen; el detalle accesible está en la tabla de al lado.
 */
export function GraficoEvolucion({ dias }: { dias: Dia[] }) {
  const marco = useMediaQuery(ESCRITORIO) ? MARCO_ESCRITORIO : MARCO_MOVIL;
  const { tope, marcas } = escalaY(dias);
  const coordenadas = puntos(dias, marco, tope);
  const cada = marco === MARCO_ESCRITORIO ? 7 : 14;
  const idArea = useId();

  return (
    <svg
      viewBox={`0 0 ${marco.ancho} ${marco.alto}`}
      width={marco.ancho}
      height={marco.alto}
      role="img"
      aria-label={`Avance por día: ${resumenEvolucion(dias)}`}
      className="h-auto w-full"
    >
      {marcas.map((marca) => (
        <g key={marca}>
          <line
            x1={marco.izquierda}
            x2={marco.ancho}
            y1={yDe(marca, marco, tope)}
            y2={yDe(marca, marco, tope)}
            className="stroke-linea"
          />
          <text
            x={0}
            y={yDe(marca, marco, tope) + 4}
            fontSize={12}
            className="fill-muted font-mono"
          >
            {marca}
          </text>
        </g>
      ))}
      {/* Área que se desvanece bajo la curva (enmienda HU-F-322): decorativa; el dato es la línea. */}
      <defs>
        <linearGradient id={idArea} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="[stop-color:rgb(var(--color-primary)/0.55)]" />
          <stop offset="100%" className="[stop-color:rgb(var(--color-primary)/0)]" />
        </linearGradient>
      </defs>
      <path d={areaBajo(coordenadas, yDe(0, marco, tope))} fill={`url(#${idArea})`} />
      <path
        d={trazoSuave(coordenadas)}
        fill="none"
        className="stroke-primary-claro"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {dias.map((dia, i) => {
        const etiqueta = etiquetaX(dia.fecha, i, dias.length, cada);
        return (
          <g key={dia.fecha}>
            <circle cx={coordenadas[i].x} cy={coordenadas[i].y} r={12} className="fill-transparent">
              <title>{`${fechaLarga(dia.fecha)}: ${registros(dia.registros)}`}</title>
            </circle>
            <circle
              cx={coordenadas[i].x}
              cy={coordenadas[i].y}
              r={3.5}
              className="fill-primary-claro"
            />
            {etiqueta && (
              <text
                x={coordenadas[i].x}
                y={marco.alto - 6}
                fontSize={12}
                textAnchor={anclaX(i, dias.length)}
                className="fill-muted"
              >
                {etiqueta}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** La misma información como tabla (visible con "Ver como tabla" o solo para lectores). */
export function TablaEvolucion({ dias, oculta }: { dias: Dia[]; oculta: boolean }) {
  return (
    <table className={oculta ? "sr-only" : "w-full text-sm"}>
      <caption className="sr-only">Registros de avance por día</caption>
      <thead>
        <tr className="border-b border-linea text-left text-muted">
          <th scope="col" className="py-2 font-medium">
            Día
          </th>
          <th scope="col" className="py-2 text-right font-medium">
            Registros
          </th>
        </tr>
      </thead>
      <tbody>
        {[...dias].reverse().map((dia) => (
          <tr key={dia.fecha} className="border-b border-linea last:border-b-0">
            <td className="py-2 text-paper">{fechaLarga(dia.fecha)}</td>
            <td className="py-2 text-right font-mono tabular-nums text-paper">{dia.registros}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
