// Gráficos de Recharts (SVG) con los tokens del sistema. NO se exportan desde shared/ui para que
// Recharts quede fuera del paquete inicial: se importan solo desde páginas cargadas bajo demanda.
export { BarrasHorizontales, type BarraHorizontal } from "./BarrasHorizontales";
export { BarrasPorDia, type BarraDia } from "./BarrasPorDia";
export { PuntosConLinea, type PuntoEvaluacion } from "./PuntosConLinea";
export { BarraApilada, type TramoApilado } from "./BarraApilada";
export { ESTADO_GRAFICO, colorToken, type EstadoGrafico } from "./colores";
