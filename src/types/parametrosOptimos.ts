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
  desviacion_dias_inventario_pct: number;
  desviacion_punto_reorden_pct: number;
  desviacion_tamano_pedido_pct: number;
  desviacion_frecuencia_pct: number;
  valor_dias_inventario: number;
  valor_tamano_pedido: number;
  valor_frecuencia: number;
}

export interface ParametrosOptimosResponse {
  success: boolean;
  data: ParametrosOptimos;
  timestamp: string;
}



