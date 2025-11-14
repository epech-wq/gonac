import { AccionesRepository } from '@/repositories/acciones.repository';
import { AccionesResponse, AccionesResumen, AccionesDetalleResponse } from '@/types/acciones';

/**
 * Acciones Service
 * Contains business logic for task history and actions data
 */
export class AccionesService {
  constructor(private repository: AccionesRepository) {}

  /**
   * Get complete acciones resumen data with metadata
   */
  async getAccionesResumen(): Promise<AccionesResponse> {
    try {
      const data = await this.repository.getAccionesResumen();

      return {
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Service error: ${(error as Error).message}`);
    }
  }

  /**
   * Get detailed list of all actions with complete information
   */
  async getAccionesDetalle(): Promise<AccionesDetalleResponse> {
    try {
      const data = await this.repository.getAccionesDetalle();

      return {
        data,
        total: data.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Service error getting acciones details: ${(error as Error).message}`
      );
    }
  }

  /**
   * Format currency values
   */
  formatCurrency(value: string, currency: string = 'USD'): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
    }).format(parseFloat(value));
  }

  /**
   * Format percentage values
   */
  formatPercentage(value: string): string {
    return `${parseFloat(value).toFixed(1)}%`;
  }

  /**
   * Calculate additional metrics
   */
  calculateMetrics(data: AccionesResumen) {
    return {
      ...data,
      tasa_completado: data.total_tareas > 0 
        ? ((data.completadas / data.total_tareas) * 100).toFixed(1) 
        : '0.0',
      tasa_cancelado: data.total_tareas > 0 
        ? ((data.canceladas / data.total_tareas) * 100).toFixed(1) 
        : '0.0',
      valor_promedio_por_tarea: data.completadas > 0
        ? (parseFloat(data.valor_capturado) / data.completadas).toFixed(2)
        : '0.00',
      costo_promedio_por_tarea: data.completadas > 0
        ? (parseFloat(data.costo_total_completadas) / data.completadas).toFixed(2)
        : '0.00',
    };
  }
}

