import { Tablatura, TrasteDivider, type DatoTablatura } from "@/shared/music";
import { VideoGuia } from "@/shared/ui";
import type { Leccion } from "../types";
import { parrafos } from "../utils/ubicacion";
import { AcordesLeccion } from "./AcordesLeccion";

/** Lo que se ve de una lección. Lo usan la vista del estudiante y la vista previa del atril. */
export type VistaLeccion = Pick<
  Leccion,
  "titulo" | "nivel" | "duracion_min" | "acordes" | "temas" | "descripcion" | "contenido" | "video"
>;

function datos(leccion: VistaLeccion): DatoTablatura[] {
  const lista: DatoTablatura[] = [{ clave: "nivel", valor: leccion.nivel }];
  if (leccion.duracion_min) lista.push({ clave: "duracion", valor: `${leccion.duracion_min} min` });
  if (leccion.acordes?.length) lista.push({ clave: "acordes", valor: leccion.acordes.join(" · ") });
  return lista;
}

/** Título, tablatura, cuerpo de lectura, temas y acordes (presentacional). */
export function ContenidoLeccion({ leccion }: { leccion: VistaLeccion }) {
  const temas = leccion.temas ?? [];
  return (
    <>
      <h1 className="mt-2 font-display text-[2.5rem] font-semibold leading-tight text-paper">
        {leccion.titulo}
      </h1>
      <Tablatura datos={datos(leccion)} className="mt-3" />

      <div className="mt-8 flex flex-col gap-4 leading-relaxed text-paper">
        {leccion.descripcion && <p className="text-muted">{leccion.descripcion}</p>}
        {parrafos(leccion.contenido).map((parrafo) => (
          <p key={parrafo.slice(0, 40)}>{parrafo}</p>
        ))}
      </div>

      {leccion.video && (
        <section aria-labelledby="video-leccion" className="mt-10">
          <h2 id="video-leccion" className="mb-3 font-display text-xl font-semibold text-paper">
            Mira cómo se toca
          </h2>
          <VideoGuia video={leccion.video} titulo={leccion.titulo} />
        </section>
      )}

      {temas.length > 0 && (
        <section aria-labelledby="temas-leccion" className="mt-10">
          <h2 id="temas-leccion" className="font-display text-xl font-semibold text-paper">
            Temas
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {temas.map((tema, indice) => (
              // El separador va dentro del <li>: una <ul> solo puede tener <li> (HU-F-312).
              <li key={tema} className="flex flex-col gap-3 text-muted">
                {indice > 0 && <TrasteDivider />}
                {tema}
              </li>
            ))}
          </ul>
        </section>
      )}

      <AcordesLeccion nombres={leccion.acordes ?? []} />
    </>
  );
}
