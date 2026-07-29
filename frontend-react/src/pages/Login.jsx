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
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-surface rounded-xl p-6">
        <div className="flex flex-col items-center mb-5">
          <img src={logo} alt="GuitarApp" className="w-16 h-16 object-contain mb-2" />
          <h2 className="font-display font-semibold text-paper text-lg">Iniciar sesion</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full mt-1">
            Entrar
          </Button>
        </form>
        {error && <p className="text-danger text-sm mt-3">{error}</p>}
        <p className="text-muted text-sm mt-4 text-center">
          No tienes cuenta?{" "}
          <Link to="/registro" className="text-primary hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
