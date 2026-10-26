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

// La foto se funde con la tarjeta (enmienda HU-F-322): transparente a la izquierda, donde va el
// texto sobre surface sólido, y visible hacia la derecha. Ningún texto queda encima de la foto.
const MASCARA = "[mask-image:linear-gradient(to_right,transparent,black_45%)]";

/** Saludo, nivel, foto de guitarra difuminada en la tarjeta y la Boca del avance global. */
export function EncabezadoInicio({ nombre, nivel, frase, avance }: EncabezadoInicioProps) {
  return (
    <section
      aria-labelledby="saludo-inicio"
      className="relative overflow-hidden rounded-caja border border-linea bg-surface"
    >
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 right-0 hidden w-3/5 lg:block ${MASCARA}`}
      >
        <Foto
          nombre="guitarra-acustica"
          alt=""
          prioridad
          sizes="(min-width: 1024px) 40vw, 0px"
          className="h-full"
        />
      </div>
      <div className="relative flex flex-col gap-6 p-6 lg:min-h-[13rem] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-md flex-col gap-3">
          <h1 id="saludo-inicio" className="font-display text-3xl font-semibold text-paper">
            {nombre ? `Hola, ${nombre}.` : "Hola."}
          </h1>
          {frase === null ? (
            <Skeleton className="h-5 w-72 max-w-full" />
          ) : (
            <p className="text-muted">{frase}</p>
          )}
          {nivel && (
            <p className="w-fit rounded-full border border-success px-3 py-1 text-xs text-success">
              Nivel {nivel}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 rounded-caja border border-linea bg-surface-2 p-4">
          {avance === null ? (
            <Skeleton className="h-24 w-24 rounded-full" />
          ) : (
            <Boca valor={avance} etiqueta="Progreso general de la ruta" tamano="sm" />
          )}
          <p className="max-w-[9rem] text-sm text-muted">Progreso general de la ruta</p>
        </div>
      </div>
    </section>
  );
}
