import { Fretboard } from "@/shared/music/Fretboard.jsx";
import logo from "../assets/logo.png";

export default function AuthLayout({ titulo, descripcion, tocando = false, children }) {
  return (
    <div className="min-h-screen bg-ink text-paper lg:grid lg:grid-cols-2">
      {/* Panel de marca (solo escritorio) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-surface p-12 lg:flex">
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#7C3AED] opacity-20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-3">
          <img src={logo} alt="" className="h-10 w-10 object-contain" />
          <span className="font-display text-xl font-semibold">Sipe Sound</span>
        </div>

        <div className="relative">
          <Fretboard tocando={tocando} />
          <h2 className="mt-10 max-w-md font-display text-4xl font-semibold leading-tight">
            {titulo}
          </h2>
          <p className="mt-4 max-w-md text-muted">{descripcion}</p>
        </div>

        <p className="relative text-sm text-muted">&copy; {new Date().getFullYear()} Sipe Sound</p>
      </aside>

      {/* Contenido (formulario) */}
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src={logo} alt="" className="h-10 w-10 object-contain" />
            <span className="font-display text-xl font-semibold">Sipe Sound</span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
