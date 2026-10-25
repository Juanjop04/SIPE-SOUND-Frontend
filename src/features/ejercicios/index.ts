export const cargarEjerciciosPage = () => import("./pages/EjerciciosPage");
export const cargarEjercicioDetallePage = () => import("./pages/EjercicioDetallePage");
export { useEjercicios } from "./hooks/useEjercicios";
export type { Ejercicio } from "./types";
export { EncabezadoEjercicio, type VistaEjercicio } from "./components/EncabezadoEjercicio";
export { PasosEjercicio } from "./components/PasosEjercicio";
