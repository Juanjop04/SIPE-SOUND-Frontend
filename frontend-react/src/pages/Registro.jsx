import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../lib/supabaseClient.js";
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
const COLORES_NIVEL = ["", "#F2545B", "#F5B942", "#7C3AED"];

function traducirError(mensaje = "") {
  const m = mensaje.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Ya existe una cuenta con ese correo. Prueba iniciando sesión.";
  if (m.includes("password") && m.includes("6"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("invalid") && m.includes("email"))
    return "Ese correo no parece válido. Revísalo e inténtalo de nuevo.";
  if (m.includes("rate limit"))
    return "Hiciste demasiados intentos. Espera unos minutos y vuelve a probar.";
  if (m.includes("failed to fetch") || m.includes("network"))
    return "No hay conexión. Revisa tu internet e inténtalo otra vez.";
  return mensaje || "No pudimos crear tu cuenta. Inténtalo de nuevo.";
}

// ⚠️ Cambia este correo por el de contacto real del equipo
const CORREO_CONTACTO = "contacto@tudominio.com";

// Borrador basado en el análisis legal del proyecto. Revísalo con tu
// instructor o un abogado antes de publicarlo.
const TERMINOS = [
  {
    titulo: "1. Sobre SIPE SOUND",
    texto:
      "SIPE SOUND es una plataforma educativa para aprender guitarra, desarrollada como proyecto de tesis en el marco del SENA. Actualmente se encuentra en fase de desarrollo académico (MVP) y aún no tiene registro mercantil. Sus funciones pueden cambiar o interrumpirse mientras se mejora.",
  },
  {
    titulo: "2. Uso de la plataforma",
    texto:
      "Tu cuenta es personal y eres responsable de mantener tu contraseña en secreto. Te comprometes a usar la plataforma solo con fines de aprendizaje, sin copiar, distribuir ni vender sus contenidos, y sin intentar acceder a cuentas o datos de otras personas.",
  },
  {
    titulo: "3. Tratamiento de datos personales",
    texto:
      "Conforme a la Ley 1581 de 2012, te informamos que guardamos tu nombre, tu correo electrónico y tu progreso (lecciones, ejercicios y quizzes). Usamos estos datos para crear tu cuenta, guardar tu avance y mejorar la plataforma. Se almacenan mediante el servicio Supabase y no se venden a terceros. Tienes derecho a conocer, actualizar, rectificar y solicitar la eliminación de tus datos, o a revocar tu autorización, escribiendo a " +
      CORREO_CONTACTO +
      ".",
  },
  {
    titulo: "4. Propiedad intelectual",
    texto:
      "De acuerdo con la Ley 23 de 1982 sobre derechos de autor, el diseño, el código, los textos, los ejercicios y la marca SIPE SOUND pertenecen a sus autores. Al registrarte no adquieres derechos sobre ellos, solo un permiso personal de uso.",
  },
  {
    titulo: "5. Aceptación electrónica",
    texto:
      "Al marcar la casilla de aceptación y crear tu cuenta, manifiestas de forma electrónica que leíste y aceptas estos términos, lo cual tiene validez según la Ley 527 de 1999 sobre comercio electrónico y mensajes de datos.",
  },
  {
    titulo: "6. Alcance del servicio",
    texto:
      "Por ser un proyecto académico, el servicio se ofrece tal como está, sin garantía de disponibilidad continua. El contenido es de apoyo para el aprendizaje y no reemplaza la enseñanza de un profesor presencial.",
  },
  {
    titulo: "7. Cambios",
    texto:
      "Podemos actualizar estos términos cuando el proyecto evolucione. Si el cambio es importante, te lo avisaremos en la plataforma.",
  },
];

function Terminos({ abierto, onToggle }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#F3EEFB]/15 bg-[#2A1B4D]/50">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={abierto}
        aria-controls="panel-terminos"
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:bg-[#2A1B4D] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7C3AED]"
      >
        <span>Leer términos y condiciones</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 text-muted transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {abierto && (
        <div
          id="panel-terminos"
          role="region"
          aria-label="Términos y condiciones"
          tabIndex={0}
          className="max-h-56 space-y-4 overflow-y-auto border-t border-[#F3EEFB]/15 px-4 py-4 text-sm text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7C3AED]"
        >
          {TERMINOS.map((t) => (
            <section key={t.titulo}>
              <h3 className="mb-1 font-medium text-paper">{t.titulo}</h3>
              <p className="leading-relaxed">{t.texto}</p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [verTerminos, setVerTerminos] = useState(false);
  const [acepta, setAcepta] = useState(false);
  const navigate = useNavigate();

  const nivel = nivelPassword(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!acepta) {
      setError("Debes aceptar los términos y condiciones para crear tu cuenta.");
      setVerTerminos(true);
      return;
    }
    setCargando(true);
    try {
      await registrarUsuario(email, password, nombre);
      setExito(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(traducirError(err.message));
      setCargando(false);
    }
  }

  return (
    <AuthLayout
      titulo="Tu primer acorde está más cerca de lo que crees"
      descripcion="Crea tu cuenta gratis y guarda tu progreso en cada lección, ejercicio y quiz."
      tocando={cargando || exito}
    >
      <h1 className="font-display text-3xl font-semibold">Crea tu cuenta</h1>
      <p className="mt-2 text-muted">
        Solo te toma un minuto. Después podrás empezar con tu primera lección.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Nombre
          <Input
            type="text"
            placeholder="¿Cómo te llamas?"
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
              minLength={6}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-muted hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
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
                  className="h-1.5 flex-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: nivel >= n ? COLORES_NIVEL[nivel] : "rgba(243,238,251,0.15)",
                  }}
                />
              ))}
            </div>
            <span className="min-w-[4.5rem] text-right text-xs text-muted">
              {nivel === 0 ? "Mín. 6 caracteres" : ETIQUETAS_NIVEL[nivel]}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Terminos abierto={verTerminos} onToggle={() => setVerTerminos((v) => !v)} />
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={acepta}
              onChange={(e) => setAcepta(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#7C3AED]"
            />
            <span>
              He leído y acepto los términos y condiciones y el tratamiento de
              mis datos personales.
            </span>
          </label>
          {!acepta && (
            <p className="text-xs text-muted">
              Marca la casilla para poder crear tu cuenta.
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-[#F2545B]/40 bg-[#F2545B]/10 px-4 py-3 text-sm text-[#F2545B]"
          >
            {error}
          </div>
        )}

        {exito && (
          <div
            role="status"
            className="rounded-lg border border-[#7C3AED]/50 bg-[#7C3AED]/10 px-4 py-3 text-sm text-success"
          >
            Cuenta creada. Te llevamos a iniciar sesión...
          </div>
        )}

        <Button type="submit" className="w-full" disabled={cargando || exito || !acepta}>
          {exito ? "Cuenta creada" : cargando ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link
          to="/login"
          className="font-medium text-[#E29DE0] hover:underline focus-visible:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
