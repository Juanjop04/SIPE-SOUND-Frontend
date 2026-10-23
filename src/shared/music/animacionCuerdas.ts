import { useEffect, useRef } from "react";
import { leerColorToken } from "@/shared/lib/tokens.js";

// Animación del mástil de Fretboard: datos de cada cuerda y el bucle de requestAnimationFrame.

export interface Cuerda {
  y: number;
  grosor: number;
  /** Cuánto se mueve y cuánto dura una vibración: las gruesas vibran más lento y menos. */
  amp: number;
  dur: number;
}

interface Toque {
  t: number;
  fuerza: number;
}

export const CUERDAS: Cuerda[] = [
  { y: 40, grosor: 2.5, amp: 14, dur: 0.4 },
  { y: 80, grosor: 2.5, amp: 13, dur: 0.4 },
  { y: 120, grosor: 2, amp: 12, dur: 0.46 },
  { y: 160, grosor: 3, amp: 10, dur: 0.54 },
  { y: 200, grosor: 4, amp: 14, dur: 0.64 },
  { y: 240, grosor: 4, amp: 10, dur: 0.74 },
];
// Cada cuánto se pulsa una cuerda (ms): mínimo + algo al azar.
const PAUSA_MIN = 450;
const PAUSA_EXTRA = 900;

// Cuerda como curva. d = cuánto se dobla en el centro (0 = recta).
export const curva = (y: number, d: number) => `M0 ${y} Q 300 ${y + d} 600 ${y}`;

// Math.random es seguro aquí: solo decide qué cuerda suena en una animación decorativa
// (Sonar S2245 no aplica: no hay criptografía ni datos sensibles).
function azar(): number {
  // eslint-disable-next-line sonarjs/pseudo-random -- animación decorativa
  return Math.random();
}

/** Otra cuerda al azar, sin repetir la anterior. */
function elegirCuerda(ultima: number): number {
  let k = ultima;
  while (k === ultima) k = Math.floor(azar() * CUERDAS.length);
  return k;
}

/** Desplazamiento de la cuerda `i` por su pulsación suelta, que se apaga con el tiempo. */
function pulsacion(c: Cuerda, toque: Toque, ahora: number): { d: number; energia: number } {
  if (toque.fuerza <= 0) return { d: 0, energia: 0 };
  const s = (ahora - toque.t) / 1000;
  const energia = toque.fuerza * Math.exp(-s * 2.2);
  if (energia < 0.01) toque.fuerza = 0;
  return { d: Math.sin((s * 2 * Math.PI) / (c.dur * 0.9)) * c.amp * 1.6 * energia, energia };
}

export interface OpcionesAnimacion {
  /** false: sin pulsaciones sueltas al azar (solo suena cuando `tocando`). */
  sueltas?: boolean;
  /** Con un valor (ms), `tocando` es un rasgueo único: vibra ese tiempo y se apaga sola. */
  rasgueoMs?: number;
}

/** Anima las cuerdas: pulsaciones sueltas (por defecto); con `tocando`, vibran todas. */
export function useAnimacionCuerdas(
  tocando: boolean,
  { sueltas = true, rasgueoMs }: OpcionesAnimacion = {},
) {
  const cuerdasRef = useRef<(SVGPathElement | null)[]>([]);
  const intensidad = useRef(0); // 0 = quieta, 1 = vibrando a tope
  const objetivo = useRef(0);

  useEffect(() => {
    objetivo.current = tocando ? 1 : 0;
    if (!tocando || rasgueoMs === undefined) return undefined;
    const apagar = window.setTimeout(() => {
      objetivo.current = 0;
    }, rasgueoMs);
    return () => window.clearTimeout(apagar);
  }, [tocando, rasgueoMs]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    // Cuerda quieta (paper) y sonando (suena, ámbar), leídos una sola vez de tokens.css.
    const quieta = leerColorToken("paper");
    const sonando = leerColorToken("suena");
    const mezclar = (brillo: number) =>
      quieta.map((canal, i) => Math.round(canal + (sonando[i] - canal) * brillo)).join(", ");

    const inicio = performance.now();
    const toques: Toque[] = CUERDAS.map(() => ({ t: 0, fuerza: 0 }));
    let siguiente = inicio + 400; // primera pulsación a los 0.4 s
    let ultima = -1;
    let frame = 0;

    function animar(ahora: number) {
      const t = (ahora - inicio) / 1000;
      intensidad.current += (objetivo.current - intensidad.current) * 0.08;

      if (sueltas && ahora >= siguiente) {
        ultima = elegirCuerda(ultima);
        toques[ultima] = { t: ahora, fuerza: 0.7 + azar() * 0.3 };
        siguiente = ahora + PAUSA_MIN + azar() * PAUSA_EXTRA;
      }

      CUERDAS.forEach((c, i) => {
        const el = cuerdasRef.current[i];
        if (!el) return;
        const general = Math.sin((t * 2 * Math.PI) / c.dur - i * 0.6) * c.amp * intensidad.current;
        const suelta = pulsacion(c, toques[i], ahora);
        el.setAttribute("d", curva(c.y, general + suelta.d));
        // Color: de lila claro (quieta) a ámbar (sonando).
        const brillo = Math.min(1, Math.max(intensidad.current, suelta.energia));
        el.style.stroke = `rgb(${mezclar(brillo)})`;
        el.style.strokeOpacity = String(0.55 + 0.45 * brillo);
      });

      frame = requestAnimationFrame(animar);
    }

    frame = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(frame);
  }, [sueltas]);

  return cuerdasRef;
}
