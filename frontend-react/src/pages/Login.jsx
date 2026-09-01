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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await iniciarSesion(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

 return (
  <div style={{
    background: "#1B1030", minHeight: "100vh",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 24, fontFamily: "'Inter', sans-serif",
    position: "relative", overflow: "hidden"
  }}>

    {/* Círculos decorativos de fondo */}
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

    {/* CARD PRINCIPAL */}
    <div style={{
      width: "100%", maxWidth: 420,
      background: "#2A1B4D",
      borderRadius: 24,
      padding: "40px 36px",
      border: "1px solid rgba(124,58,237,0.25)",
      boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
      position: "relative", zIndex: 1
    }}>

      {/* LOGO Y TÍTULO */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <img
          src={logo} alt="GuitarApp"
          style={{ width: 64, height: 64, objectFit: "contain", marginBottom: 16 }}
        />
        <h2 style={{
          color: "#F3EEFB", fontSize: 24, fontWeight: 700, margin: "0 0 6px"
        }}>
          Inicio de sesion
        
        </h2>
        <p style={{ color: "rgba(243,238,251,0.4)", fontSize: 14, margin: 0 }}>
          Inicia sesión para continuar
        </p>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Campo email */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ color: "rgba(243,238,251,0.6)", fontSize: 13, fontWeight: 500 }}>
            Correo electrónico
          </label>
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              background: "rgba(27,16,48,0.8)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: 12, padding: "12px 16px",
              color: "#F3EEFB", fontSize: 14,
              outline: "none", width: "100%"
            }}
          />
        </div>

        {/* Campo contraseña */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ color: "rgba(243,238,251,0.6)", fontSize: 13, fontWeight: 500 }}>
            Contraseña
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              background: "rgba(27,16,48,0.8)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: 12, padding: "12px 16px",
              color: "#F3EEFB", fontSize: 14,
              outline: "none", width: "100%"
            }}
          />
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
        <button
          type="submit"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #E29DE0)",
            color: "#F3EEFB", border: "none",
            borderRadius: 12, padding: "13px",
            fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            marginTop: 4, transition: "opacity 0.2s",
            letterSpacing: "0.02em"
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Entrar →
        </button>

      </form>

      {/* DIVIDER */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, margin: "24px 0"
      }}>
        <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.2)" }}/>
        <span style={{ color: "rgba(243,238,251,0.25)", fontSize: 12 }}>¿nuevo aquí?</span>
        <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.2)" }}/>
      </div>

      {/* LINK A REGISTRO */}
      <p style={{ textAlign: "center", margin: 0 }}>
        <span style={{ color: "rgba(243,238,251,0.4)", fontSize: 14 }}>
          ¿No tienes cuenta?{" "}
        </span>
        <Link to="/registro" style={{
          color: "#E29DE0", fontSize: 14, fontWeight: 600,
          textDecoration: "none", transition: "color 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.color = "#7C3AED"}
          onMouseLeave={e => e.currentTarget.style.color = "#E29DE0"}
        >
          Regístrate 
        </Link>
      </p>

    </div>
  </div>
);
}
