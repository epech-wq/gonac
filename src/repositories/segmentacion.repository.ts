import { SupabaseClient } from '@supabase/supabase-js';
import {
  SegmentacionMetrics,
  SegmentacionDetalle,
} from '@/types/segmentacion';

export class SegmentacionRepository {
  constructor(private supabase: SupabaseClient) { }

  /**
   * Get segmentation metrics from materialized view
   */
  async getMetrics(): Promise<SegmentacionMetrics[]> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('mvw_metricas_segmentacion_tiendas')
      .select(
        `
        segment,
        ventas_valor,
        ventas_unidades,
        dias_inventario,
        contribucion_porcentaje,
        num_tiendas_segmento,
        participacion_segmento,
        ventas_semana_promedio_tienda_pesos,
        ventas_semana_promedio_tienda_unidades
      `
      );

    if (error) {
      throw new Error(
        `Error fetching segmentacion metrics: ${error.message}`
      );
    }

    return data.map((item: {
      segment: string;
      ventas_valor: number;
      ventas_unidades: number;
      dias_inventario: number;
      contribucion_porcentaje: number;
      num_tiendas_segmento: number;
      participacion_segmento: number;
      ventas_semana_promedio_tienda_pesos: number;
      ventas_semana_promedio_tienda_unidades: number;
    }) => ({
      segment: String(item.segment),
      ventas_valor: Number(item.ventas_valor),
      ventas_unidades: Number(item.ventas_unidades),
      dias_inventario: Number(item.dias_inventario),
      contribucion_porcentaje: Number(item.contribucion_porcentaje),
      num_tiendas_segmento: Number(item.num_tiendas_segmento),
      participacion_segmento: Number(item.participacion_segmento),
      ventas_semana_promedio_tienda_pesos: Number(
        item.ventas_semana_promedio_tienda_pesos
      ),
      ventas_semana_promedio_tienda_unidades: Number(
        item.ventas_semana_promedio_tienda_unidades
      ),
    }));
  }

  /**
   * Get detailed metrics by store and segment
   * Fetches data from multiple tables and joins them in code
   */
  async getDetalle(): Promise<SegmentacionDetalle[]> {
    // Fetch segmentation data
    const { data: segmentData, error: segmentError } = await this.supabase
      .schema('gonac')
      .from('core_segmentacion_tiendas')
      .select('id_store, segment');

    if (segmentError) {
      throw new Error(
        `Error fetching segmentation data: ${segmentError.message}`
      );
    }

    if (!segmentData || segmentData.length === 0) {
      return [];
    }

    // Fetch store metrics
    const { data: metricsData, error: metricsError } = await this.supabase
      .schema('gonac')
      .from('core_store_metrics')
      .select('*');

    if (metricsError) {
      throw new Error(`Error fetching metrics data: ${metricsError.message}`);
    }

    // Fetch store names
    const { data: storeData, error: storeError } = await this.supabase
      .schema('gonac')
      .from('core_cat_store')
      .select('id_store, store_name');

    if (storeError) {
      throw new Error(`Error fetching store data: ${storeError.message}`);
    }

    // Create lookup maps for faster joins
    const metricsMap = new Map(
      (metricsData || []).map((m: { id_store: number;[key: string]: unknown }) => [m.id_store, m])
    );
    const storeMap = new Map(
      (storeData || []).map((s: { id_store: number; store_name: string }) => [s.id_store, s.store_name])
    );

    // Join data in code
    return segmentData
      .map((item: { id_store: number; segment: string }) => {
        const metrics = metricsMap.get(item.id_store);
        const storeName = storeMap.get(item.id_store);

        if (!metrics || !storeName) {
          return null;
        }

        return {
          store_name: String(storeName),
          segment: String(item.segment),
          ventas_totales_pesos: Number(metrics.ventas_totales_pesos || 0),
          ventas_totales_unidades: Number(metrics.ventas_totales_unidades || 0),
          venta_promedio_diaria: Number(metrics.venta_promedio_diaria || 0),
          inventario_inicial: Number(metrics.inventario_inicial || 0),
          inventario_final: Number(metrics.inventario_final || 0),
          dias_inventario: Number(metrics.dias_inventario || 0),
          sell_through_pct: Number(metrics.sell_through_pct || 0),
          dias_con_venta: Number(metrics.dias_con_venta || 0),
          dias_en_periodo: Number(metrics.dias_en_periodo || 0),
          inserted_at: String(metrics.inserted_at || ''),
          venta_promedio_semanal: Number(metrics.venta_promedio_semanal || 0),
          venta_promedio_diaria_pesos: Number(
            metrics.venta_promedio_diaria_pesos || 0
          ),
          precio_sku_promedio: Number(metrics.precio_sku_promedio || 0),
        };
      })
      .filter((item): item is SegmentacionDetalle => item !== null);
  }
}
