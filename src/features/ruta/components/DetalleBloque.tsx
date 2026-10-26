import { Tablatura, TrasteDivider, type DatoTablatura } from "@/shared/music";
import { VideoGuia } from "@/shared/ui";
import type { BloqueRuta } from "../types";
import { AccionBloque } from "./AccionBloque";
import { ListaLecciones } from "./ListaLecciones";

interface DetalleBloqueProps {
  bloque: BloqueRuta;
  anterior?: BloqueRuta;
  conSesion: boolean;
}

function datosDelBloque(bloque: BloqueRuta): DatoTablatura[] {
  const cantidad = bloque.lecciones.length;
  const datos: DatoTablatura[] = [
    { clave: "nivel", valor: bloque.nivel },
    { clave: "lecciones", valor: `${cantidad} ${cantidad === 1 ? "lección" : "lecciones"}` },
  ];
  if (bloque.mejor_puntaje !== null) {
    datos.push({ clave: "puntaje", valor: `mejor puntaje ${bloque.mejor_puntaje} %` });
  }
  return datos;
}

/** Columna derecha: el bloque seleccionado, sus lecciones y su única acción. */
export function DetalleBloque({ bloque, anterior, conSesion }: DetalleBloqueProps) {
  return (
    <article aria-labelledby={`bloque-${bloque.id}`} aria-live="polite">
      <h2
        id={`bloque-${bloque.id}`}
        className="font-display text-[2rem] font-semibold leading-tight text-paper"
      >
        Bloque {bloque.numero} · {bloque.titulo}
      </h2>
      <Tablatura datos={datosDelBloque(bloque)} className="mt-3" />
      {bloque.descripcion && (
        <p className="mt-4 max-w-prose leading-relaxed text-muted">{bloque.descripcion}</p>
      )}

      {bloque.video && (
        <VideoGuia video={bloque.video} titulo={bloque.titulo} className="mt-6 max-w-prose" />
      )}

      <TrasteDivider className="my-6" />
      <ListaLecciones lecciones={bloque.lecciones} />
      <div className="mt-8">
        <AccionBloque bloque={bloque} anterior={anterior} conSesion={conSesion} />
      </div>
    </article>
  );
}
