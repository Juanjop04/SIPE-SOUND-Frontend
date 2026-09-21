import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../lib/supabaseClient.js";
import { Input } from "../components/ui/input.jsx";
import { Button } from "../components/ui/button.jsx";
import logo from "../assets/logo.png";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await registrarUsuario(email, password, nombre);
      setExito(true);
      setTimeout(() => navigate("/login"), 1500);
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

    {/* Círculos decorativos */}
    <div style={{
      position: "absolute", top: -100, left: -100,
      width: 400, height: 400, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
      pointerEvents: "none"
    }}/>
    <div style={{
      position: "absolute", bottom: -80, right: -80,
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
          Crea tu cuenta 🎸
        </h2>
        <p style={{ color: "rgba(243,238,251,0.4)", fontSize: 14, margin: 0 }}>
          Empieza a aprender guitarra hoy
        </p>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Campo nombre */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ color: "rgba(243,238,251,0.6)", fontSize: 13, fontWeight: 500 }}>
            Nombre de usuario
          </label>
          <Input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{
              background: "rgba(27,16,48,0.8)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: 12, padding: "12px 16px",
              color: "#F3EEFB", fontSize: 14, outline: "none", width: "100%"
            }}
          />
        </div>

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
              color: "#F3EEFB", fontSize: 14, outline: "none", width: "100%"
            }}
          />
        </div>

        {/* Campo contraseña con ojo */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ color: "rgba(243,238,251,0.6)", fontSize: 13, fontWeight: 500 }}>
            Contraseña
          </label>
          <div style={{ position: "relative" }}>
            <Input
              type={mostrarPass ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                background: "rgba(27,16,48,0.8)",
                border: `1px solid ${password && password.length < 6
                  ? "#F2545B" : "rgba(124,58,237,0.3)"}`,
                borderRadius: 12, padding: "12px 48px 12px 16px",
                color: "#F3EEFB", fontSize: 14, outline: "none", width: "100%"
              }}
            />
            <button type="button"
              onClick={() => setMostrarPass(!mostrarPass)}
              style={{
                position: "absolute", right: 14, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "rgba(243,238,251,0.4)", cursor: "pointer", fontSize: 16
              }}>
              {mostrarPass ? "🙈" : "👁"}
            </button>
          </div>
          {/* Validación longitud */}
          {password && password.length < 6 && (
            <span style={{ color: "#F2545B", fontSize: 12 }}>
              ⚠️ Mínimo 6 caracteres
            </span>
          )}
        </div>

        {/* Mensajes error y éxito */}
        {error && (
          <div style={{
            background: "rgba(242,84,91,0.1)",
            border: "1px solid rgba(242,84,91,0.3)",
            borderRadius: 10, padding: "10px 14px",
            color: "#F2545B", fontSize: 13
          }}>
            ⚠️ {error}
          </div>
        )}
        {exito && (
          <div style={{
            background: "rgba(245,185,66,0.1)",
            border: "1px solid rgba(245,185,66,0.3)",
            borderRadius: 10, padding: "10px 14px",
            color: "#F5B942", fontSize: 13, textAlign: "center"
          }}>
            🎉 ¡Cuenta creada! Redirigiendo...
          </div>
        )}

        {/* Botón registrarse */}
        <button type="submit"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #E29DE0)",
            color: "#F3EEFB", border: "none",
            borderRadius: 12, padding: "13px",
            fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            marginTop: 4, transition: "opacity 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Crear cuenta →
        </button>

      </form>

      {/* DIVIDER */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.2)" }}/>
        <span style={{ color: "rgba(243,238,251,0.25)", fontSize: 12 }}>¿ya tienes cuenta?</span>
        <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.2)" }}/>
      </div>

      {/* LINK LOGIN */}
      <p style={{ textAlign: "center", margin: 0 }}>
        <Link to="/login" style={{
          color: "#E29DE0", fontSize: 14, fontWeight: 600, textDecoration: "none"
        }}>
          Inicia sesión aquí
        </Link>
      </p>

    </div>
  </div>
);
}
