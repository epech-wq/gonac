import { ParametrosOptimosRepository } from '@/repositories/parametrosOptimos.repository';
import { ParametrosOptimosResponse } from '@/types/parametrosOptimos';

/**
 * Service for Parámetros Óptimos
 * Business logic layer for optimization parameters
 */
export class ParametrosOptimosService {
  constructor(private repository: ParametrosOptimosRepository) {}

  /**
   * Get optimization parameters
   * Returns optimal and actual values for all parameters
   */
  async getParametrosOptimos(): Promise<ParametrosOptimosResponse> {
    try {
      const data = await this.repository.getParametrosOptimos();

      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(
        `Service error getting parametros optimos: ${(error as Error).message}`
      );
    }
  }
}

