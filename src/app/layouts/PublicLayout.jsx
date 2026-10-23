import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";

// Contenedor y Header comunes: antes se repetían en cada página.
export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-ink">
      <Header />
      {children ?? <Outlet />}
    </div>
  );
}
