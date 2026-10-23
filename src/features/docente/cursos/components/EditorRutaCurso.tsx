import { useState } from "react";
import { Button, MensajeError, useAviso } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useBloquesCatalogo, useDefinirRuta } from "../hooks/useCursos";
import { aCuerpoRuta, mover, rutaCambio, type BloqueEnEdicion } from "../utils/rutaCurso";
import { RutaDelCurso, SeccionDisponibles, etiquetaBloque } from "./ListasRuta";

interface EditorRutaCursoProps {
  cursoId: number;
  guardada: BloqueEnEdicion[];
  soloLectura: boolean;
}

const TITULO = "mb-2 font-display text-lg font-semibold text-paper";

/** Ruta del curso: ordenar con Subir/Bajar, agregar y quitar; cada cambio se anuncia (aria-live). */
export function EditorRutaCurso({ cursoId, guardada, soloLectura }: EditorRutaCursoProps) {
  const catalogo = useBloquesCatalogo();
  const definir = useDefinirRuta(cursoId);
  const { avisar } = useAviso();
  const [ruta, setRuta] = useState(guardada);
  const [anuncio, setAnuncio] = useState("");
  const enRuta = new Set(ruta.map((b) => b.bloque_id));
  const disponibles = (catalogo.data ?? [])
    .filter((b) => !enRuta.has(b.id))
    .map((b) => ({ bloque_id: b.id, numero: b.numero, titulo: b.titulo }));
  const lleno = ruta.length >= LIMITES.bloquesEnRuta.max;

  function moverBloque(indice: number, direccion: -1 | 1) {
    const nueva = mover(ruta, indice, direccion);
    if (nueva === ruta) return;
    setRuta(nueva);
    setAnuncio(`${etiquetaBloque(ruta[indice])} movido a la posición ${indice + direccion + 1}.`);
  }

  function quitar(bloque: BloqueEnEdicion) {
    setRuta(ruta.filter((b) => b.bloque_id !== bloque.bloque_id));
    setAnuncio(`${etiquetaBloque(bloque)} quitado de la ruta.`);
  }

  function agregar(bloque: BloqueEnEdicion) {
    setRuta([...ruta, bloque]);
    setAnuncio(`${etiquetaBloque(bloque)} agregado en la posición ${ruta.length + 1}.`);
  }

  async function guardar() {
    const { message } = await definir.mutateAsync(aCuerpoRuta(ruta));
    avisar({ mensaje: message });
  }

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2">
      <section aria-labelledby="bloques-curso">
        <h3 id="bloques-curso" className={TITULO}>
          Bloques del curso
        </h3>
        <RutaDelCurso
          ruta={ruta}
          soloLectura={soloLectura}
          onMover={moverBloque}
          onQuitar={quitar}
        />
        <p aria-live="polite" className="sr-only">
          {anuncio}
        </p>
        {definir.error && <MensajeError className="mt-4" mensaje={definir.error.message} />}
        <Button
          className="mt-4"
          cargando={definir.isPending}
          disabled={soloLectura || !rutaCambio(guardada, ruta)}
          onClick={() => guardar().catch(() => null)}
        >
          {definir.isPending ? "Guardando…" : "Guardar ruta"}
        </Button>
      </section>

      <SeccionDisponibles
        cargando={catalogo.isPending}
        error={catalogo.error?.message ?? null}
        onReintentar={() => catalogo.refetch()}
        disponibles={catalogo.data ? disponibles : null}
        lleno={lleno}
        deshabilitado={soloLectura || lleno}
        onAgregar={agregar}
      />
    </div>
  );
}
