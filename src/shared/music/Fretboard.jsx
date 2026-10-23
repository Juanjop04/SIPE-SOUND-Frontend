import { useEffect, useRef } from "react";
import { leerColorToken } from "@/shared/lib/tokens.js";

// Cada cuerda: altura (y), grosor, cuánto se mueve (amp) y cuánto dura
// una vibración (dur). Las gruesas vibran más lento y se mueven menos.
const CUERDAS = [
  { y: 40, grosor: 2.5, amp: 14, dur: 0.4 },
  { y: 80, grosor: 2.5, amp: 13, dur: 0.4 },
  { y: 120, grosor: 2, amp: 12, dur: 0.46 },
  { y: 160, grosor: 3, amp: 10, dur: 0.54 },
  { y: 200, grosor: 4, amp: 14, dur: 0.64 },
  { y: 240, grosor: 4, amp: 10, dur: 0.74 },
];
const TRASTES = [60, 190, 310, 420, 520];
const PUNTOS = [
  { x: 125, y: 140 },
  { x: 365, y: 140 },
];

// Cada cuánto se pulsa una cuerda (en milisegundos): mínimo + algo al azar
const PAUSA_MIN = 450;
const PAUSA_EXTRA = 900;

// Dibuja una cuerda como curva. d = cuánto se dobla en el centro:
// 0 = recta, negativo = hacia arriba, positivo = hacia abajo.
const curva = (y, d) => `M0 ${y} Q 300 ${y + d} 600 ${y}`;

// tocando = true  -> todas las cuerdas vibran (se está enviando el formulario)
// siempre         -> se van pulsando cuerdas sueltas, una a una y en desorden
export function Fretboard({ tocando }) {
  const cuerdasRef = useRef([]);
  const intensidad = useRef(0); // 0 = quieta, 1 = vibrando a tope
  const objetivo = useRef(0);

  useEffect(() => {
    objetivo.current = tocando ? 1 : 0;
  }, [tocando]);

  useEffect(() => {
    const quiereMenosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (quiereMenosMovimiento) return;

    // Colores de la cuerda quieta (paper) y sonando (success), leídos una sola vez de tokens.css.
    const quieta = leerColorToken("paper");
    const sonando = leerColorToken("success");
    const mezclar = (brillo) =>
      quieta.map((canal, i) => Math.round(canal + (sonando[i] - canal) * brillo)).join(", ");

    const inicio = performance.now();
    // Una pulsación por cuerda: cuándo ocurrió y qué tan fuerte fue
    const toques = CUERDAS.map(() => ({ t: 0, fuerza: 0 }));
    let siguiente = inicio + 400; // primera pulsación a los 0.4 s
    let ultima = -1;
    let frame;

    function animar(ahora) {
      const t = (ahora - inicio) / 1000;

      // Sube o baja la vibración general poco a poco
      intensidad.current += (objetivo.current - intensidad.current) * 0.08;

      // ¿Toca pulsar una cuerda nueva? Se elige al azar, sin repetir la anterior.
      if (ahora >= siguiente) {
        let k;
        do {
          k = Math.floor(Math.random() * CUERDAS.length);
        } while (k === ultima);
        ultima = k;
        toques[k] = { t: ahora, fuerza: 0.7 + Math.random() * 0.3 };
        siguiente = ahora + PAUSA_MIN + Math.random() * PAUSA_EXTRA;
      }

      CUERDAS.forEach((c, i) => {
        const el = cuerdasRef.current[i];
        if (!el) return;

        // 1) Vibración general (cuando tocando = true)
        const fase = (t * 2 * Math.PI) / c.dur - i * 0.6;
        let d = Math.sin(fase) * c.amp * intensidad.current;

        // 2) Pulsación suelta: vibra fuerte y se va apagando
        let energia = 0;
        const toque = toques[i];
        if (toque.fuerza > 0) {
          const s = (ahora - toque.t) / 1000;
          energia = toque.fuerza * Math.exp(-s * 2.2);
          d += Math.sin((s * 2 * Math.PI) / (c.dur * 0.9)) * c.amp * 1.6 * energia;
          if (energia < 0.01) toque.fuerza = 0;
        }

        el.setAttribute("d", curva(c.y, d));

        // Color: de lila claro (quieta) a ámbar (sonando)
        const brillo = Math.min(1, Math.max(intensidad.current, energia));
        el.style.stroke = `rgb(${mezclar(brillo)})`;
        el.style.strokeOpacity = String(0.55 + 0.45 * brillo);
      });

      frame = requestAnimationFrame(animar);
    }

    frame = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg
      viewBox="0 0 600 280"
      className="w-full max-w-lg"
      role="img"
      aria-label="Mástil de guitarra con seis cuerdas"
    >
      {TRASTES.map((x) => (
        <line
          key={x}
          x1={x}
          y1="30"
          x2={x}
          y2="250"
          className="stroke-primary"
          strokeOpacity="0.35"
          strokeWidth="2"
        />
      ))}

      {PUNTOS.map((p) => (
        <circle key={p.x} cx={p.x} cy={p.y} r="9" className="fill-accent" fillOpacity="0.28" />
      ))}

      {CUERDAS.map((c, i) => (
        <path
          key={c.y}
          ref={(el) => (cuerdasRef.current[i] = el)}
          d={curva(c.y, 0)}
          fill="none"
          className="stroke-paper"
          strokeOpacity="0.55"
          strokeWidth={c.grosor}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
