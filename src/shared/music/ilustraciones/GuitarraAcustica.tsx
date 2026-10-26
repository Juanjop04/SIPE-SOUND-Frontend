import { CUERDAS, curva, useAnimacionCuerdas } from "../animacionCuerdas";

export interface GuitarraAcusticaProps {
  /** Al pasar a true, las cuerdas suenan una vez (un rasgueo) y se apagan solas. */
  sonando?: boolean;
  className?: string;
}

// Guitarra acústica de frente y acostada: cuerpo a la izquierda, clavijero a la derecha.
const CUERPO =
  "M200 42C235 42 258 68 258 100C258 132 235 158 200 158C178 158 168 148 150 150" +
  "C130 152 120 182 85 182C35 182 12 145 12 100C12 55 35 18 85 18C120 18 130 48 150 50" +
  "C168 52 178 42 200 42Z";
const CLAVIJERO = "M420 82L468 74Q474 100 468 126L420 118Z";
// Trastes desde la cejuela (x = 420) hacia el cuerpo, cada vez más juntos.
const TRASTES = [396, 374, 354, 336, 319, 304, 290, 277, 265];
// Marcadores de los trastes 3, 5 y 7 (entre dos trastes).
const MARCADORES = [364, 327.5, 297];
const CLAVIJAS = [432, 446, 460];
// Las cuerdas de la animación miden 600 × 200 (y de 40 a 240): se llevan del puente a la cejuela.
const ESCALA_X = (420 - 68) / 600;
const ESCALA_Y = 20 / 200;
const RASGUEO_MS = 900;

/** Mástil con trastes cada vez más juntos, marcadores 3-5-7 y cejuela. */
function Mastil() {
  return (
    <>
      <rect
        x={250}
        y={86}
        width={170}
        height={28}
        className="fill-surface stroke-linea-fuerte"
        strokeWidth={1.5}
      />
      {TRASTES.map((x) => (
        <line
          key={x}
          x1={x}
          y1={86}
          x2={x}
          y2={114}
          className="stroke-linea-fuerte"
          strokeWidth={1.5}
        />
      ))}
      {MARCADORES.map((x) => (
        <circle key={x} cx={x} cy={100} r={3} className="fill-muted" />
      ))}
      <line x1={420} y1={86} x2={420} y2={114} className="stroke-muted" strokeWidth={3} />
    </>
  );
}

/** Ilustración decorativa del encabezado del inicio (HU-F-316). */
export function GuitarraAcustica({ sonando = false, className }: GuitarraAcusticaProps) {
  const cuerdasRef = useAnimacionCuerdas(sonando, { sueltas: false, rasgueoMs: RASGUEO_MS });

  return (
    <svg
      viewBox="0 0 480 200"
      width={480}
      height={200}
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path d={CUERPO} className="fill-surface stroke-linea-fuerte" strokeWidth={1.5} />
      <circle cx={195} cy={100} r={31} className="stroke-linea-fuerte" strokeWidth={1.5} />
      <circle
        cx={195}
        cy={100}
        r={26}
        className="fill-ink-2 stroke-linea-fuerte"
        strokeWidth={1.5}
      />
      <rect
        x={62}
        y={72}
        width={12}
        height={56}
        rx={3}
        className="fill-ink-2 stroke-linea-fuerte"
        strokeWidth={1.5}
      />

      <Mastil />

      <path d={CLAVIJERO} className="fill-surface stroke-linea-fuerte" strokeWidth={1.5} />
      {CLAVIJAS.map((x) => (
        <g key={x} className="fill-ink-2 stroke-linea-fuerte" strokeWidth={1.5}>
          <circle cx={x} cy={70} r={4} />
          <circle cx={x} cy={130} r={4} />
        </g>
      ))}

      <g transform={`translate(68 ${90 - 40 * ESCALA_Y}) scale(${ESCALA_X} ${ESCALA_Y})`}>
        {CUERDAS.map((c, i) => (
          <path
            key={c.y}
            ref={(el) => {
              cuerdasRef.current[i] = el;
            }}
            d={curva(c.y, 0)}
            className="stroke-paper"
            strokeOpacity={0.55}
            strokeWidth={c.grosor * 0.35}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}
