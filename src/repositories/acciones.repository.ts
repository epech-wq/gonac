import { SupabaseClient } from '@supabase/supabase-js';
import { AccionesResumen, AccionDetalle } from '@/types/acciones';
import { getDbSchema } from '@/lib/schema';

/**
 * Acciones Repository
 * Handles all database operations related to task history and actions data
 */
export class AccionesRepository {
  constructor(private supabase: SupabaseClient) { }

  /**
   * Fetches acciones resumen data from vw_resumen_acciones view
   * Retrieves comprehensive task and action summary statistics
   */
  async getAccionesResumen(): Promise<AccionesResumen> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .from('vw_resumen_acciones')
      .select(`
        total_tareas,
        completadas,
        activas,
        canceladas,
        valor_capturado,
        roi_promedio,
        tasa_exito_pct,
        tiempo_promedio_ejecucion_dias,
        cantidad_reabasto,
        cantidad_exhibicion,
        cantidad_promocion,
        cantidad_visita,
        costo_total_completadas,
        total_skus,
        monto_total_estimado,
        monto_total_real,
        roi_promedio_calculado
      `)
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data found in vw_resumen_acciones');
    }

    return data as AccionesResumen;
  }

  /**
   * Get detailed list of all actions with complete information
   * Fetches from vw_detalle_acciones view
   */
  async getAccionesDetalle(): Promise<AccionDetalle[]> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .from('vw_detalle_acciones')
      .select(`
        id_accion,
        folio,
        tipo_accion,
        id_store,
        store_name,
        region,
        cantidad_skus,
        monto_estimado,
        responsable,
        impacto_real,
        fecha_creacion,
        fecha_inicio,
        fecha_completada,
        roi_real,
        tiempo_ejecucion_horas,
        tiempo_ejecucion_dias,
        cantidad_evidencias,
        notas,
        status,
        prioridad,
        riesgo_potencial,
        costo_accion,
        roi_calculado,
        dias_desde_creacion,
        inserted_at,
        updated_at
      `)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      throw new Error(`Error fetching acciones details: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data as AccionDetalle[];
  }
}

