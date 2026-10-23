import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../api/authService.js";
import { IconoOjo } from "../components/IconoOjo.jsx";
import { traducirErrorRegistro } from "../utils/traducirErrorAuth.js";
import { Input } from "@/shared/ui/Input.jsx";
import { Button } from "@/shared/ui/Button.jsx";
import { paths } from "@/shared/config/paths.js";

// 0 = vacía, 1 = débil, 2 = aceptable, 3 = fuerte
function nivelPassword(p) {
  if (!p) return 0;
  if (p.length < 6) return 1;
  const variada = /[a-zA-Z]/.test(p) && /\d/.test(p);
  if (p.length >= 10 && variada) return 3;
  if (variada || p.length >= 8) return 2;
  return 1;
}

const ETIQUETAS_NIVEL = ["", "Débil", "Aceptable", "Fuerte"];
const CLASES_NIVEL = ["", "bg-danger", "bg-success", "bg-primary"];

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const nivel = nivelPassword(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await registrarUsuario(email, password, nombre);
      setExito(true);
      setTimeout(() => navigate(paths.login), 1500);
    } catch (err) {
      setError(traducirErrorRegistro(err.message));
      setCargando(false);
    }
  }

  return (
    <>
      <h1 className="font-display text-3xl font-semibold">Crea tu cuenta</h1>
      <p className="mt-2 text-muted">
        Solo te toma un segundo. Después podrás empezar con tu primera lección.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Nombre
          <Input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
            required
          />
        </label>

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
          <span className="text-sm font-medium">Contraseña</span>
          <div className="relative">
            <Input
              type={verPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              aria-label="Contraseña"
              aria-describedby="ayuda-password"
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

          {/* Indicador de seguridad: barras + texto, no solo color */}
          <div id="ayuda-password" className="mt-1 flex items-center gap-3" aria-live="polite">
            <div className="flex flex-1 gap-1.5" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    nivel >= n ? CLASES_NIVEL[nivel] : "bg-paper/15"
                  }`}
                />
              ))}
            </div>
            <span className="min-w-[4.5rem] text-right text-xs text-muted">
              {nivel === 0 ? "Mín. 6 caracteres" : ETIQUETAS_NIVEL[nivel]}
            </span>
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

        {exito && (
          <div
            role="status"
            className="rounded-lg border border-primary/50 bg-primary/10 px-4 py-3 text-sm text-success"
          >
            Cuenta creada. Te llevamos a iniciar sesión...
          </div>
        )}

        <Button type="submit" className="w-full" disabled={cargando || exito}>
          {exito ? "Cuenta creada" : cargando ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link
          to={paths.login}
          className="font-medium text-accent hover:underline focus-visible:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
