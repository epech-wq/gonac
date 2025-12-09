import { SupabaseClient } from '@supabase/supabase-js';
import { CambioInventarioSimulacion, RedistribucionCaducidadDetalle } from '@/types/cambioInventario';
import { getDbSchema } from '@/lib/schema';

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
      .schema(getDbSchema())
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

  /**
   * Get detailed redistribution data from fn_redistribucion_caducidad
   * @param p_dias_maximo_inventario - Maximum inventory days in destination (default: 30)
   */
  async getRedistribucionDetalle(
    p_dias_maximo_inventario: number = 30
  ): Promise<RedistribucionCaducidadDetalle[]> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .rpc('fn_redistribucion_caducidad', {
        p_dias_maximo_inventario: p_dias_maximo_inventario
      });

    if (error) {
      throw new Error(`Error fetching redistribucion detalle: ${error.message}`);
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Transform and validate data
    return data.map((item: Record<string, unknown>) => ({
      tipo_operacion: String(item.tipo_operacion || ''),
      id_store_origen: Number(item.id_store_origen) || 0,
      id_store_destino: Number(item.id_store_destino) || 0,
      sku: Number(item.sku) || 0,
      id_lote: String(item.id_lote || ''),
      inventario_remanente: Number(item.inventario_remanente) || 0,
      fecha_caducidad: String(item.fecha_caducidad || ''),
      dias_hasta_caducidad: Math.round(Number(item.dias_hasta_caducidad) || 0),
      capacidad_evacuacion_destino: Number(item.capacidad_evacuacion_destino) || 0,
      cantidad_a_redistribuir: Number(item.cantidad_a_redistribuir) || 0,
      precio_unitario: Number(item.precio_unitario) || 0,
      valor_total: Number(item.valor_total) || 0,
      venta_promedio_diaria_destino: Number(item.venta_promedio_diaria_destino) || 0,
      dias_inventario_proyectado: Math.round(Number(item.dias_inventario_proyectado) || 0)
    }));
  }
}

