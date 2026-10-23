import { Link } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";
import { Card } from "@/shared/ui/Card.jsx";
import { useSession } from "@/features/auth";
import { useRuta } from "../hooks/useRuta.js";
import { paths } from "@/shared/config/paths.js";

export default function Home() {
  const { data: bloques = [], isPending: cargando, error } = useRuta();
  const { usuario } = useSession();
  const hayUsuario = Boolean(usuario);

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <h2 className="mb-1 font-display text-xl font-semibold text-paper">Bloques de aprendizaje</h2>
      <p className="mb-6 text-sm text-muted">
        Completa el quiz de cada bloque (80% o mas) para desbloquear el siguiente.
      </p>

      {cargando && <p className="text-muted">Cargando...</p>}
      {error && <p className="text-sm text-danger">{error.message}</p>}

      <div className="flex flex-col gap-5">
        {bloques.map((bloque) => {
          const { desbloqueado, aprobado, tienePuntaje } = bloque;
          const leccionesDelBloque = bloque.lecciones ?? [];

          return (
            <Card key={bloque.id} className={desbloqueado ? "border-l-0" : "border-l-0 opacity-60"}>
              <div className="mb-1 flex items-center gap-2">
                {!desbloqueado && <Lock size={16} className="text-muted" aria-hidden="true" />}
                {aprobado && <CheckCircle2 size={16} className="text-success" aria-hidden="true" />}
                <h3 className="font-display text-base font-semibold text-paper">
                  Bloque {bloque.numero}: {bloque.titulo}
                </h3>
              </div>
              <p className="mb-3 text-sm text-muted">{bloque.descripcion}</p>

              {desbloqueado ? (
                <>
                  <div className="mb-3 flex flex-col gap-1">
                    {leccionesDelBloque.map((leccion) => (
                      <Link
                        key={leccion.id}
                        to={paths.leccion(leccion.id)}
                        className="text-sm text-paper transition-colors hover:text-accent"
                      >
                        • Leccion {leccion.numero}: {leccion.titulo}
                      </Link>
                    ))}
                  </div>

                  {hayUsuario ? (
                    <Link to={paths.quiz(bloque.id)}>
                      <button className="rounded-lg border border-primary px-3 py-2 text-sm text-primary transition-colors hover:bg-primary/10">
                        {tienePuntaje
                          ? `Repetir quiz (mejor resultado: ${bloque.mejor_puntaje}%)`
                          : "Hacer el quiz del bloque"}
                      </button>
                    </Link>
                  ) : (
                    <p className="text-xs italic text-muted">Inicia sesion para hacer el quiz</p>
                  )}
                </>
              ) : (
                <p className="text-xs italic text-muted">
                  Aprueba el quiz del bloque anterior para desbloquear este.
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </main>
  );
}
