import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../lib/supabaseClient.js";
import { Input } from "../components/ui/input.jsx";
import { Button } from "../components/ui/button.jsx";
import AuthLayout from "../components/AuthLayout.jsx";

function IconoOjo({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A9.9 9.9 0 0 1 12 6c5 0 8.5 4 9.5 6a12.6 12.6 0 0 1-2.6 3.3" />
      <path d="M6.6 6.7C4.4 8 3 10.3 2.5 12c1 2 4.5 6 9.5 6a9.7 9.7 0 0 0 3.4-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 12C3.5 10 7 6 12 6s8.5 4 9.5 6c-1 2-4.5 6-9.5 6s-8.5-4-9.5-6z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function traducirError(mensaje = "") {
  const m = mensaje.toLowerCase();
  if (m.includes("invalid login credentials")) return "El correo o la contraseña no coinciden. Revísalos e inténtalo de nuevo.";
  if (m.includes("email not confirmed")) return "Aún no confirmas tu correo. Abre el mensaje que te enviamos y confirma tu cuenta.";
  if (m.includes("failed to fetch") || m.includes("network")) return "No hay conexión. Revisa tu internet e inténtalo otra vez.";
  return mensaje || "No pudimos iniciar sesión. Inténtalo de nuevo.";
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await iniciarSesion(email, password);
      navigate("/");
    } catch (err) {
      setError(traducirError(err.message));
    } finally {
      setCargando(false);
    }
  }

  return (
    <AuthLayout
      titulo="Aprende guitarra a tu ritmo"
      descripcion="Practica acordes, completa ejercicios y SUPERATE para desbloquear el siguiente nivel."
      tocando={cargando}
    >
      <h1 className="font-display text-3xl font-semibold">Bienvenido de nuevo</h1>
      <p className="mt-2 text-muted">
        Inicia sesión para continuar
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Correo electrónico
          <Input
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Contraseña</span>
            {/* Crea la ruta /recuperar o cambia este enlace cuando exista */}
            <Link
              to="/recuperar"
              className="text-[#E29DE0] hover:underline focus-visible:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Input
              type={verPassword ? "text" : "password"}
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-label="Contraseña"
              required
            />
            <button
              type="button"
              onClick={() => setVerPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-muted hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={verPassword}
            >
              <IconoOjo visible={verPassword} />
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-[#F2545B]/40 bg-[#F2545B]/10 px-4 py-3 text-sm text-[#F2545B]"
          >
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={cargando}>
          {cargando ? "Entrando..." : "Iniciar sesión"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link
          to="/registro"
          className="font-medium text-[#E29DE0] hover:underline focus-visible:underline"
        >
          Crea una gratis
        </Link>
      </p>
    </AuthLayout>
  );
}