export const cargarProgresoPage = () => import("./pages/ProgresoPage");
export { useCompletarLeccion, useCompletarEjercicio } from "./hooks/useRegistrarAvance.js";
export { progresoKeys } from "./api/keys.js";
export { useResumenProgreso, type ResumenProgreso } from "./hooks/useResumenProgreso";
export {
  useActividad,
  DIAS_ACTIVIDAD,
  type Actividad,
  type EventoActividad,
} from "./hooks/useActividad";
export { avanceGlobal, cifrasDeProgreso, type Cifra } from "./utils/calculos";
