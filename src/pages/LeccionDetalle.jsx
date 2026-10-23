import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Header from "@/app/layouts/components/Header.jsx";
import { Card } from "@/shared/ui/Card.jsx";
import { Button } from "@/shared/ui/Button.jsx";
import { supabase } from "@/shared/lib/supabase.js";
import { obtenerLeccion, obtenerAcordes, guardarProgreso } from "../lib/api.js";

export default function LeccionDetalle() {
  // useParams() lee el ":id" de la URL. Si visitas /leccion/2, aquí id === "2"
  const { id } = useParams();

  const [leccion, setLeccion] = useState(null);
  const [acordesLeccion, setAcordesLeccion] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [hayUsuario, setHayUsuario] = useState(false);
  const [guardado, setGuardado] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHayUsuario(!!data.session);
    });

    // Traemos la lección Y el catálogo completo de acordes al mismo tiempo
    Promise.all([obtenerLeccion(id), obtenerAcordes()])
      .then(([leccionData, catalogoAcordes]) => {
        setLeccion(leccionData);

        // leccionData.acordes es un arreglo de nombres, ej: ["Em", "Am"]
        // Filtramos el catálogo completo para quedarnos solo con esos
        const detalles = catalogoAcordes.filter((acorde) =>
          (leccionData.acordes ?? []).includes(acorde.nombre),
        );
        setAcordesLeccion(detalles);
      })
      .catch(() => setError("No se pudo cargar la lección."))
      .finally(() => setCargando(false));
  }, [id]); // si "id" cambia (el usuario navega a otra lección), se vuelve a cargar

  async function marcarCompletada() {
    try {
      await guardarProgreso({
        tipo: "leccion",
        contenido_id: parseInt(id),
        porcentaje: 100,
        completado: true,
      });
      setGuardado("ok");
    } catch (err) {
      setGuardado("error");
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <Link
          to="/"
          className="mb-5 flex w-fit items-center gap-1 text-sm text-muted hover:text-primary"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Volver a lecciones
        </Link>

        {cargando && <p className="text-muted">Cargando...</p>}
        {error && <p className="text-sm text-danger">{error}</p>}

        {leccion && (
          <>
            <h2 className="mb-1 font-display text-xl font-semibold text-paper">
              Leccion {leccion.numero}: {leccion.titulo}
            </h2>
            <p className="mb-1 text-sm text-muted">{leccion.descripcion}</p>
            <p className="mb-6 font-mono text-xs text-muted/70">
              {leccion.nivel} - {leccion.duracion ?? "N/A"}
            </p>

            <h3 className="mb-3 font-display text-base font-semibold text-paper">
              Acordes de esta leccion
            </h3>

            {acordesLeccion.length === 0 && (
              <p className="mb-6 text-sm text-muted">
                Esta leccion no tiene acordes asociados todavia.
              </p>
            )}

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {acordesLeccion.map((acorde) => (
                <Card key={acorde.id} className="border-l-0 text-center">
                  <p className="font-display text-lg font-semibold text-paper">{acorde.nombre}</p>
                  <p className="mt-1 font-mono text-xs text-muted">{acorde.tipo}</p>
                  <p className="mt-1 text-xs text-accent">{acorde.dificultad}</p>
                </Card>
              ))}
            </div>

            {hayUsuario ? (
              <div className="flex items-center gap-3">
                <Button variant="success" onClick={marcarCompletada}>
                  Marcar como completada
                </Button>
                {guardado === "ok" && (
                  <span className="flex items-center gap-1 text-sm text-success">
                    <Check size={16} aria-hidden="true" /> guardado
                  </span>
                )}
                {guardado === "error" && (
                  <span className="text-sm text-danger">no se pudo guardar</span>
                )}
              </div>
            ) : (
              <p className="text-sm italic text-muted">Inicia sesion para guardar tu progreso</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
