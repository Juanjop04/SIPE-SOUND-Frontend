import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, CheckCircle2 } from "lucide-react";
import Header from "../components/Header.jsx";
import { Card } from "../components/ui/card.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { obtenerBloques, obtenerLecciones, obtenerProgreso } from "../lib/api.js";

export default function Home() {
  const [bloques, setBloques] = useState([]);
  const [lecciones, setLecciones] = useState([]);
  const [progresoBloques, setProgresoBloques] = useState({}); // { [bloque_id]: {completado, porcentaje} }
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [hayUsuario, setHayUsuario] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const sesionActiva = !!data.session;
      setHayUsuario(sesionActiva);

      try {
        const [bloquesData, leccionesData, progresoData] = await Promise.all([
          obtenerBloques(),
          obtenerLecciones(),
          sesionActiva ? obtenerProgreso() : Promise.resolve([]),
        ]);

        setBloques(bloquesData);
        setLecciones(leccionesData);

        const mapaBloques = {};
        progresoData
          .filter((p) => p.tipo === "bloque")
          .forEach((p) => {
            mapaBloques[p.contenido_id] = p;
          });
        setProgresoBloques(mapaBloques);
      } catch (err) {
        setError("No se pudo conectar con el backend. Esta corriendo?");
      } finally {
        setCargando(false);
      }
    });
  }, []);

  // Un bloque esta desbloqueado si es el primero, o si el bloque
  // anterior (por orden_index) ya fue aprobado.
  function bloqueDesbloqueado(bloque, index) {
    if (index === 0) return true;
    const anterior = bloques[index - 1];
    return !!progresoBloques[anterior.id]?.completado;
  }

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="font-display font-semibold text-paper text-xl mb-1">Bloques de aprendizaje</h2>
        <p className="text-muted text-sm mb-6">
          Completa el quiz de cada bloque (80% o mas) para desbloquear el siguiente.
        </p>

        {cargando && <p className="text-muted">Cargando...</p>}
        {error && <p className="text-danger text-sm">{error}</p>}

        <div className="flex flex-col gap-5">
          {bloques.map((bloque, index) => {
            const desbloqueado = bloqueDesbloqueado(bloque, index);
            const progresoDeEste = progresoBloques[bloque.id];
            const leccionesDelBloque = lecciones.filter((l) => l.bloque_id === bloque.id);

            return (
              <Card key={bloque.id} className={desbloqueado ? "border-l-0" : "border-l-0 opacity-60"}>
                <div className="flex items-center gap-2 mb-1">
                  {!desbloqueado && <Lock size={16} className="text-muted" aria-hidden="true" />}
                  {progresoDeEste?.completado && (
                    <CheckCircle2 size={16} className="text-success" aria-hidden="true" />
                  )}
                  <h3 className="font-display font-semibold text-paper text-base">
                    Bloque {bloque.numero}: {bloque.titulo}
                  </h3>
                </div>
                <p className="text-muted text-sm mb-3">{bloque.descripcion}</p>

                {desbloqueado ? (
                  <>
                    <div className="flex flex-col gap-1 mb-3">
                      {leccionesDelBloque.map((leccion) => (
                        <Link
                          key={leccion.id}
                          to={`/leccion/${leccion.id}`}
                          className="text-paper text-sm hover:text-accent transition-colors"
                        >
                          • Leccion {leccion.numero}: {leccion.titulo}
                        </Link>
                      ))}
                    </div>

                    {hayUsuario ? (
                      <Link to={`/quiz/${bloque.id}`}>
                        <button className="text-sm px-3 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors">
                          {progresoDeEste
                            ? `Repetir quiz (mejor resultado: ${progresoDeEste.porcentaje}%)`
                            : "Hacer el quiz del bloque"}
                        </button>
                      </Link>
                    ) : (
                      <p className="text-muted text-xs italic">Inicia sesion para hacer el quiz</p>
                    )}
                  </>
                ) : (
                  <p className="text-muted text-xs italic">
                    Aprueba el quiz del bloque anterior para desbloquear este.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
