/**
 * Type definitions for Metrics Section
 */

import type { StoreMetrics } from './tiendas.types';

export interface MetricasData {
  sell_through_pct?: number;
  cobertura_ponderada_pct?: number;
  crecimiento_vs_semana_anterior_pct?: number;
  porcentaje_agotados_pct?: number;
  avg_venta_promedio_diaria?: number;
  cobertura_pct?: number;
  ventas_totales_unidades?: number;
  // Target data
  objetivo_ventas_totales_pesos?: number;
  objetivo_ventas_totales_pesos_formatted?: string;
  objetivo_sell_through_pct?: number;
  objetivo_sell_through_formatted?: string;
  objetivo_cobertura_pct?: number;
  objetivo_cobertura_formatted?: string;
  objetivo_cobertura_ponderada_pct?: number;
  objetivo_cobertura_ponderada_formatted?: string;
  objetivo_promedio_dias_inventario?: number;
  objetivo_promedio_dias_inventario_formatted?: string;
  objetivo_porcentaje_agotados_pct?: number;
  objetivo_porcentaje_agotados_formatted?: string;
  objetivo_avg_venta_promedio_diaria?: number;
  objetivo_avg_venta_promedio_diaria_formatted?: string;
  // Variation data
  variacion_ventas_totales_pct?: number;
  variacion_ventas_totales_formatted?: string;
  variacion_cobertura_pct?: number;
  variacion_cobertura_formatted?: string;
  variacion_cobertura_ponderada_pct?: number;
  variacion_cobertura_ponderada_formatted?: string;
  variacion_promedio_dias_inventario_pct?: number;
  variacion_promedio_dias_inventario_formatted?: string;
  variacion_porcentaje_agotados_pct?: number;
  variacion_porcentaje_agotados_formatted?: string;
  variacion_avg_venta_promedio_diaria_pct?: number;
  variacion_avg_venta_promedio_diaria_formatted?: string;
  diferencia_sell_through_pct?: number;
}

export interface MetricsSectionProps {
  storeMetrics: StoreMetrics;
  metricasData: MetricasData | null;
  onCardClick?: (cardData: any) => void;
  enableAnalysis?: boolean;
}

export interface CardClickData {
  title: string;
  value: string;
  storeMetrics: StoreMetrics;
  metricasData: MetricasData | null;
}
