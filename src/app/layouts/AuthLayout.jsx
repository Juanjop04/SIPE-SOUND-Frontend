import { useEffect, useMemo, useState } from "react";
import { Outlet, useMatches, useSearchParams } from "react-router-dom";
import { guardarCodigoPendiente } from "@/features/cursos";
import { Fretboard } from "@/shared/music";
import { SelectorTema } from "@/shared/ui";
import logo from "@/assets/brand/logo.png";

// Layout de /login y /registro. El título y la descripción del panel vienen del `handle`
// de cada ruta (router.jsx); la página activa la vibración del mástil con
// useOutletContext().setTocando mientras envía el formulario.
export default function AuthLayout() {
  const [tocando, setTocando] = useState(false);
  const { titulo, descripcion } = useMatches().findLast((m) => m.handle?.titulo)?.handle ?? {};
  const contexto = useMemo(() => ({ setTocando }), []);
  const [parametros] = useSearchParams();
  const codigo = parametros.get("codigo");

  // Enlace del docente (/registro?codigo=…, HU-F-311): se guarda hasta completar el acceso.
  useEffect(() => guardarCodigoPendiente(codigo), [codigo]);

  return (
    <div className="relative min-h-screen bg-ink text-paper lg:grid lg:grid-cols-2">
      <SelectorTema className="absolute right-4 top-4 z-10" />
      {/* Panel de marca (solo escritorio) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-surface p-12 lg:flex">
        <div className="relative flex items-center gap-3">
          <img src={logo} alt="" className="h-10 w-10 object-contain" />
          <span className="font-display text-xl font-semibold">SIPE-SOUND</span>
        </div>

        <div className="relative">
          <Fretboard tocando={tocando} />
          <h2 className="mt-10 max-w-md font-display text-4xl font-semibold leading-tight">
            {titulo}
          </h2>
          <p className="mt-4 max-w-md text-muted">{descripcion}</p>
        </div>

        <p className="relative text-sm text-muted">&copy; {new Date().getFullYear()} SIPE-SOUND</p>
      </aside>

      {/* Contenido (formulario) */}
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src={logo} alt="" className="h-10 w-10 object-contain" />
            <span className="font-display text-xl font-semibold">SIPE-SOUND</span>
          </div>
          <Outlet context={contexto} />
        </div>
      </main>
    </div>
  );
}
