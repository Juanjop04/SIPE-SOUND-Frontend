import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";
import { Tablatura, TrasteDivider, type DatoTablatura } from "@/shared/music";
import { MensajeError, Skeleton } from "@/shared/ui";
import { FormularioMejorBpm } from "../components/FormularioMejorBpm";
import { Metronomo } from "../components/Metronomo";
import { NoEncontradoContenido } from "../components/NoEncontradoContenido";
import { PasosEjercicio } from "../components/PasosEjercicio";
import { useEjercicios } from "../hooks/useEjercicios";
import type { Ejercicio } from "../types";
import { ajustarBpm, tiemposDelCompas } from "../utils/compas";

const BPM_POR_DEFECTO = 60;
const COMPAS_POR_DEFECTO = "4/4";

function datos(e: Ejercicio): DatoTablatura[] {
  const lista: DatoTablatura[] = [{ clave: "nivel", valor: e.nivel }];
  if (e.bpm_recomendado) lista.push({ clave: "bpm", valor: `♩ ${e.bpm_recomendado} BPM` });
  lista.push({ clave: "compas", valor: e.compas ?? COMPAS_POR_DEFECTO });
  if (e.duracion_min) lista.push({ clave: "duracion", valor: `${e.duracion_min} min` });
  if (e.acordes?.length) lista.push({ clave: "acordes", valor: e.acordes.join(" · ") });
  return lista;
}

function Practica({ ejercicio }: { ejercicio: Ejercicio }) {
  const { usuario } = useSession();
  // Inicia en el BPM recomendado.
  const [bpm, setBpm] = useState(ajustarBpm(ejercicio.bpm_recomendado ?? BPM_POR_DEFECTO));
  const compas = ejercicio.compas ?? COMPAS_POR_DEFECTO;

  return (
    <article>
      <Link to={paths.ejercicios} className="font-mono text-sm text-muted hover:text-accent">
        Ejercicios ›
      </Link>
      <h1 className="mt-2 font-display text-[2.5rem] font-semibold leading-tight text-paper">
        {ejercicio.nombre}
      </h1>
      <Tablatura datos={datos(ejercicio)} className="mt-3" />
      {ejercicio.descripcion && (
        <p className="mt-4 max-w-prose leading-relaxed text-muted">{ejercicio.descripcion}</p>
      )}
      <TrasteDivider className="my-8" />
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <PasosEjercicio pasos={ejercicio.pasos ?? []} />
        </div>
        <div className="flex flex-col gap-8 lg:col-span-5">
          <Metronomo
            bpm={bpm}
            onCambiarBpm={setBpm}
            tiempos={tiemposDelCompas(compas)}
            compas={compas}
          />
          {usuario ? (
            <FormularioMejorBpm ejercicioId={ejercicio.id} bpmActual={bpm} />
          ) : (
            <p className="text-sm text-muted">
              <Link to={paths.login} className="text-accent hover:underline">
                Inicia sesión
              </Link>{" "}
              para guardar el tempo que lograste.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/** Detalle desde el catálogo en caché: el backend no expone GET /ejercicios/{id}. */
export default function EjercicioDetallePage() {
  const { id } = useParams();
  const { data, isPending, error, refetch } = useEjercicios();
  const ejercicio = data?.find((e) => String(e.id) === id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {isPending && <Skeleton lineas={6} className="h-6 w-full" />}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && !ejercicio && <NoEncontradoContenido que="ejercicio" volverA={paths.ejercicios} />}
      {ejercicio && <Practica ejercicio={ejercicio} />}
    </main>
  );
}
