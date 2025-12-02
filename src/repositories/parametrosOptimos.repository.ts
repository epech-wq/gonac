import { SupabaseClient } from '@supabase/supabase-js';
import { ParametrosOptimos } from '@/types/parametrosOptimos';
import { getDbSchema } from '@/utils/env';

/**
 * Repository for Parámetros Óptimos
 * Handles data access for optimization parameters
 */
export class ParametrosOptimosRepository {
  constructor(private supabase: SupabaseClient) { }

  /**
   * Get optimization parameters from the database
   * Returns optimal and actual values for inventory days, reorder point, order size, and frequency
   * Fetches from: gonac.vw_comparacion_optimo_real_global (single row table)
   */
  async getParametrosOptimos(): Promise<ParametrosOptimos> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .from('vw_comparacion_optimo_real_global')
      .select('optimo_dias_inventario, optimo_punto_reorden, optimo_tamano_pedido, optimo_frecuencia, real_dias_inventario, real_punto_reorden, real_tamano_pedido, real_frecuencia, desviacion_dias_inventario_pct, desviacion_punto_reorden_pct, desviacion_tamano_pedido_pct, desviacion_frecuencia_pct, valor_dias_inventario, valor_tamano_pedido, valor_frecuencia')
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching parametros optimos: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data found in vw_comparacion_optimo_real_global');
    }

    return {
      dias_inventario_optimo: Number(data.optimo_dias_inventario) || 0,
      dias_inventario_real: Number(data.real_dias_inventario) || 0,
      punto_reorden_optimo: Number(data.optimo_punto_reorden) || 0,
      punto_reorden_real: Number(data.real_punto_reorden) || 0,
      tamano_pedido_optimo: Number(data.optimo_tamano_pedido) || 0,
      tamano_pedido_real: Number(data.real_tamano_pedido) || 0,
      frecuencia_optima: Number(data.optimo_frecuencia) || 0,
      frecuencia_real: Number(data.real_frecuencia) || 0,
      desviacion_dias_inventario_pct: Number(data.desviacion_dias_inventario_pct) || 0,
      desviacion_punto_reorden_pct: Number(data.desviacion_punto_reorden_pct) || 0,
      desviacion_tamano_pedido_pct: Number(data.desviacion_tamano_pedido_pct) || 0,
      desviacion_frecuencia_pct: Number(data.desviacion_frecuencia_pct) || 0,
      valor_dias_inventario: Number(data.valor_dias_inventario) || 0,
      valor_tamano_pedido: Number(data.valor_tamano_pedido) || 0,
      valor_frecuencia: Number(data.valor_frecuencia) || 0,
    };
  }
}

