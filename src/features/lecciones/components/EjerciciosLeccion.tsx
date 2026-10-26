import { Link } from "react-router-dom";
import { useEjercicios } from "@/features/ejercicios";
import { paths } from "@/shared/config/paths.js";
import { Tablatura } from "@/shared/music";

/** Ejercicios asociados (leccion_id): nombre + tempo y compás + enlace a practicar. */
export function EjerciciosLeccion({ leccionId }: { leccionId: number }) {
  const { data } = useEjercicios();
  const ejercicios = (data ?? []).filter((e) => e.leccion_id === leccionId);
  if (ejercicios.length === 0) return null;

  return (
    <section aria-labelledby="ejercicios-leccion" className="mt-10">
      <h2 id="ejercicios-leccion" className="font-display text-xl font-semibold text-paper">
        Ejercicios
      </h2>
      <ul className="mt-2 flex flex-col">
        {ejercicios.map((ejercicio) => (
          <li
            key={ejercicio.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-linea py-3"
          >
            <div className="flex flex-col gap-1">
              <span className="text-paper">{ejercicio.nombre}</span>
              <Tablatura
                className="text-xs"
                datos={[
                  { clave: "bpm", valor: `♩ ${ejercicio.bpm_recomendado ?? "—"} BPM` },
                  { clave: "compas", valor: ejercicio.compas ?? "4/4" },
                ]}
              />
            </div>
            <Link
              to={paths.ejercicio(ejercicio.id)}
              className="text-sm text-accent underline underline-offset-2 hover:decoration-2"
            >
              Practicar
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
