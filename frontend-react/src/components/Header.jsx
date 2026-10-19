import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, cerrarSesion } from "../lib/supabaseClient.js";
import logo from "../assets/logo.png";

export default function Header() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session?.user ?? null);
    });
  }, []);

  async function handleLogout() {
    await cerrarSesion();
    navigate(0);
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-surface">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Sipe Sound" className="w-9 h-9 object-contain" />
        <Link to="/" className="font-display font-semibold text-paper text-lg">
          Sipe Sound
        </Link>
      </div>
      <nav className="flex items-center gap-4 text-sm">
        <Link to="/acordes" className="text-muted hover:text-primary">
          Acordes
        </Link>
        {usuario ? (
          <>
            <span className="text-muted">{usuario.email}</span>
            <a href="#" onClick={handleLogout} className="text-primary hover:underline">
              Cerrar sesion
            </a>
          </>
        ) : (
          <Link to="/login" className="text-primary hover:underline">
            Iniciar sesion
          </Link>
        )}
      </nav>
    </header>
  );
}
