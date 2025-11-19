import { CambioInventarioRepository } from '@/repositories/cambioInventario.repository';
import { CambioInventarioResponse, RedistribucionCaducidadResponse } from '@/types/cambioInventario';

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

  /**
   * Get detailed redistribution data
   * @param p_dias_maximo_inventario - Maximum inventory days in destination
   */
  async getRedistribucionDetalle(
    p_dias_maximo_inventario: number = 30
  ): Promise<RedistribucionCaducidadResponse> {
    try {
      const data = await this.repository.getRedistribucionDetalle(p_dias_maximo_inventario);

      return {
        success: true,
        data,
        total: data.length,
        timestamp: new Date().toISOString(),
        source: 'fn_redistribucion_caducidad'
      };
    } catch (error) {
      throw new Error(
        `Service error getting redistribucion detalle: ${(error as Error).message}`
      );
    }
  }
}

