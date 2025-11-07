import { SupabaseClient } from '@supabase/supabase-js';
import { DescuentoParams, DescuentoMetrics } from '@/types/descuento';

/**
 * Descuento Repository
 * Handles all database operations related to discount calculations
 */
export class DescuentoRepository {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Calculate discount metrics using PostgreSQL function
   * Calls: gonac.calcular_metricas_descuento(p_descuento, p_elasticidad, p_categoria)
   */
  async calcularMetricasDescuento(
    params: DescuentoParams
  ): Promise<DescuentoMetrics> {
    const { data, error } = await this.supabase.rpc('calcular_metricas_descuento', {
      p_descuento: params.descuento,
      p_elasticidad: params.elasticidad,
      p_categoria: params.categoria,
    });

    if (error) {
      throw new Error(`Database error calculating discount metrics: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned from discount calculation');
    }

    // The function returns a single row
    const result = Array.isArray(data) ? data[0] : data;

    return {
      inventario_inicial_total: Number(result.inventario_inicial_total) || 0,
      ventas_plus: Number(result.ventas_plus) || 0,
      venta_original: Number(result.venta_original) || 0,
      costo: Number(result.costo) || 0,
      valor: Number(result.valor) || 0,
      reduccion: Number(result.reduccion) || 0,
    };
  }

  /**
   * Calculate metrics for multiple categories in parallel
   */
  async calcularMetricasMultiples(
    descuento: number,
    categorias: Array<{ categoria: string; elasticidad: number }>
  ): Promise<Map<string, DescuentoMetrics>> {
    const results = await Promise.all(
      categorias.map(async ({ categoria, elasticidad }) => {
        try {
          const metrics = await this.calcularMetricasDescuento({
            descuento,
            elasticidad,
            categoria,
          });
          return { categoria, metrics };
        } catch (error) {
          console.error(`Error calculating for ${categoria}:`, error);
          return {
            categoria,
            metrics: {
              inventario_inicial_total: 0,
              ventas_plus: 0,
              venta_original: 0,
              costo: 0,
              valor: 0,
              reduccion: 0,
            },
          };
        }
      })
    );

    const metricsMap = new Map<string, DescuentoMetrics>();
    results.forEach(({ categoria, metrics }) => {
      metricsMap.set(categoria, metrics);
    });

    return metricsMap;
  }

  /**
   * Get available categories from the catalog
   */
  async getCategoriasDisponibles(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('core_cat_product')
      .select('category')
      .not('category', 'is', null);

    if (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }

    // Get unique categories
    const categorias = [...new Set(data.map((item: any) => item.category))];
    return categorias;
  }

  /**
   * Get stores by segment
   */
  async getStoresBySegment(segments: string[]): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('core_segmentacion_tiendas')
      .select('id_store')
      .in('segment', segments);

    if (error) {
      throw new Error(`Error fetching stores: ${error.message}`);
    }

    const storeIds = [...new Set(data.map((item: any) => item.id_store))];
    return storeIds;
  }

  /**
   * Get SKU details for a category
   */
  async getSkusByCategoria(categoria: string, segments: string[] = ['Slow', 'Dead']): Promise<any[]> {
    // First get stores in the segments
    const stores = await this.getStoresBySegment(segments);

    // Then get SKUs
    const { data, error } = await this.supabase
      .from('core_store_sku_metrics')
      .select(`
        sku,
        id_store,
        inventario_inicial,
        precio_sku_promedio,
        core_cat_product!inner(category)
      `)
      .in('id_store', stores)
      .eq('core_cat_product.category', categoria);

    if (error) {
      throw new Error(`Error fetching SKUs: ${error.message}`);
    }

    return data || [];
  }
}

