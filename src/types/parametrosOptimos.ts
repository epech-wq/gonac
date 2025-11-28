/**
 * Types for Parámetros Óptimos (Optimization Parameters)
 */

export interface ParametrosOptimos {
  dias_inventario_optimo: number;
  dias_inventario_real: number;
  punto_reorden_optimo: number;
  punto_reorden_real: number;
  tamano_pedido_optimo: number;
  tamano_pedido_real: number;
  frecuencia_optima: number;
  frecuencia_real: number;
}

export interface ParametrosOptimosResponse {
  success: boolean;
  data: ParametrosOptimos;
  timestamp: string;
}


