import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../lib/supabaseClient.js";
import { Input } from "../components/ui/input.jsx";
import { Button } from "../components/ui/button.jsx";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Estados nuevos
 const [identifier, setIdentifier]         = useState("");      // email o usuario
 const [mostrarPass, setMostrarPass]        = useState(false);   // ojo contraseña
 const [cargando, setCargando]             = useState(false);   // spinner botón
 const [bloqueado, setBloqueado]           = useState(false);   // límite intentos
 const [segundos, setSegundos]             = useState(30);      // cuenta regresiva
 const [intentos, setIntentos]             = useState(0);       // contador intentos
 const [mensajeBienvenida, setMensajeBienvenida] = useState(""); // nombre usuario

// Valida si es email o nombre de usuario válido
function esEmailOUsuario(val) {
  const esEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const esUsuario = val.length >= 3;
  return esEmail || esUsuario;
}

// Bloquea el botón 30 segundos tras 3 intentos fallidos
function bloquearTemporal() {
  setBloqueado(true);
  let s = 30;
  const interval = setInterval(() => {
    s--;
    setSegundos(s);
    if (s <= 0) {
      clearInterval(interval);
      setBloqueado(false);
      setIntentos(0);
      setSegundos(30);
    }
  }, 1000);
}

  async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  setCargando(true);
  try {
    await iniciarSesion(identifier, password);
    setMensajeBienvenida(identifier.split("@")[0]); // muestra nombre antes del @
    setTimeout(() => navigate("/"), 1200);
  } catch (err) {
    const nuevosIntentos = intentos + 1;
    setIntentos(nuevosIntentos);
    if (nuevosIntentos >= 3) bloquearTemporal();
    setError(err.message);
  } finally {
    setCargando(false);
  }
}

  return (
  <div style={{
    background: "#1B1030", minHeight: "100vh",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 24, fontFamily: "'Inter', sans-serif",
    position: "relative", overflow: "hidden"
  }}>

    {/* Círculos decorativos */}
    <div style={{
      position: "absolute", top: -100, right: -100,
      width: 400, height: 400, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
      pointerEvents: "none"
    }}/>
    <div style={{
      position: "absolute", bottom: -80, left: -80,
      width: 300, height: 300, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(226,157,224,0.08) 0%, transparent 70%)",
      pointerEvents: "none"
    }}/>

    {/* CARD */}
    <div style={{
      width: "100%", maxWidth: 420,
      background: "#2A1B4D", borderRadius: 24,
      padding: "40px 36px",
      border: "1px solid rgba(124,58,237,0.25)",
      boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
      position: "relative", zIndex: 1
    }}>

      {/* LOGO Y TÍTULO */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <img src={logo} alt="SIPE-SOUND"
          style={{ width: 64, height: 64, objectFit: "contain", marginBottom: 14 }}/>
        <h2 style={{ color: "#F3EEFB", fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>
          Bienvenido de vuelta 👋
        </h2>
        <p style={{ color: "rgba(243,238,251,0.4)", fontSize: 14, margin: 0 }}>
          Ingresa con tu email o nombre de usuario
        </p>
      </div>

      {/* MENSAJE DE BIENVENIDA si ya hay sesión */}
      {mensajeBienvenida && (
        <div style={{
          background: "rgba(124,58,237,0.15)",
          border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: 12, padding: "12px 16px",
          color: "#E29DE0", fontSize: 14,
          textAlign: "center", marginBottom: 20
        }}>
          🎸 ¡Hola de nuevo, {mensajeBienvenida}!
        </div>
      )}

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Campo email o usuario */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ color: "rgba(243,238,251,0.6)", fontSize: 13, fontWeight: 500 }}>
            Email o nombre de usuario
          </label>
          <Input
            type="text"
            placeholder="tu@email.com o tu_usuario"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setError("");
            }}
            required
            style={{
              background: "rgba(27,16,48,0.8)",
              border: `1px solid ${identifier && !esEmailOUsuario(identifier)
                ? "#F2545B"
                : "rgba(124,58,237,0.3)"}`,
              borderRadius: 12, padding: "12px 16px",
              color: "#F3EEFB", fontSize: 14, outline: "none", width: "100%"
            }}
          />
          {/* Validación en tiempo real */}
          {identifier && !esEmailOUsuario(identifier) && (
            <span style={{ color: "#F2545B", fontSize: 12 }}>
              ⚠️ Ingresa un email válido o un nombre de usuario
            </span>
          )}
        </div>

        {/* Campo contraseña con mostrar/ocultar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ color: "rgba(243,238,251,0.6)", fontSize: 13, fontWeight: 500 }}>
            Contraseña
          </label>
          <div style={{ position: "relative" }}>
            <Input
              type={mostrarPass ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
              style={{
                background: "rgba(27,16,48,0.8)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: 12, padding: "12px 48px 12px 16px",
                color: "#F3EEFB", fontSize: 14, outline: "none", width: "100%"
              }}
            />
            {/* Botón ojo */}
            <button type="button"
              onClick={() => setMostrarPass(!mostrarPass)}
              style={{
                position: "absolute", right: 14, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "rgba(243,238,251,0.4)", cursor: "pointer",
                fontSize: 16, padding: 0
              }}>
              {mostrarPass ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(242,84,91,0.1)",
            border: "1px solid rgba(242,84,91,0.3)",
            borderRadius: 10, padding: "10px 14px",
            color: "#F2545B", fontSize: 13,
            display: "flex", alignItems: "center", gap: 8
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Botón entrar */}
        <button type="submit"
          disabled={cargando || bloqueado}
          style={{
            background: bloqueado
              ? "rgba(255,255,255,0.05)"
              : "linear-gradient(135deg, #7C3AED, #E29DE0)",
            color: bloqueado ? "rgba(243,238,251,0.3)" : "#F3EEFB",
            border: "none", borderRadius: 12, padding: "13px",
            fontSize: 15, fontWeight: 600, cursor: bloqueado ? "not-allowed" : "pointer",
            fontFamily: "inherit", marginTop: 4,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "opacity 0.2s"
          }}
          onMouseEnter={e => { if (!bloqueado) e.currentTarget.style.opacity = "0.88" }}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {cargando ? (
            <>
              <div style={{
                width: 16, height: 16,
                border: "2px solid rgba(243,238,251,0.3)",
                borderTopColor: "#F3EEFB", borderRadius: "50%",
                animation: "spin 0.7s linear infinite"
              }}/>
              Verificando...
            </>
          ) : bloqueado ? (
            `Espera ${segundos}s...`
          ) : (
            "Entrar →"
          )}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      </form>

      {/* DIVIDER */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.2)" }}/>
        <span style={{ color: "rgba(243,238,251,0.25)", fontSize: 12 }}>¿nuevo aquí?</span>
        <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.2)" }}/>
      </div>

      {/* LINK REGISTRO */}
      <p style={{ textAlign: "center", margin: 0 }}>
        <span style={{ color: "rgba(243,238,251,0.4)", fontSize: 14 }}>
          No tienes cuenta?{" "}
        </span>
        <Link to="/registro" style={{
          color: "#E29DE0", fontSize: 14, fontWeight: 600, textDecoration: "none"
        }}>
          Regístrate gratis
        </Link>
      </p>

    </div>
  </div>
);
}
