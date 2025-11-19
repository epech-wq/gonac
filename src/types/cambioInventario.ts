/**
 * Cambio de Inventario Types
 * Types for inventory balancing simulation data
 */

/**
 * Simulation parameters and metrics from vw_simulacion_reabastecimiento
 */
export interface CambioInventarioSimulacion {
  // Parámetros de Simulación
  max_dias_inventario_destino: number;
  costo_logistico_pct: number;
  min_unidades_mover_a_tienda: number;
  min_unidades_mover_desde_tienda: number;

  // Métricas de Impacto (ROI)
  inventario_movilizar_unidades: number;
  inventario_movilizar_pesos: number;
  num_tiendas_origen: number;
  num_tiendas_destino: number;
  dias_inventario_critico_inicial: number;
  dias_inventario_critico_final: number;
  dias_inventario_destino_inicial: number;
  dias_inventario_destino_final: number;
  costo_iniciativa: number;
}

/**
 * API Response format
 */
export interface CambioInventarioResponse {
  success: boolean;
  data: CambioInventarioSimulacion;
  timestamp: string;
  source: string;
}

