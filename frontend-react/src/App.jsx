import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import LeccionDetalle from "./pages/LeccionDetalle.jsx";
import Acordes from "./pages/Acordes.jsx";
import Ejercicios from "./pages/Ejercicios.jsx";
import Progreso from "./pages/Progreso.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/leccion/:id" element={<LeccionDetalle />} />
      <Route path="/acordes" element={<Acordes />} />
      <Route path="/ejercicios" element={<Ejercicios />} />
      <Route path="/progreso" element={<Progreso />} />
    </Routes>
  );
}
