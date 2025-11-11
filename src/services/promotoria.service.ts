import { PromotoriaRepository, PromotoriaSummary, PromotoriaAggregate, PromotoriaProduct } from '@/repositories/promotoria.repository';

/**
 * API Response wrapper interfaces
 */
export interface PromotoriaSummaryResponse {
  success: boolean;
  data: PromotoriaSummary;
  timestamp: string;
}

export interface PromotoriaAggregateResponse {
  success: boolean;
  data: PromotoriaAggregate;
  timestamp: string;
}

export interface PromotoriaProductsResponse {
  success: boolean;
  data: PromotoriaProduct[];
  total: number;
  timestamp: string;
}

/**
 * Promotoria Service
 * Business logic layer for promotoria operations
 */
export class PromotoriaService {
  constructor(private repository: PromotoriaRepository) {}

  /**
   * Get global promotoria summary
   */
  async getSummary(): Promise<PromotoriaSummaryResponse> {
    try {
      const data = await this.repository.getSummary();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Service error getting promotoria summary: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get aggregate metrics from promotoria tienda
   */
  async getAggregate(): Promise<PromotoriaAggregateResponse> {
    try {
      const data = await this.repository.getAggregate();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Service error getting promotoria aggregate: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get top products without sales (highest risk)
   * 
   * @param limit - Number of products to return (default: 3)
   */
  async getProductsSinVenta(limit: number = 3): Promise<PromotoriaProductsResponse> {
    try {
      const data = await this.repository.getProductsSinVenta(limit);
      return {
        success: true,
        data,
        total: data.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Service error getting products sin venta: ${(error as Error).message}`
      );
    }
  }
}

