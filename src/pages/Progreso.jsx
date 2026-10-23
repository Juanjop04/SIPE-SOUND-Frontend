import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import Header from "../components/Header.jsx";
import { Card } from "../components/ui/card.jsx";
import { supabase } from "../lib/supabaseClient.js";
import {
  obtenerProgreso,
  obtenerLecciones,
  obtenerEjercicios,
  obtenerBloques,
} from "../lib/api.js";

export default function Progreso() {
  const [hayUsuario, setHayUsuario] = useState(null);
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
        const [progreso, lecciones, ejercicios, bloques] = await Promise.all([
          obtenerProgreso(),
          obtenerLecciones(),
          obtenerEjercicios(),
          obtenerBloques(),
        ]);

        // Segun el "tipo" del registro, buscamos su titulo en el catalogo correcto
        const catalogos = { leccion: lecciones, ejercicio: ejercicios, bloque: bloques };

        const combinados = progreso.map((registro) => {
          const catalogo = catalogos[registro.tipo] ?? [];
          const encontrado = catalogo.find((item) => item.id === registro.contenido_id);
          return {
            ...registro,
            titulo: encontrado?.titulo ?? encontrado?.nombre ?? `#${registro.contenido_id}`,
          };
        });

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
  const totalBloques = items.filter((i) => i.tipo === "bloque" && i.completado).length;

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <h2 className="mb-1 font-display text-xl font-semibold text-paper">Mi progreso</h2>
        <p className="mb-6 text-sm text-muted">
          Historial de bloques, lecciones y ejercicios completados.
        </p>

        {hayUsuario === false && (
          <p className="text-sm text-muted">
            Necesitas{" "}
            <Link to="/login" className="text-primary hover:underline">
              iniciar sesion
            </Link>{" "}
            para ver tu progreso.
          </p>
        )}

        {cargando && hayUsuario && <p className="text-muted">Cargando...</p>}
        {error && <p className="text-sm text-danger">{error}</p>}

        {hayUsuario && !cargando && !error && (
          <>
            <div className="mb-6 flex gap-3">
              <Card className="flex-1 border-l-0 text-center">
                <p className="font-display text-2xl font-semibold text-success">{totalBloques}</p>
                <p className="mt-1 text-xs text-muted">bloques aprobados</p>
              </Card>
              <Card className="flex-1 border-l-0 text-center">
                <p className="font-display text-2xl font-semibold text-success">{totalLecciones}</p>
                <p className="mt-1 text-xs text-muted">lecciones completadas</p>
              </Card>
              <Card className="flex-1 border-l-0 text-center">
                <p className="font-display text-2xl font-semibold text-success">
                  {totalEjercicios}
                </p>
                <p className="mt-1 text-xs text-muted">ejercicios completados</p>
              </Card>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3"
                >
                  {item.completado ? (
                    <CheckCircle2 size={18} className="shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <Circle size={18} className="shrink-0 text-muted" aria-hidden="true" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-paper">{item.titulo}</p>
                    <p className="font-mono text-xs text-muted/70">
                      {item.tipo === "bloque" ? "quiz de bloque" : item.tipo} - {item.porcentaje}%
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted/60">
                    {new Date(item.actualizado_en).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>

            {items.length === 0 && (
              <p className="text-sm text-muted">
                Aun no has completado nada.{" "}
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
