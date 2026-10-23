// Respuesta estándar del backend (contrato 04 §2, HU-B-317). Solo httpClient la lee.
export interface RespuestaApi<T> {
  statusCode: number;
  status: string;
  data: T | null;
  success: boolean;
  message: string;
  errors: string[];
  timestamp: string;
  meta: Record<string, unknown>;
}

export interface MetaPaginacion {
  pagina: number;
  por_pagina: number;
  total: number;
}
