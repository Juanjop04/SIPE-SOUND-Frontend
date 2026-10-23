import { Link } from "react-router-dom";

/** El id de la URL no está en el catálogo publicado. */
export function NoEncontradoContenido({ que, volverA }: { que: string; volverA: string }) {
  return (
    <div className="py-8">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-paper">
        No encontramos este {que}.
      </h1>
      <p className="mt-2 text-muted">Puede que ya no esté publicado.</p>
      <Link to={volverA} className="mt-6 inline-block text-sm text-accent hover:underline">
        Volver al listado
      </Link>
    </div>
  );
}
