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
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-surface rounded-xl p-6">
        <div className="flex flex-col items-center mb-5">
          <img src={logo} alt="SIPE-SOUND" className="w-16 h-16 object-contain mb-2" />
          <h2 className="font-display font-semibold text-paper text-lg">Crear cuenta</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Contrasena (min. 6 caracteres)"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full mt-1">
            Registrarme
          </Button>
        </form>
        {error && <p className="text-danger text-sm mt-3">{error}</p>}
        {exito && <p className="text-success text-sm mt-3">Cuenta creada! Redirigiendo...</p>}
        <p className="text-muted text-sm mt-4 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
}
