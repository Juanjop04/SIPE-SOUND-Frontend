import { Boca } from "@/shared/music";
import { Foto, Skeleton } from "@/shared/ui";

export interface EncabezadoInicioProps {
  nombre: string | null;
  nivel: string | null;
  /** Frase concreta construida con los datos (fraseDeInicio); null mientras carga la ruta. */
  frase: string | null;
  /** Avance global 0–100; null si aún no se puede calcular. */
  avance: number | null;
}

/** Saludo, nivel, foto de guitarra (sin texto encima) y la Boca del avance global. */
export function EncabezadoInicio({ nombre, nivel, frase, avance }: EncabezadoInicioProps) {
  return (
    <section
      aria-labelledby="saludo-inicio"
      className="grid overflow-hidden rounded-caja border border-linea bg-surface lg:grid-cols-[1fr_17rem_auto]"
    >
      <div className="flex flex-col justify-center gap-3 p-6">
        <h1 id="saludo-inicio" className="font-display text-3xl font-semibold text-paper">
          {nombre ? `Hola, ${nombre}.` : "Hola."}
        </h1>
        {frase === null ? (
          <Skeleton className="h-5 w-72 max-w-full" />
        ) : (
          <p className="max-w-prose text-muted">{frase}</p>
        )}
        {nivel && (
          <p className="w-fit rounded-full border border-success px-3 py-1 text-xs text-success">
            Nivel {nivel}
          </p>
        )}
      </div>
      <Foto
        nombre="guitarra-acustica"
        alt=""
        sizes="(min-width: 1024px) 17rem, 0px"
        className="hidden h-full lg:block"
      />
      <div className="flex items-center gap-4 border-t border-linea p-6 lg:border-l lg:border-t-0">
        {avance === null ? (
          <Skeleton className="h-24 w-24 rounded-full" />
        ) : (
          <Boca valor={avance} etiqueta="Progreso general de la ruta" tamano="sm" />
        )}
        <p className="max-w-[9rem] text-sm text-muted">Progreso general de la ruta</p>
      </div>
    </section>
  );
}
