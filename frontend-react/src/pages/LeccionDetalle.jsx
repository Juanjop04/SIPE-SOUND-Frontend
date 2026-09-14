import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Header from "../components/Header.jsx";
import { Card } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { supabase } from "../lib/supabaseClient.js";
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
          (leccionData.acordes ?? []).includes(acorde.nombre)
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
      <main className="max-w-2xl mx-auto px-6 py-8">
        <Link to="/" className="flex items-center gap-1 text-muted hover:text-primary text-sm mb-5 w-fit">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver a lecciones
        </Link>

        {cargando && <p className="text-muted">Cargando...</p>}
        {error && <p className="text-danger text-sm">{error}</p>}

        {leccion && (
          <>
            <h2 className="font-display font-semibold text-paper text-xl mb-1">
              Leccion {leccion.numero}: {leccion.titulo}
            </h2>
            <p className="text-muted text-sm mb-1">{leccion.descripcion}</p>
            <p className="font-mono text-xs text-muted/70 mb-6">
              {leccion.nivel} - {leccion.duracion ?? "N/A"}
            </p>

            <h3 className="font-display font-semibold text-paper text-base mb-3">
              Acordes de esta leccion
            </h3>

            {acordesLeccion.length === 0 && (
              <p className="text-muted text-sm mb-6">Esta leccion no tiene acordes asociados todavia.</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {acordesLeccion.map((acorde) => (
                <Card key={acorde.id} className="text-center border-l-0">
                  <p className="font-display font-semibold text-paper text-lg">{acorde.nombre}</p>
                  <p className="font-mono text-xs text-muted mt-1">{acorde.tipo}</p>
                  <p className="text-xs text-accent mt-1">{acorde.dificultad}</p>
                </Card>
              ))}
            </div>

            {hayUsuario ? (
              <div className="flex items-center gap-3">
                <Button variant="success" onClick={marcarCompletada}>
                  Marcar como completada
                </Button>
                {guardado === "ok" && (
                  <span className="flex items-center gap-1 text-success text-sm">
                    <Check size={16} aria-hidden="true" /> guardado
                  </span>
                )}
                {guardado === "error" && (
                  <span className="text-danger text-sm">no se pudo guardar</span>
                )}
              </div>
            ) : (
              <p className="text-muted text-sm italic">Inicia sesion para guardar tu progreso</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
