import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@/features/auth";
import logo from "@/assets/brand/logo.png";

export default function Header() {
  const { usuario, cerrarSesion } = useSession();
  const navigate = useNavigate();

  // AuthProvider limpia la caché al cerrar sesión; no hace falta recargar la página.
  async function handleLogout() {
    await cerrarSesion();
    navigate("/");
  }

  return (
    <header className="flex items-center justify-between bg-surface px-6 py-4">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Sipe Sound" className="h-9 w-9 object-contain" />
        <Link to="/" className="font-display text-lg font-semibold text-paper">
          Sipe Sound
        </Link>
      </div>
      <nav className="flex items-center gap-4 text-sm">
        <Link to="/acordes" className="text-muted hover:text-primary">
          Acordes
        </Link>
        <Link to="/ejercicios" className="text-muted hover:text-primary">
          Ejercicios
        </Link>
        {usuario && (
          <Link to="/progreso" className="text-muted hover:text-primary">
            Mi progreso
          </Link>
        )}
        {usuario ? (
          <>
            <span className="text-muted">{usuario.email}</span>
            <button type="button" onClick={handleLogout} className="text-primary hover:underline">
              Cerrar sesion
            </button>
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
