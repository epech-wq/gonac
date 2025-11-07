/**
 * Descuento (Discount) Types
 * Types for promotion discount calculation metrics
 */

export type SegmentType = 'Slow' | 'Dead';

export type CategoryType = 'PAPAS' | 'TOTOPOS' | string;

/**
 * Parameters for discount calculation
 */
export interface DescuentoParams {
  descuento: number;        // p_descuento - Discount percentage (0.41 = 41%)
  elasticidad: number;      // p_elasticidad - Price elasticity (1.5)
  categoria: string;        // p_categoria - Product category ('PAPAS', 'TOTOPOS')
}

/**
 * Raw result from the PostgreSQL function
 */
export interface DescuentoMetrics {
  inventario_inicial_total: number;  // Total initial inventory
  ventas_plus: number;               // Additional sales (increment)
  venta_original: number;            // Original sale value
  costo: number;                     // Cost after discount
  valor: number;                     // Value captured
  reduccion: number;                 // Reduction value (NEW FIELD from DB)
}

/**
 * Calculated metrics for a promotion
 */
export interface PromocionMetrics extends DescuentoMetrics {
  descuento_porcentaje: number;     // Discount as percentage (41)
  elasticidad: number;               // Elasticity used
  categoria: string;                 // Category
  reduccion_riesgo: number;         // Risk reduction percentage
  costo_promocion: number;          // Promotion cost (valor)
  valor_capturar: number;           // Value to capture (venta_original)
  inventario_post: number;          // Post-promotion inventory
}

/**
 * Configuration for a promotion
 */
export interface PromocionConfig {
  descuento_maximo: number;         // Maximum discount %
  elasticidad_papas: number;        // Elasticity for PAPAS
  elasticidad_totopos: number;      // Elasticity for TOTOPOS
}

/**
 * Complete promotion response
 */
export interface PromocionResponse {
  papas: PromocionMetrics | null;
  totopos: PromocionMetrics | null;
  config: PromocionConfig;
  timestamp: string;
}

/**
 * Promotion calculation request
 */
export interface CalcularPromocionRequest {
  descuento: number;
  elasticidad_papas?: number;
  elasticidad_totopos?: number;
  categorias?: string[];  // Optional: filter by categories
}

/**
 * API Response wrapper
 */
export interface DescuentoApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Individual SKU detail (if needed for drill-down)
 */
export interface SkuDescuentoDetail {
  sku: string;
  inventario_inicial: number;
  ventas_estimadas: number;
  valor_capturado: number;
  costo_promocion: number;
}

/**
 * Store-level metrics (if needed)
 */
export interface StoreDescuentoMetrics {
  id_store: string;
  segment: SegmentType;
  inventario_inicial: number;
  ventas_plus: number;
  valor_capturar: number;
  costo_promocion: number;
}

