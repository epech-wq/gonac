import { SupabaseClient } from '@supabase/supabase-js';
import { HierarchicalMetricsParams, HierarchicalMetricsResult } from '@/types/hierarchical-metrics';
import { getDbSchema } from '@/lib/schema';

/**
 * Hierarchical Metrics Repository
 * Handles database operations for the fn_hierarchical_metrics stored function
 */
export class HierarchicalMetricsRepository {
  constructor(private supabase: SupabaseClient) { }

  /**
   * Call the fn_hierarchical_metrics stored function
   * Returns hierarchical metrics based on the provided filters and grouping dimensions
   */
  async getHierarchicalMetrics(
    params: HierarchicalMetricsParams
  ): Promise<HierarchicalMetricsResult[]> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .rpc('fn_hierarchical_metrics', params);

    if (error) {
      console.error('Error calling fn_hierarchical_metrics:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    return (data || []) as HierarchicalMetricsResult[];
  }
}
