import { HierarchicalMetricsRepository } from '@/repositories/hierarchical-metrics.repository';
import { HierarchicalMetricsParams, HierarchicalMetricsResult } from '@/types/hierarchical-metrics';

/**
 * Hierarchical Metrics Service
 * Contains business logic for hierarchical metrics data
 */
export class HierarchicalMetricsService {
  constructor(private repository: HierarchicalMetricsRepository) { }

  /**
   * Get hierarchical metrics with the provided filters
   */
  async getMetrics(
    params: HierarchicalMetricsParams
  ): Promise<HierarchicalMetricsResult[]> {
    try {
      const data = await this.repository.getHierarchicalMetrics(params);
      return data;
    } catch (error) {
      console.error('Service error getting hierarchical metrics:', error);
      throw new Error(`Service error: ${(error as Error).message}`);
    }
  }

  /**
   * Format currency values
   */
  formatCurrency(value: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
    }).format(value);
  }

  /**
   * Format percentage values
   */
  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }
}
