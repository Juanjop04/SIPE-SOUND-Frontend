import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button, MensajeError, Skeleton } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import type { BloqueEnEdicion } from "../utils/rutaCurso";

export const etiquetaBloque = (b: BloqueEnEdicion) => `Bloque ${b.numero} · ${b.titulo}`;

const FILA = "flex min-h-11 items-center gap-2 border-b border-linea py-1";

interface RutaDelCursoProps {
  ruta: BloqueEnEdicion[];
  soloLectura: boolean;
  onMover: (indice: number, direccion: -1 | 1) => void;
  onQuitar: (bloque: BloqueEnEdicion) => void;
}

/** Bloques del curso en orden, con Subir/Bajar/Quitar (botones: accesible por teclado). */
export function RutaDelCurso({ ruta, soloLectura, onMover, onQuitar }: RutaDelCursoProps) {
  if (ruta.length === 0) {
    return <p className="text-sm text-muted">Agrega bloques desde la lista disponible.</p>;
  }
  return (
    <ol className="flex flex-col">
      {ruta.map((bloque, i) => {
        const nombre = etiquetaBloque(bloque);
        return (
          <li key={bloque.bloque_id} className={FILA}>
            <span className="w-6 font-mono text-sm text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-sm text-paper">{nombre}</span>
            <Button
              variante="fantasma"
              tamano="sm"
              aria-label={`Subir ${nombre}`}
              disabled={soloLectura || i === 0}
              onClick={() => onMover(i, -1)}
            >
              <ArrowUp size={16} aria-hidden="true" />
            </Button>
            <Button
              variante="fantasma"
              tamano="sm"
              aria-label={`Bajar ${nombre}`}
              disabled={soloLectura || i === ruta.length - 1}
              onClick={() => onMover(i, 1)}
            >
              <ArrowDown size={16} aria-hidden="true" />
            </Button>
            <Button
              variante="fantasma"
              tamano="sm"
              aria-label={`Quitar ${nombre}`}
              disabled={soloLectura}
              onClick={() => onQuitar(bloque)}
            >
              <X size={16} aria-hidden="true" />
            </Button>
          </li>
        );
      })}
    </ol>
  );
}

interface BloquesDisponiblesProps {
  disponibles: BloqueEnEdicion[];
  deshabilitado: boolean;
  onAgregar: (bloque: BloqueEnEdicion) => void;
}

/** Bloques del catálogo que aún no están en la ruta, con "Agregar". */
export function BloquesDisponibles({
  disponibles,
  deshabilitado,
  onAgregar,
}: BloquesDisponiblesProps) {
  if (disponibles.length === 0) {
    return <p className="text-sm text-muted">Todos los bloques publicados ya están en la ruta.</p>;
  }
  return (
    <ul className="flex flex-col">
      {disponibles.map((bloque) => (
        <li key={bloque.bloque_id} className={FILA}>
          <span className="flex-1 text-sm text-muted">{etiquetaBloque(bloque)}</span>
          <Button
            variante="secundario"
            tamano="sm"
            aria-label={`Agregar ${etiquetaBloque(bloque)}`}
            disabled={deshabilitado}
            onClick={() => onAgregar(bloque)}
          >
            <Plus size={16} aria-hidden="true" />
            Agregar
          </Button>
        </li>
      ))}
    </ul>
  );
}

interface SeccionDisponiblesProps {
  cargando: boolean;
  error: string | null;
  onReintentar: () => void;
  /** null mientras no llega el catálogo. */
  disponibles: BloqueEnEdicion[] | null;
  lleno: boolean;
  deshabilitado: boolean;
  onAgregar: (bloque: BloqueEnEdicion) => void;
}

/** Columna "Bloques disponibles" con sus estados de carga, error y límite de la ruta. */
export function SeccionDisponibles(props: SeccionDisponiblesProps) {
  const { cargando, error, onReintentar, disponibles, lleno, deshabilitado, onAgregar } = props;
  return (
    <section aria-labelledby="bloques-disponibles">
      <h3 id="bloques-disponibles" className="mb-2 font-display text-lg font-semibold text-paper">
        Bloques disponibles
      </h3>
      {cargando && <Skeleton lineas={4} className="h-11 w-full" />}
      {error && <MensajeError mensaje={error} onReintentar={onReintentar} />}
      {lleno && (
        <p className="mb-2 text-sm text-muted">
          La ruta llegó al máximo de {LIMITES.bloquesEnRuta.max} bloques.
        </p>
      )}
      {disponibles && (
        <BloquesDisponibles
          disponibles={disponibles}
          deshabilitado={deshabilitado}
          onAgregar={onAgregar}
        />
      )}
    </section>
  );
}
