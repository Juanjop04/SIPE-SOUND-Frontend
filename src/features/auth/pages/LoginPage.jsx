import { useState } from "react";
import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { iniciarSesion } from "../api/authService.js";
import { IconoOjo } from "../components/IconoOjo.jsx";
import { traducirErrorLogin } from "../utils/traducirErrorAuth.js";
import { destinoSeguro } from "../utils/destinoSeguro.js";
import { Input } from "@/shared/ui/Input.jsx";
import { Button } from "@/shared/ui/Button.jsx";
import { paths } from "@/shared/config/paths.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  // El mástil del AuthLayout vibra mientras se envía el formulario.
  const { setTocando } = useOutletContext();

  function marcarCargando(valor) {
    setCargando(valor);
    setTocando(valor);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    marcarCargando(true);
    try {
      await iniciarSesion(email, password);
      navigate(destinoSeguro(parametros.get("volver"), paths.inicio), { replace: true });
    } catch (err) {
      setError(traducirErrorLogin(err.message));
    } finally {
      marcarCargando(false);
    }
  }

  return (
    <>
      <h1 className="font-display text-3xl font-semibold">Bienvenido de nuevo</h1>
      <p className="mt-2 text-muted">Inicia sesión para continuar</p>

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
              to={paths.recuperar}
              className="text-accent hover:underline focus-visible:underline"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-muted hover:text-paper"
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
            className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
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
          to={paths.registro}
          className="font-medium text-accent hover:underline focus-visible:underline"
        >
          Crea una gratis
        </Link>
      </p>
    </>
  );
}
