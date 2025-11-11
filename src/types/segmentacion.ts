// Segmentacion Types

// Base segmentation metrics from materialized view
export interface SegmentacionMetrics {
  segment: string;
  ventas_valor: number;
  ventas_unidades: number;
  dias_inventario: number;
  contribucion_porcentaje: number;
  num_tiendas_segmento: number;
  participacion_segmento: number;
  ventas_semana_promedio_tienda_pesos: number;
  ventas_semana_promedio_tienda_unidades: number;
}

// Detailed metrics by store and segment
export interface SegmentacionDetalle {
  store_name: string;
  segment: string;
  ventas_totales_pesos: number;
  ventas_totales_unidades: number;
  venta_promedio_diaria: number;
  inventario_inicial: number;
  inventario_final: number;
  dias_inventario: number;
  sell_through_pct: number;
  dias_con_venta: number;
  dias_en_periodo: number;
  inserted_at: string;
  venta_promedio_semanal: number;
  venta_promedio_diaria_pesos: number;
  precio_sku_promedio: number;
}

// API Response Types
export interface SegmentacionMetricsResponse {
  success: boolean;
  data: SegmentacionMetrics[];
  total: number;
  timestamp: string;
}

export interface SegmentacionDetalleResponse {
  success: boolean;
  data: SegmentacionDetalle[];
  total: number;
  timestamp: string;
}

// Grouped by segment response
export interface SegmentacionDetalleGrouped {
  success: boolean;
  data: Record<string, Omit<SegmentacionDetalle, 'segment'>[]>;
  total: number;
  segments: string[];
  timestamp: string;
}

// Formatted response with cards and summary
export interface SegmentacionFormatted {
  success: boolean;
  cards: Array<{
    segment: string;
    ventas_valor: string;
    ventas_unidades: string;
    dias_inventario: string;
    contribucion_porcentaje: string;
    num_tiendas_segmento: number;
    participacion_segmento: string;
    ventas_semana_promedio_tienda_pesos: string;
    ventas_semana_promedio_tienda_unidades: string;
  }>;
  summary: {
    total_ventas_valor: string;
    total_ventas_unidades: string;
    promedio_dias_inventario: string;
    total_tiendas: number;
  };
  timestamp: string;
}
