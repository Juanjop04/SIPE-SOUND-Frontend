import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import Header from "../components/Header.jsx";
import { Card } from "../components/ui/card.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { obtenerProgreso, obtenerLecciones, obtenerEjercicios } from "../lib/api.js";

export default function Progreso() {
  const [hayUsuario, setHayUsuario] = useState(null); // null = aun no se sabe
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const sesionActiva = !!data.session;
      setHayUsuario(sesionActiva);

      if (!sesionActiva) {
        setCargando(false);
        return;
      }

      try {
        // Traemos las 3 fuentes al mismo tiempo: el progreso guardado,
        // y los catalogos de lecciones/ejercicios (para saber los titulos)
        const [progreso, lecciones, ejercicios] = await Promise.all([
          obtenerProgreso(),
          obtenerLecciones(),
          obtenerEjercicios(),
        ]);

        // Unimos cada registro de progreso con su titulo real,
        // buscandolo en el catalogo correspondiente segun el "tipo"
        const combinados = progreso.map((registro) => {
          const catalogo = registro.tipo === "leccion" ? lecciones : ejercicios;
          const encontrado = catalogo.find((item) => item.id === registro.contenido_id);
          return {
            ...registro,
            titulo: encontrado?.titulo ?? encontrado?.nombre ?? `#${registro.contenido_id}`,
          };
        });

        // Mas reciente primero
        combinados.sort((a, b) => new Date(b.actualizado_en) - new Date(a.actualizado_en));

        setItems(combinados);
      } catch (err) {
        setError("No se pudo cargar tu progreso.");
      } finally {
        setCargando(false);
      }
    });
  }, []);

  const totalLecciones = items.filter((i) => i.tipo === "leccion" && i.completado).length;
  const totalEjercicios = items.filter((i) => i.tipo === "ejercicio" && i.completado).length;

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="font-display font-semibold text-paper text-xl mb-1">Mi progreso</h2>
        <p className="text-muted text-sm mb-6">Historial de lecciones y ejercicios completados.</p>

        {hayUsuario === false && (
          <p className="text-muted text-sm">
            Necesitas{" "}
            <Link to="/login" className="text-primary hover:underline">
              iniciar sesion
            </Link>{" "}
            para ver tu progreso.
          </p>
        )}

        {cargando && hayUsuario && <p className="text-muted">Cargando...</p>}
        {error && <p className="text-danger text-sm">{error}</p>}

        {hayUsuario && !cargando && !error && (
          <>
            <div className="flex gap-4 mb-6">
              <Card className="text-center border-l-0 flex-1">
                <p className="font-display font-semibold text-success text-2xl">{totalLecciones}</p>
                <p className="text-muted text-xs mt-1">lecciones completadas</p>
              </Card>
              <Card className="text-center border-l-0 flex-1">
                <p className="font-display font-semibold text-success text-2xl">{totalEjercicios}</p>
                <p className="text-muted text-xs mt-1">ejercicios completados</p>
              </Card>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3"
                >
                  {item.completado ? (
                    <CheckCircle2 size={18} className="text-success shrink-0" aria-hidden="true" />
                  ) : (
                    <Circle size={18} className="text-muted shrink-0" aria-hidden="true" />
                  )}
                  <div className="flex-1">
                    <p className="text-paper text-sm">{item.titulo}</p>
                    <p className="font-mono text-xs text-muted/70">
                      {item.tipo} - {item.porcentaje}%
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted/60">
                    {new Date(item.actualizado_en).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>

            {items.length === 0 && (
              <p className="text-muted text-sm">
                Aun no has completado ninguna leccion o ejercicio.{" "}
                <Link to="/" className="text-primary hover:underline">
                  Empieza aqui
                </Link>
                .
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
