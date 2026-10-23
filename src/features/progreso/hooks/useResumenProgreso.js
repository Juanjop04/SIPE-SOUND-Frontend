import { useQuery } from "@tanstack/react-query";
import { progresoApi } from "../api/progresoApi.js";
import { progresoKeys } from "../api/keys.js";

export function useResumenProgreso({ enabled = true } = {}) {
  return useQuery({ queryKey: progresoKeys.resumen(), queryFn: progresoApi.resumen, enabled });
}
