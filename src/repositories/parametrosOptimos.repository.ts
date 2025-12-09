import { SupabaseClient } from '@supabase/supabase-js';
import { ParametrosOptimos } from '@/types/parametrosOptimos';
import { getDbSchema } from '@/lib/schema';

/**
 * Repository for Parámetros Óptimos
 * Handles data access for optimization parameters
 */
export class ParametrosOptimosRepository {
  constructor(private supabase: SupabaseClient) { }

  /**
   * Get optimization parameters from the database
   * Returns optimal and actual values for inventory days, reorder point, order size, and frequency
   */
  async getParametrosOptimos(): Promise<ParametrosOptimos> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .from('tab_parametros_optimos')
      .select('dias_inventario_optimo, dias_inventario_real, punto_reorden, punto_reorden_real, tamano_pedido_optimo, tamano_pedido_real, frecuencia_optima, frecuencia_real')
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching parametros optimos: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data found in tab_parametros_optimos');
    }

    return {
      dias_inventario_optimo: Number(data.dias_inventario_optimo) || 0,
      dias_inventario_real: Number(data.dias_inventario_real) || 0,
      punto_reorden_optimo: Number(data.punto_reorden) || 0,
      punto_reorden_real: Number(data.punto_reorden_real) || 0,
      tamano_pedido_optimo: Number(data.tamano_pedido_optimo) || 0,
      tamano_pedido_real: Number(data.tamano_pedido_real) || 0,
      frecuencia_optima: Number(data.frecuencia_optima) || 0,
      frecuencia_real: Number(data.frecuencia_real) || 0,
    };
  }
}

