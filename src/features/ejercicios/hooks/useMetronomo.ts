import { useCallback, useEffect, useRef, useState } from "react";
import { planificarNotas, type NotaPlanificada } from "../utils/compas";

// Planificación anticipada ("A tale of two clocks"): un temporizador corto solo DESPIERTA al
// planificador; el reloj es AudioContext.currentTime, que no se atrasa con el hilo principal.
const DESPERTAR_MS = 25;
const HORIZONTE_S = 0.1; // se programan los clics de los próximos 100 ms
const DURACION_CLIC_S = 0.03; // 30 ms
const FRECUENCIA_ACENTO_HZ = 1500; // tiempo 1 del compás
const FRECUENCIA_PULSO_HZ = 1000;

function sonarClic(contexto: AudioContext, tiempo: number, acento: boolean) {
  const oscilador = contexto.createOscillator();
  const volumen = contexto.createGain();
  oscilador.frequency.value = acento ? FRECUENCIA_ACENTO_HZ : FRECUENCIA_PULSO_HZ;
  volumen.gain.setValueAtTime(acento ? 0.6 : 0.35, tiempo);
  volumen.gain.exponentialRampToValueAtTime(0.001, tiempo + DURACION_CLIC_S);
  oscilador.connect(volumen).connect(contexto.destination);
  oscilador.start(tiempo);
  oscilador.stop(tiempo + DURACION_CLIC_S);
}

/** Metrónomo con Web Audio. `pulso` = tiempo del compás que está sonando (-1 en pausa). */
export function useMetronomo(bpm: number, tiempos: number) {
  const [sonando, setSonando] = useState(false);
  const [pulso, setPulso] = useState(-1);
  const contexto = useRef<AudioContext | null>(null);
  const siguiente = useRef({ tiempo: 0, pulso: 0 });
  const cola = useRef<NotaPlanificada[]>([]);
  const temporizador = useRef<ReturnType<typeof setInterval> | null>(null);
  const cuadro = useRef(0);
  // Cambiar el tempo mientras suena aplica desde el próximo clic.
  const ajustes = useRef({ bpm, tiempos });
  useEffect(() => {
    ajustes.current = { bpm, tiempos };
  }, [bpm, tiempos]);

  const planificar = useCallback(() => {
    const ctx = contexto.current;
    if (!ctx) return;
    const { bpm: tempo, tiempos: porCompas } = ajustes.current;
    const plan = planificarNotas(
      siguiente.current,
      ctx.currentTime + HORIZONTE_S,
      tempo,
      porCompas,
    );
    for (const nota of plan.notas) {
      sonarClic(ctx, nota.tiempo, nota.pulso === 0);
      cola.current.push(nota);
    }
    siguiente.current = plan.siguiente;
  }, []);

  const detener = useCallback(() => {
    if (temporizador.current) clearInterval(temporizador.current);
    temporizador.current = null;
    cancelAnimationFrame(cuadro.current);
    cola.current = [];
    setPulso(-1);
    setSonando(false);
  }, []);

  const iniciar = useCallback(async () => {
    // El AudioContext solo se crea tras una interacción del usuario (política de autoplay).
    contexto.current ??= new AudioContext();
    await contexto.current.resume();
    siguiente.current = { tiempo: contexto.current.currentTime + 0.05, pulso: 0 };
    temporizador.current = setInterval(planificar, DESPERTAR_MS);
    planificar();

    // El pulso visual sigue al reloj del audio, no al temporizador.
    const ctx = contexto.current;
    function dibujar() {
      while (cola.current.length > 0 && cola.current[0].tiempo <= ctx.currentTime) {
        setPulso(cola.current.shift()!.pulso);
      }
      cuadro.current = requestAnimationFrame(dibujar);
    }
    cuadro.current = requestAnimationFrame(dibujar);
    setSonando(true);
  }, [planificar]);

  const alternar = useCallback(() => {
    if (temporizador.current) detener();
    else void iniciar();
  }, [detener, iniciar]);

  // Libera el audio al salir de la página.
  useEffect(
    () => () => {
      detener();
      void contexto.current?.close();
      contexto.current = null;
    },
    [detener],
  );

  return { sonando, pulso, alternar };
}
