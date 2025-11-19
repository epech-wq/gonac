import { CambioInventarioRepository } from '@/repositories/cambioInventario.repository';
import { CambioInventarioResponse } from '@/types/cambioInventario';

/**
 * Service for Cambio de Inventario (Inventory Balancing)
 * Business logic layer for inventory balancing simulation
 */
export class CambioInventarioService {
  constructor(private repository: CambioInventarioRepository) {}

  /**
   * Get simulation data for inventory balancing
   * Returns all parameters and impact metrics from the database view
   */
  async getSimulacion(): Promise<CambioInventarioResponse> {
    try {
      const data = await this.repository.getSimulacion();

      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
        source: 'vw_simulacion_reabastecimiento'
      };
    } catch (error) {
      throw new Error(
        `Service error getting cambio inventario simulacion: ${(error as Error).message}`
      );
    }
  }
}

