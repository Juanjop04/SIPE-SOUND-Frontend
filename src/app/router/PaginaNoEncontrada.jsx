import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";

export function PaginaNoEncontrada({
  mensaje = "Esta página no existe. Revisa la dirección o vuelve a la ruta de aprendizaje.",
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <h2 className="mb-1 font-display text-xl font-semibold text-paper">Página no encontrada</h2>
      <p className="mb-6 text-sm text-muted">{mensaje}</p>
      <Link to={paths.inicio} className="text-sm text-primary hover:underline">
        Volver al inicio
      </Link>
    </main>
  );
}
