/**
 * Parámetros Óptimos - Types
 * Epic 2: Cálculo de Parámetros Óptimos e Indicadores
 */

/**
 * Tabla: gonac.tab_parametros_optimos
 * Parámetros óptimos y reales calculados por SKU-Tienda
 */
export interface ParametrosOptimos {
  id_store: number;
  sku: number;
  
  // Parámetros óptimos (los 4 principales)
  dias_inventario_optimo: number;
  punto_reorden: number;
  tamano_pedido_optimo: number;
  frecuencia_optima: number;
  
  // Parámetros reales
  dias_inventario_real: number | null;
  punto_reorden_real: number | null;
  tamano_pedido_real: number | null;
  frecuencia_real: number | null;
  
  // Datos del modelo de cálculo
  fecha_calculo: string;
  demanda_promedio_diaria: number | null;
  desviacion_estandar_diaria: number | null;
  stock_seguridad: number | null;
  stock_exhibicion: number | null;
  lead_time: number;
  z_score: number;
  dias_exhibicion: number;
  
  // Timestamps
  inserted_at: string;
  updated_at: string;
}

/**
 * Vista: gonac.vw_comparacion_optimo_real
 * Comparación detallada óptimo vs real por SKU-Tienda
 */
export interface ComparacionOptimoReal {
  // Identificadores y dimensiones
  id_store: number;
  sku: number;
  category: string | null;
  brand: string | null;
  store_name: string | null;
  region: string | null;
  segment: string | null;
  fecha_ultimo_calculo: string | null;
  
  // Parámetros óptimos
  optimo_dias_inventario: number | null;
  optimo_punto_reorden: number | null;
  optimo_tamano_pedido: number | null;
  optimo_frecuencia: number | null;
  
  // Parámetros reales
  real_dias_inventario: number | null;
  real_punto_reorden: number | null;
  real_tamano_pedido: number | null;
  real_frecuencia: number | null;
  
  // Desviaciones absolutas
  desviacion_dias_inventario: number | null;
  desviacion_punto_reorden: number | null;
  desviacion_tamano_pedido: number | null;
  desviacion_frecuencia: number | null;
  
  // Desviaciones porcentuales
  desviacion_dias_inventario_pct: number | null;
  desviacion_punto_reorden_pct: number | null;
  desviacion_tamano_pedido_pct: number | null;
  desviacion_frecuencia_pct: number | null;
  desviacion_total_promedio: number | null;
  
  // Tendencias (valores de texto calculados)
  tendencia_dias_inventario: string | null;
  tendencia_punto_reorden: string | null;
  
  // Métricas de desempeño
  ventas_totales_pesos: number | null;
  ventas_totales_unidades: number | null;
  venta_promedio_diaria: number | null;
  inventario_inicial: number | null;
  inventario_final: number | null;
  sell_through_pct: number | null;
  
  // Brechas (Gaps)
  gap_dias_inventario: number | null;
  gap_tamano_pedido: number | null;
  gap_frecuencia: number | null;
  
  // Correlación y período
  correlacion_segmento: number | null;
  periodo_tiempo: number | null;
  
  // Valores de oportunidad (monetarios)
  valor_oportunidad_dias_inventario: number | null;
  valor_oportunidad_tamano_pedido: number | null;
  valor_oportunidad_frecuencia: number | null;
  
  // Valores por parámetro
  valor_dias_inventario: number | null;
  valor_tamano_pedido: number | null;
  valor_frecuencia: number | null;
  
  // Impacto total
  impacto: number | null;
  
  // Ranking
  ranking_desviacion: number | null;
}

/**
 * Vista: gonac.vw_comparacion_optimo_real_tienda
 * Comparación agregada por tienda
 */
export interface ComparacionOptimoRealTienda {
  // Identificadores
  id_store: number;
  sku: number;
  store_name: string | null;
  region: string | null;
  segment: string | null;
  fecha_ultimo_calculo: string | null;
  
  // Promedios de parámetros óptimos
  optimo_dias_inventario: number | null;
  optimo_punto_reorden: number | null;
  optimo_tamano_pedido: number | null;
  optimo_frecuencia: number | null;
  
  // Promedios de parámetros reales
  real_dias_inventario: number | null;
  real_punto_reorden: number | null;
  real_tamano_pedido: number | null;
  real_frecuencia: number | null;
  
  // Desviaciones promedio absolutas
  desviacion_dias_inventario: number | null;
  desviacion_punto_reorden: number | null;
  desviacion_tamano_pedido: number | null;
  desviacion_frecuencia: number | null;
  
  // Desviaciones promedio porcentuales
  desviacion_dias_inventario_pct: number | null;
  desviacion_punto_reorden_pct: number | null;
  desviacion_tamano_pedido_pct: number | null;
  desviacion_frecuencia_pct: number | null;
  desviacion_total_promedio: number | null;
  
