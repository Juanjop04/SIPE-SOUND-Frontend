import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { EstadoVacio, Field, Input, MensajeError, Skeleton, claseBoton } from "@/shared/ui";
import { useCatalogo } from "../api";
import { FormularioUnirse } from "../components/FormularioUnirse";
import { TarjetaCatalogo } from "../components/TarjetaCatalogo";

/** /cursos/disponibles (HU-F-513): todos los cursos y el botón para pedir entrar a uno. */
export default function CatalogoPage() {
  const { data, isPending, error, refetch } = useCatalogo();
  const [busqueda, setBusqueda] = useState("");
  const texto = busqueda.trim().toLowerCase();
  const visibles = (data ?? []).filter((c) =>
    [c.nombre, c.descripcion ?? "", c.docente_nombre ?? "", c.docente_apellido ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(texto),
  );

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-paper">Cursos disponibles</h1>
          <p className="mt-2 max-w-prose text-sm text-muted">
            Pide entrar al curso que quieras: cuando su docente o un administrador te acepte, verás
            su ruta en Mis cursos. Si tu docente te dio un código, puedes unirte directo.
          </p>
        </div>
        <Link to={paths.cursos} className={claseBoton({ variante: "secundario" })}>
          Ir a Mis cursos
        </Link>
      </header>
      <section
        aria-labelledby="unirse-codigo"
        className="rounded-caja border border-dashed border-linea-fuerte p-5"
      >
        <h2 id="unirse-codigo" className="mb-3 font-display text-lg font-semibold text-paper">
          Unirme con un código
        </h2>
        <FormularioUnirse />
      </section>
      <Field etiqueta="Buscar curso">
        {(campo) => (
          <Input
            {...campo}
            type="search"
            value={busqueda}
            autoComplete="off"
            onChange={(e) => setBusqueda(e.target.value)}
          />
        )}
      </Field>
      {isPending && (
        <div aria-busy="true">
          <Skeleton lineas={3} className="h-40 w-full" />
        </div>
      )}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && data.length === 0 && (
        <EstadoVacio
          titulo="Aún no hay cursos."
          descripcion="Cuando un docente o un administrador cree uno, aparecerá aquí."
        />
      )}
      {data && data.length > 0 && visibles.length === 0 && (
        <EstadoVacio titulo="Ningún curso coincide con esa búsqueda." />
      )}
      {visibles.length > 0 && (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibles.map((curso) => (
            <TarjetaCatalogo key={curso.id} curso={curso} />
          ))}
        </ul>
      )}
    </main>
  );
}
