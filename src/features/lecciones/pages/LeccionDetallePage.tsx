import { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { useSession } from "@/features/auth";
import { useRuta } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { Tablatura, TrasteDivider, type DatoTablatura } from "@/shared/music";
import { MensajeError, Skeleton } from "@/shared/ui";
import { AcordesLeccion } from "../components/AcordesLeccion";
import { CierreLeccion } from "../components/CierreLeccion";
import { EjerciciosLeccion } from "../components/EjerciciosLeccion";
import { useLeccion } from "../hooks/useLecciones";
import type { Leccion } from "../types";
import { parrafos, ubicarLeccion } from "../utils/ubicacion";

function datos(leccion: Leccion): DatoTablatura[] {
  const lista: DatoTablatura[] = [{ clave: "nivel", valor: leccion.nivel }];
  if (leccion.duracion_min) lista.push({ clave: "duracion", valor: `${leccion.duracion_min} min` });
  if (leccion.acordes?.length) lista.push({ clave: "acordes", valor: leccion.acordes.join(" · ") });
  return lista;
}

const dos = (n: number) => String(n).padStart(2, "0");

function Lectura({ leccion }: { leccion: Leccion }) {
  const { usuario } = useSession();
  const { data: bloques } = useRuta();
  const { bloque, enRuta, anterior, siguiente } = ubicarLeccion(bloques, leccion.id);

  return (
    <article className="mx-auto max-w-[68ch]">
      <p className="font-mono text-sm text-muted">
        {bloque && (
          <Link to={`${paths.inicio}?bloque=${bloque.id}`} className="hover:text-accent">
            Bloque {bloque.numero}
          </Link>
        )}
        {bloque && " › "}Lección {dos(leccion.numero)}
      </p>
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

      {(leccion.temas?.length ?? 0) > 0 && (
        <section aria-labelledby="temas-leccion" className="mt-10">
          <h2 id="temas-leccion" className="font-display text-xl font-semibold text-paper">
            Temas
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {leccion.temas?.map((tema, indice) => (
              <Fragment key={tema}>
                {indice > 0 && <TrasteDivider />}
                <li className="text-muted">{tema}</li>
              </Fragment>
            ))}
          </ul>
        </section>
      )}

      <AcordesLeccion nombres={leccion.acordes ?? []} />
      <EjerciciosLeccion leccionId={leccion.id} />
      <CierreLeccion
        leccionId={leccion.id}
        conSesion={Boolean(usuario)}
        yaPracticada={enRuta?.completado ?? false}
        anterior={anterior}
        siguiente={siguiente}
      />
    </article>
  );
}

export default function LeccionDetallePage() {
  const { id } = useParams();
  const { data: leccion, isPending, error, refetch } = useLeccion(Number(id));

  return (
    <main className="px-4 py-8 sm:px-6">
      {isPending && <Skeleton lineas={6} className="mx-auto h-6 w-full max-w-[68ch]" />}
      {error && (
        <div className="mx-auto max-w-[68ch]">
          <MensajeError mensaje={error.message} onReintentar={() => refetch()} />
        </div>
      )}
      {leccion && <Lectura leccion={leccion} />}
    </main>
  );
}
