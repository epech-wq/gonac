import { SupabaseClient } from '@supabase/supabase-js';
import { CambioInventarioSimulacion } from '@/types/cambioInventario';

/**
 * Repository for Cambio de Inventario (Inventory Balancing)
 * Handles data access for inventory balancing simulation from Slow/Dead stores to high-rotation stores
 */
export class CambioInventarioRepository {
  constructor(private supabase: SupabaseClient) { }

  /**
   * Get simulation data from vw_simulacion_reabastecimiento view
   * Returns all simulation parameters and impact metrics
   */
  async getSimulacion(): Promise<CambioInventarioSimulacion> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('vw_simulacion_reabastecimiento')
      .select('*')
      .single();

    if (error) {
      throw new Error(`Error fetching cambio inventario simulacion: ${error.message}`);
    }

    if (!data) {
      // Return default values if no data found
      return {
        max_dias_inventario_destino: 30,
        costo_logistico_pct: 5,
        min_unidades_mover_a_tienda: 10,
        min_unidades_mover_desde_tienda: 20,
        inventario_movilizar_unidades: 0,
        inventario_movilizar_pesos: 0,
        num_tiendas_origen: 0,
        num_tiendas_destino: 0,
        dias_inventario_critico_inicial: 0,
        dias_inventario_critico_final: 0,
        dias_inventario_destino_inicial: 0,
        dias_inventario_destino_final: 0,
        costo_iniciativa: 0
      };
    }

    // Transform and validate data
    return {
      max_dias_inventario_destino: Number(data.max_dias_inventario_destino) || 30,
      costo_logistico_pct: Number(data.costo_logistico_pct) || 5,
      min_unidades_mover_a_tienda: Number(data.min_unidades_mover_a_tienda) || 10,
      min_unidades_mover_desde_tienda: Number(data.min_unidades_mover_desde_tienda) || 20,
      inventario_movilizar_unidades: Number(data.inventario_movilizar_unidades) || 0,
      inventario_movilizar_pesos: Number(data.inventario_movilizar_pesos) || 0,
      num_tiendas_origen: Number(data.num_tiendas_origen) || 0,
      num_tiendas_destino: Number(data.num_tiendas_destino) || 0,
      dias_inventario_critico_inicial: Math.round(Number(data.dias_inventario_critico_inicial) || 0),
      dias_inventario_critico_final: Math.round(Number(data.dias_inventario_critico_final) || 0),
      dias_inventario_destino_inicial: Math.round(Number(data.dias_inventario_destino_inicial) || 0),
      dias_inventario_destino_final: Math.round(Number(data.dias_inventario_destino_final) || 0),
      costo_iniciativa: Number(data.costo_iniciativa) || 0
    };
  }
}