  // Tendencias
  tendencia_dias_inventario: string | null;
  tendencia_punto_reorden: string | null;
  
  // Métricas agregadas
  ventas_totales_pesos: number | null;
  ventas_totales_unidades: number | null;
  venta_promedio_diaria: number | null;
  inventario_inicial: number | null;
  inventario_final: number | null;
  sell_through_pct: number | null;
  
  // Valores agregados
  valor_dias_inventario: number | null;
  valor_tamano_pedido: number | null;
  valor_frecuencia: number | null;
  
  // Impacto agregado
  impacto: number | null;
  
  // Contadores
  total_skus: number | null;
}

/**
 * Vista: gonac.vw_comparacion_optimo_real_global
 * Comparación agregada global
 */
export interface ComparacionOptimoRealGlobal {
  // Identificadores (agregados)
  id_store: number | null;
  sku: number | null;
  store_name: string | null;
  region: string | null;
  segment: string | null;
  fecha_ultimo_calculo: string | null;
  
  // Promedios globales de parámetros óptimos
  optimo_dias_inventario: number | null;
  optimo_punto_reorden: number | null;
  optimo_tamano_pedido: number | null;
  optimo_frecuencia: number | null;
  
  // Promedios globales de parámetros reales
  real_dias_inventario: number | null;
  real_punto_reorden: number | null;
  real_tamano_pedido: number | null;
  real_frecuencia: number | null;
  
  // Desviaciones globales absolutas
  desviacion_dias_inventario: number | null;
  desviacion_punto_reorden: number | null;
  desviacion_tamano_pedido: number | null;
  desviacion_frecuencia: number | null;
  
  // Desviaciones globales porcentuales
  desviacion_dias_inventario_pct: number | null;
  desviacion_punto_reorden_pct: number | null;
  desviacion_tamano_pedido_pct: number | null;
  desviacion_frecuencia_pct: number | null;
  desviacion_total_promedio: number | null;
  
  // Tendencias
  tendencia_dias_inventario: string | null;
  tendencia_punto_reorden: string | null;
  
  // Métricas globales
  ventas_totales_pesos: number | null;
  ventas_totales_unidades: number | null;
  venta_promedio_diaria: number | null;
  inventario_inicial: number | null;
  inventario_final: number | null;
  sell_through_pct: number | null;
  
  // Valores globales
  valor_dias_inventario: number | null;
  valor_tamano_pedido: number | null;
  valor_frecuencia: number | null;
  
  // Impacto global
  impacto: number | null;
  
  // Contadores globales
  total_tiendas: number | null;
  total_skus: number | null;
  total_combinaciones_sku_tienda: number | null;
}

/**
 * Filtros para consultas
 */
export interface ParametrosFilters {
  id_store?: number;
  sku?: number;
  category?: string;
  brand?: string;
  segment?: string;
  region?: string;
  store_name?: string;
  ranking_limit?: number; // Para top N por desviación o impacto
  min_impacto?: number; // Filtrar por impacto mínimo
  tendencia?: string; // Filtrar por tendencia específica
}

/**
 * Helper type para código de colores (basado en desviación %)
 * - green: desviación <= 5%
 * - yellow: desviación > 5% y <= 10%
 * - red: desviación > 10%
 */
export type StatusColor = 'green' | 'yellow' | 'red';

/**
 * Resumen por status de color
 */
export interface ResumenPorStatus {
  total: number;
  green: number;
  yellow: number;
  red: number;
  green_pct: number;
  yellow_pct: number;
  red_pct: number;
}

/**
 * Dashboard consolidado con todas las agregaciones
 */
export interface DashboardParametros {
  global: ComparacionOptimoRealGlobal;
  porTienda: ComparacionOptimoRealTienda[];
  topDesviaciones: ComparacionOptimoReal[];
  topImpacto: ComparacionOptimoReal[];
  resumenStatus: ResumenPorStatus;
  ultimaActualizacion: string;
}

/**
 * Response types para API
 */
export interface ParametrosApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  timestamp: string;
  error?: string;
}

/**
 * Comparación con formato para UI
 */
export interface ComparacionOptimoRealFormatted extends ComparacionOptimoReal {
  // Status por parámetro
  status_dias_inventario: StatusColor;
  status_punto_reorden: StatusColor;
  status_tamano_pedido: StatusColor;
  status_frecuencia: StatusColor;
  
  // Valores formateados
  ventas_totales_pesos_formatted: string;
  impacto_formatted: string;
  valor_oportunidad_total_formatted: string;
  
  // Porcentajes formateados
  desviacion_dias_inventario_pct_formatted: string;
  desviacion_punto_reorden_pct_formatted: string;
  desviacion_tamano_pedido_pct_formatted: string;
  desviacion_frecuencia_pct_formatted: string;
}

