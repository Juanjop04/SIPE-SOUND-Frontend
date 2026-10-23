import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import Header from "@/app/layouts/components/Header.jsx";
import { Card } from "@/shared/ui/Card.jsx";
import { useSession } from "@/features/auth";
import { useRuta } from "@/features/ruta";
import { useResumenProgreso } from "../hooks/useResumenProgreso.js";
import { armarHistorial } from "../utils/armarHistorial.js";

export default function Progreso() {
  const { usuario, estaCargando } = useSession();
  // null mientras se averigua si hay sesión (no se muestra "Necesitas iniciar sesión").
  const hayUsuario = estaCargando ? null : Boolean(usuario);
  const conSesion = hayUsuario === true;
  const resumen = useResumenProgreso({ enabled: conSesion });
  const ruta = useRuta();
  const cargando = conSesion && (resumen.isPending || ruta.isPending);
  const error = resumen.error ?? ruta.error;
  const items = useMemo(() => armarHistorial(ruta.data), [ruta.data]);

  const totalLecciones = resumen.data?.lecciones.completadas ?? 0;
  const totalEjercicios = resumen.data?.ejercicios.completados ?? 0;
  const totalBloques = resumen.data?.bloques_aprobados ?? 0;

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
        {error && <p className="text-sm text-danger">{error.message}</p>}

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
