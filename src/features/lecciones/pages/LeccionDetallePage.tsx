import { Link, useParams } from "react-router-dom";
import { useSession } from "@/features/auth";
import { useRuta } from "@/features/ruta";
import { paths } from "@/shared/config/paths.js";
import { MensajeError, Skeleton } from "@/shared/ui";
import { ContenidoLeccion } from "../components/ContenidoLeccion";
import { CierreLeccion } from "../components/CierreLeccion";
import { EjerciciosLeccion } from "../components/EjerciciosLeccion";
import { useLeccion } from "../hooks/useLecciones";
import type { Leccion } from "../types";
import { ubicarLeccion } from "../utils/ubicacion";

const dos = (n: number) => String(n).padStart(2, "0");

function Lectura({ leccion }: { leccion: Leccion }) {
  const { usuario } = useSession();
  const { data: bloques } = useRuta();
  const { bloque, enRuta, anterior, siguiente } = ubicarLeccion(bloques, leccion.id);

  return (
    <article className="mx-auto max-w-[68ch]">
      <p className="font-mono text-sm text-muted">
        {bloque && (
          <Link to={`${paths.ruta}?bloque=${bloque.id}`} className="hover:text-accent">
            Bloque {bloque.numero}
          </Link>
        )}
        {bloque && " › "}Lección {dos(leccion.numero)}
      </p>
      <ContenidoLeccion leccion={leccion} />
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
