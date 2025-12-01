import { SupabaseClient } from '@supabase/supabase-js';
import {
  ParametrosOptimos,
  ComparacionOptimoReal,
  ComparacionOptimoRealTienda,
  ComparacionOptimoRealGlobal,
  ParametrosFilters,
} from '@/types/parametros';

export class ParametrosRepository {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Obtener parámetros óptimos de la tabla base
   * Tabla: gonac.tab_parametros_optimos
   */
  async getParametrosOptimos(filters?: ParametrosFilters): Promise<ParametrosOptimos[]> {
    let query = this.supabase
      .schema('gonac')
      .from('tab_parametros_optimos')
      .select('*');

    if (filters?.id_store) {
      query = query.eq('id_store', filters.id_store);
    }
    if (filters?.sku) {
      query = query.eq('sku', filters.sku);
    }

    const { data, error } = await query.order('fecha_calculo', { ascending: false });

    if (error) {
      throw new Error(`Error fetching parametros optimos: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtener comparación óptimo vs real (detalle por SKU-Tienda)
   * Vista: gonac.vw_comparacion_optimo_real
   */
  async getComparacionOptimoReal(filters?: ParametrosFilters): Promise<ComparacionOptimoReal[]> {
    let query = this.supabase
      .schema('gonac')
      .from('vw_comparacion_optimo_real')
      .select('*');

    // Aplicar filtros
    if (filters?.id_store) {
      query = query.eq('id_store', filters.id_store);
    }
    if (filters?.sku) {
      query = query.eq('sku', filters.sku);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.brand) {
      query = query.eq('brand', filters.brand);
    }
    if (filters?.segment) {
      query = query.eq('segment', filters.segment);
    }
    if (filters?.region) {
      query = query.eq('region', filters.region);
    }
    if (filters?.tendencia) {
      query = query.eq('tendencia_dias_inventario', filters.tendencia);
    }
    if (filters?.min_impacto) {
      query = query.gte('impacto', filters.min_impacto);
    }

    // Ordenar por ranking de desviación (ya calculado en la vista)
    query = query.order('ranking_desviacion', { ascending: true });

    // Limitar resultados si se especifica
    if (filters?.ranking_limit) {
      query = query.limit(filters.ranking_limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching comparacion optimo real: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtener comparación agregada por tienda
   * Vista: gonac.vw_comparacion_optimo_real_tienda
   */
  async getComparacionPorTienda(filters?: ParametrosFilters): Promise<ComparacionOptimoRealTienda[]> {
    let query = this.supabase
      .schema('gonac')
      .from('vw_comparacion_optimo_real_tienda')
      .select('*');

    if (filters?.id_store) {
      query = query.eq('id_store', filters.id_store);
    }
    if (filters?.segment) {
      query = query.eq('segment', filters.segment);
    }
    if (filters?.region) {
      query = query.eq('region', filters.region);
    }
    if (filters?.min_impacto) {
      query = query.gte('impacto', filters.min_impacto);
    }

    // Ordenar por impacto descendente
    query = query.order('impacto', { ascending: false, nullsFirst: false });

    if (filters?.ranking_limit) {
      query = query.limit(filters.ranking_limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching comparacion por tienda: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtener comparación global (agregada de toda la operación)
   * Vista: gonac.vw_comparacion_optimo_real_global
   */
  async getComparacionGlobal(): Promise<ComparacionOptimoRealGlobal> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('vw_comparacion_optimo_real_global')
      .select('*')
      .single();

    if (error) {
      throw new Error(`Error fetching comparacion global: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from comparacion global');
    }

    return data;
  }

  /**
   * Obtener última fecha de cálculo de parámetros
   */
  async getUltimaFechaCalculo(): Promise<{ fecha: string; total_registros: number }> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('tab_parametros_optimos')
      .select('fecha_calculo')
      .order('fecha_calculo', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw new Error(`Error fetching ultima fecha calculo: ${error.message}`);
    }

    // Contar registros de esa fecha
    const { count } = await this.supabase
      .schema('gonac')
      .from('tab_parametros_optimos')
      .select('*', { count: 'exact', head: true })
      .eq('fecha_calculo', data.fecha_calculo);

    return {
      fecha: data.fecha_calculo,
      total_registros: count || 0,
    };
  }

  /**
   * Obtener top tiendas por impacto (oportunidad de mejora)
   */
  async getTopTiendasPorImpacto(limit: number = 10): Promise<ComparacionOptimoRealTienda[]> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('vw_comparacion_optimo_real_tienda')
      .select('*')
      .order('impacto', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      throw new Error(`Error fetching top tiendas por impacto: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtener SKUs con mayor desviación (top críticos)
   */
  async getTopSKUsCriticos(limit: number = 20): Promise<ComparacionOptimoReal[]> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('vw_comparacion_optimo_real')
      .select('*')
      .order('ranking_desviacion', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`Error fetching top SKUs criticos: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Obtener distribución por segmento
   */
  async getDistribucionPorSegmento(): Promise<{ segment: string; count: number; impacto_total: number }[]> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('vw_comparacion_optimo_real')
      .select('segment, impacto')
      .not('segment', 'is', null);

    if (error) {
      throw new Error(`Error fetching distribucion por segmento: ${error.message}`);
    }

    // Agrupar por segmento en JavaScript
    const grouped = (data || []).reduce((acc, row) => {
      const segment = row.segment || 'Sin Segmento';
      if (!acc[segment]) {
        acc[segment] = { segment, count: 0, impacto_total: 0 };
      }
      acc[segment].count += 1;
      acc[segment].impacto_total += Number(row.impacto || 0);
      return acc;
    }, {} as Record<string, { segment: string; count: number; impacto_total: number }>);

    return Object.values(grouped);
  }
}

